"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Trash2 } from "lucide-react"
import Image from "next/image"

interface HistoryItem {
  id: number
  originalImage: string
  generatedImage: string
  options: {
    pose: string
    skinTone: string
    bodyType: string
    background: string
  }
  timestamp: string
}

export default function HistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    const stored = sessionStorage.getItem("generationHistory")
    if (stored) {
      setHistory(JSON.parse(stored))
    }
  }, [])

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `virtual-tryon-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("Download failed:", err)
    }
  }

  const handleDelete = (id: number) => {
    const updated = history.filter((item) => item.id !== id)
    setHistory(updated)
    sessionStorage.setItem("generationHistory", JSON.stringify(updated))
  }

  const handleClearAll = () => {
    setHistory([])
    sessionStorage.removeItem("generationHistory")
  }

  if (history.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground">
                  No generation history yet. Create your first virtual try-on!
                </p>
                <Button onClick={() => router.push("/")} className="mt-4">
                  Start Creating
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-3xl font-bold">Generation History</h1>
              <p className="text-muted-foreground mt-2">
                View and download your previous virtual try-on images
              </p>
            </div>
            <Button variant="outline" onClick={handleClearAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history
              .slice()
              .reverse()
              .map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </CardTitle>
                    <CardDescription>
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border">
                      <Image
                        src={item.generatedImage}
                        alt="Generated virtual try-on"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDownload(item.generatedImage)}
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>
                        <span className="font-medium">Pose:</span> {item.options.pose}
                      </p>
                      <p>
                        <span className="font-medium">Skin Tone:</span> {item.options.skinTone}
                      </p>
                      <p>
                        <span className="font-medium">Background:</span> {item.options.background}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
