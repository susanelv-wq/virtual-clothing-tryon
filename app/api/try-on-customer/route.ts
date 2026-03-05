import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"
import { getStoreProduct } from "@/lib/store-products"
import { uploadToCloudinary, bufferToDataURL } from "@/lib/image-storage"

const FASHN_API_KEY = process.env.FASHN_API_KEY || ""

/**
 * Customer try-on: person photo + garment (from store product or upload).
 * Uses FASHN API with customer's photo as model_image and selected garment as garment_image.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const personImageFile = formData.get("personImage") as File | null
    const garmentImageFile = formData.get("garmentImage") as File | null
    const productId = (formData.get("productId") as string) || ""

    if (!personImageFile || !personImageFile.size) {
      return NextResponse.json(
        { error: "Please upload your photo (person image)." },
        { status: 400 }
      )
    }

    let garmentImageDataUrl: string

    if (garmentImageFile && garmentImageFile.size > 0) {
      // Garment from file upload
      const arrayBuffer = await garmentImageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const processed = await sharp(buffer)
        .resize(2048, 2048, { fit: "inside", withoutEnlargement: true })
        .png({ quality: 100, compressionLevel: 6 })
        .toBuffer()
        .catch(async () => sharp(buffer).jpeg({ quality: 98, mozjpeg: true }).toBuffer())
      garmentImageDataUrl = bufferToDataURL(processed, "image/png")
    } else if (productId) {
      // Garment from store product
      const product = getStoreProduct(productId)
      if (!product?.imageUrl) {
        return NextResponse.json(
          { error: "Product not found or has no image." },
          { status: 400 }
        )
      }
      const res = await fetch(product.imageUrl, { signal: AbortSignal.timeout(15000) })
      if (!res.ok) throw new Error("Failed to fetch product image")
      const arrayBuffer = await res.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const processed = await sharp(buffer)
        .resize(2048, 2048, { fit: "inside", withoutEnlargement: true })
        .png({ quality: 100, compressionLevel: 6 })
        .toBuffer()
        .catch(async () => sharp(buffer).jpeg({ quality: 98, mozjpeg: true }).toBuffer())
      garmentImageDataUrl = bufferToDataURL(processed, "image/png")
    } else {
      return NextResponse.json(
        { error: "Please select a garment (choose a product or upload a clothing image)." },
        { status: 400 }
      )
    }

    // Process person image
    const personArrayBuffer = await personImageFile.arrayBuffer()
    const personBuffer = Buffer.from(personArrayBuffer)
    const personProcessed = await sharp(personBuffer)
      .resize(2048, 2048, { fit: "inside", withoutEnlargement: true })
      .png({ quality: 100, compressionLevel: 6 })
      .toBuffer()
      .catch(async () => sharp(personBuffer).jpeg({ quality: 98, mozjpeg: true }).toBuffer())
    const personImageDataUrl = bufferToDataURL(personProcessed, "image/png")

    if (!FASHN_API_KEY) {
      return NextResponse.json(
        {
          error: "Try-on service is not configured. Please set FASHN_API_KEY.",
          imageUrl: null,
        },
        { status: 503 }
      )
    }

    const requestBody = {
      model_name: "tryon-v1.6",
      inputs: {
        model_image: personImageDataUrl,
        garment_image: garmentImageDataUrl,
      },
    }

    const submitResponse = await fetch("https://api.fashn.ai/v1/run", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FASHN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text()
      console.error("FASHN submit error:", errorText)
      return NextResponse.json(
        { error: `Try-on failed: ${submitResponse.status} - ${errorText}`, imageUrl: null },
        { status: 502 }
      )
    }

    const submitData = await submitResponse.json()
    const predictionId = submitData.id || submitData.prediction_id || submitData.predictionId
    if (!predictionId) {
      return NextResponse.json(
        { error: "No prediction ID from try-on service.", imageUrl: null },
        { status: 502 }
      )
    }

    const maxAttempts = 60
    let attempts = 0

    while (attempts < maxAttempts) {
      await new Promise((r) => setTimeout(r, 3000))

      const statusResponse = await fetch(
        `https://api.fashn.ai/v1/status/${predictionId}`,
        { headers: { Authorization: `Bearer ${FASHN_API_KEY}` } }
      )
      if (!statusResponse.ok) {
        const errText = await statusResponse.text()
        throw new Error(`Status check failed: ${statusResponse.status} - ${errText}`)
      }

      const statusData = await statusResponse.json()
      const status = statusData.status || statusData.state

      if (status === "completed" || status === "succeeded" || status === "success") {
        let generatedImageUrl: string | undefined
        if (Array.isArray(statusData.output) && statusData.output.length > 0) {
          generatedImageUrl = statusData.output[0]
        } else {
          generatedImageUrl =
            statusData.output?.image_url ||
            statusData.output?.url ||
            statusData.output?.image ||
            statusData.result?.image_url ||
            statusData.result?.url ||
            statusData.image_url ||
            statusData.url
        }
        if (!generatedImageUrl && statusData.output?.image_base64) {
          generatedImageUrl = `data:image/jpeg;base64,${statusData.output.image_base64}`
        } else if (!generatedImageUrl && statusData.output?.base64) {
          generatedImageUrl = `data:image/jpeg;base64,${statusData.output.base64}`
        }
        if (!generatedImageUrl) {
          throw new Error("No image URL in completed result")
        }
        if (generatedImageUrl.startsWith("data:")) {
          try {
            const base64Data = generatedImageUrl.split(",")[1]
            const imageBuffer = Buffer.from(base64Data, "base64")
            const cloudinaryUrl = await uploadToCloudinary(imageBuffer)
            if (!cloudinaryUrl.startsWith("data:")) generatedImageUrl = cloudinaryUrl
          } catch {
            // keep data URL
          }
        }
        return NextResponse.json({ imageUrl: generatedImageUrl, success: true })
      }

      if (status === "failed" || status === "error") {
        throw new Error(`Try-on failed: ${statusData.error || "Unknown error"}`)
      }

      attempts++
    }

    throw new Error("Try-on timed out after 3 minutes")
  } catch (error) {
    console.error("Try-on customer error:", error)
    const message = error instanceof Error ? error.message : "Try-on failed"
    return NextResponse.json(
      { error: message, imageUrl: null },
      { status: 500 }
    )
  }
}
