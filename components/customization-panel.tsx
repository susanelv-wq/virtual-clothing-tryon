"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface CustomizationOptions {
  pose: string
  skinTone: string
  bodyType: string
  background: string
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
          <Label htmlFor="pose">Model Pose</Label>
          <Select
            id="pose"
            value={options.pose}
            onChange={(e) => updateOption("pose", e.target.value)}
          >
            <option value="standing-front">Standing (Front)</option>
            <option value="standing-side">Standing (Side)</option>
            <option value="standing-back">Standing (Back)</option>
            <option value="sitting">Sitting</option>
            <option value="walking">Walking</option>
            <option value="casual">Casual Pose</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="skin-tone">Skin Tone</Label>
          <Select
            id="skin-tone"
            value={options.skinTone}
            onChange={(e) => updateOption("skinTone", e.target.value)}
          >
            <option value="light">Light</option>
            <option value="medium-light">Medium Light</option>
            <option value="medium">Medium</option>
            <option value="medium-dark">Medium Dark</option>
            <option value="dark">Dark</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="body-type">Body Type</Label>
          <Select
            id="body-type"
            value={options.bodyType}
            onChange={(e) => updateOption("bodyType", e.target.value)}
          >
            <option value="slim">Slim</option>
            <option value="athletic">Athletic</option>
            <option value="average">Average</option>
            <option value="curvy">Curvy</option>
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
