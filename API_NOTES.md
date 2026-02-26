# API Configuration Notes

## Current Implementation

The application is set up to use **FASHN API** for virtual try-on generation. However, the exact API endpoint and parameters may need adjustment based on FASHN's current API documentation.

## Issues You Might Encounter

### 1. "Failed to download image"
- **Fixed**: The download function now handles both data URLs and regular URLs
- If you still see this error, the image might be a data URL - try right-clicking and "Save Image As"

### 2. "Generation Failed"
- The FASHN API endpoint might be incorrect
- Check FASHN's latest documentation at https://docs.fashn.ai
- The API might require different parameter names or authentication

### 3. "Model Image Required"
- You need to update `lib/model-gallery.ts` with actual model image URLs
- Upload model images to ImgBB (free) or any free image hosting
- The model images should match the customization options (pose, skin tone, body type)

## Testing Without API Keys

The app now has a **demo mode** that works without API keys:
- If `FASHN_API_KEY` is not set, it will return the uploaded clothing image as a demo result
- This allows you to test the UI and flow without setting up API keys

## Alternative Free APIs

If FASHN doesn't work, consider these alternatives:

1. **Hugging Face Inference API** (Free tier)
   - Models like `levihsu/OOTDiffusion` for virtual try-on
   - Free tier: 30,000 requests/month

2. **Replicate** (Free tier)
   - Various virtual try-on models
   - Free tier: Limited requests

3. **Local AI Models** (Completely free)
   - Run models locally using Ollama or similar
   - Requires more setup but no API costs

## Quick Fixes

1. **Check FASHN API Documentation**: https://docs.fashn.ai
2. **Update API Endpoint**: Edit `app/api/generate/route.ts` with the correct endpoint
3. **Add Model Images**: Update `lib/model-gallery.ts` with your model image URLs
4. **Test in Demo Mode**: Remove `FASHN_API_KEY` from `.env.local` to test UI

## Current API Endpoints Tried

The code tries these endpoints in order:
- `https://api.fashn.ai/v1/tryon`
- `https://api.fashn.ai/tryon`
- `https://fashn.ai/api/v1/tryon`

If none work, check FASHN's documentation for the correct endpoint.
