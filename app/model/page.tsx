"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UploadZone } from "@/components/upload-zone"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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
    <div className="min-h-screen ocean-flow-bg relative overflow-hidden">
      {/* Decorative ocean waves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-primary/5 ocean-wave" />
        <div className="absolute top-1/4 -right-16 w-80 h-80 rounded-full bg-primary/8 ocean-wave ocean-wave-delay-1" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-primary/6 ocean-wave ocean-wave-delay-2" />
        <svg className="absolute bottom-0 left-0 w-full h-32 text-primary/10 fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z" />
        </svg>
        <svg className="absolute bottom-0 left-0 w-full h-24 text-primary/8 fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,80 C200,40 400,100 600,80 C800,60 1000,100 1200,80 L1200,120 L0,120 Z" />
        </svg>
      </div>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 mb-6 ring-2 ring-primary/20">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Ocean Heaven
            </h1>
            <p className="text-lg font-medium text-foreground/90 mb-2">Virtual Try-On Studio</p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Show your clothes on professional models, or try store items on yourself—upload a photo and choose any garment
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Link
                href="/try-on"
                className={cn(buttonVariants({ size: "lg", variant: "default" }), "gap-2")}
              >
                Try clothes on yourself
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#upload-section"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gap-2")}
              >
                Show on model
              </Link>
            </div>
          </div>

          {/* Upload Zone */}
          <Card id="upload-section" className="mb-6 border-primary/20 shadow-lg shadow-primary/5">
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
