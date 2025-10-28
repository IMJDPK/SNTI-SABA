# MBTI Psychology Assessment Application
# Simplified for student psychological assessment and MBTI testing

import os
import json
import logging
import redis
import requests
from datetime import datetime
from flask import Flask, request, jsonify, session, Response, make_response
from flask_session import Session
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional

# Load environment variables
load_dotenv()

# Get Gemini API Key for AI psychology responses
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("❌ Missing GEMINI_API_KEY in .env file")

# Get model name from environment or default to gemini-2.0-flash
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

# Assessment data folder
ASSESSMENT_FOLDER = "assessment_data"
os.makedirs(ASSESSMENT_FOLDER, exist_ok=True)

# Assessment files
ASSESSMENTS_FILE = os.path.join(ASSESSMENT_FOLDER, "student_assessments.json")
RESULTS_FILE = os.path.join(ASSESSMENT_FOLDER, "mbti_results.json")

# Logging setup
logging.basicConfig(level=logging.DEBUG)

# Flask setup
app = Flask(__name__)
CORS(app, supports_credentials=True)

# Session configuration with Redis
app.config["SECRET_KEY"] = os.urandom(24)
app.config["SESSION_TYPE"] = "redis"

# Redis configuration for sessions
redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = int(os.getenv("REDIS_PORT", 6379))
redis_db = int(os.getenv("REDIS_DB", 0))

app.config["SESSION_REDIS"] = redis.Redis(
    host=redis_host,
    port=redis_port,
    db=redis_db
)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = False  # Set to True in production with HTTPS
app.config["PERMANENT_SESSION_LIFETIME"] = 7200  # 2 hours for assessments

Session(app)

# Rate limiting with Redis storage
redis_url = f"redis://{redis_host}:{redis_port}/{redis_db}"
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["1000 per day", "200 per hour"],
    storage_uri=redis_url
)

limiter.init_app(app)

# MBTI Personality Types and Descriptions
MBTI_TYPES = {
    "INTJ": {
        "name": "The Architect",
        "description": "Strategic thinkers who are driven by their vision and work systematically to achieve their goals.",
        "strengths": ["Strategic thinking", "Independent", "Determined", "Analytical"],
        "challenges": ["Can seem aloof", "May overlook emotional factors", "Perfectionist tendencies"],
        "career_suggestions": ["Research scientist", "Software architect", "Strategic planner", "Systems analyst"]
    },
    "INTP": {
        "name": "The Thinker", 
        "description": "Logical and analytical individuals who love exploring theoretical concepts and ideas.",
        "strengths": ["Logical", "Creative", "Objective", "Independent"],
        "challenges": ["May struggle with deadlines", "Can be insensitive", "Dislike routine"],
        "career_suggestions": ["Research scientist", "Software developer", "Philosopher", "Mathematician"]
    },
    "ENTJ": {
        "name": "The Commander",
        "description": "Natural leaders who are strategic, assertive, and excellent at organizing people and resources.",
        "strengths": ["Natural leadership", "Strategic", "Efficient", "Confident"],
        "challenges": ["Can be dominating", "Impatient", "May neglect emotions"],
        "career_suggestions": ["CEO", "Manager", "Entrepreneur", "Lawyer"]
    },
    # Add more types as needed...
}

# System instruction for the AI psychologist
PSYCHOLOGY_SYSTEM_INSTRUCTION = """
You are SABA, a professional AI psychologist specializing in MBTI (Myers-Briggs Type Indicator) assessment and student counseling. You work with students to help them understand their personality types and provide psychological guidance.

Your role:
1. Conduct MBTI assessments in a warm, professional manner
2. Provide psychological insights based on personality types
3. Offer study strategies and career guidance based on MBTI results
4. Support students with academic stress and personal development
5. Maintain ethical boundaries and refer to human professionals when needed

Tone: Empathetic, professional, encouraging, and psychologically informed.

When conducting MBTI assessments:
- Ask thoughtful questions to understand personality preferences
- Explain the four dichotomies: E/I, S/N, T/F, J/P
- Provide detailed, personalized results
- Offer practical advice for academic and personal growth

Always prioritize student wellbeing and maintain confidentiality.
"""

