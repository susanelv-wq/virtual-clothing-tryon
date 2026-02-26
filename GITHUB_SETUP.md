# GitHub Setup Guide

## Step 1: Initialize Git Repository

The repository is already initialized. If you need to reinitialize:

```bash
git init
```

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `virtual-clothing-tryon` (or any name you prefer)
3. Description: "AI-powered virtual try-on web application"
4. Choose **Public** (so raw.githubusercontent.com URLs work)
5. **Don't** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 3: Connect Local Repository to GitHub

After creating the GitHub repo, run these commands:

```bash
# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Virtual Try-On Web Application"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/virtual-clothing-tryon.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Create Model Images Repository

For hosting model images, create a **separate** repository:

1. Go to https://github.com/new
2. Repository name: `virtual-tryon-models` (or any name)
3. Choose **Public**
4. Click "Create repository"

## Step 5: Upload Model Images

### Option A: Using GitHub Web Interface

1. Go to your `virtual-tryon-models` repository
2. Click "Add file" → "Upload files"
3. Create a `models` folder structure:
   ```
   models/
     ├── standing-front-light-slim.jpg
     ├── standing-front-medium-average.jpg
     ├── standing-side-dark-curvy.jpg
     └── ...
   ```
4. Upload your model images
5. Commit with message: "Add model images"
6. Click "Commit changes"

### Option B: Using Git Commands

```bash
# Create models directory
mkdir -p models

# Add your model images to the models folder
# (copy your image files here)

# Initialize git in models repo
cd models
git init
git add .
git commit -m "Add model images"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/virtual-tryon-models.git
git push -u origin main
```

## Step 6: Get Image URLs

After uploading images to GitHub:

1. Go to your `virtual-tryon-models` repository
2. Navigate to the image file (e.g., `models/standing-front-medium.jpg`)
3. Click on the image
4. Click the **"Raw"** button (top right)
5. Copy the URL from the address bar

Example URL format:
```
https://raw.githubusercontent.com/YOUR_USERNAME/virtual-tryon-models/main/models/standing-front-medium.jpg
```

## Step 7: Update Model Gallery

Edit `lib/model-gallery.ts` and replace the URLs:

```typescript
export const MODEL_GALLERY: ModelImageConfig[] = [
  {
    pose: "standing-front",
    skinTone: "light",
    bodyType: "slim",
    url: "https://raw.githubusercontent.com/YOUR_USERNAME/virtual-tryon-models/main/models/standing-front-light-slim.jpg",
  },
  {
    pose: "standing-front",
    skinTone: "medium",
    bodyType: "average",
    url: "https://raw.githubusercontent.com/YOUR_USERNAME/virtual-tryon-models/main/models/standing-front-medium-average.jpg",
  },
  // Add more...
]
```

## Step 8: Commit and Push Changes

```bash
git add lib/model-gallery.ts
git commit -m "Update model gallery with GitHub URLs"
git push
```

## Finding Free Model Images

If you need model images:

1. **Unsplash** (Free, high-quality):
   - https://unsplash.com/s/photos/fashion-model
   - Search for: "fashion model", "portrait", "professional model"
   - Download and use freely

2. **Pexels** (Free):
   - https://www.pexels.com/search/fashion%20model/
   - Free to use, no attribution required

3. **Pixabay** (Free):
   - https://pixabay.com/images/search/fashion%20model/

## Tips

- **Keep models repo public** - so raw.githubusercontent.com URLs work
- **Organize by pose/skin/body type** - easier to manage
- **Use descriptive filenames** - e.g., `standing-front-medium-average.jpg`
- **Optimize images** - compress before uploading (saves bandwidth)

## Troubleshooting

### Images not loading?
- Make sure the repository is **public**
- Check the URL format (should be `raw.githubusercontent.com`)
- Verify the file path matches exactly

### Can't push to GitHub?
- Make sure you're authenticated: `gh auth login` or use SSH keys
- Check remote URL: `git remote -v`
- Verify you have push access to the repository

## Next Steps

1. ✅ Connect project to GitHub
2. ✅ Create models repository
3. ✅ Upload model images
4. ✅ Update `lib/model-gallery.ts`
5. ✅ Test the application!
