# Fix Nginx Warning and PM2 Error

## Issue 1: Nginx http2 Warning

The warning is about deprecated syntax. Fix it:

```bash
sudo nano /etc/nginx/sites-available/cobabaju.online
```

Change this line:
```nginx
listen 443 ssl http2;
```

To:
```nginx
listen 443 ssl;
http2 on;
```

## Issue 2: PM2 virtual-tryon Error

The app is in "errored" status. Check and fix:

```bash
# Check logs
pm2 logs virtual-tryon --lines 50

# Check if app is in correct directory
cd /var/www/virtual-clothing-tryon

# Check if .env.local exists
ls -la .env.local

# Check if build exists
ls -la .next

# Restart the app
pm2 restart virtual-tryon

# If still errored, delete and recreate
pm2 delete virtual-tryon
pm2 start ecosystem.config.js
pm2 save
```

## Complete Fix Steps

1. Fix Nginx config
2. Restart Nginx
3. Check PM2 logs
4. Fix PM2 issue
5. Verify everything works
