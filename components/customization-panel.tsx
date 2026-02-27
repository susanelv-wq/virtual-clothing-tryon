"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getAvailableModels, getModelById } from "@/lib/model-gallery"

interface CustomizationOptions {
  pose: string
  skinTone: string
  bodyType: string
  background: string
  angle: string
}

interface CustomizationPanelProps {
  options: CustomizationOptions
  onChange: (options: CustomizationOptions) => void
}

export function CustomizationPanel({ options, onChange }: CustomizationPanelProps) {
  const updateOption = (key: keyof CustomizationOptions, value: string) => {
    onChange({ ...options, [key]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Your Model</CardTitle>
        <CardDescription>
          Adjust model appearance and settings for your virtual try-on
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="model">Choose Model</Label>
          <Select
            id="model"
            value={`${options.pose}-${options.skinTone}-${options.bodyType}`}
            onChange={(e) => {
              // Parse the model value correctly (format: pose-skinTone-bodyType)
              const value = e.target.value
              // Find the model by value to get the correct options
              const models = getAvailableModels()
              const selectedModel = models.find(m => m.value === value)
              if (selectedModel) {
                // Find the full model config to get all properties
                const modelConfig = getModelById(selectedModel.id)
                if (modelConfig) {
                  onChange({
                    ...options,
                    pose: modelConfig.pose,
                    skinTone: modelConfig.skinTone,
                    bodyType: modelConfig.bodyType,
                  })
                }
              }
            }}
          >
            {getAvailableModels().map((model) => (
              <option key={model.id} value={model.value}>
                {model.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="background">Background Style</Label>
          <Select
            id="background"
            value={options.background}
            onChange={(e) => updateOption("background", e.target.value)}
          >
            <option value="studio-white">Studio White</option>
            <option value="studio-gray">Studio Gray</option>
            <option value="studio-black">Studio Black</option>
            <option value="minimal">Minimal</option>
            <option value="elegant">Elegant</option>
            <option value="modern">Modern</option>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
