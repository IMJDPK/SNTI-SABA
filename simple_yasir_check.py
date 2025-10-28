#!/usr/bin/env python3
"""
Simple verification of Yasir's data status
"""

import json
import os

def check_yasir_status():
    leads_file = '/home/imjd/CHATIMJD/client_data/leads_minimal.json'
    
    print("🔍 YASIR DATA STATUS CHECK")
    print("=" * 40)
    
    # Load current data
    with open(leads_file, 'r') as f:
        leads = json.load(f)
    
    print(f"📋 Total leads entries: {len(leads)}")
    
    # Find Yasir entries
    yasir_entries = []
    for entry in leads:
        if entry.get('email') == 'yasirzulfiqar2@gmail.com':
            yasir_entries.append(entry)
    
    print(f"👤 Yasir entries found: {len(yasir_entries)}")
    
    if len(yasir_entries) == 0:
        print("❌ No Yasir entries found!")
    elif len(yasir_entries) == 1:
        yasir = yasir_entries[0]
        print(f"✅ Single Yasir entry (ID {yasir['id']}):")
        print(f"   Name: {yasir.get('name', 'N/A')}")
        print(f"   Phone: {yasir.get('phone', 'N/A')}")
        print(f"   Messages: {yasir.get('total_messages', 0)}")
        print(f"   Files: {yasir.get('conversation_files', [])}")
        
        # Check conversation file
        conv_files = yasir.get('conversation_files', [])
        if conv_files:
            conv_path = f"/home/imjd/CHATIMJD/client_data/{conv_files[0]}"
            if os.path.exists(conv_path):
                print(f"✅ Conversation file exists: {conv_files[0]}")
            else:
                print(f"❌ Conversation file missing: {conv_files[0]}")
        
    else:
        print(f"⚠️  Multiple Yasir entries still exist:")
        for entry in yasir_entries:
            print(f"   ID {entry['id']}: {entry.get('name', '')} | {entry.get('phone', '')} | {entry.get('total_messages', 0)} msgs")

if __name__ == "__main__":
    check_yasir_status()
