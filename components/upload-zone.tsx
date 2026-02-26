"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  selectedFile?: File | null
  onRemove?: () => void
}

export function UploadZone({ onFileSelect, selectedFile, onRemove }: UploadZoneProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        onFileSelect(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const handleRemove = () => {
    setPreview(null)
    onRemove?.()
  }

  if (selectedFile && preview) {
    return (
      <Card className="relative overflow-hidden">
        <div className="relative aspect-square w-full">
          <img
            src={preview}
            alt="Uploaded clothing"
            className="h-full w-full object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <p className="text-sm font-medium truncate">{selectedFile.name}</p>
          <p className="text-xs text-muted-foreground">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed cursor-pointer transition-colors",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50"
      )}
    >
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <input {...getInputProps()} />
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {isDragActive ? "Drop your image here" : "Upload Clothing Photo"}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop or click to select
        </p>
        <p className="text-xs text-muted-foreground">
          Supports PNG, JPG, JPEG, WEBP (max 10MB)
        </p>
      </div>
    </Card>
  )
}
