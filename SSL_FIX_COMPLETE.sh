#!/bin/bash

# Complete SSL Fix Script
# Run this on your VPS to fix SSL certificate issues

set -e

echo "🔧 Fixing SSL Certificate Issues..."

# 1. Create ACME challenge directory
echo "📁 Creating ACME challenge directory..."
sudo mkdir -p /var/www/html/.well-known/acme-challenge
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# 2. Backup current Nginx config
echo "💾 Backing up current Nginx config..."
sudo cp /etc/nginx/sites-available/cobabaju.online /etc/nginx/sites-available/cobabaju.online.backup

# 3. Create new Nginx config
echo "📝 Creating new Nginx configuration..."
sudo tee /etc/nginx/sites-available/cobabaju.online > /dev/null <<EOF
server {
    listen 80;
    server_name cobabaju.online www.cobabaju.online;

    # Allow Let's Encrypt verification - MUST be before proxy_pass
    location /.well-known/acme-challenge/ {
        root /var/www/html;
        default_type "text/plain";
    }

    # Proxy everything else to Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 4. Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
if sudo nginx -t; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors. Restoring backup..."
    sudo cp /etc/nginx/sites-available/cobabaju.online.backup /etc/nginx/sites-available/cobabaju.online
    exit 1
fi

# 5. Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

# 6. Test ACME challenge path
echo "🧪 Testing ACME challenge path..."
echo "test-acme-challenge" | sudo tee /var/www/html/.well-known/acme-challenge/test.txt > /dev/null

# Test from localhost
if curl -s http://localhost/.well-known/acme-challenge/test.txt | grep -q "test-acme-challenge"; then
    echo "✅ ACME challenge path is accessible locally"
else
    echo "⚠️  ACME challenge path not accessible locally"
fi

# Test from domain (if DNS is set)
if curl -s http://cobabaju.online/.well-known/acme-challenge/test.txt | grep -q "test-acme-challenge"; then
    echo "✅ ACME challenge path is accessible from domain"
else
    echo "⚠️  ACME challenge path not accessible from domain (check DNS)"
fi

# Clean up test file
sudo rm -f /var/www/html/.well-known/acme-challenge/test.txt

# 7. Check DNS
echo "🌐 Checking DNS..."
DOMAIN_IP=$(dig +short cobabaju.online | tail -n1)
if [ "$DOMAIN_IP" = "76.13.195.111" ]; then
    echo "✅ DNS is correctly pointing to 76.13.195.111"
else
    echo "⚠️  DNS shows: $DOMAIN_IP (expected: 76.13.195.111)"
    echo "   Wait for DNS propagation or check Hostinger DNS settings"
fi

# 8. Check firewall
echo "🔥 Checking firewall..."
if sudo ufw status | grep -q "80/tcp.*ALLOW"; then
    echo "✅ Port 80 is open"
else
    echo "⚠️  Port 80 might be blocked. Opening it..."
    sudo ufw allow 80/tcp
fi

if sudo ufw status | grep -q "443/tcp.*ALLOW"; then
    echo "✅ Port 443 is open"
else
    echo "⚠️  Port 443 might be blocked. Opening it..."
    sudo ufw allow 443/tcp
fi

echo ""
echo "✅ Configuration updated!"
echo ""
echo "Now try getting SSL certificate:"
echo "  sudo certbot --nginx -d cobabaju.online -d www.cobabaju.online"
echo ""
echo "If it still fails, try standalone mode:"
echo "  sudo systemctl stop nginx"
echo "  sudo certbot certonly --standalone -d cobabaju.online -d www.cobabaju.online"
echo "  sudo systemctl start nginx"
