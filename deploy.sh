#!/bin/bash

# Deployment script for VPS
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project root?"
    exit 1
fi

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}🏗️  Building application...${NC}"
npm run build

echo -e "${YELLOW}🔄 Restarting PM2...${NC}"
if pm2 list | grep -q "virtual-tryon"; then
    pm2 restart virtual-tryon
else
    pm2 start ecosystem.config.js
    pm2 save
fi

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Check status: pm2 status"
echo "View logs: pm2 logs virtual-tryon"