# Helper functions for assessment data
def load_assessments() -> List[Dict[str, Any]]:
    """Load student assessments from file"""
    if not os.path.exists(ASSESSMENTS_FILE):
        return []
    try:
        with open(ASSESSMENTS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return []

def save_assessment(assessment_data: Dict[str, Any]) -> bool:
    """Save student assessment data"""
    try:
        assessments = load_assessments()
        assessment_data["timestamp"] = datetime.now().isoformat()
        assessment_data["id"] = len(assessments) + 1
        assessments.append(assessment_data)
        
        with open(ASSESSMENTS_FILE, "w", encoding="utf-8") as f:
            json.dump(assessments, f, indent=4)
        return True
    except Exception as e:
        logging.error(f"Error saving assessment: {e}")
        return False

def calculate_mbti_type(responses: List[str]) -> str:
    """Calculate MBTI type from assessment responses"""
    # This is a simplified calculation - in a real implementation,
    # you'd want more sophisticated scoring
    
    e_score = i_score = s_score = n_score = 0
    t_score = f_score = j_score = p_score = 0
    
    # Score based on responses (this would be more complex in reality)
    for response in responses:
        # This is a placeholder - you'd implement proper MBTI scoring logic
        pass
    
    # Determine type based on scores
    ei = "E" if e_score > i_score else "I"
    sn = "S" if s_score > n_score else "N"
    tf = "T" if t_score > f_score else "F"
    jp = "J" if j_score > p_score else "P"
    
    return f"{ei}{sn}{tf}{jp}"

# API Routes

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "🧠 SABA MBTI Psychology Assessment Platform",
        "status": "active",
        "endpoints": [
            "/psychology/chat - AI psychology conversation",
            "/assessment/start - Begin MBTI assessment", 
            "/assessment/submit - Submit assessment results",
            "/assessment/results/<id> - Get assessment results"
        ]
    })

@app.route("/psychology/chat", methods=["POST"])
@limiter.limit("100 per hour")
def psychology_chat():
    """Main psychology conversation endpoint"""
    try:
        data = request.get_json()
        if not data or "message" not in data:
            return jsonify({"error": "Missing 'message' in request body"}), 400

        user_message = data.get("message", "").strip()
        student_id = data.get("student_id", "anonymous")
        
        if not user_message:
            return jsonify({"error": "Empty message"}), 400

        # Get conversation history from session
        session_key = f"psychology_session:{student_id}"
        redis_client = app.config["SESSION_REDIS"]
        
        session_data_raw = redis_client.get(session_key)
        if session_data_raw:
            session_data = json.loads(session_data_raw.decode('utf-8'))
            conversation_history = session_data.get("conversation_history", [])
        else:
            conversation_history = []

        # Add user message to history
        conversation_history.append({"role": "user", "parts": [{"text": user_message}]})

        # Limit conversation history
        if len(conversation_history) > 20:
            conversation_history = conversation_history[-20:]

        # Call Gemini API for psychology response
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
        headers = {"Content-Type": "application/json"}
        
        payload = {
            "systemInstruction": {"parts": [{"text": PSYCHOLOGY_SYSTEM_INSTRUCTION}]},
            "contents": conversation_history
        }

        response = requests.post(url, headers=headers, json=payload)

        if response.status_code == 200:
            res_json = response.json()
            reply = res_json["candidates"][0]["content"]["parts"][0]["text"]

            # Add AI response to history
            conversation_history.append({"role": "model", "parts": [{"text": reply}]})

            # Save updated session
            redis_client.setex(session_key, 7200, json.dumps({
                "conversation_history": conversation_history,
                "student_id": student_id
            }))

            return jsonify({"reply": reply, "status": "success"})
        else:
            logging.error(f"Gemini API Error: {response.status_code} - {response.text}")
            return jsonify({"error": "AI service temporarily unavailable"}), 500

    except Exception as e:
        logging.exception(f"Error in psychology chat: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/assessment/start", methods=["POST"])
