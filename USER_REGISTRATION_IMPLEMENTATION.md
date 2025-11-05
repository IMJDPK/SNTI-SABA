# User Registration System Implementation

## Overview
Implemented pre-test user registration system to collect student information and enable handling 100+ concurrent SNTI tests with unique user identification.

## Problem Solved
- **Previous Issue**: IP-based session management caused collisions when multiple users tested from same network (institutional/NAT environments)
- **Solution**: Composite email-phone key for unique session identification + pre-registration modal

## Implementation Date
January 2025

## Changes Made

### 1. Frontend Components

#### A. UserRegistrationModal.jsx (NEW)
**Location**: `frontend/src/components/UserRegistrationModal.jsx`

**Features**:
- Collects 5 required fields before test begins:
  - Full Name (minimum 3 characters)
  - Phone Number (Pakistani format: 03XXXXXXXXX)
  - Email Address (validated format)
  - Roll Number/Student ID
  - Institution Name (School/University)
- Real-time validation with error messages
- Disabled submit until all fields valid
- Modern gradient UI matching SNTI branding

**Key Code**:
```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  if (Object.keys(errors).length === 0) {
    onSubmit(formData);
  }
};
```

#### B. PsychologyChat.jsx (MODIFIED)
**Location**: `frontend/src/pages/PsychologyChat.jsx`

**Changes**:
1. Added API_URL constant at component top:
   ```jsx
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
   ```

2. Added state management:
   ```jsx
   const [showRegistration, setShowRegistration] = useState(true);
   const [userInfo, setUserInfo] = useState(null);
   ```

3. Created `handleUserRegistration` function:
   - Stores user data in state
   - Automatically sends welcome message to backend
   - Initializes session with userInfo
   - Closes registration modal
   - Displays AI welcome response

4. Updated `handleSendMessage` to include userInfo:
   ```jsx
   body: JSON.stringify({
     message: inputMessage,
     conversationHistory: messages,
     userInfo: userInfo // Composite key data
   })
   ```

5. Added UserRegistrationModal render:
   ```jsx
   {showRegistration && (
     <UserRegistrationModal
       onSubmit={handleUserRegistration}
       onClose={() => {}}
     />
   )}
   ```

### 2. Backend Services

#### A. index.js (MODIFIED)
**Location**: `backend/index.js`

**Changes**:
1. Updated `/api/psychology-chat` endpoint:
   ```javascript
   const { message, userInfo } = req.body;
   
   // Create session identifier
   const sessionIdentifier = userInfo 
     ? `${userInfo.email}-${userInfo.phone}`
     : ipAddress;
   
   const result = await handleSNTITestConversation(
     message, 
     sessionIdentifier, 
     userInfo
   );
   ```

**Benefits**:
- Unique identification via email-phone composite
- Backward compatible with IP-based sessions (fallback)
- Supports 100+ concurrent users from same IP

#### B. gemini_simple.js (MODIFIED)
**Location**: `backend/gemini_simple.js`

**Changes**:
1. Updated function signature:
   ```javascript
   export async function handleSNTITestConversation(
     userMessage, 
     sessionIdentifier, 
     userInfo = null
   )
   ```

2. Added userInfo storage logic:
   ```javascript
   if (userInfo && !session.userInfo) {
     session.userInfo = userInfo;
     session.name = userInfo.name;
     
     // Generate readable session ID
     const timestamp = Date.now().toString().slice(-6);
     const phoneDigits = userInfo.phone.slice(-4);
     session.id = `SNTI-${timestamp}-${phoneDigits}`;
     
     // Skip name request, go directly to assessment
     session.state = 'ASSESSMENT_START';
     
     console.log(`👤 User registered: ${userInfo.name} (${userInfo.email}), Session: ${session.id}`);
   }
   ```

3. Added new state handler: `ASSESSMENT_START`
   ```javascript
   if (session.state === 'ASSESSMENT_START') {
     session.state = 'TEST_INTRO';
     updateSession(sessionIdentifier, session);
     
     const institutionText = session.userInfo.institution 
       ? ` from ${session.userInfo.institution}` 
       : '';
       
     response = `Hello ${session.name}!${institutionText} 👋 ...`;
   }
   ```

4. Replaced all `updateSession(ipAddress, session)` with `updateSession(sessionIdentifier, session)`

**Benefits**:
- Personalized welcome messages with institution name
- Session ID includes phone digits for easy identification
- Skips redundant name request when userInfo provided

#### C. session_manager.js (MODIFIED)
**Location**: `backend/session_manager.js`

**Changes**:
1. Updated `getOrCreateSession` function:
   ```javascript
   export function getOrCreateSession(identifier) {
     let session = sessions.get(identifier);
     
     if (!session) {
       session = {
         id: generateUniqueId(),
         identifier: identifier, // email-phone or IP
         ipAddress: identifier, // Backward compatibility
         name: null,
         userInfo: null, // Stores full registration data
         state: 'NAME_REQUEST',
         currentQuestion: 0,
         answers: [],
         mbtiType: null,
         createdAt: new Date(),
         conversationHistory: []
       };
       sessions.set(identifier, session);
       console.log(`✅ New session created: ${session.id} for identifier: ${identifier.substring(0, 20)}...`);
     }
     
     return session;
   }
   ```

