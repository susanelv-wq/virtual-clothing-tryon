# Let's Encrypt Rate Limit Fix

You've hit the rate limit (5 failed attempts per hour per domain). Here are your options:

## Option 1: Wait and Try Again (Easiest)

Wait 1 hour from the last attempt, then try again. The error message shows when you can retry:
```
retry after 2026-02-27 05:28:10 UTC
```

## Option 2: Get Certificate for Main Domain Only (Quick Fix)

Get certificate for just `cobabaju.online` first (without www):

```bash
# Make sure Nginx is stopped
sudo systemctl stop nginx

# Get certificate for main domain only
sudo certbot certonly --standalone -d cobabaju.online

# Start Nginx
sudo systemctl start nginx
```

Then configure Nginx for just the main domain. You can add www later.

## Option 3: Check DNS First (Important!)

Before trying again, verify DNS is correct:

```bash
# Check if domain points to your IP
dig cobabaju.online +short
dig www.cobabaju.online +short

# Both should return: 76.13.195.111
```

If DNS is wrong, fix it in Hostinger first!

## Option 4: Use Different Account (Advanced)

If you have multiple Let's Encrypt accounts, you can use a different one:

```bash
sudo certbot certonly --standalone --email your-other-email@example.com -d cobabaju.online -d www.cobabaju.online
```

## Option 5: Wait and Use Nginx Method (After Rate Limit Resets)

Once the rate limit resets, try the Nginx method with proper configuration:

1. First, verify DNS is correct
2. Run the fix script: `./SSL_FIX_COMPLETE.sh`
3. Then try: `sudo certbot --nginx -d cobabaju.online -d www.cobabaju.online`

## Recommended: Wait + Verify DNS

**Best approach:**

1. **Verify DNS is correct:**
   ```bash
   dig cobabaju.online +short
   dig www.cobabaju.online +short
   ```
   Both should show: `76.13.195.111`

2. **If DNS is wrong:**
   - Go to Hostinger DNS settings
   - Add A record: `@` → `76.13.195.111`
   - Add A record: `www` → `76.13.195.111`
   - Wait 10-15 minutes

3. **Wait for rate limit to reset** (check the time in error message)

4. **Try again with standalone mode:**
   ```bash
   sudo systemctl stop nginx
   sudo certbot certonly --standalone -d cobabaju.online -d www.cobabaju.online
   sudo systemctl start nginx
   ```

## Check Rate Limit Status

You can check when you can retry:
```bash
sudo certbot certificates
```

Or check the log:
```bash
sudo tail -20 /var/log/letsencrypt/letsencrypt.log
```

## Temporary Solution: Use HTTP Only

While waiting, you can run the site on HTTP only:

```bash
sudo nano /etc/nginx/sites-available/cobabaju.online
```

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

Then add SSL later when rate limit resets.
