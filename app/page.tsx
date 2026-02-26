"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UploadZone } from "@/components/upload-zone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowRight } from "lucide-react"

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const router = useRouter()

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleContinue = () => {
    if (selectedFile) {
      // Store file in sessionStorage temporarily
      const reader = new FileReader()
      reader.onloadend = () => {
        sessionStorage.setItem("uploadedImage", reader.result as string)
        sessionStorage.setItem("uploadedFileName", selectedFile.name)
        router.push("/generate")
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Virtual Try-On Studio
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your clothing and see it on professional models with AI-powered virtual try-on technology
            </p>
          </div>

          {/* Upload Zone */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Step 1: Upload Your Clothing</CardTitle>
              <CardDescription>
                Upload a photo of your clothing item on a flat surface or as a product photo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadZone
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                onRemove={() => setSelectedFile(null)}
              />
            </CardContent>
          </Card>

          {/* Continue Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleContinue}
              disabled={!selectedFile}
              size="lg"
              className="gap-2"
            >
              Continue to Customization
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI-Powered</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Advanced AI technology generates realistic try-on images in seconds
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fully Customizable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Choose model pose, skin tone, body type, and background style
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">High Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Download studio-quality images perfect for e-commerce and marketing
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
