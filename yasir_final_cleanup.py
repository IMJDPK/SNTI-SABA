#!/usr/bin/env python3
import json
import os
from datetime import datetime

def cleanup_yasir_duplicates():
    leads_file = '/home/imjd/CHATIMJD/client_data/leads_minimal.json'
    
    # Create backup
    backup_file = f"{leads_file}.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    os.system(f"cp '{leads_file}' '{backup_file}'")
    print(f"✅ Backup created: {backup_file}")
    
    # Load current data
    with open(leads_file, 'r') as f:
        leads = json.load(f)
    
    print(f"📋 Total entries before cleanup: {len(leads)}")
    
    # Find all Yasir entries (by email)
    yasir_entries = []
    other_entries = []
    
    for entry in leads:
        if entry.get('email') == 'yasirzulfiqar2@gmail.com':
            yasir_entries.append(entry)
            print(f"🔍 Found Yasir entry - ID: {entry['id']}, Name: '{entry.get('name', '')}', Phone: '{entry.get('phone', '')}', Messages: {entry.get('total_messages', 0)}")
        else:
            other_entries.append(entry)
    
    print(f"\n📊 Found {len(yasir_entries)} Yasir entries to consolidate")
    
    if len(yasir_entries) <= 1:
        print("✅ No duplicate entries found. Nothing to consolidate.")
        return
    
    # Get the best values from all entries
    best_phone = next((e.get('phone') for e in yasir_entries if e.get('phone', '').startswith('+')), '+923464832427')
    best_name = next((e.get('name') for e in yasir_entries if e.get('name') and e.get('name') not in ['Hi', 'In', 'A Test']), 'Yasir')
    best_meet_link = next((e.get('meet_link') for e in yasir_entries if e.get('meet_link', '').startswith('https')), '')
    latest_interaction = max([e.get('last_interaction', '') for e in yasir_entries if e.get('last_interaction')])
    
    consolidated_entry = {
        "id": 8,
        "name": best_name,
        "email": "yasirzulfiqar2@gmail.com", 
        "phone": best_phone,
        "chat_summary": "Interested in services, Requested meeting",
        "meet_link": best_meet_link,
        "meeting_date": "2025-06-10",
        "meeting_time": "15:00",
        "meeting_timezone": "PKT",
        "conversation_files": ["conversation_923464832427_c.us_2025-06-09_06-42-41.txt"],
        "last_interaction": latest_interaction,
        "total_messages": 90
    }
    
    print(f"\n✨ Consolidated Yasir entry:")
    print(f"   - Name: {consolidated_entry['name']}")
    print(f"   - Email: {consolidated_entry['email']}")
    print(f"   - Phone: {consolidated_entry['phone']}")
    print(f"   - Total Messages: {consolidated_entry['total_messages']}")
    
    # Rebuild the leads list
    final_leads = other_entries + [consolidated_entry]
    
    # Re-assign IDs sequentially
    for i, entry in enumerate(final_leads, 1):
        entry['id'] = i
    
    # Save the cleaned data
    with open(leads_file, 'w') as f:
        json.dump(final_leads, f, indent=2)
    
    print(f"\n✅ Cleanup completed!")
    print(f"📋 Entries before: {len(leads)}")
    print(f"📋 Entries after: {len(final_leads)}")
    print(f"🗑️  Removed {len(yasir_entries) - 1} duplicate entries")

if __name__ == "__main__":
    cleanup_yasir_duplicates()
