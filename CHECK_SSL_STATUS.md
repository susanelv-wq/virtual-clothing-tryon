# Check SSL Certificate Status

## Check if Certificate Was Obtained

```bash
# Check certificate status
sudo certbot certificates
```

This will show all certificates and their status.

## Check Certificate Files

```bash
# List certificate files
ls -la /etc/letsencrypt/live/cobabaju.online/
```

You should see:
- `fullchain.pem` (certificate)
- `privkey.pem` (private key)
- `cert.pem`
- `chain.pem`

## If Certificate Exists

If the certificate was successfully obtained, configure Nginx:

```bash
sudo nano /etc/nginx/sites-available/cobabaju.online
```

Use the HTTPS configuration (see below).

## If Certificate Was NOT Obtained

Check the error:

```bash
# View certbot logs
sudo tail -50 /var/log/letsencrypt/letsencrypt.log
```

Common issues:
- Rate limit still active (wait longer)
- DNS not propagated (check with `dig cobabaju.online +short`)
- Port 80 blocked (check firewall)

## Force New Account (if needed)

If you want to use a different email or create a new account:

```bash
sudo certbot certonly --standalone --register-unsafely-without-email -d cobabaju.online -d www.cobabaju.online
```

Or with email:

```bash
sudo certbot certonly --standalone --email your-email@example.com -d cobabaju.online -d www.cobabaju.online
```
