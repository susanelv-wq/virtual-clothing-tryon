/**
 * Free Image Storage Utilities
 * 
 * Completely FREE options:
 * 1. Base64 data URLs (no storage needed - default)
 * 2. GitHub (free, unlimited) - upload to repo, use raw.githubusercontent.com
 * 3. Cloudinary free tier (10GB storage, 25GB bandwidth/month)
 */

/**
 * Upload to Cloudinary (FREE TIER: 10GB storage, 25GB bandwidth/month)
 * Sign up at https://cloudinary.com/users/register/free
 * This is the recommended free option for persistent storage
 */
export async function uploadToCloudinary(imageBuffer: Buffer): Promise<string> {
  const cloudinaryUrl = process.env.CLOUDINARY_URL
  
  if (!cloudinaryUrl) {
    // Fallback to base64 if Cloudinary not configured
    console.warn("CLOUDINARY_URL not set. Using base64 data URL. Get free account at https://cloudinary.com")
    return bufferToDataURL(imageBuffer)
  }

  try {
    // Convert buffer to base64
    const base64Image = imageBuffer.toString("base64")
    
    // Extract cloud name from CLOUDINARY_URL
    // Format: cloudinary://api_key:api_secret@cloud_name
    const urlParts = cloudinaryUrl.match(/cloudinary:\/\/(\w+):(\w+)@(\w+)/)
    if (!urlParts) {
      throw new Error("Invalid CLOUDINARY_URL format")
    }
    
    const [, apiKey, apiSecret, cloudName] = urlParts
    
    // Create upload signature (simplified - for production use proper signing)
    const timestamp = Math.round(new Date().getTime() / 1000)
    const formData = new FormData()
    formData.append("file", `data:image/jpeg;base64,${base64Image}`)
    formData.append("upload_preset", "ml_default") // Create upload preset in Cloudinary dashboard
    formData.append("api_key", apiKey)
    formData.append("timestamp", timestamp.toString())
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Cloudinary upload failed:", errorText)
      // Fallback to base64
      return bufferToDataURL(imageBuffer)
    }

    const data = await response.json()
    return data.secure_url || data.url || bufferToDataURL(imageBuffer)
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    // Fallback to base64 data URL
    return bufferToDataURL(imageBuffer)
  }
}

/**
 * Upload to ImgBB (FREE - but has limitations)
 * Only use if you have a free API key
 */
export async function uploadToImgBB(imageBuffer: Buffer): Promise<string> {
  const apiKey = process.env.IMGBB_API_KEY
  
  if (!apiKey) {
    // Fallback to base64
    return bufferToDataURL(imageBuffer)
  }
  
  try {
    const base64Image = imageBuffer.toString("base64")
    const formData = new URLSearchParams()
    formData.append("key", apiKey)
    formData.append("image", base64Image)
    
    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    if (!response.ok) {
      return bufferToDataURL(imageBuffer)
    }

    const data = await response.json()
    return data.success && data.data?.url ? data.data.url : bufferToDataURL(imageBuffer)
  } catch (error) {
    return bufferToDataURL(imageBuffer)
  }
}

/**
 * Use GitHub for FREE image hosting (Recommended for model images)
 * 
 * Steps:
 * 1. Create a GitHub repository (free)
 * 2. Upload model images to the repo
 * 3. Use raw.githubusercontent.com URLs
 * 
 * Example URL format:
 * https://raw.githubusercontent.com/username/repo/main/models/image.jpg
 * 
 * This is completely free and unlimited!
 */
export function getGitHubImageUrl(
  username: string,
  repo: string,
  branch: string,
  path: string
): string {
  return `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${path}`
}

/**
 * Convert image buffer to base64 data URL (no storage needed)
 * Use this for temporary images or if you want to avoid external storage
 */
export function bufferToDataURL(buffer: Buffer, mimeType: string = "image/jpeg"): string {
  const base64 = buffer.toString("base64")
  return `data:${mimeType};base64,${base64}`
}
