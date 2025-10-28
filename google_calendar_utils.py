import os
import uuid
import pickle
from typing import List, Dict, Any
from google.oauth2 import service_account
from googleapiclient.discovery import build
from google.auth.transport.requests import Request

# Adjust the path based on where you put the JSON key
SERVICE_ACCOUNT_FILE = 'backend/service_account.json'  # ✅ Update this if needed
SCOPES = ['https://www.googleapis.com/auth/calendar']
CALENDAR_ID = 'khanjawadkhalid@gmail.com'  # ✅ Replace this with your real calendar's email
OAUTH_CLIENT_SECRET_FILE = 'client_secret_612766372047-4rsfdcurc59rib6lmgfgrthua007pfla.apps.googleusercontent.com.json'

def create_meet_event(summary: str, start_time: str, end_time: str, attendees: List[str] = []) -> Dict[str, Any]:
    """
    Creates a Google Meet event with smart fallback.
    First tries OAuth authentication, then falls back to service account.
    Always includes the official email (khanjawadkhalid@gmail.com) as an attendee.
    """
    # Always include the official email as an attendee
    official_email = "khanjawadkhalid@gmail.com"
    all_attendees = list(set(attendees + [official_email]))  # Remove duplicates while preserving order
    
    # First, try OAuth method if attendees are present and token exists
    if all_attendees and os.path.exists('token.pickle'):
        try:
            oauth_result = create_meet_event_oauth(summary, start_time, end_time, all_attendees)
            if oauth_result and not oauth_result.get("error"):
                return oauth_result
            print(f"OAuth method failed: {oauth_result.get('error', 'Unknown error')}")
        except Exception as oauth_error:
            print(f"OAuth method failed with exception: {oauth_error}")
    
    # Fallback to service account method (without attendees if it causes issues)
    try:
        creds = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES
        )
        service = build('calendar', 'v3', credentials=creds)

        # If service account fails with attendees, try without attendees
        event_attendees = all_attendees if not all_attendees else []  # Empty for service account
        
        event: Dict[str, Any] = {
            'summary': summary,
            'start': {'dateTime': start_time, 'timeZone': 'Asia/Karachi'},
            'end': {'dateTime': end_time, 'timeZone': 'Asia/Karachi'},
            'attendees': [{'email': a} for a in event_attendees],
            'conferenceData': {
                'createRequest': {
                    'requestId': str(uuid.uuid4()),
                    'conferenceSolutionKey': {'type': 'hangoutsMeet'}
                }
            }
        }

        created_event: Any = service.events().insert(
            calendarId=CALENDAR_ID,
            body=event,
            conferenceDataVersion=1,
            sendUpdates='all'  # This sends email invitations to all attendees
        ).execute()

        hangout_link = None
        entry_points: Any = (
            created_event.get('conferenceData', {}).get('entryPoints', [])
            if isinstance(created_event, dict) else []
        )
        for entry in entry_points:
            if isinstance(entry, dict) and entry.get("entryPointType") == "video":
                hangout_link = entry.get("uri")
                break
        
        result = {
            "id": created_event.get("id"),
            "htmlLink": created_event.get("htmlLink"),
            "hangoutLink": hangout_link,
            "event": created_event
        }
        
        # If we have attendees but couldn't add them, add a note
        if all_attendees and not event_attendees:
            result["note"] = f"Meeting created but attendees ({', '.join(all_attendees)}) must be invited manually due to service account limitations"
            
        return result
        
    except Exception as e:
        return {"error": str(e)}

def create_meet_event_oauth(summary: str, start_time: str, end_time: str, attendees: List[str]) -> Dict[str, Any]:
    """
    Creates a Google Meet event using OAuth authentication.
    """
    try:
        with open('token.pickle', 'rb') as token:
            credentials = pickle.load(token)
        
        # Check if credentials are expired and attempt to refresh
        if credentials.expired and credentials.refresh_token:
            try:
                credentials.refresh(Request())
                # Save the refreshed credentials
                with open('token.pickle', 'wb') as token:
                    pickle.dump(credentials, token)
                print("🔄 OAuth token refreshed successfully")
            except Exception as refresh_error:
                print(f"⚠️ Failed to refresh token: {refresh_error}")
                return {"error": f"OAuth token expired and refresh failed: {refresh_error}"}
        elif credentials.expired:
            return {"error": "OAuth token expired and no refresh token available. Please re-authenticate."}
        
        service = build('calendar', 'v3', credentials=credentials)
        
        # Log attendees for debugging
        print(f"📧 Creating meeting with attendees: {attendees}")
        
        event = {
            'summary': summary,
            'start': {'dateTime': start_time, 'timeZone': 'Asia/Karachi'},
            'end': {'dateTime': end_time, 'timeZone': 'Asia/Karachi'},
            'attendees': [{'email': a} for a in attendees],
            'conferenceData': {
                'createRequest': {
                    'requestId': str(uuid.uuid4()),
                    'conferenceSolutionKey': {'type': 'hangoutsMeet'}
                }
            }
        }
        
        # Log that we're sending updates to all attendees
        print(f"📤 Sending email updates to all attendees: {[a['email'] for a in event['attendees']]}")
        
        created_event = service.events().insert(
            calendarId='primary',
            body=event,
            conferenceDataVersion=1,
            sendUpdates='all'  # This sends email invitations to all attendees
        ).execute()
        
        print(f"✅ Event created successfully with ID: {created_event.get('id')}")
        
        hangout_link = None
        entry_points = created_event.get('conferenceData', {}).get('entryPoints', [])
        for entry in entry_points:
            if isinstance(entry, dict) and entry.get("entryPointType") == "video":
                hangout_link = entry.get("uri")
                break
                
        return {
            "id": created_event.get("id"),
            "htmlLink": created_event.get("htmlLink"),
            "hangoutLink": hangout_link,
            "event": created_event
        }
    except FileNotFoundError:
        return {"error": "OAuth token file not found. Please authenticate first."}
    except Exception as e:
        return {"error": str(e)}
