# 🚀 Quick Start - Connect to GitHub

## Step 1: Run Setup Script

```bash
./setup-github.sh
```

Or follow these manual steps:

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `virtual-clothing-tryon`
3. Make it **PUBLIC** (important for raw.githubusercontent.com URLs)
4. **Don't** initialize with README, .gitignore, or license
5. Click "Create repository"

## Step 3: Connect and Push

```bash
# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Virtual Try-On Web Application"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/virtual-clothing-tryon.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 4: Create Models Repository

1. Go to https://github.com/new
2. Repository name: `virtual-tryon-models`
3. Make it **PUBLIC**
4. Click "Create repository"

## Step 5: Upload Model Images

1. In your `virtual-tryon-models` repo, click "Add file" → "Upload files"
2. Create a `models` folder
3. Upload your model images
4. Commit with message: "Add model images"

## Step 6: Get Image URLs

1. Click on an uploaded image
2. Click the **"Raw"** button
3. Copy the URL

Example:
```
https://raw.githubusercontent.com/YOUR_USERNAME/virtual-tryon-models/main/models/standing-front-medium.jpg
```

## Step 7: Update Model Gallery

Edit `lib/model-gallery.ts` and add your GitHub URLs:

```typescript
{
  pose: "standing-front",
  skinTone: "medium",
  bodyType: "average",
  url: "https://raw.githubusercontent.com/YOUR_USERNAME/virtual-tryon-models/main/models/standing-front-medium.jpg",
}
```

## Step 8: Commit Changes

```bash
git add lib/model-gallery.ts
git commit -m "Add GitHub model image URLs"
git push
```

## ✅ Done!

Your project is now on GitHub and using free GitHub hosting for model images!
