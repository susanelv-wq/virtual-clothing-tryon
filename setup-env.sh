#!/bin/bash

# Setup .env.local file with FASHN API Key

echo "🔧 Setting up .env.local file"
echo "=============================="
echo ""

ENV_FILE=".env.local"
API_KEY="fa-v8quJyGOBko0-f7a1AG5ALXt4cqFSEKWF2ci2"

# Check if file exists
if [ -f "$ENV_FILE" ]; then
    echo "📄 File $ENV_FILE already exists"
    echo ""
    echo "Current contents:"
    cat "$ENV_FILE"
    echo ""
    read -p "Do you want to update it? (y/n): " UPDATE
    if [ "$UPDATE" != "y" ]; then
        echo "Keeping existing file"
        exit 0
    fi
fi

# Create/update the file
echo "FASHN_API_KEY=$API_KEY" > "$ENV_FILE"

echo ""
echo "✅ Created/updated $ENV_FILE with:"
echo "   FASHN_API_KEY=$API_KEY"
echo ""
echo "📋 Next steps:"
echo "1. Restart your dev server:"
echo "   - Stop current server (Ctrl+C)"
echo "   - Run: npm run dev"
echo ""
echo "2. Test the API key:"
echo "   - Go to http://localhost:3000/generate"
echo "   - Click 'Test API Key' button"
echo ""
echo "3. Try generating an image!"
echo ""
