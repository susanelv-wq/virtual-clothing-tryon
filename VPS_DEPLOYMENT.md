# VPS Deployment Guide - Hostinger (cobabaju.online)

Complete guide to deploy your virtual try-on app to Hostinger VPS.

## Prerequisites

- VPS with Hostinger (Ubuntu/Debian recommended)
- Domain `cobabaju.online` pointed to your VPS IP
- SSH access to your VPS
- Node.js 18+ installed on VPS

## Step 1: Connect to Your VPS

```bash
ssh root@your-vps-ip
# or
ssh your-username@your-vps-ip
```

## Step 2: Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+ (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git (if not installed)
sudo apt install -y git
```

## Step 3: Clone Your Repository

```bash
# Navigate to web directory
cd /var/www

# Clone your repository
sudo git clone https://github.com/susanelv-wq/virtual-clothing-tryon.git
sudo chown -R $USER:$USER virtual-clothing-tryon
cd virtual-clothing-tryon
```

## Step 4: Install Dependencies and Build

```bash
# Install dependencies
npm install

# Create .env file
nano .env.local
```

Add this content to `.env.local`:
```env
FASHN_API_KEY=fa-v8quJyGOBko0-f7a1AG5ALXt4cqFSEKWF2ci2
NODE_ENV=production
```

Save and exit (Ctrl+X, then Y, then Enter)

```bash
# Build the application
npm run build
```

## Step 5: Set Up PM2

```bash
# Create PM2 ecosystem file
nano ecosystem.config.js
```

Add this content:
```javascript
module.exports = {
  apps: [{
    name: 'virtual-tryon',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/virtual-clothing-tryon',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/virtual-tryon-error.log',
    out_file: '/var/log/pm2/virtual-tryon-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
}
```

Save and exit.

```bash
# Create log directory
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Start the application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Follow the instructions it gives you (usually run a sudo command)
```

## Step 6: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/cobabaju.online
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name cobabaju.online www.cobabaju.online;

    # Redirect HTTP to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

    # For now, proxy to Node.js (remove after SSL setup)
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

Save and exit.

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/cobabaju.online /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 7: Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d cobabaju.online -d www.cobabaju.online

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)
```

Certbot will automatically update your Nginx configuration.

## Step 8: Configure Firewall

```bash
# Allow HTTP, HTTPS, and SSH
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Step 9: Verify Everything Works

1. Visit `http://cobabaju.online` (should redirect to HTTPS)
2. Check PM2 status: `pm2 status`
3. Check logs: `pm2 logs virtual-tryon`
4. Check Nginx: `sudo systemctl status nginx`

## Useful Commands

### PM2 Commands
```bash
pm2 status              # Check app status
pm2 logs virtual-tryon  # View logs
pm2 restart virtual-tryon # Restart app
pm2 stop virtual-tryon   # Stop app
pm2 monit               # Monitor resources
```

### Update Application
```bash
cd /var/www/virtual-clothing-tryon
git pull origin main
npm install
npm run build
pm2 restart virtual-tryon
```

### Nginx Commands
```bash
sudo systemctl status nginx
sudo systemctl restart nginx
sudo nginx -t           # Test configuration
```

### SSL Renewal (Automatic)
Certbot sets up automatic renewal. Test it:
```bash
sudo certbot renew --dry-run
```

## Troubleshooting

### App not loading?
```bash
# Check PM2
pm2 logs virtual-tryon

# Check if port 3000 is in use
sudo netstat -tulpn | grep 3000

# Check Nginx
sudo nginx -t
sudo systemctl status nginx
```

### SSL issues?
```bash
# Check certificate
sudo certbot certificates

# Renew manually
sudo certbot renew
```

### Domain not pointing correctly?
```bash
# Check DNS
dig cobabaju.online
nslookup cobabaju.online
```

## Environment Variables

Make sure `.env.local` has:
```env
FASHN_API_KEY=fa-v8quJyGOBko0-f7a1AG5ALXt4cqFSEKWF2ci2
NODE_ENV=production
```

## Performance Optimization

### Enable Gzip in Nginx
Add to your Nginx config:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
```

### PM2 Cluster Mode (Optional)
For better performance, you can use cluster mode in `ecosystem.config.js`:
```javascript
instances: 'max',  // Use all CPU cores
exec_mode: 'cluster',
```

## Backup

Create a backup script:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backup/virtual-tryon-$DATE.tar.gz /var/www/virtual-clothing-tryon
```

## Security Tips

1. Keep system updated: `sudo apt update && sudo apt upgrade`
2. Use strong SSH keys
3. Keep Node.js updated
4. Monitor PM2 logs regularly
5. Set up fail2ban for SSH protection

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs virtual-tryon`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Check system logs: `sudo journalctl -xe`
