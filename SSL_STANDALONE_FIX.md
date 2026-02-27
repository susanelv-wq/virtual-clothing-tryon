# SSL Certificate - Standalone Mode (Most Reliable)

If the Nginx method keeps failing, use standalone mode. This temporarily stops Nginx and runs its own web server for verification.

## Step 1: Stop Nginx

```bash
sudo systemctl stop nginx
```

## Step 2: Get Certificate in Standalone Mode

```bash
sudo certbot certonly --standalone -d cobabaju.online -d www.cobabaju.online
```

Follow the prompts:
- Enter your email
- Agree to terms (A)
- Share email? (N or Y, your choice)

## Step 3: Start Nginx Again

```bash
sudo systemctl start nginx
```

## Step 4: Configure Nginx for SSL

Now manually configure Nginx to use the certificate:

```bash
sudo nano /etc/nginx/sites-available/cobabaju.online
```

Replace with this configuration:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name cobabaju.online www.cobabaju.online;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name cobabaju.online www.cobabaju.online;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/cobabaju.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cobabaju.online/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;

    # Proxy to Node.js
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

## Step 5: Test and Restart Nginx

```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Step 6: Verify

Visit: **https://cobabaju.online**

## Auto-Renewal Setup

Certbot should have set up auto-renewal. Test it:

```bash
sudo certbot renew --dry-run
```

If it works, certificates will auto-renew. If not, add to crontab:

```bash
sudo crontab -e
```

Add this line:
```
0 0 * * * certbot renew --quiet && systemctl reload nginx
```

## Troubleshooting

### Certificate location
```bash
ls -la /etc/letsencrypt/live/cobabaju.online/
```

Should show:
- `fullchain.pem` (certificate)
- `privkey.pem` (private key)

### Check if certificate is valid
```bash
sudo certbot certificates
```

### Renew manually
```bash
sudo certbot renew
sudo systemctl reload nginx
```