@limiter.limit("10 per hour")
def start_assessment():
    """Start a new MBTI assessment"""
    try:
        data = request.get_json()
        student_name = data.get("student_name", "")
        student_email = data.get("student_email", "")
        student_id = data.get("student_id", "")

        if not student_name or not student_email:
            return jsonify({"error": "Student name and email required"}), 400

        # Create new assessment session
        assessment_session = {
            "student_id": student_id,
            "student_name": student_name,
            "student_email": student_email,
            "status": "started",
            "started_at": datetime.now().isoformat(),
            "responses": []
        }

        # Save to Redis session
        session_key = f"assessment_session:{student_id}"
        redis_client = app.config["SESSION_REDIS"]
        redis_client.setex(session_key, 3600, json.dumps(assessment_session))  # 1 hour expiry

        return jsonify({
            "message": "Assessment started successfully",
            "session_id": student_id,
            "status": "success"
        })

    except Exception as e:
        logging.exception(f"Error starting assessment: {e}")
        return jsonify({"error": "Failed to start assessment"}), 500

@app.route("/assessment/submit", methods=["POST"])
@limiter.limit("5 per hour")
def submit_assessment():
    """Submit completed MBTI assessment"""
    try:
        data = request.get_json()
        student_id = data.get("student_id", "")
        responses = data.get("responses", [])

        if not student_id or not responses:
            return jsonify({"error": "Student ID and responses required"}), 400

        # Get assessment session
        session_key = f"assessment_session:{student_id}"
        redis_client = app.config["SESSION_REDIS"]
        session_data_raw = redis_client.get(session_key)
        
        if not session_data_raw:
            return jsonify({"error": "Assessment session not found"}), 404

        session_data = json.loads(session_data_raw.decode('utf-8'))

        # Calculate MBTI type
        mbti_type = calculate_mbti_type(responses)
        
        # Get type description
        type_info = MBTI_TYPES.get(mbti_type, {
            "name": "Unknown Type",
            "description": "Assessment needs review",
            "strengths": [],
            "challenges": [],
            "career_suggestions": []
        })

        # Complete assessment data
        assessment_data = {
            **session_data,
            "responses": responses,
            "mbti_type": mbti_type,
            "type_info": type_info,
            "status": "completed",
            "completed_at": datetime.now().isoformat()
        }

        # Save assessment
        if save_assessment(assessment_data):
            # Clean up session
            redis_client.delete(session_key)
            
            return jsonify({
                "message": "Assessment completed successfully",
                "mbti_type": mbti_type,
                "type_info": type_info,
                "assessment_id": assessment_data["id"]
            })
        else:
            return jsonify({"error": "Failed to save assessment"}), 500

    except Exception as e:
        logging.exception(f"Error submitting assessment: {e}")
        return jsonify({"error": "Failed to submit assessment"}), 500

@app.route("/assessment/results/<int:assessment_id>", methods=["GET"])
def get_assessment_results(assessment_id: int):
    """Get assessment results by ID"""
    try:
        assessments = load_assessments()
        assessment = next((a for a in assessments if a["id"] == assessment_id), None)
        
        if not assessment:
            return jsonify({"error": "Assessment not found"}), 404

        return jsonify({
            "assessment": assessment,
            "status": "success"
        })

    except Exception as e:
        logging.exception(f"Error getting assessment results: {e}")
        return jsonify({"error": "Failed to retrieve results"}), 500

@app.route("/psychology/reset", methods=["POST"])
def reset_psychology_session():
    """Reset psychology conversation session"""
    try:
        data = request.get_json()
        student_id = data.get("student_id", "anonymous")
        
        session_key = f"psychology_session:{student_id}"
        redis_client = app.config["SESSION_REDIS"]
        redis_client.delete(session_key)
        
        return jsonify({"message": "Session reset successfully"})

    except Exception as e:
        logging.exception(f"Error resetting session: {e}")
        return jsonify({"error": "Failed to reset session"}), 500

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    try:
        # Test Redis connection
        redis_client = app.config["SESSION_REDIS"]
        redis_client.ping()
        
        return jsonify({
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "services": {
                "redis": "connected",
                "gemini_api": "configured" if GEMINI_API_KEY else "missing"
            }
        })
    except Exception as e:
        return jsonify({
            "status": "unhealthy", 
            "error": str(e)
        }), 500

if __name__ == "__main__":
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8001
    print(f"🧠 Starting SABA MBTI Psychology Assessment Platform on port {port}")
    app.run(host="0.0.0.0", port=port, debug=True)
