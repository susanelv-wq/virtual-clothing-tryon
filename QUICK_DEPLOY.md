# Quick Deployment Guide - cobabaju.online

**VPS IP:** `76.13.195.111`  
**Domain:** `cobabaju.online`

## Step-by-Step Commands

### 1. Connect to VPS
```bash
ssh root@76.13.195.111
# or if you have a username:
ssh your-username@76.13.195.111
```

### 2. Install Prerequisites
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# Install PM2
sudo npm install -g pm2

# Verify installations
node -v  # Should show v18.x or higher
npm -v
pm2 -v
```

### 3. Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/susanelv-wq/virtual-clothing-tryon.git
sudo chown -R $USER:$USER virtual-clothing-tryon
cd virtual-clothing-tryon
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Create Environment File
```bash
nano .env.local
```

Paste this (press Ctrl+X, then Y, then Enter to save):
```env
FASHN_API_KEY=fa-v8quJyGOBko0-f7a1AG5ALXt4cqFSEKWF2ci2
NODE_ENV=production
```

### 6. Build Application
```bash
npm run build
```

### 7. Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# Copy and run the command it shows you (usually starts with sudo)
```

### 8. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/cobabaju.online
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name cobabaju.online www.cobabaju.online;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save and exit (Ctrl+X, Y, Enter)

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/cobabaju.online /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 9. Configure Firewall
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 10. Set Up SSL (HTTPS)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d cobabaju.online -d www.cobabaju.online
```

Follow the prompts:
- Enter your email
- Agree to terms (A)
- Redirect HTTP to HTTPS? (2 - Yes)

### 11. Verify
```bash
# Check PM2
pm2 status

# Check Nginx
sudo systemctl status nginx

# View logs
pm2 logs virtual-tryon
```

Visit: **https://cobabaju.online**

## DNS Configuration (Do this in Hostinger)

Before step 10, make sure your domain DNS is configured:

1. Go to Hostinger DNS settings
2. Add/Update these records:
   - **A Record**: `@` → `76.13.195.111`
   - **A Record**: `www` → `76.13.195.111`

Wait 5-10 minutes for DNS to propagate, then continue with SSL setup.

## Update Commands

When you need to update the app:
```bash
cd /var/www/virtual-clothing-tryon
git pull origin main
npm install
npm run build
pm2 restart virtual-tryon
```

Or use the deploy script:
```bash
cd /var/www/virtual-clothing-tryon
./deploy.sh
```

## Troubleshooting

### Check if app is running
```bash
pm2 status
pm2 logs virtual-tryon
```

### Check if Nginx is running
```bash
sudo systemctl status nginx
sudo nginx -t
```

### Check if port 3000 is listening
```bash
sudo netstat -tulpn | grep 3000
```

### Test domain DNS
```bash
dig cobabaju.online
nslookup cobabaju.online
```

### View Nginx error logs
```bash
sudo tail -f /var/log/nginx/error.log
```

## Quick Status Check
```bash
echo "=== PM2 Status ==="
pm2 status

echo "=== Nginx Status ==="
sudo systemctl status nginx --no-pager

echo "=== Port 3000 ==="
sudo netstat -tulpn | grep 3000
```
