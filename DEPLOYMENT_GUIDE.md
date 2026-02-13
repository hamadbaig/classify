# Complete Deployment Guide: Next.js App on Hostinger VPS

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Firebase Setup](#firebase-setup)
3. [VPS Setup](#vps-setup)
4. [Project Upload](#project-upload)
5. [Environment Configuration](#environment-configuration)
6. [Build & Run](#build--run)
7. [Process Manager (PM2)](#process-manager-pm2)
8. [Nginx Proxy Configuration](#nginx-proxy-configuration)
9. [SSL Certificate](#ssl-certificate)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Hostinger VPS with Plesk
- Domain name (e.g., pbaypost.com)
- SSH access to VPS
- Git repository (GitHub/GitLab)
- Google account for Firebase

---

## Firebase Setup

Firebase is used for:
- File storage (product images, profile pictures)
- Authentication
- Push notifications

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Sign in with Google account
3. Click "Add project" or "Create a project"
4. Enter project name (e.g., "eClassify")
5. Click "Continue" → Enable/disable Google Analytics → "Create project"

### Step 2: Register Web App

1. In project dashboard, click the **Web icon** `</>`
2. Enter app nickname: "eClassify Web"
3. Click "Register app"
4. Copy the firebaseConfig values:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abc123",
     measurementId: "G-XXXXXXXXX"
   };
   ```

### Step 3: Enable Storage

1. Left sidebar → "Build" → "Storage"
2. Click "Get started"
3. **Important:** Requires Blaze (pay-as-you-go) plan
   - Free tier: 5GB storage, 1GB/day download
   - Won't be charged within free limits
4. Choose security rules (Start in test mode for development)
5. Select location (closest to your users)
6. Click "Done"

### Step 4: Get VAPID Key

1. Click gear icon ⚙️ → "Project settings"
2. Click "Cloud Messaging" tab
3. Scroll to "Web Push certificates"
4. Click "Generate key pair"
5. Copy the generated key (starts with "B...")

### Step 5: Enable Authentication (Optional)

1. Left sidebar → "Build" → "Authentication"
2. Click "Get started"
3. Enable sign-in methods (Email/Password, Phone, Google, etc.)

---

## VPS Setup

### Step 1: Connect to VPS via SSH

**From PowerShell (Windows):**
```powershell
ssh root@YOUR_VPS_IP
```

Example:
```powershell
ssh root@31.97.137.167
```

Type `yes` when asked about authenticity, then enter your password.

### Step 2: Check System & Install Dependencies

**Check if CentOS/RHEL (Hostinger typically uses this):**
```bash
cat /etc/os-release
```

**Update system:**
```bash
yum update -y
```

### Step 3: Install Node.js

**Install Node.js 20.x:**
```bash
# Add NodeSource repository
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -

# Install Node.js
yum install -y nodejs

# Verify installation
node -v
npm -v
```

### Step 4: Install Git

```bash
yum install -y git
```

---

## Project Upload

You have 3 options to upload your project:

### Option 1: Git Clone (Recommended)

**On VPS:**
```bash
# Navigate to web directory
cd /var/www/eclassify

# Clone your repository
git clone YOUR_REPOSITORY_URL .
```

**To update later:**
```bash
cd /var/www/eclassify
git pull origin main
```

### Option 2: SCP Upload

**From Windows PowerShell:**
```powershell
cd D:\back2basics\eClassify-Web-v2.7.0
scp -r * root@YOUR_VPS_IP:/var/www/eclassify/
```

### Option 3: FileZilla/WinSCP

1. Download WinSCP or FileZilla
2. Connect: Host: `YOUR_VPS_IP`, Username: `root`, Password: `your_password`
3. Upload all files to `/var/www/eclassify/`

---

## Environment Configuration

### Step 1: Update .env File

**On your local machine, edit `.env`:**

```env
# Web Version (Do not Change)
NEXT_PUBLIC_WEB_VERSION="2.7.0"

# Admin panel url (Your backend API)
NEXT_PUBLIC_API_URL="https://admin.yourdomain.com"

# Website URL 
NEXT_PUBLIC_WEB_URL="https://yourdomain.com"

# API ENDPOINT (Do not change)
NEXT_PUBLIC_END_POINT="/api/"

# Server Port
PORT=3000

# Firebase config (from Step 2 of Firebase Setup)
NEXT_PUBLIC_API_KEY="AIzaSy..."
NEXT_PUBLIC_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_PROJECT_ID="your-project-id"
NEXT_PUBLIC_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_MESSAGING_SENDER_ID="123456789012"
NEXT_PUBLIC_APP_ID="1:123456789012:web:abc123"
NEXT_PUBLIC_MEASUREMENT_ID="G-XXXXXXXXX"

# Vapid api key (from Step 4 of Firebase Setup)
NEXT_PUBLIC_VAPID_KEY="BIGeEb_PLvTR02z59kuUf5XtyTrebjqhNs5nadytnPa53wuAoDA8uf..."

# Default Country
NEXT_PUBLIC_DEFAULT_COUNTRY=pk

# SEO Meta Tags
NEXT_PUBLIC_META_TITLE="Your App Title"
NEXT_PUBLIC_META_DESCRIPTION="Your app description"
NEXT_PUBLIC_META_kEYWORDS="your, keywords, here"
```

### Step 2: Update server.js

**Ensure server.js uses PORT variable:**

```javascript
const port = process.env.PORT || process.env.NODE_PORT || 3000;
```

### Step 3: Commit and Push Changes

```bash
git add .env server.js
git commit -m "Update environment configuration for production"
git push origin main
```

### Step 4: Pull Changes on VPS

```bash
cd /var/www/eclassify
git pull origin main

# Verify files updated
cat .env | grep PORT
cat server.js | grep "const port"
```

---

## Build & Run

### Step 1: Install Dependencies

```bash
cd /var/www/eclassify
npm install
```

This will take several minutes.

### Step 2: Build for Production

```bash
npm run build
```

Wait for build to complete. You should see a `.next` folder created.

### Step 3: Test Locally

```bash
PORT=3000 npm start
```

Open another SSH session and test:
```bash
curl http://localhost:3000
```

You should see HTML output. Press `Ctrl+C` to stop.

---

## Process Manager (PM2)

PM2 keeps your app running 24/7 and restarts it automatically if it crashes.

### Step 1: Install PM2

```bash
npm install -g pm2
```

### Step 2: Start Application

```bash
cd /var/www/eclassify
PORT=3000 pm2 start npm --name "eclassify" -- start
```

### Step 3: Save PM2 Configuration

```bash
pm2 save
```

### Step 4: Enable Auto-Start on Boot

```bash
pm2 startup
```

Copy and run the command it outputs.

### Step 5: Useful PM2 Commands

```bash
# List all processes
pm2 list

# View logs
pm2 logs eclassify

# View last 50 lines
pm2 logs eclassify --lines 50

# Restart app
pm2 restart eclassify

# Stop app
pm2 stop eclassify

# Delete app
pm2 delete eclassify

# Show detailed info
pm2 show eclassify

# Monitor CPU/Memory
pm2 monit
```

### Step 6: Verify App is Running

```bash
# Check PM2 status
pm2 list

# Check port
netstat -tlnp | grep node

# Should show: tcp6  0  0 :::3000  :::*  LISTEN

# Test response
curl http://localhost:3000
```

---

## Nginx Proxy Configuration

### Method 1: Using Plesk UI (Recommended)

#### Step 1: Access Plesk

```bash
plesk login
```

Copy the URL and open in browser.

#### Step 2: Navigate to Domain Settings

1. Click on "Websites & Domains"
2. Click on your domain (e.g., pbaypost.com)
3. Find "Apache & nginx Settings" (or similar)

#### Step 3: Configure Nginx Proxy

**In "Additional nginx directives" (for HTTPS):**

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

**Important Notes:**
- ✅ Make sure to add this in the **HTTPS section** (not HTTP)
- ✅ Some Plesk versions have "Proxy mode" checkbox - if you see it, check it and leave directives empty
- ✅ Leave "Additional directives for HTTP" and "Additional directives for HTTPS" (Apache) empty
- ✅ Click "OK" or "Apply"

#### Step 4: Restart Nginx

**From SSH:**
```bash
systemctl restart nginx
```

Or use Plesk UI to restart web server.

### Method 2: Manual Nginx Configuration

**If Plesk doesn't work, edit nginx config directly:**

```bash
# Find nginx config for your domain
cd /var/www/vhosts/system/yourdomain.com/conf/

# Edit nginx config
nano vhost_nginx.conf
```

Add the proxy configuration and restart nginx.

---

## SSL Certificate

### Using Plesk (Let's Encrypt)

1. In Plesk, go to your domain
2. Click "SSL/TLS Certificates"
3. Find "Let's Encrypt" section
4. Click "Install" or "Get it free"
5. Select:
   - ✅ Include www subdomain
   - ✅ Secure webmail
6. Enter email address
7. Click "Get it free"

Certificate auto-renews every 90 days.

### Verify HTTPS

Visit: `https://yourdomain.com`

---

## Troubleshooting

### Issue 1: Port 3000 Not Responding

**Check if app is running:**
```bash
pm2 list
netstat -tlnp | grep node
```

**If not on port 3000:**
```bash
pm2 delete eclassify
PORT=3000 pm2 start npm --name "eclassify" -- start
pm2 save
```

### Issue 2: White/Blank Page

**Check logs:**
```bash
pm2 logs eclassify --lines 50
```

**Common solutions:**
```bash
# Rebuild app
cd /var/www/eclassify
rm -rf .next
npm run build
pm2 restart eclassify

# Check if .env file exists
cat .env

# Check if node_modules installed
ls -la node_modules
```

### Issue 3: Server Action Errors

**Clear and rebuild:**
```bash
cd /var/www/eclassify
rm -rf .next node_modules
npm install
npm run build
pm2 restart eclassify
```

### Issue 4: Nginx Configuration Errors

**Duplicate location "/":**
- This means nginx already has a location / block
- If using Plesk proxy mode, leave additional directives empty
- OR remove the `location /` wrapper and just add the proxy directives

**Test nginx config:**
```bash
nginx -t
```

**View nginx error log:**
```bash
tail -f /var/log/nginx/error.log
```

### Issue 5: Permission Denied

```bash
# Fix ownership
chown -R root:root /var/www/eclassify

# Fix permissions
chmod -R 755 /var/www/eclassify
```

### Issue 6: Can't Connect to API

**Check firewall:**
```bash
# Allow port 3000 (if needed for testing)
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --reload

# Check if firewall is running
systemctl status firewalld
```

### Issue 7: Git Pull Fails

```bash
# Stash local changes
git stash

# Pull
git pull origin main

# Apply stashed changes (if needed)
git stash pop
```

### Issue 8: Out of Memory

**Increase Node memory limit:**
```bash
pm2 delete eclassify
NODE_OPTIONS="--max-old-space-size=2048" PORT=3000 pm2 start npm --name "eclassify" -- start
pm2 save
```

---

## Post-Deployment Checklist

- [ ] App responds on `http://localhost:3000` (via curl)
- [ ] PM2 shows app as "online"
- [ ] Port 3000 is listening (netstat)
- [ ] Domain resolves to VPS IP
- [ ] Website loads at `https://yourdomain.com`
- [ ] SSL certificate is active (green padlock)
- [ ] Firebase Storage configured
- [ ] Firebase Authentication enabled
- [ ] Environment variables correct
- [ ] PM2 startup script enabled
- [ ] Nginx proxy configuration active

---

## Useful Commands Summary

```bash
# Application Management
pm2 list                          # List all PM2 processes
pm2 logs eclassify               # View logs
pm2 restart eclassify            # Restart app
pm2 stop eclassify               # Stop app
pm2 delete eclassify             # Remove from PM2

# System Status
netstat -tlnp | grep node        # Check ports
systemctl status nginx           # Nginx status
systemctl restart nginx          # Restart Nginx

# Testing
curl http://localhost:3000       # Test local access
curl https://yourdomain.com      # Test public access

# Updates
cd /var/www/eclassify
git pull origin main             # Pull latest code
npm install                      # Install dependencies
npm run build                    # Build production
pm2 restart eclassify           # Restart app

# Logs
pm2 logs eclassify --lines 100  # App logs
tail -f /var/log/nginx/error.log # Nginx errors
journalctl -u nginx -f           # Nginx service logs
```

---

## Maintenance & Updates

### Updating Your App

1. **Make changes locally**
2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Your update description"
   git push origin main
   ```
3. **On VPS:**
   ```bash
   cd /var/www/eclassify
   git pull origin main
   npm install  # Only if package.json changed
   npm run build
   pm2 restart eclassify
   ```

### Monitoring

**Check app status daily:**
```bash
pm2 list
pm2 logs eclassify --lines 20
```

**Monitor server resources:**
```bash
pm2 monit
htop  # If installed
```

---

## Security Best Practices

1. **Never commit .env to public repositories**
   - Add `.env` to `.gitignore`
   - Use different values for production

2. **Use strong passwords**
   - SSH password
   - Plesk password
   - Database passwords

3. **Keep system updated**
   ```bash
   yum update -y
   npm update -g npm
   npm update  # In project directory
   ```

4. **Configure Firebase Security Rules**
   - Storage rules
   - Firestore rules (if using)
   - Authentication rules

5. **Enable fail2ban** (prevents brute force attacks)
   ```bash
   yum install fail2ban -y
   systemctl start fail2ban
   systemctl enable fail2ban
   ```

6. **Regular backups**
   - Database backups
   - Code backups (via Git)
   - Use Plesk backup features

---

## Support & Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Firebase Docs:** https://firebase.google.com/docs
- **PM2 Docs:** https://pm2.keymetrics.io/docs
- **Nginx Docs:** https://nginx.org/en/docs
- **Plesk Docs:** https://docs.plesk.com

---

## Need Help?

If you encounter issues:

1. **Check logs first:**
   ```bash
   pm2 logs eclassify --lines 100
   tail -f /var/log/nginx/error.log
   ```

2. **Test step by step:**
   - Can curl localhost:3000?
   - Is PM2 running?
   - Is nginx configured correctly?
   - Does domain DNS point to VPS?

3. **Common fixes:**
   - Rebuild app: `npm run build && pm2 restart eclassify`
   - Restart services: `systemctl restart nginx`
   - Check firewall: `firewall-cmd --list-all`

---

**Congratulations!** Your Next.js app should now be live on your Hostinger VPS! 🎉

Visit: `https://yourdomain.com`
