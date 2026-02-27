# Change virtual-tryon to Port 3001

## Steps to Change Port

### 1. Update ecosystem.config.js (Already done in repo)

The file has been updated to use port 3001. Pull the latest changes:

```bash
cd /var/www/virtual-clothing-tryon
git pull origin main
```

Or manually update:

```bash
nano ecosystem.config.js
```

Change:
```javascript
PORT: 3000
```

To:
```javascript
PORT: 3001
```

### 2. Update Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/cobabaju.online
```

Find this line:
```nginx
proxy_pass http://localhost:3000;
```

Change to:
```nginx
proxy_pass http://localhost:3001;
```

Save and exit (Ctrl+X, Y, Enter)

### 3. Test and Reload Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Restart PM2 App

```bash
# Delete old process
pm2 delete virtual-tryon

# Start with new config
pm2 start ecosystem.config.js
pm2 save

# Check status
pm2 status
pm2 logs virtual-tryon --lines 20
```

### 5. Verify

```bash
# Check if app is running on port 3001
sudo netstat -tulpn | grep 3001

# Check PM2 status
pm2 status

# Visit your site
# https://cobabaju.online
```

## Complete Nginx Config (for reference)

After changes, your Nginx config should have:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name cobabaju.online www.cobabaju.online;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl;
    http2 on;
    server_name cobabaju.online www.cobabaju.online;

    ssl_certificate /etc/letsencrypt/live/cobabaju.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cobabaju.online/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:3001;  # Changed to 3001
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
