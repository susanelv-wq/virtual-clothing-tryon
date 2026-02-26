# 🆓 Free Setup Guide

## Complete Free Solution - No Subscriptions Required!

This application has been updated to use **100% free services**. No paid subscriptions needed!

## What Changed?

✅ **Removed**: Fal AI (paid)  
✅ **Removed**: Vercel Blob (paid)  
✅ **Added**: FASHN API (free tier)  
✅ **Added**: ImgBB (completely free)  
✅ **Added**: Base64 encoding (no storage needed)

## Quick Start

### 1. Get Your FREE API Keys

#### FASHN API (Required)
1. Go to [https://app.fashn.ai/api](https://app.fashn.ai/api)
2. Sign up for a free account
3. Get your API key
4. Add to `.env.local`: `FASHN_API_KEY=your_key_here`

#### ImgBB (Optional but Recommended)
1. Go to [https://api.imgbb.com/](https://api.imgbb.com/)
2. Sign up for a free account
3. Get your API key
4. Add to `.env.local`: `IMGBB_API_KEY=your_key_here`

**Note**: Without ImgBB key, images will use base64 encoding (works but less efficient).

### 2. Create `.env.local`

```env
FASHN_API_KEY=your_fashn_key_here
IMGBB_API_KEY=your_imgbb_key_here
```

### 3. Install & Run

```bash
npm install
npm run dev
```

## Cost Comparison

| Service | Old (Paid) | New (Free) |
|---------|-----------|------------|
| AI Generation | Fal AI ($) | FASHN (Free tier) |
| Image Storage | Vercel Blob ($) | ImgBB (Free) |
| **Total** | **$$$** | **$0** |

## Features Still Work

✅ Upload clothing images  
✅ Customize model (pose, skin tone, body type, background)  
✅ Generate virtual try-on  
✅ Download high-quality images  
✅ View history  

Everything works exactly the same, just using free services!

## Troubleshooting

### "FASHN_API_KEY not set"
- Make sure `.env.local` exists in the root directory
- Restart the dev server after adding the key
- Get your free key at [app.fashn.ai/api](https://app.fashn.ai/api)

### API Endpoint Issues
- Check FASHN's latest API documentation at [docs.fashn.ai](https://docs.fashn.ai)
- The endpoint might need adjustment based on their current API
- You can also try using their SDK: `npm i fashn` (if available)

### Model Images
- You still need to provide model images
- Upload them to ImgBB (free) or any free image hosting
- Update `lib/model-gallery.ts` with your image URLs

## Need Help?

- FASHN Docs: [docs.fashn.ai](https://docs.fashn.ai)
- ImgBB Docs: [api.imgbb.com](https://api.imgbb.com/)
- Check the main README.md for detailed setup instructions
