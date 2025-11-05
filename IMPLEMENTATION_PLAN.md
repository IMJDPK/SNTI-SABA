# SNTI Assessment - Implementation Plan
**Status**: Ready for Development  
**Launch Date**: After Complete Testing  
**Updated**: November 5, 2025

---

## 🎯 Business Model (Confirmed)

### Free Service
- ✅ Complete 20-question SNTI assessment
- ✅ Personality type result (e.g., INFJ)
- ✅ Basic personality information
- ✅ Limited insights (just enough to entice payment)

### Paid Services (PKR 50 each)

#### Service 1: Detailed Personality Report
- **Price**: PKR 50 (one-time)
- **Delivery**: Email (manually sent by your team)
- **Includes**:
  - Comprehensive personality analysis
  - Strengths and growth areas
  - Career recommendations
  - Relationship insights
  - Personalized advice

#### Service 2: AI Psychologist Consultation
- **Price**: PKR 50 per session
- **Limitation**: 4 questions per session
- **Access**: After payment verification
- **Features**:
  - Chat with Gemini AI psychologist
  - Personalized guidance based on personality type
  - Question counter displayed (4/4 remaining)
  - Session ends after 4 questions answered

---

## 💳 Payment Configuration

### JazzCash Business Account
- **Static QR Code**: Pre-configured to charge exactly PKR 50
- **Payment Method**: User scans QR → pays PKR 50 → submits transaction ID
- **No API Integration**: Manual verification initially

### Payment Flow
```
User completes free test
    ↓
Sees basic results + payment options:
   [Get Detailed Report - PKR 50]
   [Consult AI Psychologist - PKR 50]
    ↓
Clicks either button
    ↓
Payment modal appears:
   - Display JazzCash QR code (stored in assets)
   - Instructions: "Scan & Pay PKR 50"
   - Form fields:
     * Name: _________
     * Email: _________
     * Mobile: _________
     * Transaction ID: _________
     * Service Type: [Detailed Report] OR [AI Consultation]
    ↓
User submits payment details
    ↓
System creates PENDING record
    ↓
Admin (khanjawadkhalid@gmail.com) receives notification
    ↓
Admin verifies on JazzCash dashboard
    ↓
Admin approves in system
    ↓
IF Detailed Report:
   - User receives email notification
   - Your team manually sends detailed report
   - Mark as DELIVERED in system

IF AI Consultation:
   - User receives SMS/Email with access link
   - User can login and start AI chat
   - Question counter: 4 remaining
   - After 4 questions, session ends
   - Message: "Session complete. Purchase another session for PKR 50"
```

---

## 👤 Admin Configuration

### Admin Credentials (Pre-configured)
```
Email: khanjawadkhalid@gmail.com
Password: LukeSkywalker
Role: Super Admin
```

### Admin Access
- Login URL: `https://snti.imjd.asia/admin`
- Dashboard features:
  - Pending payments list
  - Approve/Reject payments
  - Mark detailed reports as sent
  - View user analytics
  - AI session monitoring

---

## 🏗️ Technical Implementation

### Phase 1: Free Assessment (Already Exists)
**Status**: ✅ Complete (needs minor updates)

**Current Flow**:
- User visits Psychology Chat page
- Takes 20-question SNTI test
- Receives personality type result

**Required Updates**:
- Modify results page to show LIMITED information
- Add two payment CTAs: "Get Detailed Report" and "Consult AI Psychologist"
- Store test results temporarily (24 hours) without user data

---

### Phase 2: Payment System (NEW)

#### 2.1 Payment Modal Component
**File**: `frontend/src/components/PaymentModal.jsx`

```jsx
import React, { useState } from 'react';
import JazzCashQR from '../assets/jazzcash-qr.png'; // Your QR code image

const PaymentModal = ({ 
  serviceType, // 'report' or 'ai-session'
  personalityType,
  onClose,
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    transactionId: '',
    serviceType: serviceType
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">
          {serviceType === 'report' ? 'Get Your Detailed Report' : 'Consult AI Psychologist'}
        </h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Your Personality Type: <strong>{personalityType}</strong>
          </p>
          <p className="text-lg font-semibold text-blue-600">Price: PKR 50</p>
        </div>

        {/* JazzCash QR Code */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6 text-center">
          <p className="font-semibold mb-3">Step 1: Scan & Pay PKR 50</p>
          <img 
            src={JazzCashQR} 
            alt="JazzCash QR Code" 
            className="mx-auto h-48 w-48"
          />
          <p className="text-sm text-gray-500 mt-2">
            Scan with JazzCash app to pay exactly PKR 50
          </p>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="font-semibold mb-2">Step 2: Submit Payment Details</p>
          
          <input
            type="text"
            placeholder="Your Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          
          <input
            type="tel"
            placeholder="Mobile Number (03XX-XXXXXXX)"
            value={formData.mobile}
            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          
          <input
            type="text"
            placeholder="JazzCash Transaction ID"
            value={formData.transactionId}
            onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Payment Details
            </button>
          </div>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Your payment will be verified within 24 hours. You'll receive a confirmation email.
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;
```

