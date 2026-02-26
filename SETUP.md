# Quick Setup Guide - FREE VERSION

## 🆓 Completely Free Setup

This application now uses **100% free services** - no subscriptions required!

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables (All FREE)

Create a `.env.local` file in the root directory:

```env
# Required: FASHN API Key (FREE)
# Get your free key at: https://app.fashn.ai/api
FASHN_API_KEY=your_fashn_api_key_here

# Optional: ImgBB API Key (FREE - for higher upload limits)
# Get free key at: https://api.imgbb.com/
# If not set, images will use base64 encoding (works fine for most cases)
IMGBB_API_KEY=your_imgbb_key_here

# Optional: Cloudinary (FREE TIER: 10GB storage, 25GB bandwidth/month)
# Sign up at: https://cloudinary.com/users/register/free
# Format: cloudinary://api_key:api_secret@cloud_name
CLOUDINARY_URL=cloudinary://your_key:your_secret@your_cloud_name
```

### Getting Your FREE FASHN API Key:
1. Go to [https://app.fashn.ai/api](https://app.fashn.ai/api)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Copy it to `.env.local` as `FASHN_API_KEY`

### Getting Your FREE ImgBB Key (Optional):
1. Go to [https://api.imgbb.com/](https://api.imgbb.com/)
2. Sign up for a free account
3. Get your API key
4. Copy it to `.env.local` as `IMGBB_API_KEY`

**Note**: If you don't set `IMGBB_API_KEY`, the app will use base64 data URLs which work fine but are less efficient for large images.

## 3. Set Up Model Gallery

The virtual try-on requires model images. You need to:

1. **Create Model Images**: Take or source professional model photos with:
   - Different poses (standing-front, standing-side, sitting, etc.)
   - Different skin tones (light, medium, dark, etc.)
   - Different body types (slim, athletic, average, curvy)

2. **Upload to FREE CDN**: Upload your model images to:
   - **ImgBB** (completely free, no limits)
   - **Cloudinary** (free tier: 10GB)
   - **GitHub** (free, use raw.githubusercontent.com URLs)
   - **Any free image hosting service**

3. **Update Model Gallery**: Edit `lib/model-gallery.ts` and replace the placeholder URLs with your actual model image URLs.

Example:
```typescript
export const MODEL_GALLERY: ModelImageConfig[] = [
  {
    pose: "standing-front",
    skinTone: "light",
    bodyType: "slim",
    url: "https://i.imgbb.com/your-image-id.jpg", // ImgBB free hosting
  },
  // Add more...
]
```

## 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 5. Test the Application

1. Upload a clothing image on the home page
2. Customize model options (pose, skin tone, body type, background)
3. Click "Generate Virtual Try-On"
4. Wait for the AI to process (10-30 seconds)
5. Download your generated image

## Cost Breakdown

✅ **FASHN API**: Free tier available  
✅ **ImgBB**: Completely free (unlimited uploads)  
✅ **Cloudinary**: Free tier (10GB storage, 25GB bandwidth/month)  
✅ **Total Cost**: $0.00/month

## Troubleshooting

### "FASHN_API_KEY not set" Warning
- Make sure your `.env.local` file exists and contains `FASHN_API_KEY=your_key`
- Restart the dev server after adding environment variables
- Get your free key at [https://app.fashn.ai/api](https://app.fashn.ai/api)

### "Model Image Required" Placeholder
- Update `lib/model-gallery.ts` with your actual model image URLs
- Ensure the URLs are publicly accessible
- Use ImgBB or Cloudinary for free hosting

### Generation Fails
- Check your FASHN API key is valid
- Verify you have credits/quota in your FASHN account (free tier)
- Check the browser console and server logs for error messages
- Make sure your model image URLs are accessible

### Image Upload Issues
- Ensure images are under 10MB
- Supported formats: PNG, JPG, JPEG, WEBP
- If using base64 (no ImgBB key), very large images may cause issues

## Free Alternatives Summary

| Service | Free Tier | Notes |
|---------|-----------|-------|
| **FASHN API** | ✅ Yes | Free tier available for virtual try-on |
| **ImgBB** | ✅ Yes | Completely free, unlimited uploads |
| **Cloudinary** | ✅ Yes | 10GB storage, 25GB bandwidth/month |
| **Base64** | ✅ Yes | No storage needed, works for small images |

## Next Steps

- Add more model images to your gallery
- Customize the UI colors and styling
- Add more customization options
- Implement user authentication for persistent history (optional)
- Add database storage instead of session storage (optional)
