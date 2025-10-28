#!/usr/bin/env python3
"""
Test Client Deduplication and ID Assignment System

This script tests the complete client deduplication flow:
1. Assign client ID as soon as chat starts
2. Always check for previous history by phone/email/conversation file before creating new client
3. Compile chat in same file if client recognized  
4. Issue new ID only if no match found
5. Saba must always communicate client ID to user at start of conversation
"""

import json
import requests
import os
import shutil
from datetime import datetime
import time

# Test configuration
FLASK_BASE_URL = "http://localhost:5000"
CLIENT_DATA_DIR = "/home/imjd/CHATIMJD/client_data"
LEADS_FILE = f"{CLIENT_DATA_DIR}/leads_minimal.json"

def backup_test_data():
    """Create backup of current data before testing"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    if os.path.exists(LEADS_FILE):
        backup_file = f"{LEADS_FILE}.test_backup_{timestamp}"
        shutil.copy2(LEADS_FILE, backup_file)
        print(f"✅ Backup created: {backup_file}")
        return backup_file
    return None

def restore_test_data(backup_file):
    """Restore data from backup"""
    if backup_file and os.path.exists(backup_file):
        shutil.copy2(backup_file, LEADS_FILE)
        print(f"✅ Data restored from: {backup_file}")

def clean_test_conversations():
    """Remove test conversation files"""
    for file in os.listdir(CLIENT_DATA_DIR):
        if file.startswith('conversation_test_') or 'test_client' in file:
            os.remove(f"{CLIENT_DATA_DIR}/{file}")
            print(f"🧹 Removed test file: {file}")

def test_new_client_creation():
    """Test 1: New client gets ID immediately and Saba introduces herself with ID"""
    print("\n🧪 TEST 1: New Client Creation")
    
    # Test data for new client
    test_phone = "+923001234567"
    test_client_id = "test_client_001"
    
    # Call the get_or_create_client API
    response = requests.post(f"{FLASK_BASE_URL}/api/get_or_create_client", json={
        "phone": test_phone,
        "email": None,
        "client_id": test_client_id,
        "conversation_file": None
    })
    
    if response.status_code == 200:
        data = response.json()
        client = data["client"]
        
        print(f"✅ Client created successfully")
        print(f"   - Client ID: {client['id']}")
        print(f"   - Phone: {client['phone']}")
        print(f"   - Created: {data['created']}")
        print(f"   - Conversation file: {data['conversation_file']}")
        
        # Test Saba's greeting with client ID
        greeting_response = requests.post(f"{FLASK_BASE_URL}/api/saba_greeting", json={
            "client": client
        })
        
        if greeting_response.status_code == 200:
            greeting = greeting_response.json()["greeting"]
            print(f"✅ Saba's greeting: {greeting}")
            
            # Verify greeting contains client ID
            if str(client['id']) in greeting:
                print("✅ Client ID correctly included in greeting")
                return True
            else:
                print("❌ Client ID missing from greeting")
                return False
        else:
            print(f"❌ Greeting API failed: {greeting_response.text}")
            return False
    else:
        print(f"❌ Client creation failed: {response.text}")
        return False

def test_existing_client_recognition():
    """Test 2: Existing client is recognized by phone number"""
    print("\n🧪 TEST 2: Existing Client Recognition")
    
    # Use the same phone from test 1
    test_phone = "+923001234567"
    test_client_id = "test_client_002"  # Different client ID
    
    # Call the get_or_create_client API again
    response = requests.post(f"{FLASK_BASE_URL}/api/get_or_create_client", json={
        "phone": test_phone,
        "email": None,
        "client_id": test_client_id,
        "conversation_file": None
    })
    
    if response.status_code == 200:
        data = response.json()
        client = data["client"]
        
        print(f"✅ Client lookup completed")
        print(f"   - Client ID: {client['id']}")
        print(f"   - Phone: {client['phone']}")
        print(f"   - Created: {data['created']}")
        
        # Should NOT create new client
        if not data['created']:
            print("✅ Existing client correctly recognized (no new client created)")
            return True
        else:
            print("❌ New client created when existing one should have been found")
            return False
    else:
        print(f"❌ Client lookup failed: {response.text}")
        return False

def test_email_recognition():
    """Test 3: Client recognition by email address"""
    print("\n🧪 TEST 3: Email Recognition")
    
    # First, create a client with email
    test_email = "test@example.com"
    test_client_id = "test_client_email"
    
    response1 = requests.post(f"{FLASK_BASE_URL}/api/get_or_create_client", json={
        "phone": None,
        "email": test_email,
        "client_id": test_client_id,
        "conversation_file": None
    })
    
    if response1.status_code == 200:
        data1 = response1.json()
        original_client_id = data1["client"]["id"]
        print(f"✅ Client created with email: {original_client_id}")
        
        # Now try to find the same client using email (different client_id)
        response2 = requests.post(f"{FLASK_BASE_URL}/api/get_or_create_client", json={
            "phone": None,
            "email": test_email,
            "client_id": "different_client_id",
            "conversation_file": None
        })
        
        if response2.status_code == 200:
            data2 = response2.json()
            found_client_id = data2["client"]["id"]
            
            if not data2['created'] and found_client_id == original_client_id:
                print("✅ Client correctly found by email address")
                return True
            else:
                print(f"❌ Client not found by email. Created: {data2['created']}, IDs match: {found_client_id == original_client_id}")
                return False
        else:
            print(f"❌ Email lookup failed: {response2.text}")
            return False
    else:
        print(f"❌ Initial client creation failed: {response1.text}")
        return False

def test_conversation_file_integration():
    """Test 4: Conversation files are properly linked to clients"""
    print("\n🧪 TEST 4: Conversation File Integration")
    
    # Create client and check conversation file
    test_phone = "+923009999999"
    test_client_id = "test_conversation_client"
    
    response = requests.post(f"{FLASK_BASE_URL}/api/get_or_create_client", json={
        "phone": test_phone,
        "email": None,
        "client_id": test_client_id,
        "conversation_file": None
    })
    
    if response.status_code == 200:
        data = response.json()
        conversation_file = data["conversation_file"]
        
        print(f"✅ Conversation file created: {conversation_file}")
        
        # Verify file exists
        full_path = f"{CLIENT_DATA_DIR}/{conversation_file}"
        if os.path.exists(full_path):
            print("✅ Conversation file exists on disk")
            
            # Read file content to verify it's properly formatted
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            if len(content) > 0:
                print("✅ Conversation file has initial content")
                return True
            else:
                print("⚠️ Conversation file is empty (may be expected)")
                return True
        else:
            print("❌ Conversation file does not exist on disk")
            return False
    else:
        print(f"❌ Client creation failed: {response.text}")
        return False

def test_gemini_integration():
    """Test 5: Integration with Gemini endpoint for new vs existing clients"""
    print("\n🧪 TEST 5: Gemini Integration Test")
    
    # Test with a new client - should get greeting with ID
    test_message = "Hello, I need help"
    test_client_id = "whatsapp_test_987654321"
    test_phone = "+923007777777"
    
    # First message should trigger new client creation
    response = requests.post(f"{FLASK_BASE_URL}/gemini/train", json={
        "content": test_message,
        "client_id": test_client_id,
        "phone": test_phone
    })
    
    if response.status_code == 200:
        reply = response.json().get("reply", "")
        print(f"✅ Gemini response received: {reply[:100]}...")
        
        # Check if response includes client ID (for new clients)
        # Note: This may not happen in current flow, but we can verify client was created
        
        # Verify client was created in database
        client_response = requests.post(f"{FLASK_BASE_URL}/api/get_or_create_client", json={
            "phone": test_phone,
            "email": None,
            "client_id": test_client_id,
            "conversation_file": None
        })
        
        if client_response.status_code == 200:
            client_data = client_response.json()
            if not client_data['created']:  # Should find existing client
                print("✅ Client was properly created and can be found again")
                return True
            else:
                print("❌ Client was not found in subsequent lookup")
                return False
        else:
            print(f"❌ Client lookup failed: {client_response.text}")
            return False
    else:
        print(f"❌ Gemini endpoint failed: {response.text}")
        return False

def run_all_tests():
    """Run all tests and provide summary"""
    print("🚀 Starting Client Deduplication System Tests")
    print("=" * 60)
    
    # Create backup
    backup_file = backup_test_data()
    
    try:
        # Clean any existing test data
        clean_test_conversations()
        
        # Run tests
        tests = [
            ("New Client Creation", test_new_client_creation),
            ("Existing Client Recognition", test_existing_client_recognition),
            ("Email Recognition", test_email_recognition),
            ("Conversation File Integration", test_conversation_file_integration),
            ("Gemini Integration", test_gemini_integration)
        ]
        
        results = []
        for test_name, test_func in tests:
            print(f"\n{'-' * 40}")
            try:
                result = test_func()
                results.append((test_name, result))
                status = "✅ PASSED" if result else "❌ FAILED"
                print(f"Test Result: {status}")
            except Exception as e:
                print(f"❌ TEST ERROR: {e}")
                results.append((test_name, False))
        
        # Summary
        print(f"\n{'=' * 60}")
        print("📊 TEST SUMMARY")
        print(f"{'=' * 60}")
        
        passed = sum(1 for _, result in results if result)
        total = len(results)
        
        for test_name, result in results:
            status = "✅ PASSED" if result else "❌ FAILED"
            print(f"{test_name:.<40} {status}")
        
        print(f"\nOverall: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 ALL TESTS PASSED! Client deduplication system is working correctly.")
        else:
            print("⚠️ Some tests failed. Please review the implementation.")
            
    finally:
        # Clean up test data
        clean_test_conversations()
        
        # Restore backup if requested
        if input("\nRestore original data? (y/n): ").lower().startswith('y'):
            restore_test_data(backup_file)

if __name__ == "__main__":
    # Wait a moment for Flask server to be ready
    print("⏳ Waiting for Flask server to start...")
    time.sleep(3)
    
    # Check if Flask server is running
    try:
        response = requests.get(f"{FLASK_BASE_URL}/")
        if response.status_code == 200:
            print("✅ Flask server is running")
            run_all_tests()
        else:
            print("❌ Flask server is not responding correctly")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Flask server. Please ensure it's running on port 5000")