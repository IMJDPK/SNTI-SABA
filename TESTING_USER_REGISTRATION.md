# Testing User Registration System

## Quick Test Guide

### Test 1: Single User Registration
1. Start backend: `cd backend && npm start`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:5174/psychology-chat
4. Verify registration modal appears
5. Fill all fields:
   - Name: "Test Student"
   - Phone: "03001234567"
   - Email: "test@university.edu"
   - Roll Number: "TEST-001"
   - Institution: "Test University"
6. Click "Start Assessment"
7. Verify:
   - Modal closes
   - Welcome message appears with name and institution
   - Session ID format: SNTI-XXXXXX-4567
   - Ready to start message appears
8. Type "START" and verify test begins

### Test 2: Multiple Concurrent Users (Same IP)
Simulate institutional deployment:

```bash
# Terminal 1 - Start backend
cd backend && npm start

# Terminal 2 - Start frontend
cd frontend && npm run dev

# Use multiple browser profiles or incognito windows
# Each should register with different email-phone combinations

Window 1: student1@uni.edu / 03001111111
Window 2: student2@uni.edu / 03002222222
Window 3: student3@uni.edu / 03003333333

# Verify each gets unique session
# All should be able to progress independently
```

### Test 3: Session Persistence
1. Register and start test
2. Answer 5 questions
3. Close browser tab
4. Reopen same URL
5. Verify: Registration modal appears again (session lost - expected for new visit)
6. To test persistence: Keep tab open and continue answering

### Test 4: Complete Flow with Payment
1. Register with valid info
2. Complete all 20 questions
3. Verify MBTI result appears
4. Click payment CTA (Report or AI Session)
5. Verify payment modal pre-fills user info
6. Submit payment with transaction ID
7. Check admin dashboard for entry with correct user details

### Test 5: Validation Checks
Try registering with invalid data:

**Invalid Phone**:
- "1234567890" (not starting with 03)
- "03001234" (too short)
- "abcdefghijk" (letters)

**Invalid Email**:
- "notanemail"
- "test@"
- "@domain.com"

**Empty Fields**:
- Leave name blank
- Leave institution blank
- Submit button should be disabled

### Test 6: Backend Session Verification
```bash
# Check backend console for logs
cd backend && npm start

# Look for:
# ✅ New session created: SNTI-XXXXXX-YYYY for identifier: email@domain.com-03XXXXXXXXX...
# 👤 User registered: NAME (email@domain.com), Session: SNTI-XXXXXX-YYYY
```

### Test 7: Admin Dashboard Integration
1. Complete test and submit payment
2. Login to admin: http://localhost:5174/admin
   - Email: khanjawadkhalid@gmail.com
   - Password: LukeSkywalker
3. Verify payment entry shows:
   - User name
   - Email
   - Phone number
   - Roll number (if shown)
   - Institution (if shown)
   - Personality type

### Debugging Tips

**Modal Not Appearing**:
- Check console for errors
- Verify `showRegistration` state is true
- Check UserRegistrationModal import

**Session Not Creating**:
- Verify backend is running on port 3001
- Check backend console for errors
- Verify API_URL in frontend matches backend port

**Duplicate Sessions**:
- Each email-phone combo should create ONE session
- Check backend console for session identifier logs
- Verify Map keys are composite strings

**Welcome Message Not Personalized**:
- Check if userInfo is passed in API call
- Verify handleUserRegistration sends automatic message
- Check backend receives userInfo in request body

**Test Not Starting**:
- Verify state transitions: NAME_REQUEST → ASSESSMENT_START → TEST_INTRO → TEST_IN_PROGRESS
- Check backend logs for state changes
- Ensure "START" triggers TEST_IN_PROGRESS state

### Performance Testing

**Simulate 10 Concurrent Users**:
```bash
# Use tools like Apache Bench or create simple script
# Or manually open 10 browser windows with different profiles

# Each window:
1. Different email-phone combo
2. Complete registration
3. Start answering questions
4. Monitor backend memory usage
```

**Check Session Memory**:
```javascript
// Add to backend/session_manager.js for debugging
console.log(`📊 Active sessions: ${sessions.size}`);
```

### Expected Results

✅ **Registration**: Modal blocks access until complete  
✅ **Validation**: Real-time error messages for invalid fields  
✅ **Personalization**: Welcome includes name + institution  
✅ **Session ID**: Format SNTI-timestamp-phoneDigits  
✅ **Concurrent Users**: Multiple users from same IP get unique sessions  
✅ **Payment Integration**: User info carries through to payment records  
✅ **Admin View**: Complete user details visible in dashboard  
✅ **No Collisions**: 100+ users can test simultaneously  

### Troubleshooting

**Error: 'API_URL' is not defined**
- Fixed in latest code (defined at top of PsychologyChat.jsx)

**Error: Cannot read property 'name' of null**
- Ensure userInfo is set before accessing properties
- Check handleUserRegistration is called properly

**Sessions Mixing Between Users**
- Verify email-phone composite key is unique
- Check backend logs for session identifier format
- Ensure sessions Map uses string keys correctly

**Backend Not Receiving userInfo**
- Check frontend sends userInfo in request body
- Verify Content-Type header is 'application/json'
- Check backend endpoint destructures userInfo correctly

### Success Criteria

Test is successful when:
1. ✅ Registration modal appears on first visit
2. ✅ All validation rules work correctly
3. ✅ Welcome message is personalized
4. ✅ Session ID is unique and readable
5. ✅ Multiple users can test from same IP
6. ✅ Each user has independent session
7. ✅ Test progresses without interference
8. ✅ Payment submission includes user info
9. ✅ Admin dashboard displays user details
10. ✅ No console errors during flow

### File Checklist

Before testing, verify these files exist and have no errors:

```bash
# Frontend
frontend/src/components/UserRegistrationModal.jsx ✅
frontend/src/pages/PsychologyChat.jsx ✅
frontend/src/App.jsx ✅

# Backend
backend/index.js ✅
backend/gemini_simple.js ✅
backend/session_manager.js ✅
backend/data/ (directory exists) ✅
backend/data/payments.json ✅
backend/data/ai-sessions.json ✅
```

Run `npm run lint` in both directories to check for errors.
