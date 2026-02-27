# Deployment Guide

Your virtual try-on app is now on GitHub! Here's how to deploy it.

## Quick Deploy with Vercel (Recommended - FREE)

Vercel is the easiest way to deploy Next.js apps and offers a free tier.

### Steps:

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with your GitHub account
3. **Click "Add New Project"**
4. **Import your repository**: Select `susanelv-wq/virtual-clothing-tryon`
5. **Configure Project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
6. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add: `FASHN_API_KEY` = `fa-v8quJyGOBko0-f7a1AG5ALXt4cqFSEKWF2ci2`
7. **Click "Deploy"**

That's it! Your app will be live in ~2 minutes.

### After Deployment:

- Your app will have a URL like: `https://virtual-clothing-tryon.vercel.app`
- Every push to `main` branch will auto-deploy
- You can add a custom domain later

## Alternative: Netlify (Also FREE)

1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select your GitHub repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variable: `FASHN_API_KEY`
7. Deploy!

## Environment Variables

Make sure to add this in your deployment platform:

```
FASHN_API_KEY=fa-v8quJyGOBko0-f7a1AG5ALXt4cqFSEKWF2ci2
```

## Troubleshooting

- **Build fails?** Check that all dependencies are in `package.json`
- **API errors?** Verify `FASHN_API_KEY` is set correctly
- **Images not loading?** Check that ImgBB URLs are accessible

## Local Testing Before Deploy

```bash
npm run build
npm start
```

This tests the production build locally.
