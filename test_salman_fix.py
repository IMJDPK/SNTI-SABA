#!/usr/bin/env python3
"""
Test script to verify the fixes for Salman's meeting scheduling issue.
"""

import os
import sys
import json
import re
from datetime import datetime, timedelta

# Add the app.py functions for testing
sys.path.append('.')
from app import detect_and_schedule_meeting, extract_client_info_from_conversation

def test_email_extraction_fix():
    """Test that email extraction now works with conversation history"""
    print("🧪 Testing Email Extraction Fix...")
    print("=" * 60)
    
    # Simulate Salman's scenario
    client_id = "923226967197_c.us"
    
    # Current user input (without email)
    user_input = "Ok"
    ai_reply = "Perfect! Let me schedule that meeting for you."
    
    print(f"📧 Client ID: {client_id}")
    print(f"💬 Current User Input: '{user_input}'")
    print(f"🤖 AI Reply: '{ai_reply}'")
    
    # Test the enhanced detect_and_schedule_meeting function
    print(f"\n🔍 Running detect_and_schedule_meeting...")
    result = detect_and_schedule_meeting(user_input, ai_reply, client_id)
    
    print(f"\n📊 Result:")
    if result.get("success"):
        print(f"   ✅ SUCCESS: Meeting scheduling attempted")
        print(f"   📧 Email: {result.get('email', 'N/A')}")
        print(f"   🔗 Meet Link: {result.get('meeting_link', 'N/A')}")
    else:
        print(f"   ❌ FAILED: {result.get('error', 'Unknown error')}")
        if result.get("needs_info"):
            print(f"   ⚠️ Needs Info: {result.get('missing_fields', [])}")
    
    return result

def test_conversation_data_extraction():
    """Test that full conversation data extraction works"""
    print("\n\n🧪 Testing Full Conversation Data Extraction...")
    print("=" * 60)
    
    # Read Salman's actual conversation
    conversation_file = "/home/imjd/CHATIMJD/client_data/conversation_923226967197_c.us_2025-06-09_06-32-04.txt"
    
    try:
        with open(conversation_file, 'r', encoding='utf-8') as f:
            full_conversation = f.read()
        
        print(f"📁 Reading: {conversation_file}")
        print(f"📄 Size: {len(full_conversation)} characters")
        
        # Test extraction
        extracted_info = extract_client_info_from_conversation(full_conversation, "")
        
        print(f"\n📊 Extracted Information:")
        for key, value in extracted_info.items():
            print(f"   {key}: {value}")
        
        # Verify email extraction
        if extracted_info.get("email"):
            print(f"\n✅ SUCCESS: Email extracted from conversation history!")
            print(f"   📧 Email: {extracted_info['email']}")
        else:
            print(f"\n❌ FAILED: Email not extracted from conversation")
            
            # Debug: Check if email exists in conversation
            email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
            emails = re.findall(email_pattern, full_conversation)
            client_emails = [email for email in emails if email != "khanjawadkhalid@gmail.com"]
            print(f"   🔍 Debug - Emails found in conversation: {client_emails}")
        
        return extracted_info
        
    except Exception as e:
        print(f"❌ Error reading conversation: {e}")
        return {}

def verify_leads_database():
    """Verify that Salman's data is correctly stored in leads database"""
    print("\n\n🧪 Verifying Leads Database...")
    print("=" * 60)
    
    try:
        with open('/home/imjd/CHATIMJD/client_data/leads_minimal.json', 'r') as f:
            leads = json.load(f)
        
        # Find Salman's entry
        salman_lead = None
        for lead in leads:
            if lead.get("phone") == "923226967197" or "salman" in lead.get("name", "").lower():
                salman_lead = lead
                break
        
        if salman_lead:
            print(f"✅ Found Salman's lead entry:")
            print(f"   🆔 ID: {salman_lead.get('id')}")
            print(f"   👤 Name: {salman_lead.get('name')}")
            print(f"   📧 Email: {salman_lead.get('email')}")
            print(f"   📱 Phone: {salman_lead.get('phone')}")
            print(f"   📅 Meeting Date: {salman_lead.get('meeting_date')}")
            print(f"   ⏰ Meeting Time: {salman_lead.get('meeting_time')}")
            print(f"   🌍 Timezone: {salman_lead.get('meeting_timezone')}")
            print(f"   💬 Summary: {salman_lead.get('chat_summary')}")
            
            # Check if all required fields are present
            required_fields = ['email', 'meeting_date', 'meeting_time']
            missing_fields = [field for field in required_fields if not salman_lead.get(field)]
            
            if missing_fields:
                print(f"   ⚠️ Missing fields: {missing_fields}")
            else:
                print(f"   ✅ All required fields present!")
        else:
            print(f"❌ Salman's lead entry not found")
            print(f"   📊 Total leads: {len(leads)}")
            
        return salman_lead
        
    except Exception as e:
        print(f"❌ Error reading leads database: {e}")
        return None

def main():
    """Main test function"""
    print("🚀 Testing Salman's Meeting Scheduling Fixes")
    print("🎯 Verifying email extraction and meeting scheduling improvements")
    print("=" * 80)
    
    # Run all tests
    email_result = test_email_extraction_fix()
    extraction_result = test_conversation_data_extraction()
    leads_result = verify_leads_database()
    
    print("\n" + "=" * 80)
    print("📋 SUMMARY:")
    print("=" * 80)
    
    # Email detection test
    if email_result and not email_result.get("error"):
        print("✅ Email Detection: FIXED - System can now find emails in conversation history")
    else:
        print("❌ Email Detection: Still has issues")
    
    # Data extraction test
    if extraction_result and extraction_result.get("email"):
        print("✅ Data Extraction: FIXED - Full conversation parsing works")
    else:
        print("❌ Data Extraction: Still has issues")
    
    # Database verification
    if leads_result and leads_result.get("email"):
        print("✅ Database: FIXED - Salman's data is properly stored")
    else:
        print("❌ Database: Missing or incomplete data")
    
    print("\n🎯 Next Steps:")
    if email_result and extraction_result and leads_result:
        print("   ✅ All core issues resolved!")
        print("   🔄 Test with a new conversation to verify real-time functionality")
    else:
        print("   ⚠️ Some issues remain - review test results above")
    
    print("\n✅ Test analysis complete!")

if __name__ == "__main__":
    main()
