# 🚀 CHATIMJD Quick Reference Card

## Start Services (Choose One Method)

### Method 1: Desktop Applications (Easiest)
```
Double-click: CHATIMJD-ControlPanel.desktop
```
Or start individually:
- `CHATIMJD-Backend.desktop` 
- `CHATIMJD-Frontend.desktop`
- `CHATIMJD-Python.desktop`

### Method 2: Manual Commands
```bash
# Backend
cd backend && node index.js

# Frontend  
cd frontend && npm run dev

# Python
source .venv/bin/activate && python3 mbti_app.py
```

### Method 3: Production (PM2)
```bash
pm2 start chatimjd-backend
sudo systemctl start chatimjd-python
sudo systemctl start nginx
```

## Stop Services

```bash
# Stop individual processes
pkill -f "node index.js"
pkill -f "mbti_app.py"

# Or PM2
pm2 stop all
```

## Access URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Python Service:** http://localhost:8001
- **WhatsApp QR:** http://localhost:5173/whatsapp
- **Admin Dashboard:** http://localhost:5173/admin

## Quick Checks

```bash
# Check if services are running
curl http://localhost:3001/health
curl http://localhost:8001/health

# Check Redis
redis-cli ping

# View logs
pm2 logs
tail -f flask.log
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | `pkill -f "node index.js"` |
| QR code not showing | Check backend logs, restart backend |
| Redis error | `sudo systemctl start redis` |
| Dependencies missing | `npm install` or `pip install -r requirements.txt` |

## Environment Files

- **Main Config:** `.env`
- **Google OAuth:** `client_secret_*.json`
- **Credentials:** `credentials.json`

## Deployment Status: ✅ READY

**Last Checked:** August 6, 2025
**Node.js:** v18.19.1 ✓
**Python:** 3.12.3 ✓  
**Redis:** Running ✓
**Dependencies:** Installed ✓
