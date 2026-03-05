# Full VPS Redeploy (Fresh Install)

Use this when the VPS was cleared and you need to deploy from GitHub from scratch.

**VPS IP:** `76.13.195.111`  
**Domain:** `cobabaju.online`  
**App runs on port:** `3001` (see `ecosystem.config.js`)

---

## 1. Connect to VPS

```bash
ssh root@76.13.195.111
```

---

## 2. Install prerequisites (if not already installed)

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2
node -v
npm -v
pm2 -v
```

---

## 3. Clone the repo

```bash
sudo mkdir -p /var/www
cd /var/www
sudo rm -rf virtual-clothing-tryon
sudo git clone https://github.com/susanelv-wq/virtual-clothing-tryon.git
sudo chown -R $USER:$USER virtual-clothing-tryon
cd virtual-clothing-tryon
```

---

## 4. Environment and build

```bash
nano .env.local
```

Paste (replace with your real key if different):

```env
FASHN_API_KEY=fa-v8quJyGOBko0-f7a1AG5ALXt4cqFSEKWF2ci2
NODE_ENV=production
```

Save: `Ctrl+X`, then `Y`, then `Enter`.

```bash
npm install
npm run build
```

---

## 5. Start app with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Run the command that `pm2 startup` prints (usually starts with `sudo env PATH=...`).

Check:

```bash
pm2 status
pm2 logs virtual-tryon --lines 20
```

App should be listening on **port 3001**.

---

## 6. Nginx (reverse proxy)

```bash
sudo nano /etc/nginx/sites-available/cobabaju.online
```

Paste (use **3001** to match the app):

```nginx
server {
    listen 80;
    server_name cobabaju.online www.cobabaju.online;

    location / {
        proxy_pass http://localhost:3001;
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

Save: `Ctrl+X`, `Y`, `Enter`.

```bash
sudo ln -sf /etc/nginx/sites-available/cobabaju.online /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 7. Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

---

## 8. SSL (HTTPS)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d cobabaju.online -d www.cobabaju.online
```

Use your email, agree to terms, choose redirect HTTP → HTTPS when asked.

---

## 9. Verify

- **PM2:** `pm2 status` → `virtual-tryon` online  
- **Nginx:** `sudo systemctl status nginx`  
- **Site:** https://cobabaju.online  

---

## Later: update after you push to GitHub

```bash
ssh root@76.13.195.111
cd /var/www/virtual-clothing-tryon
git pull origin main
npm install
npm run build
pm2 restart virtual-tryon
```

Or run: `./deploy.sh`
