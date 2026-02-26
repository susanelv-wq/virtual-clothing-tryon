#!/bin/bash

# Setup Script for Models Repository

echo "📸 Virtual Try-On Models Repository Setup"
echo "=========================================="
echo ""

read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Create a NEW repository on GitHub:"
echo "   https://github.com/new"
echo ""
echo "   Repository name: virtual-tryon-models"
echo "   Description: Model images for virtual try-on application"
echo "   Make it PUBLIC (important!)"
echo "   Don't initialize with README"
echo ""
echo "2. After creating the repo, run these commands:"
echo ""
echo "   cd models"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Add model images structure'"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/$GITHUB_USERNAME/virtual-tryon-models.git"
echo "   git push -u origin main"
echo ""
echo "3. Upload your model images to the appropriate folders:"
echo "   - standing-front/"
echo "   - standing-side/"
echo "   - sitting/"
echo "   - walking/"
echo ""
echo "4. After uploading images, commit and push:"
echo ""
echo "   git add ."
echo "   git commit -m 'Add model images'"
echo "   git push"
echo ""
echo "5. Get image URLs:"
echo "   - Go to your repository on GitHub"
echo "   - Click on an image file"
echo "   - Click the 'Raw' button"
echo "   - Copy the URL"
echo ""
echo "6. Update lib/model-gallery.ts with the GitHub URLs"
echo ""
echo "✅ Done!"
echo ""