#### 2.2 Update Results Page
**File**: `frontend/src/pages/PsychologyChat.jsx`

Add after test completion:

```jsx
// Limited free results
<div className="bg-white p-6 rounded-lg shadow-lg">
  <h2 className="text-2xl font-bold mb-4">Your Personality Type</h2>
  <div className="text-center mb-6">
    <p className="text-4xl font-bold text-blue-600">{personalityType}</p>
    <p className="text-lg text-gray-600 mt-2">{typeInfo.name}</p>
  </div>

  {/* Limited Information */}
  <div className="mb-6">
    <h3 className="font-semibold mb-2">Basic Overview</h3>
    <p className="text-gray-600">{typeInfo.shortDescription}</p>
  </div>

  {/* Payment CTAs */}
  <div className="grid md:grid-cols-2 gap-4 mt-8">
    <div className="border border-blue-200 rounded-lg p-6 hover:shadow-lg transition">
      <h4 className="font-bold text-lg mb-2">📄 Detailed Report</h4>
      <p className="text-gray-600 text-sm mb-4">
        Get comprehensive analysis, career insights, and personalized advice
      </p>
      <p className="text-2xl font-bold text-blue-600 mb-4">PKR 50</p>
      <button
        onClick={() => setShowPaymentModal('report')}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Get Detailed Report
      </button>
    </div>

    <div className="border border-green-200 rounded-lg p-6 hover:shadow-lg transition">
      <h4 className="font-bold text-lg mb-2">🤖 AI Psychologist</h4>
      <p className="text-gray-600 text-sm mb-4">
        Ask 4 questions to our AI psychologist about your personality
      </p>
      <p className="text-2xl font-bold text-green-600 mb-4">PKR 50</p>
      <button
        onClick={() => setShowPaymentModal('ai-session')}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
      >
        Consult AI Psychologist
      </button>
    </div>
  </div>
</div>

{/* Payment Modal */}
{showPaymentModal && (
  <PaymentModal
    serviceType={showPaymentModal}
    personalityType={personalityType}
    onClose={() => setShowPaymentModal(null)}
    onSubmit={handlePaymentSubmit}
  />
)}
```

#### 2.3 Backend Payment Endpoint
**File**: `backend/index.js`

```javascript
// Submit payment details
app.post('/api/submit-payment', async (req, res) => {
    try {
        const { name, email, mobile, transactionId, serviceType, personalityType } = req.body;
        
        // Validate required fields
        if (!name || !email || !mobile || !transactionId || !serviceType) {
            return res.status(400).json({ 
                success: false, 
                error: 'All fields are required' 
            });
        }

        // Create payment record
        const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const paymentRecord = {
            id: paymentId,
            name,
            email,
            mobile,
            transactionId,
            serviceType, // 'report' or 'ai-session'
            personalityType,
            amount: 50,
            currency: 'PKR',
            status: 'PENDING',
            submittedAt: new Date().toISOString(),
            verifiedAt: null,
            verifiedBy: null
        };

        // Store in database (using JSON file for now)
        const fs = require('fs').promises;
        const paymentsFile = './data/payments.json';
        
        let payments = [];
        try {
            const data = await fs.readFile(paymentsFile, 'utf8');
            payments = JSON.parse(data);
        } catch (err) {
            // File doesn't exist yet
        }
        
        payments.push(paymentRecord);
        await fs.writeFile(paymentsFile, JSON.stringify(payments, null, 2));

        // Send confirmation email (optional)
        // sendEmail(email, 'Payment Received', '...');

        res.json({
            success: true,
            message: 'Payment details submitted successfully',
            paymentId,
            estimatedVerificationTime: '24 hours'
        });

    } catch (error) {
        console.error('Payment submission error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to submit payment details' 
        });
    }
});
```

---

### Phase 3: Admin Panel (NEW)

#### 3.1 Admin Login Page
**File**: `frontend/src/pages/AdminLogin.jsx`

