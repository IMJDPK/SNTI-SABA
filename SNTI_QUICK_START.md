# 🚀 SNTI TEST - Quick Start Guide

## What is SNTI TEST?

**SNTI TEST BY SULNAQ x IMJD** is an AI-powered personality assessment system that:
- Asks for your name and generates a unique 5-digit ID
- Guides you through 20 questions to determine your MBTI personality type
- Provides comprehensive, personalized guidance based on your results
- Remembers your entire conversation for ongoing psychological support

---

## 🎯 Try It Now!

### Option 1: Web Interface (Recommended)
1. Open your browser to: **http://localhost:5173**
2. Click on **"Psychology Chat"** in the navigation
3. Start chatting! The AI will guide you through everything

### Option 2: Run the Demo Script
```bash
./snti_demo.sh
```
This will walk you through the complete user journey with example responses.

### Option 3: Test via API
```bash
# Start a conversation
curl -X POST http://localhost:3001/api/psychology-chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'

# Response will ask for your name
```

---

## 📝 How It Works

### Step 1: Introduction & Name Collection
- AI greets you and asks for your name
- You provide your name (e.g., "My name is Sarah" or just "Sarah")
- AI generates your unique 5-digit session ID

### Step 2: Test Introduction
- AI explains the SNTI TEST benefits
- You type "START" when ready to begin

### Step 3: 20 Questions
- AI asks 20 carefully designed questions
- You answer with "A" or "B" for each question
- Progress is tracked (e.g., "Question 5/20")

### Step 4: Results & Guidance
- AI calculates your MBTI personality type (one of 16 types)
- Provides comprehensive results including:
  - ✅ Your personality type (e.g., ENFP - The Champion)
  - 💪 Your strengths
  - 🎯 Areas for growth
  - 💼 Recommended careers
  - ❤️ Relationship insights
  - 🌱 Personal development advice

### Step 5: Ongoing Support
- Continue chatting with the AI
- Ask questions about your personality type
- Get personalized psychological guidance
- AI always remembers your name and type

---

## 🆔 Your Session Info

When you chat, you'll see:
- **👤 Your Name**: Displayed in the session bar
- **🆔 Session ID**: A unique 5-digit number (e.g., 82422)
- **📊 Progress**: Your test progress (e.g., "5/20")
- **🏷️ MBTI Type**: Your personality type badge (after completion)

---

## 💡 Example Conversation

```
AI: Hello! 👋 Welcome to the SNTI TEST BY SULNAQ x IMJD!
    Before we begin, I'd love to know your name!

You: Sarah

AI: Hello Sarah! 👋 Your unique session ID is: 45678
    I'm here to guide you through the SNTI TEST...
    Ready to begin, Sarah? Reply with "START"!

You: START

AI: Excellent, Sarah! Let's begin! 🎯
    Question 1 of 20
    When you're at a social gathering, do you:
    A) Feel energized by meeting lots of new people
    B) Prefer deep conversations with a few close friends

You: A

AI: Thanks, Sarah! 📝
    Question 2 of 20
    [Next question...]

[... after 20 questions ...]

AI: 🎉 Congratulations, Sarah! You've completed the SNTI TEST!
    Your Personality Type: ENFP
    "The Champion" - Enthusiastic, Creative, Warm
    [Detailed guidance...]
```

---

## 📊 16 Personality Types

The SNTI TEST can identify any of these 16 types:

### Analysts:
- **INTJ** - The Mastermind
- **INTP** - The Architect
- **ENTJ** - The Commander
- **ENTP** - The Visionary

### Diplomats:
- **INFJ** - The Counselor
- **INFP** - The Healer
- **ENFJ** - The Teacher
- **ENFP** - The Champion

### Sentinels:
- **ISTJ** - The Inspector
- **ISFJ** - The Protector
- **ESTJ** - The Supervisor
- **ESFJ** - The Provider

### Explorers:
- **ISTP** - The Craftsman
- **ISFP** - The Composer
- **ESTP** - The Dynamo
- **ESFP** - The Performer

---

## 🔧 Admin Tools

### View All Active Sessions:
```bash
curl http://localhost:3001/api/sessions | jq
```

### Check Backend Logs:
```bash
tail -f /tmp/backend.log
```

### View Saved Sessions:
```bash
ls -la backend/data/sessions/
cat backend/data/sessions/12345.json
```

---

## ❓ FAQ

**Q: Do I need to create an account?**
A: No! Just provide your name and start chatting.

**Q: How long does the test take?**
A: About 5-10 minutes for 20 questions.

**Q: Can I pause and continue later?**
A: Yes! Your session is saved. Return from the same device/network to continue.

**Q: Is my data saved?**
A: Yes, completed tests are saved to `backend/data/sessions/` with your session ID.

**Q: Can I retake the test?**
A: Yes! Just start a new conversation from a different device or clear your session.

**Q: What if I make a mistake?**
A: The test is designed to be forgiving. Just answer honestly based on your natural preferences.

---

## 📚 Documentation

For detailed technical information:
- **Complete Guide**: `SNTI_TEST_GUIDE.md`
- **Implementation Summary**: `SNTI_IMPLEMENTATION_SUMMARY.md`
- **Demo Script**: `./snti_demo.sh`

---

## ✨ Features at a Glance

✅ AI asks for your name first
✅ Unique 5-digit ID for each session
✅ IP-based session tracking
✅ Full conversation memory
✅ AI calls you by name throughout
✅ 20-question MBTI assessment
✅ All 16 personality types supported
✅ Comprehensive results with guidance
✅ Personalized ongoing support
✅ Beautiful, responsive UI
✅ Real-time progress tracking
✅ Persistent data storage

---

## 🎉 Ready to Discover Your Personality?

### Start Now:
👉 **http://localhost:5173** → Click "Psychology Chat"

### Need Help?
- Read the full guide: `SNTI_TEST_GUIDE.md`
- Run the demo: `./snti_demo.sh`
- Check the backend logs: `tail -f /tmp/backend.log`

---

**SNTI TEST BY SULNAQ x IMJD** - Your Journey to Self-Discovery Starts Here! 🧠✨