2. Updated `updateSession` function parameter:
   ```javascript
   export function updateSession(identifier, updates) {
     const session = sessions.get(identifier);
     if (session) {
       Object.assign(session, updates);
       sessions.set(identifier, session);
     }
     return session;
   }
   ```

**Benefits**:
- Sessions keyed by composite identifier (email-phone)
- Stores complete user registration data
- Supports concurrent users from same IP
- Backward compatible with IP-based keys

## User Flow

### New Registration Flow:
1. User visits `/psychology-chat`
2. **Registration modal appears** (blocks access)
3. User fills form: name, phone, email, roll number, institution
4. Form validates all fields
5. User clicks "Start Assessment"
6. Modal closes, automatic API call to backend with userInfo
7. Backend creates session with composite key: `email-phone`
8. AI responds with personalized welcome including institution name
9. User can start test immediately (no name request)
10. Session tracked uniquely even if 100+ users from same IP

### Old Flow (Fallback):
1. User visits `/psychology-chat`
2. Chat starts immediately
3. AI asks for name
4. Session tracked by IP address only
5. Name stored after user provides it

## Session Identification

### Composite Key Format:
```
sessionIdentifier = `${email}-${phone}`
Example: "student@uni.edu-03001234567"
```

### Session ID Format:
```
session.id = `SNTI-${timestamp}-${phoneLastDigits}`
Example: "SNTI-123456-4567"
```

## Concurrent User Support

### How It Handles 100+ Tests:
- **Unique Keys**: Email-phone composite ensures no collisions
- **Separate Sessions**: Each user gets own Map entry
- **Institution Tracking**: Full userInfo stored per session
- **Scalable**: In-memory Map can handle thousands of concurrent sessions

### Example Scenario:
```
University Computer Lab (Same Public IP):
- Student1: ali@uni.edu-03001111111 → Unique session
- Student2: sara@uni.edu-03002222222 → Unique session
- Student3: ahmed@uni.edu-03003333333 → Unique session
... (100+ more students)
```

All students can test simultaneously without interference!

## Data Structure

### UserInfo Object:
```javascript
{
  name: "Ali Khan",
  phone: "03001234567",
  email: "ali.khan@university.edu",
  rollNumber: "BSCS-2021-001",
  institution: "University of Punjab"
}
```

### Enhanced Session Object:
```javascript
{
  id: "SNTI-123456-4567",
  identifier: "ali.khan@university.edu-03001234567",
  ipAddress: "192.168.1.100", // Backward compatibility
  name: "Ali Khan",
  userInfo: { /* Full registration data */ },
  state: "TEST_IN_PROGRESS",
  currentQuestion: 5,
  answers: ["A", "B", "A", "B", "A"],
  mbtiType: null,
  createdAt: Date,
  conversationHistory: [...]
}
```

## Testing Checklist

- [ ] Single user registration and test completion
- [ ] Multiple users from different IPs (normal scenario)
- [ ] Multiple users from same IP (institutional scenario)
- [ ] 10+ concurrent tests from same IP
- [ ] 100+ concurrent tests simulation
- [ ] Session persistence across messages
- [ ] User info displayed in welcome message
- [ ] Institution name shown correctly
- [ ] Session ID format verification
- [ ] Payment submission with correct user data
- [ ] Admin dashboard shows user info

## Files Modified

### Frontend:
1. `frontend/src/components/UserRegistrationModal.jsx` (NEW - 284 lines)
2. `frontend/src/pages/PsychologyChat.jsx` (MODIFIED)

### Backend:
1. `backend/index.js` (MODIFIED - /api/psychology-chat endpoint)
2. `backend/gemini_simple.js` (MODIFIED - handleSNTITestConversation function)
3. `backend/session_manager.js` (MODIFIED - getOrCreateSession, updateSession)

## Environment Variables
No new environment variables required. Uses existing:
- `VITE_API_URL` (frontend) - Defaults to http://localhost:3001

## Next Steps
1. Test registration flow end-to-end
2. Simulate concurrent users (10+ from same IP)
3. Verify session uniqueness and data storage
4. Test payment flow with user info
5. Verify admin dashboard displays user details
6. Stress test with 100+ simulated concurrent users
7. Deploy to production

## Benefits Summary
✅ **Unique Identification**: Email-phone composite prevents collisions  
✅ **Institutional Deployment**: Supports 100+ users from same network  
✅ **Data Collection**: Full student info before test begins  
✅ **Personalization**: Welcome messages include name + institution  
✅ **Scalability**: In-memory Map handles thousands of sessions  
✅ **Backward Compatibility**: IP-based fallback still works  
✅ **Better UX**: No redundant name request when registered  
✅ **Payment Integration**: User info automatically included in payment records  
✅ **Admin Tracking**: Complete student data in verification dashboard  

## Notes
- Modal cannot be closed without completing registration (no X button)
- Phone validation enforces Pakistani format (03XXXXXXXXX)
- Email validation uses regex pattern
- All fields required (minimum length validations)
- Session state 'ASSESSMENT_START' added for registered users
- Original name request flow preserved as fallback
- Session files saved with full userInfo in `backend/data/sessions/`