```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">SNTI Admin Login</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
```

#### 3.2 Admin Dashboard
**File**: `frontend/src/pages/AdminDashboard.jsx`

```jsx
import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [filter, setFilter] = useState('PENDING'); // PENDING, VERIFIED, REJECTED, ALL

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    const response = await fetch(`/api/admin/payments?status=${filter}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    const data = await response.json();
    setPendingPayments(data.payments);
  };

  const handleApprove = async (paymentId) => {
    await fetch('/api/admin/verify-payment', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ paymentId, action: 'APPROVE' })
    });
    fetchPayments(); // Refresh list
  };

  const handleReject = async (paymentId, reason) => {
    await fetch('/api/admin/verify-payment', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ paymentId, action: 'REJECT', rejectionReason: reason })
    });
    fetchPayments();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">SNTI Admin Dashboard</h1>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          {['PENDING', 'VERIFIED', 'REJECTED', 'ALL'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg ${
                filter === status 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingPayments.map(payment => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.mobile}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                    {payment.transactionId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.serviceType === 'report' ? '📄 Report' : '🤖 AI Session'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">PKR {payment.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      payment.status === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(payment.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Rejection reason:');
                            if (reason) handleReject(payment.id, reason);
                          }}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
```

#### 3.3 Admin Backend Endpoints
**File**: `backend/index.js`

```javascript
// Admin login
app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Hardcoded admin credentials (you can move to env later)
    const ADMIN_EMAIL = 'khanjawadkhalid@gmail.com';
    const ADMIN_PASSWORD = 'LukeSkywalker';
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const token = 'admin-token-' + Date.now(); // Simple token for now
        res.json({ 
            success: true, 
            token,
            admin: { email: ADMIN_EMAIL }
        });
    } else {
        res.status(401).json({ 
            success: false, 
            error: 'Invalid credentials' 
        });
    }
});

