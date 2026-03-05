"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ArrowLeft, User, Shirt, Download, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { getStoreProducts, type StoreProduct } from "@/lib/store-products"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"

const storeProducts = getStoreProducts()

export default function TryOnPage() {
  const router = useRouter()
  const [personPhoto, setPersonPhoto] = useState<string | null>(null)
  const [personFile, setPersonFile] = useState<File | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null)
  const [customGarmentFile, setCustomGarmentFile] = useState<File | null>(null)
  const [customGarmentPreview, setCustomGarmentPreview] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onPersonDrop = (accepted: File[]) => {
    const file = accepted[0]
    if (file) {
      setPersonFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPersonPhoto(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const onGarmentDrop = (accepted: File[]) => {
    const file = accepted[0]
    if (file) {
      setCustomGarmentFile(file)
      setSelectedProduct(null)
      const reader = new FileReader()
      reader.onloadend = () => setCustomGarmentPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const personDropzone = useDropzone({
    onDrop: onPersonDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  const garmentDropzone = useDropzone({
    onDrop: onGarmentDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  const handleSelectProduct = (product: StoreProduct) => {
    setSelectedProduct(product)
    setCustomGarmentFile(null)
    setCustomGarmentPreview(null)
  }

  const hasGarment = selectedProduct || customGarmentFile

  const handleTryOn = async () => {
    if (!personFile || !personPhoto) {
      setError("Please upload your photo.")
      return
    }
    if (!hasGarment) {
      setError("Please choose a garment from the store or upload your own clothing photo.")
      return
    }

    setIsGenerating(true)
    setError(null)
    setResultImage(null)

    try {
      const formData = new FormData()
      formData.append("personImage", personFile, personFile.name)

      if (selectedProduct) {
        formData.append("productId", selectedProduct.id)
      } else if (customGarmentFile) {
        formData.append("garmentImage", customGarmentFile, customGarmentFile.name)
      }

      const res = await fetch("/api/try-on-customer", {
        method: "POST",
        body: formData,
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`)
      }
      if (data.imageUrl) {
        setResultImage(data.imageUrl)
      } else {
        throw new Error("No image returned")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Try-on failed. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!resultImage) return
    try {
      const response = await fetch(resultImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `try-on-${Date.now()}.png`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      setError("Download failed. Try right-click and Save Image As.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Button>

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Try clothes on yourself
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Upload your photo and pick any garment from the store (or upload your own) to see how it looks on you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Upload + product choice */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Step 1: Your photo
                  </CardTitle>
                  <CardDescription>
                    Upload a clear photo of yourself (full or upper body works best)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {personPhoto ? (
                    <div className="relative aspect-[3/4] max-h-80 w-full rounded-lg overflow-hidden border">
                      <Image
                        src={personPhoto}
                        alt="Your photo"
                        fill
                        className="object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setPersonPhoto(null)
                          setPersonFile(null)
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div
                      {...personDropzone.getRootProps()}
                      className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                        personDropzone.isDragActive
                          ? "border-primary bg-primary/5"
                          : "border-muted-foreground/25 hover:border-primary/50"
                      )}
                    >
                      <input {...personDropzone.getInputProps()} />
                      <p className="text-sm text-muted-foreground">
                        {personDropzone.isDragActive
                          ? "Drop your photo here"
                          : "Drag & drop your photo or click to select"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, WEBP (max 10MB)
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shirt className="h-5 w-5" />
                    Step 2: Choose a garment
                  </CardTitle>
                  <CardDescription>
                    Pick from the store or upload your own clothing image
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm font-medium">From the store</p>
                  <div className="grid grid-cols-3 gap-3">
                    {storeProducts.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelectProduct(product)}
                        className={cn(
                          "relative rounded-lg overflow-hidden border-2 transition-all aspect-square",
                          selectedProduct?.id === product.id
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-muted hover:border-primary/50"
                        )}
                      >
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                        {selectedProduct?.id === product.id && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <Check className="h-8 w-8 text-primary stroke-[3]" />
                          </div>
                        )}
                        <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                          {product.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  <p className="text-sm font-medium pt-2">Or upload your own</p>
                  {customGarmentPreview ? (
                    <div className="relative aspect-square max-w-[200px] rounded-lg overflow-hidden border">
                      <Image
                        src={customGarmentPreview}
                        alt="Your garment"
                        fill
                        className="object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setCustomGarmentFile(null)
                          setCustomGarmentPreview(null)
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div
                      {...garmentDropzone.getRootProps()}
                      className={cn(
                        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                        garmentDropzone.isDragActive
                          ? "border-primary bg-primary/5"
                          : "border-muted-foreground/25 hover:border-primary/50"
                      )}
                    >
                      <input {...garmentDropzone.getInputProps()} />
                      <p className="text-sm text-muted-foreground">
                        {garmentDropzone.isDragActive
                          ? "Drop here"
                          : "Upload clothing photo"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button
                size="lg"
                className="w-full"
                onClick={handleTryOn}
                disabled={!personPhoto || !hasGarment || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Generating your try-on…
                  </>
                ) : (
                  "Try it on me"
                )}
              </Button>

              {error && (
                <Card className="border-destructive bg-destructive/10">
                  <CardContent className="pt-4">
                    <p className="text-sm text-destructive">{error}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right: Result */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Your try-on result</CardTitle>
                  <CardDescription>
                    You wearing the selected garment will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isGenerating && (
                    <div className="aspect-[3/4] rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50">
                      <div className="text-center">
                        <LoadingSpinner size="lg" className="mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">
                          This may take 15–30 seconds…
                        </p>
                      </div>
                    </div>
                  )}
                  {!isGenerating && resultImage && (
                    <div className="space-y-4">
                      <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border bg-background">
                        <img
                          src={resultImage}
                          alt="Try-on result"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        className="w-full gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download image
                      </Button>
                    </div>
                  )}
                  {!isGenerating && !resultImage && (
                    <div className="aspect-[3/4] rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50">
                      <p className="text-sm text-muted-foreground text-center px-4">
                        Upload your photo, choose a garment, and click “Try it on me”
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
