#!/usr/bin/env python3
"""
Meeting Resender Script
Resends Google Meet emails with corrected times and sends meeting links to all chat participants.
"""

import json
import os
import sys
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from google_calendar_utils import create_meet_event
import requests

# Email configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "khanjawadkhalid@gmail.com"
SENDER_PASSWORD = os.getenv("EMAIL_PASSWORD")  # Set this in environment variables

# WhatsApp API configuration (if available)
WHATSAPP_API_URL = "http://localhost:3000/send-message"  # Adjust based on your setup

class MeetingResender:
    def __init__(self):
        self.leads_file = "client_data/leads_minimal.json"
        self.leads_data = self.load_leads()
        
    def load_leads(self) -> List[Dict]:
        """Load leads data from JSON file"""
        try:
            with open(self.leads_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"❌ Leads file not found: {self.leads_file}")
            return []
        except json.JSONDecodeError as e:
            print(f"❌ Error parsing leads file: {e}")
            return []
    
    def save_leads(self):
        """Save updated leads data back to JSON file"""
        try:
            with open(self.leads_file, 'w') as f:
                json.dump(self.leads_data, f, indent=2)
            print("✅ Leads data updated successfully")
        except Exception as e:
            print(f"❌ Error saving leads data: {e}")
    
    def get_clients_with_meetings(self) -> List[Dict]:
        """Get all clients who have scheduled meetings"""
        clients_with_meetings = []
        for lead in self.leads_data:
            if (lead.get('meeting_date') and lead.get('meeting_time') and 
                lead.get('email') and lead.get('name')):
                clients_with_meetings.append(lead)
        return clients_with_meetings
    
    def get_clients_with_emails(self) -> List[Dict]:
        """Get all clients who have email addresses for potential meeting invites"""
        clients_with_emails = []
        for lead in self.leads_data:
            if lead.get('email') and lead.get('name'):
                clients_with_emails.append(lead)
        return clients_with_emails
    
    def create_google_meet_for_client(self, client: Dict, corrected_time: Optional[str] = None) -> Dict:
        """Create a Google Meet event for a specific client"""
        try:
            # Use corrected time if provided, otherwise use existing time
            meeting_time = corrected_time or client.get('meeting_time', '10:00')
            meeting_date = client.get('meeting_date', datetime.now().strftime('%Y-%m-%d'))
            
            # Parse the date and time
            meeting_datetime = datetime.strptime(f"{meeting_date} {meeting_time}", '%Y-%m-%d %H:%M')
            
            # Format for Google Calendar API
            start_time = meeting_datetime.strftime('%Y-%m-%dT%H:%M:%S')
            end_time = (meeting_datetime + timedelta(hours=1)).strftime('%Y-%m-%dT%H:%M:%S')
            
            # Create the meeting
            summary = f"Consultation with {client['name']} - CHATIMJD AI Solutions"
            attendees = [client['email']]
            
            print(f"🗓️ Creating Google Meet for {client['name']} ({client['email']}) at {meeting_datetime}")
            
            result = create_meet_event(summary, start_time, end_time, attendees)
            
            if result.get('error'):
                print(f"❌ Error creating meeting for {client['name']}: {result['error']}")
                return {}
            
            # Update client record with meeting link
            client['meet_link'] = result.get('hangoutLink', '')
            client['meeting_time'] = meeting_time  # Update with corrected time if provided
            
            print(f"✅ Meeting created successfully for {client['name']}")
            print(f"📍 Meeting Link: {result.get('hangoutLink', 'Not available')}")
            
            return result
            
        except Exception as e:
            print(f"❌ Error creating meeting for {client['name']}: {e}")
            return {}
    
    def send_email_reminder(self, client: Dict, meeting_details: Dict) -> bool:
        """Send email reminder with meeting details"""
        if not SENDER_PASSWORD:
            print("⚠️ Email password not set. Set EMAIL_PASSWORD environment variable.")
            return False
            
        try:
            # Create email content
            subject = f"Meeting Reminder - CHATIMJD AI Solutions Consultation"
            
            body = f"""
Dear {client['name']},

I hope this email finds you well. This is a friendly reminder about our upcoming consultation meeting.

Meeting Details:
📅 Date: {client['meeting_date']}
🕐 Time: {client['meeting_time']} (PKT - Pakistan Standard Time)
📍 Location: Google Meet (Online)
🔗 Meeting Link: {client.get('meet_link', 'Link will be provided shortly')}

About the Meeting:
Based on our previous conversation, we'll be discussing your interest in WhatsApp automation and AI chatbot solutions for your business. This will be a great opportunity to understand your specific needs and show you how our CHATIMJD system can help streamline your customer communication and lead generation.

What to Expect:
• Overview of CHATIMJD AI automation features
• Customized solutions for your business needs
• Live demonstration of the system
• Q&A session
• Next steps and pricing discussion

Meeting Preparation:
Please ensure you have a stable internet connection and access to Google Meet. The meeting link above will be active 10 minutes before our scheduled time.

If you need to reschedule or have any questions, please don't hesitate to reach out to me directly.

Looking forward to our conversation!

Best regards,
Jawad Khalid
CHATIMJD AI Solutions
Email: khanjawadkhalid@gmail.com
WhatsApp: +92 (Available for urgent matters)

---
This meeting was scheduled based on your request during our WhatsApp conversation. We're excited to help you automate and enhance your business communication!
"""

            # Create message
            msg = MIMEMultipart()
            msg['From'] = SENDER_EMAIL
            msg['To'] = client['email']
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))
            
            # Send email
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            text = msg.as_string()
            server.sendmail(SENDER_EMAIL, client['email'], text)
            server.quit()
            
            print(f"✅ Email sent successfully to {client['name']} ({client['email']})")
            return True
            
        except Exception as e:
            print(f"❌ Error sending email to {client['name']}: {e}")
            return False
    
    def send_whatsapp_message(self, client: Dict) -> bool:
        """Send WhatsApp message with meeting details"""
        if not client.get('phone'):
            print(f"⚠️ No phone number available for {client['name']}")
            return False
            
        try:
            message = f"""
🎯 *Meeting Reminder - CHATIMJD AI Solutions*

Hi {client['name']}! 👋

This is a friendly reminder about our upcoming consultation:

📅 *Date:* {client['meeting_date']}
🕐 *Time:* {client['meeting_time']} PKT
📍 *Location:* Google Meet (Online)
🔗 *Meeting Link:* {client.get('meet_link', 'Will be shared via email')}

*What we'll discuss:*
• WhatsApp automation solutions for your business
• AI chatbot implementation
• Lead generation strategies
• Live system demonstration

I've also sent you a detailed email with all the meeting information. Please check your inbox at {client['email']}.

If you need to reschedule or have any questions, just reply to this message!

Looking forward to our conversation! 🚀

Best regards,
Jawad Khalid
CHATIMJD AI Solutions
"""

            # Send via WhatsApp API (if available)
            payload = {
                "phone": client['phone'],
                "message": message
            }
            
            # Try to send via local WhatsApp API
            try:
                response = requests.post(WHATSAPP_API_URL, json=payload, timeout=10)
                if response.status_code == 200:
                    print(f"✅ WhatsApp message sent to {client['name']} ({client['phone']})")
                    return True
                else:
                    print(f"⚠️ WhatsApp API returned status {response.status_code}")
                    return False
            except requests.exceptions.RequestException:
                print(f"⚠️ WhatsApp API not available. Message prepared for {client['name']}")
                print(f"📱 Phone: {client['phone']}")
                print(f"💬 Message: {message}")
                return False
                
        except Exception as e:
            print(f"❌ Error preparing WhatsApp message for {client['name']}: {e}")
            return False
    
    def resend_all_meetings(self, corrected_times: Dict[str, str] = None):
        """Resend meetings to all clients with corrected times"""
        print("🔄 Starting meeting resend process...")
        print("=" * 50)
        
        # Get clients with meetings
        clients = self.get_clients_with_meetings()
        if not clients:
            print("ℹ️ No clients with scheduled meetings found.")
            
            # Check if there are clients with emails who might need meetings
            email_clients = self.get_clients_with_emails()
            if email_clients:
                print(f"\n📧 Found {len(email_clients)} clients with email addresses:")
                for client in email_clients:
                    print(f"  • {client['name']} - {client['email']}")
                
                response = input("\nWould you like to schedule meetings for these clients? (y/n): ")
                if response.lower() == 'y':
                    self.schedule_new_meetings(email_clients)
            return
        
        print(f"📋 Found {len(clients)} clients with scheduled meetings")
        
        corrected_times = corrected_times or {}
        
        for client in clients:
            print(f"\n👤 Processing: {client['name']}")
            print(f"📧 Email: {client['email']}")
            print(f"📱 Phone: {client.get('phone', 'Not available')}")
            
            # Check if this client has a corrected time
            client_corrected_time = corrected_times.get(client['name']) or corrected_times.get(str(client['id']))
            
            if client_corrected_time:
                print(f"🔄 Updating time from {client.get('meeting_time')} to {client_corrected_time}")
            
            # Create/update Google Meet
            meeting_result = self.create_google_meet_for_client(client, client_corrected_time)
            
            if meeting_result:
                # Send email reminder
                self.send_email_reminder(client, meeting_result)
                
                # Send WhatsApp message
                self.send_whatsapp_message(client)
            
            print("-" * 30)
        
        # Save updated data
        self.save_leads()
        print("\n✅ Meeting resend process completed!")
    
    def schedule_new_meetings(self, clients: List[Dict]):
        """Schedule new meetings for clients who don't have meetings yet"""
        print(f"\n🗓️ Scheduling meetings for {len(clients)} clients...")
        
        # Default meeting time (can be customized per client)
        default_date = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        default_time = "15:00"  # 3 PM PKT
        
        for client in clients:
            print(f"\n👤 Scheduling for: {client['name']}")
            
            # Set default meeting details
            client['meeting_date'] = default_date
            client['meeting_time'] = default_time
            client['meeting_timezone'] = "PKT"
            
            # Create Google Meet
            meeting_result = self.create_google_meet_for_client(client)
            
            if meeting_result:
                # Send email invitation
                self.send_email_reminder(client, meeting_result)
                
                # Send WhatsApp message
                self.send_whatsapp_message(client)
        
        # Save updated data
        self.save_leads()

