# 🧠 SABA MBTI Psychology Assessment Platform

A simplified AI-powered psychology assessment platform focused on MBTI (Myers-Briggs Type Indicator) testing and student counseling.

## 🎯 Purpose

This application serves as an AI psychologist for students, providing:
- Professional MBTI personality assessments
- Psychological counseling and support
- Academic guidance based on personality types
- Career suggestions aligned with MBTI results
- Confidential and supportive environment for student development

## ✨ Key Features

### 1. **AI Psychology Conversations**
- Professional AI psychologist (SABA) powered by Google Gemini
- Empathetic, evidence-based psychological support
- Maintains conversation context and history
- Ethical boundaries and professional standards

### 2. **MBTI Assessment System**
- Complete Myers-Briggs Type Indicator testing
- Automated scoring and type calculation
- Detailed personality type descriptions
- Personalized results with strengths and development areas

### 3. **Student-Focused Support**
- Academic stress management
- Study strategies based on personality type
- Career guidance and suggestions
- Personal development recommendations

### 4. **Data Privacy & Security**
- Secure session management with Redis
- Confidential assessment storage
- Rate limiting to prevent abuse
- GDPR-compliant data handling

## 🚀 Quick Start

### Prerequisites
```bash
# Install Python 3.8+
# Install Redis server
sudo apt-get install redis-server
```

### Installation
```bash
# Clone and navigate to directory
cd "CHATIMJD 2025/SNTI SABA"

# Install dependencies
pip install -r mbti_requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your GEMINI_API_KEY
```

### Environment Configuration
Create a `.env` file with:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
```

### Run the Application
```bash
python mbti_app.py [port]
# Default port is 8001
```

## 📡 API Endpoints

### Psychology Conversation
```
POST /psychology/chat
Content-Type: application/json

{
  "message": "I'm feeling stressed about my studies",
  "student_id": "student123"
}
```

### Start MBTI Assessment
```
POST /assessment/start
Content-Type: application/json

{
  "student_name": "John Doe",
  "student_email": "john@university.edu",
  "student_id": "student123"
}
```

### Submit Assessment Results
```
POST /assessment/submit
Content-Type: application/json

{
  "student_id": "student123",
  "responses": ["A", "B", "A", "B", ...]
}
```

### Get Assessment Results
```
GET /assessment/results/1
```

### Reset Psychology Session
```
POST /psychology/reset
Content-Type: application/json

{
  "student_id": "student123"
}
```

## 🧠 MBTI Implementation

### Supported Personality Types
- **INTJ** - The Architect
- **INTP** - The Thinker  
- **ENTJ** - The Commander
- **ENTP** - The Debater
- *(More types can be easily added)*

### Assessment Features
- Comprehensive 16-question assessment
- Automated scoring algorithm
- Detailed personality analysis
- Career suggestions based on type
- Academic strategies tailored to personality

## 💾 Data Storage

### Assessment Data Structure
```json
{
  "id": 1,
  "student_id": "student123",
  "student_name": "John Doe",
  "student_email": "john@university.edu",
  "mbti_type": "INTJ",
  "responses": ["A", "B", "A", ...],
  "type_info": {
    "name": "The Architect",
    "description": "Strategic thinkers...",
    "strengths": [...],
    "challenges": [...],
    "career_suggestions": [...]
  },
  "timestamp": "2025-08-05T12:00:00",
  "status": "completed"
}
```

### File Organization
```
assessment_data/
├── student_assessments.json    # All completed assessments
└── mbti_results.json          # Results cache
```

## 🔒 Privacy & Ethics

### Data Protection
- All conversations are encrypted in Redis
- Assessment data stored locally
- No personal data shared with external services
- Session expiry for privacy protection

### Psychological Ethics
- Clear boundaries about AI limitations
- Referral to human professionals when needed
- Crisis intervention protocols
- Confidentiality maintained

### Rate Limiting
- 100 conversations per hour per user
- 10 assessment starts per hour
- 5 assessment submissions per hour
- Protection against system abuse

## 🎨 Frontend Integration

The backend is designed to work with any frontend framework. Sample API calls:

```javascript
// Start psychology conversation
fetch('/psychology/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello, I need help with exam anxiety',
    student_id: 'student123'
  })
})

// Begin MBTI assessment
fetch('/assessment/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    student_name: 'Jane Smith',
    student_email: 'jane@university.edu',
    student_id: 'student456'
  })
})
```

## 📊 Monitoring & Health

### Health Check
```
GET /health
```
Returns system status, Redis connectivity, and API configuration.

### Logging
- All interactions logged for debugging
- Error tracking and monitoring
- Session management logs
- Assessment completion tracking

## 🚀 Deployment

### Production Considerations
1. Set `SESSION_COOKIE_SECURE=True` for HTTPS
2. Configure proper Redis security
3. Set up SSL/TLS certificates
4. Monitor system resources
5. Regular data backups

### Scaling Options
- Redis Cluster for high availability
- Load balancing for multiple instances
- Database migration for large-scale deployment
- CDN for static assets

## 🤝 Contributing

This system is designed for educational and therapeutic purposes. When extending:

1. Maintain psychological ethics
2. Ensure data privacy compliance
3. Follow evidence-based practices
4. Test thoroughly with sample data

## 📞 Support

For technical issues or psychological concerns:
- Technical Support: Review logs and error messages
- Psychological Ethics: Consult with licensed professionals
- MBTI Accuracy: Validate against established instruments

---

**Note**: This AI system is designed to support, not replace, professional psychological services. Students with serious mental health concerns should be directed to qualified human professionals.
