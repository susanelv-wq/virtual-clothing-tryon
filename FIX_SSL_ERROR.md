# Fix SSL Certificate Error

The error indicates Let's Encrypt can't verify your domain. Let's fix this step by step.

## Step 1: Verify DNS is Correct

First, check if your domain points to your VPS IP:

```bash
# Check DNS records
dig cobabaju.online +short
nslookup cobabaju.online

# Should return: 76.13.195.111
```

If it doesn't show your IP, wait a bit longer for DNS propagation or check Hostinger DNS settings.

## Step 2: Check if Domain is Accessible

```bash
# Test from your VPS
curl -I http://cobabaju.online
curl -I http://www.cobabaju.online

# Should return HTTP 200 or 301/302
```

## Step 3: Fix Nginx Configuration

The issue is that Nginx needs to allow Let's Encrypt to verify the domain. Update your Nginx config:

```bash
sudo nano /etc/nginx/sites-available/cobabaju.online
```

Replace with this configuration (IMPORTANT: This allows ACME challenge):

```nginx
server {
    listen 80;
    server_name cobabaju.online www.cobabaju.online;

    # Allow Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/html;
        try_files $uri =404;
    }

    # Proxy everything else to Node.js
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

## Step 4: Create ACME Challenge Directory

```bash
sudo mkdir -p /var/www/html/.well-known/acme-challenge
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

## Step 5: Test and Reload Nginx

```bash
# Test configuration
sudo nginx -t

# If test passes, reload
sudo systemctl reload nginx
```

## Step 6: Verify ACME Challenge Works

```bash
# Create a test file
echo "test" | sudo tee /var/www/html/.well-known/acme-challenge/test.txt

# Test from your VPS
curl http://cobabaju.online/.well-known/acme-challenge/test.txt

# Should return: test

# Clean up
sudo rm /var/www/html/.well-known/acme-challenge/test.txt
```

## Step 7: Try SSL Certificate Again

```bash
sudo certbot --nginx -d cobabaju.online -d www.cobabaju.online
```

## Alternative: Manual Verification (if above doesn't work)

If automatic verification still fails, try standalone mode:

```bash
# Stop Nginx temporarily
sudo systemctl stop nginx

# Get certificate in standalone mode
sudo certbot certonly --standalone -d cobabaju.online -d www.cobabaju.online

# Start Nginx again
sudo systemctl start nginx

# Then manually configure SSL in Nginx (see below)
```

## Manual SSL Configuration (if using standalone)

If you used standalone mode, update Nginx config manually:

```bash
sudo nano /etc/nginx/sites-available/cobabaju.online
```

```nginx
server {
    listen 80;
    server_name cobabaju.online www.cobabaju.online;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cobabaju.online www.cobabaju.online;

    ssl_certificate /etc/letsencrypt/live/cobabaju.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cobabaju.online/privkey.pem;

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

Then:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Check Firewall

Make sure ports 80 and 443 are open:

```bash
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Debug Commands

```bash
# Check if port 80 is listening
sudo netstat -tulpn | grep :80

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check Let's Encrypt logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Test domain from outside
curl -v http://cobabaju.online
```
