"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface RotationControlProps {
  value: string // "front", "side", "back", "side-back"
  onChange: (angle: string) => void
  className?: string
}

// Map angle names to degrees
const ANGLE_TO_DEGREES: Record<string, number> = {
  front: 0,
  side: 90,
  back: 180,
  "side-back": 270,
}

const DEGREES_TO_ANGLE: Record<number, string> = {
  0: "front",
  90: "side",
  180: "back",
  270: "side-back",
}

// Get the closest angle based on degrees
function getClosestAngle(degrees: number): string {
  const angles = [0, 90, 180, 270]
  const closest = angles.reduce((prev, curr) => {
    const prevDiff = Math.abs(prev - degrees)
    const currDiff = Math.abs(curr - degrees)
    return currDiff < prevDiff ? curr : prev
  })
  return DEGREES_TO_ANGLE[closest] || "front"
}

export function RotationControl({ value, onChange, className }: RotationControlProps) {
  const [rotation, setRotation] = useState(ANGLE_TO_DEGREES[value] || 0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Update rotation when value prop changes
  useEffect(() => {
    const degrees = ANGLE_TO_DEGREES[value] || 0
    setRotation(degrees)
  }, [value])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    updateRotation(e)
  }

  const updateRotation = (e: MouseEvent | React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = e.clientX - centerX
    const y = e.clientY - centerY

    // Calculate angle in degrees (0° = top, clockwise)
    let degrees = (Math.atan2(y, x) * 180) / Math.PI + 90
    if (degrees < 0) degrees += 360

    // Snap to nearest 90-degree angle
    const snappedDegrees = Math.round(degrees / 90) * 90
    const angle = getClosestAngle(snappedDegrees)

    setRotation(snappedDegrees)
    onChange(angle)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const x = e.clientX - centerX
      const y = e.clientY - centerY

      // Calculate angle in degrees (0° = top, clockwise)
      let degrees = (Math.atan2(y, x) * 180) / Math.PI + 90
      if (degrees < 0) degrees += 360

      // Snap to nearest 90-degree angle
      const snappedDegrees = Math.round(degrees / 90) * 90
      const angle = getClosestAngle(snappedDegrees)

      setRotation(snappedDegrees)
      onChange(angle)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging])

  const angleLabels = [
    { angle: 0, label: "Front", position: "top" },
    { angle: 90, label: "Side", position: "right" },
    { angle: 180, label: "Back", position: "bottom" },
    { angle: 270, label: "Side", position: "left" },
  ]

  return (
    <div className={cn("space-y-3", className)}>
      <Label>Rotate Model (360°)</Label>
      <div className="relative">
        {/* Circular rotation control */}
        <div
          ref={containerRef}
          className="relative w-full aspect-square max-w-[200px] mx-auto cursor-pointer select-none"
          onMouseDown={handleMouseDown}
        >
          {/* Outer circle */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 bg-secondary/50" />

          {/* Rotation indicator line */}
          <div
            className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-primary origin-left transition-transform duration-200"
            style={{
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            }}
          />

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />

          {/* Angle markers */}
          {angleLabels.map(({ angle, label, position }) => {
            const isActive = Math.abs(rotation - angle) < 5 || Math.abs(rotation - angle) > 355
            const radius = 45 // percentage
            const radian = ((angle - 90) * Math.PI) / 180
            const x = 50 + radius * Math.cos(radian)
            const y = 50 + radius * Math.sin(radian)

            return (
              <div
                key={angle}
                className={cn(
                  "absolute text-xs font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full border-2 transition-colors",
                      isActive
                        ? "bg-primary border-primary"
                        : "bg-background border-muted-foreground"
                    )}
                  />
                  <span className="whitespace-nowrap">{label}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Linear slider as alternative */}
        <div className="mt-4">
          <input
            type="range"
            min="0"
            max="360"
            step="90"
            value={rotation}
            onChange={(e) => {
              const degrees = parseInt(e.target.value)
              const angle = getClosestAngle(degrees)
              setRotation(degrees)
              onChange(angle)
            }}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${(rotation / 360) * 100}%, hsl(var(--secondary)) ${(rotation / 360) * 100}%, hsl(var(--secondary)) 100%)`,
            }}
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>0°</span>
            <span>90°</span>
            <span>180°</span>
            <span>270°</span>
            <span>360°</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Click and drag the circle or use the slider to rotate
      </p>
    </div>
  )
}
