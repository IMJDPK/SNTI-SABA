# CHATIMJD (SABA) - Production Deployment Guide

> **SABA MBTI Psychology Assessment Platform**  
> Complete WhatsApp-integrated MBTI assessment system with AI-powered psychology chat

## 📋 Table of Contents
- [System Overview](#system-overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Deployment Steps](#deployment-steps)
- [Production Configuration](#production-configuration)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Security Checklist](#security-checklist)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ System Overview

### Services Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    CHATIMJD Platform                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Frontend   │◄───┤   Backend    │◄───┤   Python     │  │
│  │  React/Vite  │    │  Node.js     │    │   Flask      │  │
│  │  Port: 5173  │    │  Port: 3001  │    │  Port: 8001  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                    │          │
│         │                    ├─WhatsApp Web.js    │          │
│         │                    ├─Socket.IO          │          │
│         │                    ├─Gemini AI          │          │
│         │                    └─QR Code Gen        │          │
│         │                                         │          │
│    Tailwind CSS          Express + CORS       MBTI Engine   │
│    React Router          WhatsApp Auto        Google APIs   │
│    Socket Client         PDF Processing       Redis Cache   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend
- **Framework:** React 19.1.0 + Vite 5.4.0
- **Routing:** React Router DOM 6.27.0
- **Styling:** Tailwind CSS 3.4.17
- **Real-time:** Socket.IO Client 4.8.1
- **Build:** PostCSS + Autoprefixer

#### Backend
- **Runtime:** Node.js 18.19.1+
- **Framework:** Express 5.1.0
- **WhatsApp:** whatsapp-web.js 1.31.0
- **AI:** Google Gemini AI 0.24.1
- **Real-time:** Socket.IO 4.8.1
- **Browser Automation:** Puppeteer 24.15.0
- **File Processing:** Multer 2.0.0, PDF-Parse 1.1.1
- **QR Generation:** QRCode 1.5.4

#### Python Service
- **Framework:** Flask 3.0.3
- **Session:** Flask-Session 0.8.0 + Redis 5.0.8
- **Database:** Flask-SQLAlchemy 3.1.1
- **API:** Google API Client
- **ML/AI:** PyTorch 2.0+, Transformers 4.30+
- **Production Server:** Gunicorn 22.0.0

---

## 🔧 Prerequisites

### System Requirements
- **OS:** Linux (Ubuntu 20.04+ recommended) / macOS / Windows WSL2
- **RAM:** Minimum 4GB, Recommended 8GB+
- **Storage:** 10GB+ free space
- **Network:** Stable internet connection for WhatsApp Web

### Software Dependencies
```bash
# Node.js (v18.19.1 or higher)
node --version  # Should be >= 18.19.1

# Python (v3.9 or higher)
python3 --version  # Should be >= 3.9

# npm (comes with Node.js)
npm --version

# Redis Server (for session management)
redis-server --version

# Git
git --version
```

### External Services Required
- ✅ **Google Gemini API Key** - AI processing
- ✅ **Google Calendar API** - Meeting scheduling (credentials.json)
- ✅ **WhatsApp Account** - Parent number for automation
- ✅ **Redis Server** - Session storage
- ⚠️ **Domain & SSL** - Production deployment (optional for development)

---

## 🌍 Environment Setup

### 1. Clone Repository
```bash
cd /home/your-username/Documents/
git clone <repository-url> CHATIMJD
cd CHATIMJD
```

### 2. Environment Variables

#### Create `.env` file in root directory:
```bash
# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash

# Redis Configuration
SESSION_TYPE=redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# Session Security
SESSION_COOKIE_SAMESITE=None
SESSION_COOKIE_SECURE=True
SESSION_LIFETIME=86400

# API Limits
MAX_INPUT_LENGTH=5000
MAX_HISTORY_TURNS=10

# Security
JWT_SECRET_KEY=generate_random_key_here
```

⚠️ **IMPORTANT:** Replace placeholder values before deployment!

#### Generate Secure JWT Secret:
```bash
# Generate a secure random key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Google Calendar API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Download credentials and save as `client_secret_*.json` in root directory
6. First run will generate `credentials.json` and `token.pickle`

---

## 🚀 Deployment Steps

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install

# Verify installation
npm list --depth=0
```

**Expected packages:**
- @google/generative-ai
- express
- socket.io
- whatsapp-web.js
- puppeteer
- qrcode
- cors
- multer
- pdf-parse

### Step 2: Install Frontend Dependencies
```bash
cd ../frontend
npm install

# Verify installation
npm list --depth=0
```

**Expected packages:**
- react
- react-dom
- react-router-dom
- socket.io-client
- vite
- tailwindcss

### Step 3: Install Python Dependencies
```bash
cd ..

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # Linux/Mac
# OR
.venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Verify installation
pip list
```

**Expected packages:**
- flask
- flask-cors
- flask-session
- gunicorn
- google-api-python-client
- torch
- transformers
- redis

### Step 4: Install & Start Redis
```bash
# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis
sudo systemctl enable redis

# Verify Redis is running
redis-cli ping  # Should return "PONG"
```

### Step 5: Build Frontend for Production
```bash
cd frontend

# Build optimized production bundle
npm run build

# Test production build locally
npm run preview
```

---

## 🏭 Production Configuration

### Backend (Node.js)

#### Option 1: PM2 Process Manager (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start backend with PM2
cd backend
pm2 start index.js --name "chatimjd-backend"

# Configure PM2 to restart on system reboot
pm2 startup
pm2 save

# Monitor processes
pm2 status
pm2 logs chatimjd-backend
```

#### Option 2: Systemd Service
Create `/etc/systemd/system/chatimjd-backend.service`:
```ini
[Unit]
Description=CHATIMJD Backend Service
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/home/your-username/Documents/CHATIMJD/backend
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable chatimjd-backend
sudo systemctl start chatimjd-backend
sudo systemctl status chatimjd-backend
```

### Frontend (React)

#### Option 1: Nginx (Production)
```bash
# Install Nginx
sudo apt-get install nginx

# Copy build to web root
sudo cp -r frontend/dist/* /var/www/chatimjd/

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/chatimjd
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/chatimjd;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /socket.io/ {
        proxy_pass http://localhost:3001/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/chatimjd /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Option 2: Serve with Express (Backend Integration)
Add to `backend/index.js`:
```javascript
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Handle React routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
```

### Python Service (Flask)

#### Using Gunicorn (Production WSGI Server)
```bash
# Create Gunicorn configuration
nano gunicorn_config.py
```

**gunicorn_config.py:**
```python
bind = "0.0.0.0:8001"
workers = 4
worker_class = "sync"
timeout = 120
keepalive = 5
accesslog = "flask_access.log"
errorlog = "flask_error.log"
loglevel = "info"
```

**Start with Gunicorn:**
```bash
cd /home/your-username/Documents/CHATIMJD
source .venv/bin/activate
gunicorn -c gunicorn_config.py mbti_app:app
```

#### Systemd Service for Python
Create `/etc/systemd/system/chatimjd-python.service`:
```ini
[Unit]
Description=CHATIMJD Python MBTI Service
After=network.target redis.service

[Service]
Type=simple
User=your-username
WorkingDirectory=/home/your-username/Documents/CHATIMJD
ExecStart=/home/your-username/Documents/CHATIMJD/.venv/bin/gunicorn -c gunicorn_config.py mbti_app:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

---

## 🔒 Security Checklist

### Pre-Deployment Security

- [ ] **Environment Variables**
  - [ ] `.env` file NOT committed to Git
  - [ ] All API keys rotated for production
  - [ ] JWT secret is strong (32+ characters)
  - [ ] Database credentials secured

- [ ] **API Keys Protection**
  - [ ] Gemini API key restricted to production domain
  - [ ] Google Calendar API restricted to authorized origins
  - [ ] Rate limiting enabled on all endpoints

- [ ] **CORS Configuration**
  ```javascript
  // backend/index.js
  const corsOptions = {
      origin: 'https://your-production-domain.com',
      credentials: true,
      optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));
  ```

- [ ] **Session Security**
  - [ ] Redis password enabled
  - [ ] SESSION_COOKIE_SECURE=True in production
  - [ ] SESSION_COOKIE_HTTPONLY=True
  - [ ] SESSION_COOKIE_SAMESITE=Lax or Strict

- [ ] **SSL/TLS Certificate**
  - [ ] HTTPS enabled (Let's Encrypt recommended)
  - [ ] All HTTP traffic redirects to HTTPS
  - [ ] SSL certificate auto-renewal configured

- [ ] **File Upload Security**
  - [ ] File size limits enforced (backend/index.js)
  - [ ] File type validation
  - [ ] Malware scanning for uploads

- [ ] **Input Validation**
  - [ ] SQL injection protection (parameterized queries)
  - [ ] XSS protection (sanitize inputs)
  - [ ] CSRF tokens implemented

### Firewall Rules
```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw deny 3001/tcp  # Backend (internal only)
sudo ufw deny 8001/tcp  # Python (internal only)
sudo ufw deny 6379/tcp  # Redis (internal only)
sudo ufw enable
```

---

## 📊 Monitoring & Maintenance

### Log Management

#### Backend Logs
```bash
# PM2 logs
pm2 logs chatimjd-backend

# Systemd logs
sudo journalctl -u chatimjd-backend -f

# Custom logging
# Add to backend/index.js:
import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});
```

#### Python Logs
```bash
# Gunicorn logs
tail -f flask_access.log
tail -f flask_error.log

# Flask application logs
tail -f flask.log
```

### Health Check Endpoints

Add to `backend/index.js`:
```javascript
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        whatsapp: isClientReady ? 'connected' : 'disconnected'
    });
});
```

Add to `mbti_app.py`:
```python
@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'redis': check_redis_connection()
    })
```

### Monitoring Script
Create `monitor.sh`:
```bash
#!/bin/bash

echo "=== CHATIMJD System Status ==="
echo ""

echo "Backend Status:"
curl -s http://localhost:3001/health | jq

echo ""
echo "Python Service Status:"
curl -s http://localhost:8001/health | jq

echo ""
echo "Redis Status:"
redis-cli ping

echo ""
echo "Process Status:"
pm2 status

echo ""
echo "System Resources:"
free -h
df -h /
```

### Backup Strategy

#### Database Backup
```bash
# Create backup script: backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/your-username/backups"

# Backup client data
tar -czf $BACKUP_DIR/client_data_$DATE.tar.gz client_data/

# Backup assessment data
tar -czf $BACKUP_DIR/assessment_data_$DATE.tar.gz assessment_data/

# Backup Redis data
redis-cli --rdb $BACKUP_DIR/redis_dump_$DATE.rdb

# Keep only last 7 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.rdb" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make executable
chmod +x backup.sh

# Schedule daily backups with cron
crontab -e
# Add: 0 2 * * * /home/your-username/Documents/CHATIMJD/backup.sh
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Backend Won't Start
**Symptom:** `Error: listen EADDRINUSE: address already in use :::3001`

**Solution:**
```bash
# Find process using port 3001
sudo lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use:
pkill -f "node index.js"
```

#### 2. WhatsApp QR Code Not Displaying
**Symptom:** QR code component shows loading but no QR appears

**Checklist:**
- [ ] Backend running on port 3001
- [ ] Socket.IO connection established (check browser console)
- [ ] Puppeteer installed correctly: `npm list puppeteer`
- [ ] No Chrome/Chromium conflicts

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
node index.js
```

#### 3. Python Service Crashes
**Symptom:** `ModuleNotFoundError` or `ImportError`

**Solution:**
```bash
# Reinstall Python dependencies
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

#### 4. Redis Connection Failed
**Symptom:** `Error: Redis connection refused`

**Solution:**
```bash
# Start Redis
sudo systemctl start redis

# Check Redis status
sudo systemctl status redis

# Test connection
redis-cli ping
```

#### 5. Frontend Build Fails
**Symptom:** `Error: Cannot find module 'tailwindcss'`

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 6. CORS Errors in Browser
**Symptom:** `Access-Control-Allow-Origin` error

**Solution:**
```javascript
// backend/index.js - Update CORS settings
const corsOptions = {
    origin: ['http://localhost:5173', 'https://your-domain.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
```

### Debug Mode

#### Enable Debug Logging
```bash
# Backend
NODE_ENV=development node index.js

# Frontend
npm run dev  # Already in debug mode

# Python
FLASK_DEBUG=1 python3 mbti_app.py
```

---

## 📦 Quick Start Commands

### Development Mode
```bash
# Terminal 1: Backend
cd backend && node index.js

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Python
source .venv/bin/activate && python3 mbti_app.py
```

### Production Mode
```bash
# Start all services
pm2 start chatimjd-backend
sudo systemctl start chatimjd-python
sudo systemctl start nginx

# Check status
pm2 status
sudo systemctl status chatimjd-python
sudo systemctl status nginx
```

### Desktop Applications (Linux)
Double-click any of these files:
- `CHATIMJD-Backend.desktop` - Start backend only
- `CHATIMJD-Frontend.desktop` - Start frontend only
- `CHATIMJD-Python.desktop` - Start Python service only
- `CHATIMJD-ControlPanel.desktop` - Start all services at once

---

## 🎯 Deployment Checklist

### Pre-Deployment
- [ ] All dependencies installed
- [ ] `.env` file configured
- [ ] Google Calendar credentials added
- [ ] Redis server running
- [ ] Frontend built successfully
- [ ] All services start without errors
- [ ] Health check endpoints respond

### Security
- [ ] API keys secured
- [ ] CORS configured correctly
- [ ] SSL certificate installed
- [ ] Firewall rules applied
- [ ] Session security configured
- [ ] Input validation enabled

### Production
- [ ] PM2 or systemd configured
- [ ] Nginx reverse proxy set up
- [ ] Domain DNS configured
- [ ] Monitoring enabled
- [ ] Backup script scheduled
- [ ] Log rotation configured

### Testing
- [ ] WhatsApp QR code generates
- [ ] MBTI assessment works
- [ ] Admin dashboard accessible
- [ ] All API endpoints functional
- [ ] Socket.IO connections stable
- [ ] File uploads work correctly

---

## 📞 Support & Resources

### Documentation Files
- `README.md` - Project overview
- `MBTI_README.md` - MBTI assessment documentation
- `PROJECT_STRUCTURE_DOCUMENTATION.md` - Detailed architecture
- `ssl-setup-guide.md` - SSL certificate setup

### Service Ports
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001
- **Python:** http://localhost:8001
- **Redis:** localhost:6379

### API Endpoints
- `GET /health` - Health check
- `GET /qr` - WhatsApp QR code
- `POST /api/mbti` - MBTI assessment
- `POST /api/upload` - File upload
- `WebSocket /socket.io` - Real-time communication

---

## 🎉 Deployment Complete!

Your CHATIMJD platform is now ready for production. Access your application at:
- **Production URL:** https://your-domain.com
- **Admin Dashboard:** https://your-domain.com/admin
- **WhatsApp Integration:** https://your-domain.com/whatsapp

For ongoing support and updates, refer to the documentation files in the project root.

**Last Updated:** August 6, 2025  
**Version:** 1.0.0  
**Deployed By:** CHATIMJD Team
