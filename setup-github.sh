#!/bin/bash

# GitHub Setup Script for Virtual Try-On Project
# This script helps you connect your project to GitHub

echo "🚀 Virtual Try-On - GitHub Setup"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git branch -M main
fi

# Show current status
echo "📋 Current git status:"
git status --short
echo ""

# Ask for GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

# Ask for repository name
read -p "Enter repository name (default: virtual-clothing-tryon): " REPO_NAME
REPO_NAME=${REPO_NAME:-virtual-clothing-tryon}

echo ""
echo "📝 Next steps:"
echo "=============="
echo ""
echo "1. Create a new repository on GitHub:"
echo "   https://github.com/new"
echo "   Repository name: $REPO_NAME"
echo "   Make it PUBLIC (so raw.githubusercontent.com works)"
echo "   Don't initialize with README"
echo ""
echo "2. After creating the repo, run these commands:"
echo ""
echo "   git add ."
echo "   git commit -m 'Initial commit: Virtual Try-On Web Application'"
echo "   git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo "   git push -u origin main"
echo ""
echo "3. Create a separate repository for model images:"
echo "   https://github.com/new"
echo "   Repository name: virtual-tryon-models"
echo "   Make it PUBLIC"
echo ""
echo "4. Upload model images to the models repo and update lib/model-gallery.ts"
echo ""
echo "📖 See GITHUB_SETUP.md for detailed instructions"
echo ""