def main():
    """Main function to run the meeting resender"""
    print("🎯 CHATIMJD Meeting Resender")
    print("=" * 40)
    
    resender = MeetingResender()
    
    # Define corrected times for specific clients (if needed)
    corrected_times = {
        "Salman Arshad": "14:00",  # 2 PM PKT instead of 10 AM
        # Add more clients and their corrected times as needed
        # "Client Name": "HH:MM",
        # "3": "16:00",  # Using client ID instead of name
    }
    
    # Check command line arguments
    if len(sys.argv) > 1:
        if sys.argv[1] == "--schedule-new":
            print("📅 Scheduling new meetings mode")
            clients = resender.get_clients_with_emails()
            resender.schedule_new_meetings(clients)
        elif sys.argv[1] == "--list-clients":
            print("📋 Current clients with meetings:")
            clients = resender.get_clients_with_meetings()
            for client in clients:
                print(f"• {client['name']} - {client['email']} - {client['meeting_date']} {client['meeting_time']}")
            
            print("\n📧 Clients with emails (potential meeting candidates):")
            email_clients = resender.get_clients_with_emails()
            for client in email_clients:
                has_meeting = client.get('meeting_date') and client.get('meeting_time')
                status = "✅ Has meeting" if has_meeting else "❌ No meeting scheduled"
                print(f"• {client['name']} - {client['email']} - {status}")
        else:
            print("Usage: python resend_meetings.py [--schedule-new|--list-clients]")
    else:
        # Default behavior: resend existing meetings with corrections
        resender.resend_all_meetings(corrected_times)

if __name__ == "__main__":
    main()
