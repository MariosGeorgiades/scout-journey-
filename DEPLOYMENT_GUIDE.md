# 🚀 Deployment Guide - Host on Debian Mini PC

Complete guide to host your scouting website on a Debian mini PC with internet access.

## 📋 Overview

You'll get:
- ✅ Professional Nginx web server
- ✅ Free domain name (yourname.duckdns.org)
- ✅ HTTPS security with free SSL certificate
- ✅ Accessible from anywhere in the world
- ✅ Auto-start on boot

---

## Step 1: Install Nginx on Debian

SSH into your mini PC or open terminal, then run:

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install Nginx
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

✅ **Test**: Open browser to `http://localhost` - you should see Nginx welcome page!

---

## Step 2: Transfer Website Files to Mini PC

### Option A: From your Mac using SCP

```bash
# Replace USER and MINI-PC-IP with your details
scp -r "/Users/mariosgeorgiades/Desktop/scout project"/* user@MINI-PC-IP:/tmp/scout-site/
```

### Option B: Using USB Drive
1. Copy the "scout project" folder to USB
2. Plug into mini PC
3. Copy files: `cp -r /media/usb/scout\ project/* /tmp/scout-site/`

### Then on the Mini PC:

```bash
# Remove default Nginx page
sudo rm -rf /var/www/html/*

# Copy your website
sudo cp -r /tmp/scout-site/* /var/www/html/

# Set permissions
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
```

✅ **Test**: Visit `http://YOUR-MINI-PC-LOCAL-IP` from another device on your network

---

## Step 3: Get a Free Domain Name (DuckDNS)

### A. Sign up for DuckDNS

1. Go to https://www.duckdns.org
2. Sign in with Google, GitHub, or other
3. Create a subdomain: `marios-scouts` (or any name you like)
4. You'll get: `marios-scouts.duckdns.org`
5. **Copy your token** (shown on the page)

### B. Install DuckDNS updater on Mini PC

```bash
# Create directory
mkdir ~/duckdns
cd ~/duckdns

# Create update script
nano duck.sh
```

Paste this (replace TOKEN and DOMAIN):

```bash
#!/bin/bash
echo url="https://www.duckdns.org/update?domains=YOUR-DOMAIN&token=YOUR-TOKEN&ip=" | curl -k -o ~/duckdns/duck.log -K -
```

**Example:**
```bash
echo url="https://www.duckdns.org/update?domains=marios-scouts&token=a1b2c3d4-e5f6-7890&ip=" | curl -k -o ~/duckdns/duck.log -K -
```

Make it executable:

```bash
chmod +x duck.sh

# Test it
./duck.sh

# Check log
cat duck.log
# Should show: OK
```

### C. Auto-update every 5 minutes

```bash
# Edit crontab
crontab -e

# Add this line at the bottom:
*/5 * * * * ~/duckdns/duck.sh >/dev/null 2>&1
```

✅ Your domain will always point to your current IP!

---

## Step 4: Router Port Forwarding

You need to configure your router to forward traffic to your mini PC.

### Find Your Mini PC's Local IP:

```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
# Example output: 192.168.1.150
```

### Router Configuration Steps:

1. Open your router admin panel (usually `http://192.168.1.1` or `http://192.168.0.1`)
2. Login (check router label for password)
3. Find **Port Forwarding** or **Virtual Server** section
4. Add new rule:
   - **Service Name**: Scout Website
   - **External Port**: 80
   - **Internal IP**: Your Mini PC IP (e.g., 192.168.1.150)
   - **Internal Port**: 80
   - **Protocol**: TCP
5. Save and Apply

### For HTTPS (later):
Add another rule for port 443 (same settings, just port 443)

✅ **Test**: From your phone (using mobile data, not WiFi), visit `http://marios-scouts.duckdns.org`

---

## Step 5: Add FREE SSL Certificate (HTTPS) 🔒

### Install Certbot (Let's Encrypt):

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate (replace with YOUR domain)
sudo certbot --nginx -d marios-scouts.duckdns.org

# Follow prompts:
# - Enter email for important notices
# - Agree to Terms of Service (Y)
# - Redirect HTTP to HTTPS? (2 - Yes, recommended)
```

✅ **Auto-renewal** is already set up! Certificate renews automatically.

### Test HTTPS:

Visit: `https://marios-scouts.duckdns.org` 🔒

---

## Step 6: Configure Nginx for Best Performance

### Edit Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/default
```

Replace with this optimized config:

```nginx
server {
    listen 80;
    server_name marios-scouts.duckdns.org;
    
    # Redirect HTTP to HTTPS (after SSL setup)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name marios-scouts.duckdns.org;
    
    # SSL certificate paths (Certbot fills these automatically)
    ssl_certificate /etc/letsencrypt/live/marios-scouts.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/marios-scouts.duckdns.org/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    root /var/www/html;
    index index.html;
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/css text/javascript application/javascript image/svg+xml;
    
    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Test and reload:

```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🎯 Final Checklist

- [ ] Nginx installed and running
- [ ] Website files in `/var/www/html/`
- [ ] DuckDNS domain created and updating
- [ ] Router port forwarding (80 and 443)
- [ ] SSL certificate installed (HTTPS working)
- [ ] Website accessible from internet

---

## 🔧 Useful Commands

```bash
# Restart Nginx
sudo systemctl restart nginx

# Check Nginx status
sudo systemctl status nginx

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# View access logs (who visited)
sudo tail -f /var/log/nginx/access.log

# Update website files
sudo cp -r /path/to/new/files/* /var/www/html/

# Renew SSL certificate manually
sudo certbot renew

# Check DuckDNS status
cat ~/duckdns/duck.log
```

---

## 🆘 Troubleshooting

### Website not loading from internet:

1. **Check router port forwarding** - Make sure ports 80 and 443 are forwarded
2. **Check firewall on mini PC**:
   ```bash
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw status
   ```
3. **Verify DuckDNS is working**:
   ```bash
   ping marios-scouts.duckdns.org
   ```

### SSL certificate errors:

```bash
# Make sure ports are open BEFORE running certbot
sudo certbot --nginx -d marios-scouts.duckdns.org --dry-run
```

### Nginx won't start:

```bash
# Check what's using port 80
sudo lsof -i :80

# Check configuration errors
sudo nginx -t
```

---

## 📊 Monitor Your Website

### See who's visiting:

```bash
# Real-time access log
sudo tail -f /var/log/nginx/access.log

# Count visitors today
sudo grep $(date +%d/%b/%Y) /var/log/nginx/access.log | wc -l
```

---

## 🎉 Success!

Your website is now live at:
- **HTTP**: http://marios-scouts.duckdns.org (redirects to HTTPS)
- **HTTPS**: https://marios-scouts.duckdns.org 🔒

Share this link with friends, family, and scouts! 🎖️

### To Update Content:

1. Edit files on your Mac
2. Transfer to mini PC: `scp -r * user@mini-pc-ip:/tmp/updates/`
3. Copy to web directory: `sudo cp -r /tmp/updates/* /var/www/html/`

**Or** edit directly on mini PC: `sudo nano /var/www/html/index.html`

---

## 💡 Tips

- **Keep Debian updated**: `sudo apt update && sudo apt upgrade -y`
- **Backup your website**: `sudo tar -czf scout-backup.tar.gz /var/www/html/`
- **Monitor logs** occasionally to see traffic
- **Certificate renews automatically** every 90 days

Enjoy your live website! 🚀
