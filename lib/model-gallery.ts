/**
 * Model Gallery Configuration
 * 
 * Use GitHub for FREE image hosting:
 * 1. Create a GitHub repository (e.g., "virtual-tryon-models")
 * 2. Upload model images to the repo
 * 3. Use raw.githubusercontent.com URLs
 * 
 * Example URL format:
 * https://raw.githubusercontent.com/YOUR_USERNAME/virtual-tryon-models/main/models/standing-front-medium.jpg
 * 
 * See GITHUB_SETUP.md for detailed instructions
 */

export interface ModelImageConfig {
  id: string
  name: string
  pose: string
  skinTone: string
  bodyType: string
  angle: string // "front", "side", "back", "side-back", etc.
  url: string
}

// Model gallery with ImgBB-hosted images
// Only 3 models available - users can choose between these

export const MODEL_GALLERY: ModelImageConfig[] = [
  // Spanish Model - Front view
  {
    id: "spanish-front",
    name: "Spanish",
    pose: "standing",
    skinTone: "medium",
    bodyType: "athletic-spanish",
    angle: "front",
    url: "https://i.ibb.co.com/9mty2g5y/Spanish-front.png",
  },
  // Spanish Model - Side 1 (90°)
  {
    id: "spanish-side",
    name: "Spanish",
    pose: "standing",
    skinTone: "medium",
    bodyType: "athletic-spanish",
    angle: "side",
    url: "https://i.ibb.co.com/Hp7f7ZzR/spanish-side.png",
  },
  // Spanish Model - Side 2 (270°)
  {
    id: "spanish-side-back",
    name: "Spanish",
    pose: "standing",
    skinTone: "medium",
    bodyType: "athletic-spanish",
    angle: "side-back",
    url: "https://i.ibb.co.com/ynqLbrFK/spanish-side-left.png",
  },
  // Spanish Model - Back view (180°)
  {
    id: "spanish-back",
    name: "Spanish",
    pose: "standing",
    skinTone: "medium",
    bodyType: "athletic-spanish",
    angle: "back",
    url: "https://i.ibb.co.com/cKWtnG10/spanish-back.png",
  },
  // Blonde Model - Front view
  {
    id: "blonde-front",
    name: "Blonde",
    pose: "standing",
    skinTone: "light",
    bodyType: "athletic-blonde",
    angle: "front",
    url: "https://i.ibb.co.com/JjqHyWtP/Blonde.png",
  },
  // Blonde Model - Side 1 (90°)
  {
    id: "blonde-side",
    name: "Blonde",
    pose: "standing",
    skinTone: "light",
    bodyType: "athletic-blonde",
    angle: "side",
    url: "https://i.ibb.co.com/1fTBjgjv/blonde-side-2.png",
  },
  // Blonde Model - Side 2 (270°)
  {
    id: "blonde-side-back",
    name: "Blonde",
    pose: "standing",
    skinTone: "light",
    bodyType: "athletic-blonde",
    angle: "side-back",
    url: "https://i.ibb.co.com/v6hkwLzz/blonde-side.png",
  },
  // Blonde Model - Back view (180°)
  {
    id: "blonde-back",
    name: "Blonde",
    pose: "standing",
    skinTone: "light",
    bodyType: "athletic-blonde",
    angle: "back",
    url: "https://i.ibb.co.com/S4fTytq9/blonde-back.png",
  },
  // Asian Model - Front view
  {
    id: "asian-front",
    name: "Asian",
    pose: "standing",
    skinTone: "light",
    bodyType: "athletic-asian",
    angle: "front",
    url: "https://i.ibb.co.com/x8PNFG3k/Asian.png",
  },
  // Asian Model - Side 1 (90°)
  {
    id: "asian-side",
    name: "Asian",
    pose: "standing",
    skinTone: "light",
    bodyType: "athletic-asian",
    angle: "side",
    url: "https://i.ibb.co.com/6RZbdsMY/Asian-side.png",
  },
  // Asian Model - Side 2 (270°)
  {
    id: "asian-side-back",
    name: "Asian",
    pose: "standing",
    skinTone: "light",
    bodyType: "athletic-asian",
    angle: "side-back",
    url: "https://i.ibb.co.com/jkMgN6jt/Asian-side-2.png",
  },
  // Asian Model - Back view (180°)
  {
    id: "asian-back",
    name: "Asian",
    pose: "standing",
    skinTone: "light",
    bodyType: "athletic-asian",
    angle: "back",
    url: "https://i.ibb.co.com/gLXyYKgj/Asian-back.png",
  },
  // Korean Model - Front view
  {
    id: "korean-front",
    name: "Korean",
    pose: "standing",
    skinTone: "light",
    bodyType: "athletic-korean",
    angle: "front",
    url: "https://i.ibb.co.com/p6gpX3Q5/Korean-Front.png",
  },
  // Korean Model - Side 1 (90°)
  {
    id: "korean-side",
    name: "Korean",
    pose: "standing",
    skinTone: "light",
    bodyType: "athletic-korean",
    angle: "side",
    url: "https://i.ibb.co.com/vvqLpkC3/Korean-side.png",
  },
  // Korean Model - Side 2 (270°)
  {
    id: "korean-side-back",
    name: "Korean",
    pose: "standing",
    skinTone: "light",
    bodyType: "athletic-korean",
    angle: "side-back",
    url: "https://i.ibb.co.com/JF76jxGY/Korean-side-2.png",
  },
  // Korean Model - Back view (180°)
  {
    id: "korean-back",
    name: "Korean",
    pose: "standing",
    skinTone: "light",
    bodyType: "athletic-korean",
    angle: "back",
    url: "https://i.ibb.co.com/QvC58b9n/Korean-back.png",
  },
]

