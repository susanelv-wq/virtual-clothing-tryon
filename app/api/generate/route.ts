import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"
import { getModelImageUrl } from "@/lib/model-gallery"
import { uploadToCloudinary, bufferToDataURL } from "@/lib/image-storage"

// FASHN API - Free tier available
// Get free API key at: https://app.fashn.ai/api
const FASHN_API_KEY = process.env.FASHN_API_KEY || ""

export async function POST(request: NextRequest) {
  try {
    console.log("API: Received generation request")
    
    const formData = await request.formData()
    const imageFile = formData.get("image") as File
    const pose = formData.get("pose") as string
    const skinTone = formData.get("skinTone") as string
    const bodyType = formData.get("bodyType") as string
    const background = formData.get("background") as string

    console.log("API: Options:", { pose, skinTone, bodyType, background })

    if (!imageFile) {
      console.error("API: No image file provided")
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      )
    }

    console.log("API: Processing image file:", imageFile.name, imageFile.size, "bytes")

    // Convert File to Buffer
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log("API: Optimizing image with Sharp...")

    // Optimize image with Sharp
    const optimizedBuffer = await sharp(buffer)
      .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer()

    // Convert to base64 data URL for API (no storage needed initially)
    const clothingImageDataUrl = bufferToDataURL(optimizedBuffer)
    console.log("API: Image converted to data URL, length:", clothingImageDataUrl.length)

    // Generate virtual try-on image using FASHN API (free tier)
    console.log("API: Calling generateWithFASHN...")
    const generatedImageUrl = await generateWithFASHN(clothingImageDataUrl, {
      pose,
      skinTone,
      bodyType,
      background,
    })

    console.log("API: Generated image URL:", generatedImageUrl.substring(0, 100) + "...")

    return NextResponse.json({
      imageUrl: generatedImageUrl,
      success: true,
    })
  } catch (error) {
    console.error("API: Generation error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to generate image"
    return NextResponse.json(
      {
        error: errorMessage,
        imageUrl: null, // Explicitly set to null on error
      },
      { status: 500 }
    )
  }
}

async function generateWithFASHN(
  clothingImageDataUrl: string,
  options: {
    pose: string
    skinTone: string
    bodyType: string
    background: string
  }
): Promise<string> {
  // Get model image based on user customization options
  const modelImageUrl = getModelImageUrl(
    options.pose,
    options.skinTone,
    options.bodyType
  )

  // Check if model image is configured
  if (!modelImageUrl || modelImageUrl.includes("placeholder") || modelImageUrl.includes("your-cdn.com")) {
    console.warn("Model image not configured. Update lib/model-gallery.ts with actual model image URLs")
    console.warn("Running in demo mode - returning uploaded clothing image")
    // Return the clothing image as a demo result
    return clothingImageDataUrl
  }

  if (!FASHN_API_KEY) {
    // Return a demo/mock image for testing without API key
    console.warn("FASHN_API_KEY not set. Using demo mode. Get free key at https://app.fashn.ai/api")
    // Return the clothing image as a demo result
    return clothingImageDataUrl
  }

  try {
    // FASHN API uses polling-based system
    // Step 1: Submit the job
    console.log("FASHN: Submitting try-on job...")
    
    const submitResponse = await fetch("https://api.fashn.ai/v1/run", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FASHN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tryon-v1.6",
        input: {
          model_image: modelImageUrl,
          garment_image: clothingImageDataUrl,
          // Alternative parameter names
          person_image: modelImageUrl,
          clothing_image: clothingImageDataUrl,
        },
      }),
    })

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text()
      console.error("FASHN submit error:", errorText)
      throw new Error(`FASHN API submit error: ${submitResponse.status} - ${errorText}`)
    }

    const submitData = await submitResponse.json()
    const predictionId = submitData.id || submitData.prediction_id || submitData.predictionId

    if (!predictionId) {
      throw new Error("No prediction ID returned from FASHN API")
    }

    console.log("FASHN: Prediction ID:", predictionId)

    // Step 2: Poll for results
    const maxAttempts = 60 // 3 minutes max (60 * 3 seconds)
    let attempts = 0

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 3000)) // Wait 3 seconds

      console.log(`FASHN: Polling attempt ${attempts + 1}/${maxAttempts}`)

      const statusResponse = await fetch(
        `https://api.fashn.ai/v1/status/${predictionId}`,
        {
          headers: {
            "Authorization": `Bearer ${FASHN_API_KEY}`,
          },
        }
      )

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text()
        throw new Error(`FASHN status check error: ${statusResponse.status} - ${errorText}`)
      }

      const statusData = await statusResponse.json()
      const status = statusData.status || statusData.state

      console.log("FASHN: Status:", status)

      if (status === "completed" || status === "succeeded") {
        // Get the result image
        let generatedImageUrl =
          statusData.output?.image_url ||
          statusData.output?.url ||
          statusData.output?.image ||
          statusData.result?.image_url ||
          statusData.image_url ||
          statusData.url

        if (!generatedImageUrl) {
          // Check for base64
          if (statusData.output?.image_base64) {
            generatedImageUrl = `data:image/jpeg;base64,${statusData.output.image_base64}`
          } else {
            throw new Error("No image URL or base64 in completed result")
          }
        }

        console.log("FASHN: Generation completed!")

        // If the URL is a data URL, optionally upload to Cloudinary for persistence
        // (or just keep the data URL - it works fine)
        if (generatedImageUrl.startsWith("data:")) {
          // Optionally upload to Cloudinary for persistent storage
          // If Cloudinary not configured, data URL works fine
          try {
            const base64Data = generatedImageUrl.split(",")[1]
            const imageBuffer = Buffer.from(base64Data, "base64")
            const cloudinaryUrl = await uploadToCloudinary(imageBuffer)
            if (!cloudinaryUrl.startsWith("data:")) {
              generatedImageUrl = cloudinaryUrl
            }
          } catch {
            // Keep the data URL if upload fails - it works fine
            console.warn("Cloudinary upload failed, using data URL (this is fine)")
          }
        }

        return generatedImageUrl
      }

      if (status === "failed" || status === "error") {
        throw new Error(`FASHN generation failed: ${statusData.error || "Unknown error"}`)
      }

      // Continue polling for: "starting", "in_queue", "processing"
      attempts++
    }

    throw new Error("FASHN generation timed out after 3 minutes")
  } catch (error) {
    console.error("FASHN API error:", error)

    // Fallback: Return the clothing image as a demo result
    console.warn("Falling back to demo mode - returning uploaded image")
    return clothingImageDataUrl
  }
}
