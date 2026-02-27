"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CustomizationPanel } from "@/components/customization-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Wand2, ArrowLeft, Download } from "lucide-react"
import Image from "next/image"
import { RotationControl } from "@/components/rotation-control"

interface CustomizationOptions {
  pose: string
  skinTone: string
  bodyType: string
  background: string
  angle: string // "front", "side", "back"
}

export default function GeneratePage() {
  const router = useRouter()
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string>("")
  const [options, setOptions] = useState<CustomizationOptions>({
    pose: "standing",
    skinTone: "light",
    bodyType: "athletic-asian", // Default to Asian model
    background: "studio-white",
    angle: "front", // Default to front view
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({}) // Store all 4 angles
  const [currentViewAngle, setCurrentViewAngle] = useState<string>("front") // Current viewing angle
  const [imageKey, setImageKey] = useState(0) // Force re-render key
  const [error, setError] = useState<string | null>(null)
  const [generationProgress, setGenerationProgress] = useState<string>("") // Progress message

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
    setGeneratedImages({})
    setCurrentViewAngle("front")

    try {
      console.log("Starting generation for all 4 angles...")
      
      // Convert base64 to blob
      let blob: Blob
      if (uploadedImage.startsWith("data:")) {
        const response = await fetch(uploadedImage)
        blob = await response.blob()
      } else {
        const response = await fetch(uploadedImage)
        blob = await response.blob()
      }

      // Generate all 4 angles IN PARALLEL for faster generation
      const angles = ["front", "side", "back", "side-back"]
      const generatedResults: Record<string, string> = {}

      setGenerationProgress("Starting generation for all 4 angles...")

      // Generate all angles in parallel
      const generationPromises = angles.map(async (angle) => {
        try {
          setGenerationProgress(`Generating ${angle} view...`)

          const formData = new FormData()
          formData.append("image", blob, uploadedFileName)
          formData.append("pose", options.pose)
          formData.append("skinTone", options.skinTone)
          formData.append("bodyType", options.bodyType)
          formData.append("background", options.background)
          formData.append("angle", angle)

          const apiResponse = await fetch("/api/generate", {
            method: "POST",
            body: formData,
          })

          if (!apiResponse.ok) {
            const errorData = await apiResponse.json().catch(() => ({ error: "Unknown error" }))
            console.error(`API error for ${angle}:`, errorData.error)
            return { angle, imageUrl: null, error: errorData.error }
          }

          const data = await apiResponse.json()
          
          if (data.imageUrl) {
            // Update results as each completes (progressive loading)
            generatedResults[angle] = data.imageUrl
            setGeneratedImages({ ...generatedResults })
            setImageKey(prev => prev + 1)
            console.log(`✅ Generated ${angle} view`)
            return { angle, imageUrl: data.imageUrl }
          } else {
            console.warn(`⚠️ No image URL for ${angle} view`)
            return { angle, imageUrl: null }
          }
        } catch (angleError) {
          console.error(`Error generating ${angle} view:`, angleError)
          return { angle, imageUrl: null, error: angleError instanceof Error ? angleError.message : String(angleError) }
        }
      })

      // Wait for all generations to complete (in parallel)
      setGenerationProgress("Generating all angles in parallel... This may take 30-60 seconds")
      const results = await Promise.all(generationPromises)
      
      // Collect successful results
      results.forEach((result) => {
        if (result.imageUrl) {
          generatedResults[result.angle] = result.imageUrl
        }
      })

      if (Object.keys(generatedResults).length === 0) {
        throw new Error("Failed to generate any images. Please try again.")
      }

      setGeneratedImages(generatedResults)
      setCurrentViewAngle("front") // Start with front view
      setImageKey(prev => prev + 1)
      console.log("✅ All angles generated successfully:", Object.keys(generatedResults))

      // Store in session history
      const history = JSON.parse(sessionStorage.getItem("generationHistory") || "[]")
      history.push({
        id: Date.now(),
        originalImage: uploadedImage,
        generatedImages: generatedResults,
        options,
        timestamp: new Date().toISOString(),
      })
      sessionStorage.setItem("generationHistory", JSON.stringify(history))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      console.error("❌ Generation error:", err)
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    const currentImage = generatedImages[currentViewAngle]
    if (!currentImage) return

    try {
      let blob: Blob
      let filename = `virtual-tryon-${currentViewAngle}-${Date.now()}.png`

      if (currentImage.startsWith("data:")) {
        const response = await fetch(currentImage)
        blob = await response.blob()
      } else {
        const response = await fetch(currentImage)
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

  // Get current displayed image
  const currentGeneratedImage = generatedImages[currentViewAngle] || null

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
                  <CardContent className="pt-4 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Debug: {Object.keys(generatedImages).length > 0 ? `✅ ${Object.keys(generatedImages).length} angles` : "❌ No images"} | 
                      {uploadedImage ? " ✅ Upload OK" : " ❌ No upload"}
                    </p>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={async () => {
                          try {
                            const response = await fetch(
                              `/api/test-model-image?pose=${options.pose}&skinTone=${options.skinTone}&bodyType=${options.bodyType}`
                            )
                            const data = await response.json()
                            console.log("Model image test:", data)
                            alert(`Model Image Test:\n${JSON.stringify(data, null, 2)}`)
                          } catch (err) {
                            console.error("Test error:", err)
                          }
                        }}
                      >
                        Test Model Image URL
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={async () => {
                          try {
                            const response = await fetch("/api/test-env")
                            const data = await response.json()
                            console.log("Environment test:", data)
                            alert(`Environment Check:\n${JSON.stringify(data, null, 2)}`)
                          } catch (err) {
                            console.error("Test error:", err)
                          }
                        }}
                      >
                        Test API Key
                      </Button>
                    </div>
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
                          {generationProgress || "Generating your virtual try-on..."}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Generating all 4 angles in parallel... This may take 30-60 seconds
                        </p>
                        {Object.keys(generatedImages).length > 0 && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                            ✅ {Object.keys(generatedImages).length}/4 angles completed
                          </p>
                        )}
                      </div>
                    </div>
                  ) : currentGeneratedImage ? (
                    <div className="space-y-4">
                      {/* 360° Rotation Control */}
                      <RotationControl
                        value={currentViewAngle}
                        onChange={(angle) => {
                          if (generatedImages[angle]) {
                            setCurrentViewAngle(angle)
                            setImageKey(prev => prev + 1)
                          }
                        }}
                      />

                      <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border-2 border-primary/30 bg-background shadow-lg">
                        <img
                          key={`img-${imageKey}-${currentViewAngle}`}
                          src={currentGeneratedImage}
                          alt={`Generated virtual try-on - ${currentViewAngle} view`}
                          className="w-full h-full object-contain bg-white"
                          style={{ 
                            display: "block", 
                            minHeight: "400px",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#ffffff",
                            objectFit: "contain"
                          }}
                          onError={(e) => {
                            console.error("❌ Image load error:", e)
                            console.error("Failed image URL:", currentGeneratedImage)
                            setError(`Failed to load ${currentViewAngle} view. Check browser console for errors.`)
                          }}
                          onLoad={(e) => {
                            console.log(`✅ ${currentViewAngle} view loaded successfully!`)
                            setError(null)
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          ✓ {currentViewAngle.charAt(0).toUpperCase() + currentViewAngle.slice(1)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleDownload}
                          className="flex-1 gap-2"
                          variant="outline"
                        >
                          <Download className="h-4 w-4" />
                          Download {currentViewAngle.charAt(0).toUpperCase() + currentViewAngle.slice(1)} View
                        </Button>
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(currentGeneratedImage)
                            alert("Image URL copied to clipboard!")
                          }}
                          variant="ghost"
                          size="icon"
                          title="Copy image URL"
                        >
                          📋
                        </Button>
                      </div>
                      {error && (
                        <p className="text-xs text-destructive text-center p-2 rounded bg-destructive/10">
                          ⚠️ {error}
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