/**
 * Get model image URL based on customization options
 * Supports multiple angles (front, side, back) for 360-degree view
 */
export function getModelImageUrl(
  pose: string,
  skinTone: string,
  bodyType: string,
  angle: string = "front"
): string {
  // Find matching model image by pose, skinTone, bodyType, and angle
  const model = MODEL_GALLERY.find(
    (m) =>
      m.pose === pose &&
      m.skinTone === skinTone &&
      m.bodyType === bodyType &&
      m.angle === angle
  )

  if (model) {
    return model.url
  }

  // Fallback to front view of the same model
  const fallback = MODEL_GALLERY.find(
    (m) =>
      m.pose === pose &&
      m.skinTone === skinTone &&
      m.bodyType === bodyType &&
      m.angle === "front"
  ) || MODEL_GALLERY[0]

  const fallbackUrl = fallback?.url || ""
  
  // Check if URL is a placeholder or invalid
  if (!fallbackUrl || 
      fallbackUrl.includes("placeholder") || 
      fallbackUrl.includes("your-cdn.com") ||
      fallbackUrl.includes("Model+Image+Required")) {
    return ""
  }

  return fallbackUrl
}

/**
 * Get model by ID (for direct model selection)
 */
export function getModelById(id: string): ModelImageConfig | undefined {
  return MODEL_GALLERY.find(m => m.id === id)
}

/**
 * Get all available models (for display in UI) - unique models only
 */
export function getAvailableModels() {
  const uniqueModels = new Map<string, ModelImageConfig>()
  
  MODEL_GALLERY.forEach(m => {
    const key = `${m.name}-${m.skinTone}-${m.bodyType}`
    if (!uniqueModels.has(key) || m.angle === "front") {
      uniqueModels.set(key, m)
    }
  })
  
  return Array.from(uniqueModels.values()).map(m => ({
    id: m.id,
    name: m.name,
    value: `${m.pose}-${m.skinTone}-${m.bodyType}`,
  }))
}

/**
 * Get available angles for a specific model
 */
export function getAvailableAngles(modelId: string): string[] {
  const model = MODEL_GALLERY.find(m => m.id === modelId)
  if (!model) return ["front"]
  
  const angles = MODEL_GALLERY
    .filter(m => 
      m.name === model.name &&
      m.skinTone === model.skinTone &&
      m.bodyType === model.bodyType
    )
    .map(m => m.angle)
  
  return [...new Set(angles)] // Remove duplicates
}
