# CHATIMJD (SABA) - AI Copilot Instructions

## Project Overview
CHATIMJD is a web-based MBTI psychology assessment platform with dual AI engines: business lead generation (Saba) and psychological testing (SNTI). The system runs a hybrid Node.js + Flask backend architecture.

## Architecture Overview
- **Frontend**: React 19 + Vite + Tailwind (port 5173)
- **Backend**: Node.js Express + Socket.IO (port 3001) 
- **Python Services**: Flask + Redis (port 8001)
- **AI Models**: Gemini 2.0 Flash for conversations, custom MBTI engine
- **Data Storage**: Redis for sessions, JSON files for user data

## Key Service Boundaries
The system has **three distinct AI personalities**:
1. **Saba** (`system_instruction.txt`): Business assistant for lead generation
2. **SNTI Psychology** (`backend/gemini_simple.js`): MBTI assessment conductor  
3. **General Chat** (`app.py`): Fallback conversational AI

Web conversations route through appropriate AI handlers based on conversation context and user interface selection.

## Critical Development Patterns

### API Message Flow
```javascript
// backend/index.js - Main routing logic
app.post('/api/psychology-chat', async (req, res) => {
    // Route to SNTI MBTI assessment handler
    const result = await handleSNTITestConversation(message, ipAddress);
    res.json(result);
});
```

### Session Management 
Redis sessions are **critical** - always check session state before processing:
```python
# app.py pattern
session_key = f"chat_session:{client_id}"
conversation_history = session_data.get("conversation_history", [])
```

### AI Model Configuration
- Use `GEMINI_MODEL` env var (defaults to `gemini-2.0-flash`)
- System instructions are **dynamically loaded** from files
- Rate limiting: 2000/day, 500/hour via Flask-Limiter

## Development Workflow Commands

### Local Development
```bash
# Start all services (use deployment_check.sh first)
npm run dev          # Frontend (from frontend/)
npm start           # Backend (from backend/)  
python app.py       # Flask services (from root)
redis-server        # Required for sessions
```

### Production Deployment
```bash
docker-compose up   # Full stack deployment
# OR individual services:
./deployment_check.sh  # Verify environment first
```

### Key Scripts
- `deployment_check.sh`: Environment validation
- `snti_demo.sh`: MBTI test simulation  
- Various `*_cleanup.py`: Data management utilities

## Project-Specific Conventions

### File Organization
- **Frontend pages**: `frontend/src/pages/` - Route-based components
- **AI handlers**: `backend/ai_handler.js`, `backend/gemini_simple.js`
- **Flask routes**: Direct in `app.py` (2300+ lines - monolithic by design)
- **API endpoints**: `backend/index.js` with Express REST APIs

### Configuration Management
Environment variables are **distributed**:
- Root `.env`: Python/Flask configuration  
- `backend/.env`: Node.js configuration
- Different ports/services require separate configs

### Data Flow Pattern
1. Web UI → Node.js (`backend/index.js`)
2. Node.js → Appropriate AI handler based on message type
3. AI response → Web UI via HTTP/Socket.IO
4. Session data → Redis (Python) or JSON files (Node.js)

## Integration Points

### Google Calendar OAuth
- OAuth flow: `app.py` `/authorize` → `/oauth2callback`
- Auto-meeting scheduling when emails detected in conversations
- Service account JSON required for production

### Lead Management System  
- Automatic lead extraction from conversations
- Excel export generation (`openpyxl` in Flask)
- RESTful API endpoints in `app.py` for CRUD operations

### MBTI Assessment Engine
- 20-question format with A/B responses
- Custom scoring algorithm in `backend/gemini_simple.js`
- Results stored in conversation history

## Testing & Debugging
- Use `snti_demo.sh` for MBTI flow testing
- Redis session inspection for conversation issues
- Check `deployment_check.sh` before reporting environment issues

When modifying AI behavior, update the appropriate instruction file (`system_instruction.txt` for Saba, inline prompts in `gemini_simple.js` for SNTI). The system is designed for **personality switching** based on conversation context.