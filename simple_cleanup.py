import json
import re
import os

# Load leads data
with open('/home/imjd/CHATIMJD/client_data/leads_minimal.json', 'r') as f:
    leads = json.load(f)

print(f"Starting with {len(leads)} leads")

# Function to extract phone from conversation filename
def extract_phone_from_filename(filename):
    match = re.search(r'(\d+)_c\.us', filename)
    if match:
        return f"+{match.group(1)}"
    return ""

# Fix 1: Add missing phone numbers
phone_fixes = 0
for lead in leads:
    if not lead.get('phone') and lead.get('conversation_files'):
        for conv_file in lead['conversation_files']:
            phone = extract_phone_from_filename(conv_file)
            if phone:
                lead['phone'] = phone
                phone_fixes += 1
                break

print(f"Added {phone_fixes} phone numbers")

# Fix 2: Fix the invalid conversation file reference
file_fixes = 0
for lead in leads:
    if lead.get('conversation_files'):
        original_files = lead['conversation_files'][:]
        valid_files = []
        for conv_file in lead['conversation_files']:
            if conv_file == "conversation_923226967197_c.us_2025-06-09_07-03-21.txt":
                # Replace with the existing file
                valid_files.append("conversation_923226967197_c.us_2025-06-09_06-32-04.txt")
                file_fixes += 1
            elif os.path.exists(f"/home/imjd/CHATIMJD/client_data/{conv_file}"):
                valid_files.append(conv_file)
        lead['conversation_files'] = valid_files

print(f"Fixed {file_fixes} invalid file references")

# Fix 3: Remove duplicate leads with same phone number
phone_groups = {}
for i, lead in enumerate(leads):
    phone = lead.get('phone')
    if phone:
        if phone not in phone_groups:
            phone_groups[phone] = []
        phone_groups[phone].append((i, lead))

# Keep only the best lead for each phone number
leads_to_keep = []
duplicates_removed = 0

for phone, lead_list in phone_groups.items():
    if len(lead_list) > 1:
        # Sort by completeness (name, email, conv files) and keep the best one
        best_lead = max(lead_list, key=lambda x: (
            bool(x[1].get('name')),
            bool(x[1].get('email')),
            len(x[1].get('conversation_files', [])),
            x[1].get('total_messages', 0)
        ))[1]
        
        # Merge conversation files from all duplicates
        all_conv_files = set()
        total_messages = 0
        for _, lead in lead_list:
            for conv_file in lead.get('conversation_files', []):
                all_conv_files.add(conv_file)
            total_messages += lead.get('total_messages', 0)
        
        best_lead['conversation_files'] = list(all_conv_files)
        best_lead['total_messages'] = total_messages
        leads_to_keep.append(best_lead)
        duplicates_removed += len(lead_list) - 1
    else:
        leads_to_keep.append(lead_list[0][1])

# Add leads without phone numbers
for lead in leads:
    if not lead.get('phone'):
        leads_to_keep.append(lead)

print(f"Removed {duplicates_removed} duplicate leads")

# Renumber IDs
for i, lead in enumerate(leads_to_keep):
    lead['id'] = i + 1

# Save backup
import datetime
backup_file = f"/home/imjd/CHATIMJD/client_data/leads_minimal.json.backup_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}"
with open(backup_file, 'w') as f:
    json.dump(leads, f, indent=2)

# Save cleaned data
with open('/home/imjd/CHATIMJD/client_data/leads_minimal.json', 'w') as f:
    json.dump(leads_to_keep, f, indent=2)

print(f"Final database has {len(leads_to_keep)} leads")
print(f"Backup saved as: {backup_file}")

# Report remaining issues
empty_names = sum(1 for lead in leads_to_keep if not lead.get('name'))
empty_phones = sum(1 for lead in leads_to_keep if not lead.get('phone'))
print(f"Remaining issues: {empty_names} empty names, {empty_phones} empty phones")
