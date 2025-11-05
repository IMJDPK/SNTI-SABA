#!/bin/bash

echo "🔍 CHATIMJD Deployment Readiness Check"
echo "======================================"
echo ""

# Check Node.js
echo "✓ Node.js Version:"
node --version

# Check npm
echo "✓ npm Version:"
npm --version

# Check Python
echo "✓ Python Version:"
python3 --version

# Check Redis
echo "✓ Redis Status:"
redis-cli ping 2>/dev/null || echo "❌ Redis not running"

# Check Backend dependencies
echo ""
echo "✓ Backend Dependencies:"
cd backend && npm list --depth=0 2>/dev/null | grep -E "express|socket.io|generative-ai" || echo "❌ Backend dependencies missing"
cd ..

# Check Frontend dependencies
echo ""
echo "✓ Frontend Dependencies:"
cd frontend && npm list --depth=0 2>/dev/null | grep -E "react|vite|tailwind" || echo "❌ Frontend dependencies missing"
cd ..

# Check Python dependencies
echo ""
echo "✓ Python Dependencies:"
source .venv/bin/activate && pip list 2>/dev/null | grep -E "flask|redis|google" || echo "❌ Python dependencies missing"

# Check environment variables
echo ""
echo "✓ Environment Configuration:"
if [ -f .env ]; then
    echo "  .env file exists"
    grep -q "GEMINI_API_KEY" .env && echo "  ✓ GEMINI_API_KEY configured" || echo "  ❌ GEMINI_API_KEY missing"
    grep -q "REDIS_HOST" .env && echo "  ✓ Redis configured" || echo "  ❌ Redis config missing"
else
    echo "  ❌ .env file not found"
fi

# Check Google credentials
echo ""
echo "✓ Google API Credentials:"
ls client_secret_*.json &>/dev/null && echo "  ✓ OAuth client secret found" || echo "  ❌ OAuth client secret missing"
ls credentials.json &>/dev/null && echo "  ✓ Credentials.json found" || echo "  ⚠️  Credentials.json missing (will be generated on first run)"

# Check desktop applications
echo ""
echo "✓ Desktop Applications:"
ls *.desktop 2>/dev/null | wc -l | xargs -I {} echo "  {} desktop files found"

echo ""
echo "======================================"
echo "✅ Deployment readiness check complete!"
