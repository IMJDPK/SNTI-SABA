#!/usr/bin/env python3
import json

with open('client_data/leads_minimal.json', 'r') as f:
    leads = json.load(f)

print('📊 CLEANED LEADS DATABASE')
print('=' * 40)
print(f'Total leads: {len(leads)}')
print()

for lead in leads:
    name = lead.get('name', 'No name')
    phone = lead.get('phone', 'No phone') 
    email = lead.get('email', 'No email')
    has_conversation = len(lead.get('conversation_files', [])) > 0
    
    print(f'ID {lead.get("id")}: {name}')
    print(f'  📱 {phone}')
    print(f'  📧 {email}') 
    print(f'  💬 Conversation: {"✅" if has_conversation else "❌"}')
    print()

# Verify Salman specifically
salman = next((l for l in leads if l.get('id') == 3), None)
if salman:
    print('🎯 SALMAN RECORD:')
    print(f'  ✅ Name: {salman.get("name")}')
    print(f'  ✅ Email: {salman.get("email")}')  
    print(f'  ✅ Meeting: {salman.get("meeting_date")} at {salman.get("meeting_time")}')
    print(f'  ✅ Summary: {salman.get("chat_summary")}')
else:
    print('❌ Salman record missing')

print('\n🎯 KEY RECORDS SUMMARY:')
print('=' * 40)
for lead in leads:
    if lead.get('email') or lead.get('name'):
        print(f'ID {lead.get("id")}: {lead.get("name", "No name")} - {lead.get("email", "No email")}')
