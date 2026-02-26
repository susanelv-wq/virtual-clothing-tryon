# 📸 Models Repository Setup Guide

## Step 1: Create Models Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `virtual-tryon-models`
3. Description: "Model images for virtual try-on application"
4. Make it **PUBLIC** (required for raw.githubusercontent.com URLs)
5. **Don't** initialize with README, .gitignore, or license
6. Click "Create repository"

## Step 2: Initialize Models Repository Locally

Run the setup script:

```bash
./setup-models-repo.sh
```

Or manually:

```bash
cd models
git init
git add .
git commit -m "Add model images structure"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/virtual-tryon-models.git
git push -u origin main
```

## Step 3: Upload Model Images

### Option A: Using GitHub Web Interface

1. Go to your `virtual-tryon-models` repository
2. Navigate to the appropriate folder (e.g., `standing-front/`)
3. Click "Add file" → "Upload files"
4. Upload your model images
5. Commit with message: "Add model images"
6. Click "Commit changes"

### Option B: Using Git Commands

```bash
# Copy your model images to the appropriate folders
# For example:
cp ~/Downloads/model-standing-front-medium.jpg models/standing-front/

# Then commit and push
cd models
git add .
git commit -m "Add model images"
git push
```

## Step 4: Get Image URLs

1. Go to your `virtual-tryon-models` repository on GitHub
2. Navigate to an image file (e.g., `models/standing-front/medium-average.jpg`)
3. Click on the image
4. Click the **"Raw"** button (top right of the image)
5. Copy the URL from the address bar

Example URL:
```
https://raw.githubusercontent.com/YOUR_USERNAME/virtual-tryon-models/main/models/standing-front/medium-average.jpg
```

## Step 5: Update Model Gallery

Edit `lib/model-gallery.ts` and replace the empty URLs:

```typescript
export const MODEL_GALLERY: ModelImageConfig[] = [
  {
    pose: "standing-front",
    skinTone: "medium",
    bodyType: "average",
    url: "https://raw.githubusercontent.com/YOUR_USERNAME/virtual-tryon-models/main/models/standing-front/medium-average.jpg",
  },
  // Add more...
]
```

## Step 6: Commit Changes

```bash
# Back in your main project
git add lib/model-gallery.ts
git commit -m "Update model gallery with GitHub URLs"
git push
```

## Image Naming Convention

Name your images clearly:
- `standing-front-light-slim.jpg`
- `standing-front-medium-average.jpg`
- `standing-side-dark-curvy.jpg`

Format: `{pose}-{skinTone}-{bodyType}.jpg`

## Finding Free Model Images

### Unsplash (Recommended)
- https://unsplash.com/s/photos/fashion-model
- High-quality, professional photos
- Free to use

### Pexels
- https://www.pexels.com/search/fashion%20model/
- Free stock photos

### Pixabay
- https://pixabay.com/images/search/fashion%20model/
- Free images

## Folder Structure

```
virtual-tryon-models/
├── models/
│   ├── standing-front/
│   │   ├── light-slim.jpg
│   │   ├── medium-average.jpg
│   │   └── ...
│   ├── standing-side/
│   ├── sitting/
│   └── walking/
└── README.md
```

## Tips

- ✅ Keep repository **PUBLIC** (required for raw URLs)
- ✅ Use descriptive filenames
- ✅ Organize by pose in folders
- ✅ Optimize images before uploading (smaller = faster)
- ✅ Test URLs in browser before adding to code

## Troubleshooting

### Images not loading?
- Make sure repository is **PUBLIC**
- Check URL format (should be `raw.githubusercontent.com`)
- Verify file path matches exactly

### Can't push?
- Make sure you're authenticated
- Check remote URL: `git remote -v`
- Try: `git push -u origin main --force` (if safe to overwrite)

## ✅ Quick Checklist

- [ ] Created `virtual-tryon-models` repository on GitHub
- [ ] Made repository PUBLIC
- [ ] Initialized git in models folder
- [ ] Pushed folder structure to GitHub
- [ ] Uploaded model images
- [ ] Got raw GitHub URLs
- [ ] Updated `lib/model-gallery.ts`
- [ ] Tested image URLs in browser
- [ ] Committed and pushed changes