// Get payments (with filter)
app.get('/api/admin/payments', async (req, res) => {
    try {
        const { status } = req.query; // PENDING, VERIFIED, REJECTED, ALL
        
        const fs = require('fs').promises;
        const paymentsFile = './data/payments.json';
        
        let payments = [];
        try {
            const data = await fs.readFile(paymentsFile, 'utf8');
            payments = JSON.parse(data);
        } catch (err) {
            return res.json({ payments: [] });
        }

        // Filter by status
        if (status && status !== 'ALL') {
            payments = payments.filter(p => p.status === status);
        }

        // Sort by submission date (newest first)
        payments.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

        res.json({ payments });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

// Verify/Reject payment
app.post('/api/admin/verify-payment', async (req, res) => {
    try {
        const { paymentId, action, rejectionReason } = req.body;
        
        const fs = require('fs').promises;
        const paymentsFile = './data/payments.json';
        
        let payments = JSON.parse(await fs.readFile(paymentsFile, 'utf8'));
        
        const paymentIndex = payments.findIndex(p => p.id === paymentId);
        if (paymentIndex === -1) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        if (action === 'APPROVE') {
            payments[paymentIndex].status = 'VERIFIED';
            payments[paymentIndex].verifiedAt = new Date().toISOString();
            payments[paymentIndex].verifiedBy = 'khanjawadkhalid@gmail.com';

            // TODO: Send notification email to user
            // TODO: If AI session, enable AI chat access
            
        } else if (action === 'REJECT') {
            payments[paymentIndex].status = 'REJECTED';
            payments[paymentIndex].rejectionReason = rejectionReason;
        }

        await fs.writeFile(paymentsFile, JSON.stringify(payments, null, 2));

        res.json({ 
            success: true, 
            payment: payments[paymentIndex] 
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to verify payment' });
    }
});
```

---

### Phase 4: AI Consultation System (NEW)

#### 4.1 AI Session Component
**File**: `frontend/src/pages/AIConsultation.jsx`

```jsx
import React, { useState, useEffect } from 'react';

const AIConsultation = ({ sessionId, personalityType }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [questionsRemaining, setQuestionsRemaining] = useState(4);
  const [sessionActive, setSessionActive] = useState(true);

  const sendMessage = async () => {
    if (!input.trim() || questionsRemaining === 0) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');

    // Send to AI
    const response = await fetch('/api/ai-consultation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        message: input,
        personalityType
      })
    });

    const data = await response.json();
    
    setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    setQuestionsRemaining(data.questionsRemaining);
    
    if (data.questionsRemaining === 0) {
      setSessionActive(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">AI Psychologist Consultation</h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">Your Personality</p>
            <p className="font-bold text-blue-600">{personalityType}</p>
          </div>
        </div>

        {/* Questions Counter */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Questions Remaining:</span>
            <span className="text-2xl font-bold text-blue-600">{questionsRemaining}/4</span>
          </div>
          {questionsRemaining === 0 && (
            <p className="text-sm text-gray-600 mt-2">
              Session complete. <a href="#" className="text-blue-600 underline">Purchase another session for PKR 50</a>
            </p>
          )}
        </div>

        {/* Chat Messages */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md p-4 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        {sessionActive && (
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask your question..."
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIConsultation;
```

#### 4.2 AI Consultation Backend
**File**: `backend/index.js`

```javascript
// AI consultation endpoint (protected by payment verification)
app.post('/api/ai-consultation', async (req, res) => {
    try {
        const { sessionId, message, personalityType } = req.body;
        
        // Load session data
        const fs = require('fs').promises;
        const sessionsFile = './data/ai-sessions.json';
        
        let sessions = {};
        try {
            const data = await fs.readFile(sessionsFile, 'utf8');
            sessions = JSON.parse(data);
        } catch (err) {
            // File doesn't exist yet
        }

        if (!sessions[sessionId]) {
            // New session
            sessions[sessionId] = {
                personalityType,
                questionsAsked: 0,
                maxQuestions: 4,
                messages: [],
                createdAt: new Date().toISOString()
            };
        }

        const session = sessions[sessionId];

        // Check if session is still active
        if (session.questionsAsked >= session.maxQuestions) {
            return res.status(403).json({
                success: false,
                error: 'Session limit reached. Purchase another session.'
            });
        }

        // Add user message
        session.messages.push({ role: 'user', content: message });
        session.questionsAsked++;

        // Call Gemini AI
        const systemPrompt = `You are an empathetic AI psychologist. 
The user has ${personalityType} personality type.
Provide personalized psychological guidance based on their personality.
Keep responses concise (2-3 paragraphs).`;

        const model = genAI.getGenerativeModel({ 
            model: GEMINI_MODEL,
            systemInstruction: systemPrompt
        });

        const chat = model.startChat({
            history: session.messages.slice(0, -1).map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
            }))
        });

        const result = await chat.sendMessage(message);
        const aiReply = result.response.text();

        // Add AI response
        session.messages.push({ role: 'assistant', content: aiReply });

        // Save session
        sessions[sessionId] = session;
        await fs.writeFile(sessionsFile, JSON.stringify(sessions, null, 2));

        res.json({
            success: true,
            reply: aiReply,
            questionsRemaining: session.maxQuestions - session.questionsAsked
        });

    } catch (error) {
        console.error('AI consultation error:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
});
```

---

## 📝 File Structure After Implementation

```
SNTI-SABA/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── jazzcash-qr.png          # NEW: Your JazzCash QR code
│   │   │   ├── saba-logo.png
│   │   │   ├── gemini-logo.png
│   │   │   └── imjd-logo.png
│   │   ├── components/
│   │   │   └── PaymentModal.jsx         # NEW
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # Existing
│   │   │   ├── PsychologyChat.jsx       # UPDATE: Add payment CTAs
│   │   │   ├── MBTIAssessment.jsx       # Existing
│   │   │   ├── AdminLogin.jsx           # NEW
│   │   │   ├── AdminDashboard.jsx       # NEW
│   │   │   └── AIConsultation.jsx       # NEW
│   │   └── App.jsx                      # UPDATE: Add new routes
├── backend/
│   ├── index.js                         # UPDATE: Add payment endpoints
│   ├── data/
│   │   ├── payments.json                # NEW: Payment records
│   │   └── ai-sessions.json             # NEW: AI consultation sessions
└── IMPLEMENTATION_PLAN.md               # This file
```

---

## ✅ Implementation Checklist

### Step 1: Setup (Day 1)
- [ ] Add JazzCash QR code image to `frontend/src/assets/jazzcash-qr.png`
- [ ] Create `backend/data/` directory
- [ ] Create empty `payments.json` and `ai-sessions.json` files
- [ ] Install any missing dependencies

### Step 2: Payment System (Day 2-3)
- [ ] Create `PaymentModal.jsx` component
- [ ] Update `PsychologyChat.jsx` with payment CTAs
- [ ] Implement `/api/submit-payment` endpoint
- [ ] Test payment submission flow
- [ ] Verify data is stored correctly

### Step 3: Admin Panel (Day 4-5)
- [ ] Create `AdminLogin.jsx` page
- [ ] Create `AdminDashboard.jsx` page
- [ ] Implement admin authentication endpoints
- [ ] Implement payment verification endpoints
- [ ] Test approve/reject flow
- [ ] Add routes to `App.jsx`

### Step 4: AI Consultation (Day 6-7)
- [ ] Create `AIConsultation.jsx` component
- [ ] Implement `/api/ai-consultation` endpoint
- [ ] Add question counter logic
- [ ] Test 4-question limit
- [ ] Integrate with payment verification

### Step 5: Testing (Day 8-9)
- [ ] Test complete free assessment flow
- [ ] Test detailed report payment submission
- [ ] Test AI consultation payment submission
- [ ] Test admin login and approval
- [ ] Test AI session with 4-question limit
- [ ] Test edge cases (duplicate payments, invalid data)

### Step 6: Production Prep (Day 10)
- [ ] Add proper error handling
- [ ] Add loading states
- [ ] Add success/error notifications
- [ ] Setup email notifications (optional)
- [ ] Backup data files
- [ ] Deploy to production server

---

## 🚀 Quick Start Commands

### 1. Add JazzCash QR Code
```bash
# Place your QR code image in:
cp /path/to/your/jazzcash-qr.png frontend/src/assets/jazzcash-qr.png
```

### 2. Create Data Directories
```bash
mkdir -p backend/data
echo "[]" > backend/data/payments.json
echo "{}" > backend/data/ai-sessions.json
```

### 3. Start Development
```bash
# Terminal 1: Frontend
cd frontend
npm run dev

# Terminal 2: Backend
cd backend
npm start
```

### 4. Access Points
- **Website**: http://localhost:5174
- **Admin Login**: http://localhost:5174/admin
- **Backend API**: http://localhost:3001

---

## 📧 Email Templates

### Payment Received Confirmation
**Subject**: SNTI Payment Received - Verification Pending

```
Dear [Name],

Thank you for your payment of PKR 50 for [Service Type].

Transaction ID: [Transaction ID]
Service: [Detailed Report / AI Consultation]
Personality Type: [Type]

Your payment is being verified. You'll receive confirmation within 24 hours.

Best regards,
SNTI Team by SULNAQ x IMJD
```

### Payment Verified - Detailed Report
**Subject**: SNTI Payment Verified - Report Being Prepared

```
Dear [Name],

✅ Your payment has been verified!

Transaction ID: [Transaction ID]
Amount: PKR 50
Service: Detailed Personality Report

Your comprehensive [Personality Type] report is being prepared by our team.
You'll receive it via email within 24-48 hours.

Best regards,
SNTI Team
```

### Payment Verified - AI Session
**Subject**: SNTI Payment Verified - AI Consultation Ready

```
Dear [Name],

✅ Your payment has been verified!

Transaction ID: [Transaction ID]
Amount: PKR 50
Service: AI Psychologist Consultation (4 Questions)

Your AI consultation session is now active.

Access your session here:
https://snti.imjd.asia/ai-consultation/[SESSION_ID]

You can ask 4 questions to our AI psychologist about your [Personality Type] personality.

Best regards,
SNTI Team
```

---

## 🎯 Success Criteria

### Phase 1 Success
- ✅ User can complete free assessment and see basic results
- ✅ Payment modal displays correctly with QR code
- ✅ Payment submission creates PENDING record
- ✅ Admin can login and see pending payments

### Phase 2 Success
- ✅ Admin can approve/reject payments
- ✅ User receives email notifications
- ✅ Approved detailed report payments are trackable
- ✅ Approved AI session payments activate consultation access

### Phase 3 Success (AI Consultation)
- ✅ User can access AI consultation after payment verification
- ✅ Question counter works correctly (4/4 → 3/4 → ... → 0/4)
- ✅ Session ends after 4 questions
- ✅ User is prompted to purchase another session

### Production Ready
- ✅ All flows tested end-to-end
- ✅ Error handling in place
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Admin can manage all payments
- ✅ Data is properly backed up

---

## 📞 Support & Next Steps

Once you review this plan, I can start implementing:

1. **First**: Create the PaymentModal component
2. **Second**: Update PsychologyChat results page
3. **Third**: Setup backend payment endpoints
4. **Fourth**: Build admin panel
5. **Fifth**: Implement AI consultation system

Let me know if you want me to start building now, or if you need any clarifications! 🚀

**Admin Credentials (Pre-configured)**:
- Email: khanjawadkhalid@gmail.com
- Password: LukeSkywalker

Ready to proceed?
