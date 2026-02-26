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
  pose: string
  skinTone: string
  bodyType: string
  url: string
}

// Example model gallery - replace with your actual CDN URLs
// For now, using placeholder URLs that will trigger demo mode
// To use real API: Upload model images to ImgBB (free) and update these URLs

export const MODEL_GALLERY: ModelImageConfig[] = [
  // Standing Front - Light Skin
  {
    pose: "standing-front",
    skinTone: "light",
    bodyType: "slim",
    url: "", // Add your model image URL here
  },
  {
    pose: "standing-front",
    skinTone: "light",
    bodyType: "average",
    url: "", // Add your model image URL here
  },
  {
    pose: "standing-front",
    skinTone: "light",
    bodyType: "athletic",
    url: "", // Add your model image URL here
  },
  {
    pose: "standing-front",
    skinTone: "light",
    bodyType: "curvy",
    url: "", // Add your model image URL here
  },
  // Standing Front - Medium Skin
  {
    pose: "standing-front",
    skinTone: "medium",
    bodyType: "slim",
    url: "", // Add your model image URL here
  },
  {
    pose: "standing-front",
    skinTone: "medium",
    bodyType: "average",
    url: "", // Add your model image URL here
  },
  {
    pose: "standing-front",
    skinTone: "medium",
    bodyType: "athletic",
    url: "", // Add your model image URL here
  },
  {
    pose: "standing-front",
    skinTone: "medium",
    bodyType: "curvy",
    url: "", // Add your model image URL here
  },
  // Add more poses and variations as needed
  // You can find free model images at:
  // - Unsplash: https://unsplash.com/s/photos/fashion-model
  // - Pexels: https://www.pexels.com/search/fashion%20model/
]

/**
 * Get model image URL based on customization options
 */
export function getModelImageUrl(
  pose: string,
  skinTone: string,
  bodyType: string
): string {
  // Find matching model image
  const model = MODEL_GALLERY.find(
    (m) =>
      m.pose === pose &&
      m.skinTone === skinTone &&
      m.bodyType === bodyType
  )

  if (model) {
    return model.url
  }

  // Fallback to closest match
  const fallback = MODEL_GALLERY.find(
    (m) => m.pose === pose && m.skinTone === skinTone
  ) || MODEL_GALLERY.find((m) => m.pose === pose) || MODEL_GALLERY[0]

  const fallbackUrl = fallback?.url || ""
  
  // Check if URL is a placeholder or invalid
  if (!fallbackUrl || 
      fallbackUrl.includes("placeholder") || 
      fallbackUrl.includes("your-cdn.com") ||
      fallbackUrl.includes("Model+Image+Required")) {
    // Return a demo model image URL (you can replace this with an actual free model image)
    // For now, return null to trigger demo mode in the API
    return ""
  }

  return fallbackUrl
}
