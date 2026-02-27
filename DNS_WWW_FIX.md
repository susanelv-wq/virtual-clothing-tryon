# Fix DNS www Record Error

Error: "DNS resource record tidak valid atau tidak sesuai dengan resource record lain"

This usually means there's a conflicting record. Here's how to fix it:

## Solution 1: Check for Existing www Record

1. **Look at your DNS records list** - Do you see a `www` record already?
2. **If yes, delete it first**, then create a new one
3. **If there's a CNAME record for www**, you need to delete it (can't have both CNAME and A record)

## Solution 2: Use CNAME Instead (Alternative)

If A record doesn't work, you can use CNAME:

- **Type**: CNAME
- **Name**: www
- **Points to**: cobabaju.online (not the IP address)
- **TTL**: 14400

This makes www point to the main domain, which then points to your IP.

## Solution 3: Skip www for Now

You can skip the www record for now and just use the main domain:

- Your site will work on: `http://cobabaju.online`
- You can add www later

For SSL, you can get certificate for just the main domain:
```bash
sudo certbot certonly --standalone -d cobabaju.online
```

## Recommended: Use CNAME

**Best approach - Use CNAME for www:**

1. **Main domain (already done):**
   - Type: A
   - Name: @
   - Points to: 76.13.195.111

2. **www subdomain:**
   - Type: CNAME
   - Name: www
   - Points to: cobabaju.online (the domain name, not IP)
   - TTL: 14400

This is actually the recommended way - www points to the main domain.

## Verify After Setup

Wait 10-15 minutes, then check:

```bash
dig cobabaju.online +short
dig www.cobabaju.online +short
```

Both should resolve (www might show as cobabaju.online if using CNAME, which is fine).
