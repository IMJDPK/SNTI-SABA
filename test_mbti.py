#!/usr/bin/env python3
"""
Test script for MBTI Psychology Assessment Platform
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:8001"
TEST_STUDENT_ID = "test_student_123"

def test_health_check():
    """Test the health check endpoint"""
    print("🏥 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")

def test_psychology_chat():
    """Test psychology conversation"""
    print("\n🧠 Testing psychology chat...")
    try:
        payload = {
            "message": "Hello, I'm a student feeling anxious about my upcoming exams. Can you help me?",
            "student_id": TEST_STUDENT_ID
        }
        
        response = requests.post(f"{BASE_URL}/psychology/chat", json=payload)
        if response.status_code == 200:
            result = response.json()
            print("✅ Psychology chat successful")
            print(f"AI Response: {result.get('reply', 'No reply')}")
        else:
            print(f"❌ Psychology chat failed: {response.status_code}")
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"❌ Psychology chat error: {e}")

def test_assessment_flow():
    """Test complete MBTI assessment flow"""
    print("\n📝 Testing MBTI assessment flow...")
    
    # Step 1: Start assessment
    try:
        start_payload = {
            "student_name": "Test Student",
            "student_email": "test@university.edu",
            "student_id": TEST_STUDENT_ID
        }
        
        response = requests.post(f"{BASE_URL}/assessment/start", json=start_payload)
        if response.status_code == 200:
            print("✅ Assessment started successfully")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Assessment start failed: {response.status_code}")
            return
            
    except Exception as e:
        print(f"❌ Assessment start error: {e}")
        return

    # Step 2: Submit assessment (with sample responses)
    try:
        time.sleep(1)  # Brief pause
        
        # Sample MBTI responses (16 questions, A or B answers)
        sample_responses = ["A", "B", "A", "A", "B", "A", "B", "A", 
                          "B", "A", "A", "B", "A", "B", "A", "B"]
        
        submit_payload = {
            "student_id": TEST_STUDENT_ID,
            "responses": sample_responses
        }
        
        response = requests.post(f"{BASE_URL}/assessment/submit", json=submit_payload)
        if response.status_code == 200:
            result = response.json()
            print("✅ Assessment submitted successfully")
            print(f"MBTI Type: {result.get('mbti_type', 'Unknown')}")
            print(f"Assessment ID: {result.get('assessment_id', 'Unknown')}")
            return result.get('assessment_id')
        else:
            print(f"❌ Assessment submit failed: {response.status_code}")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Assessment submit error: {e}")

def test_session_reset():
    """Test session reset functionality"""
    print("\n🔄 Testing session reset...")
    try:
        payload = {
            "student_id": TEST_STUDENT_ID
        }
        
        response = requests.post(f"{BASE_URL}/psychology/reset", json=payload)
        if response.status_code == 200:
            print("✅ Session reset successful")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Session reset failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Session reset error: {e}")

def main():
    """Run all tests"""
    print("🧪 Starting MBTI Assessment Platform Tests")
    print("=" * 50)
    
    # Check if server is running
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"🚀 Server is running at {BASE_URL}")
        print(f"Server response: {response.json().get('message', 'Unknown')}")
    except Exception as e:
        print(f"❌ Server not accessible at {BASE_URL}")
        print(f"Error: {e}")
        print("Please make sure the MBTI app is running with: python mbti_app.py")
        return

    print("\n" + "=" * 50)
    
    # Run tests
    test_health_check()
    test_psychology_chat()
    test_assessment_flow()
    test_session_reset()
    
    print("\n" + "=" * 50)
    print("🏁 Test suite completed!")
    print("\nTo run the MBTI app manually:")
    print("python mbti_app.py")
    print(f"Then visit: {BASE_URL}")

if __name__ == "__main__":
    main()
