"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CustomizationPanel } from "@/components/customization-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Wand2, ArrowLeft, Download } from "lucide-react"
import Image from "next/image"

interface CustomizationOptions {
  pose: string
  skinTone: string
  bodyType: string
  background: string
}

export default function GeneratePage() {
  const router = useRouter()
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string>("")
  const [options, setOptions] = useState<CustomizationOptions>({
    pose: "standing-front",
    skinTone: "medium",
    bodyType: "average",
    background: "studio-white",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load uploaded image from sessionStorage
    const image = sessionStorage.getItem("uploadedImage")
    const fileName = sessionStorage.getItem("uploadedFileName")
    if (image) {
      setUploadedImage(image)
      setUploadedFileName(fileName || "clothing.jpg")
    } else {
      router.push("/")
    }
  }, [router])

  const handleGenerate = async () => {
    if (!uploadedImage) return

    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)

    try {
      console.log("Starting generation...")
      
      // Convert base64 to blob
      let blob: Blob
      if (uploadedImage.startsWith("data:")) {
        // It's already a data URL, fetch it
        const response = await fetch(uploadedImage)
        blob = await response.blob()
      } else {
        // It's a URL, fetch it
        const response = await fetch(uploadedImage)
        blob = await response.blob()
      }

      // Create FormData
      const formData = new FormData()
      formData.append("image", blob, uploadedFileName)
      formData.append("pose", options.pose)
      formData.append("skinTone", options.skinTone)
      formData.append("bodyType", options.bodyType)
      formData.append("background", options.background)

      console.log("Calling API...")
      
      // Call API
      const apiResponse = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      })

      console.log("API response status:", apiResponse.status)

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({ error: "Unknown error" }))
        const errorMessage = errorData.error || `Server error: ${apiResponse.status}`
        console.error("API error:", errorMessage)
        throw new Error(errorMessage)
      }

      const data = await apiResponse.json()
      console.log("API response data:", data)
      
      if (!data.imageUrl) {
        const errorMsg = data.error || "No image URL returned from server"
        console.error("Missing imageUrl:", errorMsg)
        throw new Error(errorMsg)
      }
      
      console.log("Setting generated image:", data.imageUrl.substring(0, 50) + "...")
      setGeneratedImage(data.imageUrl)
      
      // Store in session history
      const history = JSON.parse(sessionStorage.getItem("generationHistory") || "[]")
      history.push({
        id: Date.now(),
        originalImage: uploadedImage,
        generatedImage: data.imageUrl,
        options,
        timestamp: new Date().toISOString(),
      })
      sessionStorage.setItem("generationHistory", JSON.stringify(history))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      console.error("Generation error:", err)
      setError(errorMessage)
      // Always set a demo image so user can see something works
      // This ensures the UI shows the uploaded image as a demo result
      console.log("Setting fallback demo image")
      setGeneratedImage(uploadedImage)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedImage) return

    try {
      let blob: Blob
      let filename = `virtual-tryon-${Date.now()}.png`

      // Handle data URLs (base64)
      if (generatedImage.startsWith("data:")) {
        const response = await fetch(generatedImage)
        blob = await response.blob()
      } else {
        // Handle regular URLs
        const response = await fetch(generatedImage)
        if (!response.ok) {
          throw new Error("Failed to fetch image")
        }
        blob = await response.blob()
      }

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("Download error:", err)
      setError("Failed to download image. Try right-clicking and 'Save Image As'")
    }
  }

  if (!uploadedImage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Upload
            </Button>
            <h1 className="text-3xl font-bold">Customize & Generate</h1>
            <p className="text-muted-foreground mt-2">
              Adjust settings and generate your virtual try-on image
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Customization */}
            <div className="space-y-6">
              <CustomizationPanel options={options} onChange={setOptions} />

              <Card>
                <CardHeader>
                  <CardTitle>Original Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
                    <Image
                      src={uploadedImage}
                      alt="Uploaded clothing"
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                size="lg"
                className="w-full gap-2"
              >
                {isGenerating ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Generate Virtual Try-On
                  </>
                )}
              </Button>
              
              {/* Debug info */}
              {process.env.NODE_ENV === "development" && (
                <Card className="border-muted">
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground">
                      Debug: {generatedImage ? "Image set" : "No image"} | 
                      {uploadedImage ? " Upload OK" : " No upload"}
                    </p>
                  </CardContent>
                </Card>
              )}

              {error && (
                <Card className="border-destructive bg-destructive/10">
                  <CardContent className="pt-6">
                    <p className="text-sm font-semibold text-destructive mb-2">Error:</p>
                    <p className="text-sm text-destructive">{error}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Note: The app is running in demo mode. Check the browser console for details.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Preview */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Generated Result</CardTitle>
                  <CardDescription>
                    Your AI-generated virtual try-on image will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="aspect-[3/4] w-full rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50">
                      <div className="text-center">
                        <LoadingSpinner size="lg" className="mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">
                          Generating your virtual try-on...
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          This may take 10-30 seconds
                        </p>
                      </div>
                    </div>
                  ) : generatedImage ? (
                    <div className="space-y-4">
                      <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border bg-muted">
                        {/* Always use img tag for better compatibility */}
                        <img
                          src={generatedImage}
                          alt="Generated virtual try-on"
                          className="w-full h-full object-cover"
                          style={{ display: "block" }}
                          onError={(e) => {
                            console.error("Image load error:", e)
                            console.error("Failed image URL:", generatedImage.substring(0, 100))
                            setError("Failed to load generated image. Check console for details.")
                          }}
                          onLoad={() => {
                            console.log("✅ Image loaded successfully")
                          }}
                        />
                      </div>
                      <Button
                        onClick={handleDownload}
                        className="w-full gap-2"
                        variant="outline"
                      >
                        <Download className="h-4 w-4" />
                        Download High-Quality Image
                      </Button>
                      {generatedImage === uploadedImage && (
                        <p className="text-xs text-muted-foreground text-center bg-blue-50 dark:bg-blue-950 p-2 rounded">
                          ℹ️ Demo mode: Showing your uploaded image. Add FASHN_API_KEY for real AI generation.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-[3/4] w-full rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50">
                      <p className="text-sm text-muted-foreground text-center px-4">
                        Click &quot;Generate Virtual Try-On&quot; to create your image
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
