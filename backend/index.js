import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promises as fs } from 'fs';
import { getEmpatheticResponse, TOPIC_TREES, MBTI_TEMPLATES } from './ai_handler.js';
import { generateConversationalResponse, handleSNTITestConversation } from './gemini_simple.js';
import { getAllSessions } from './session_manager.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);

// Middleware
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL, // Set this in Railway
    /\.vercel\.app$/, // Allow all Vercel deployments
    /\.railway\.app$/ // Allow Railway preview deployments
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        // Check if origin is allowed
        const isAllowed = allowedOrigins.some(allowed => {
            if (typeof allowed === 'string') return allowed === origin;
            if (allowed instanceof RegExp) return allowed.test(origin);
            return false;
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all in production for now
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// SNTI Questions Database
const mbtiQuestions = {
    1: {
        text: "When you're at a gathering, do you:",
        A: "Feel energized by meeting lots of people",
        B: "Prefer deep conversations with a few close individuals",
        type: "E/I"
    },
    2: {
        text: "After a long day, you prefer to:",
        A: "Go out with friends to recharge",
        B: "Spend quiet time alone to restore energy",
        type: "E/I"
    },
    3: {
        text: "In group projects, you typically:",
        A: "Take the lead and engage with everyone",
        B: "Work independently on your assigned part",
        type: "E/I"
    },
    4: {
        text: "Your ideal weekend includes:",
        A: "Social events and activities with others",
        B: "Personal hobbies and peaceful moments",
        type: "E/I"
    },
    5: {
        text: "When solving problems, you trust more in:",
        A: "Past experience and proven methods",
        B: "Gut feelings and innovative approaches",
        type: "S/N"
    },
    6: {
        text: "You are more interested in:",
        A: "What is real and present",
        B: "What could be possible in the future",
        type: "S/N"
    },
    7: {
        text: "When learning something new, you prefer:",
        A: "Step-by-step practical instructions",
        B: "Understanding the underlying concepts first",
        type: "S/N"
    },
    8: {
        text: "You tend to:",
        A: "Focus on details and specific facts",
        B: "See patterns and make connections",
        type: "S/N"
    },
    9: {
        text: "When making decisions, you primarily consider:",
        A: "Logic and objective analysis",
        B: "Impact on people and harmony",
        type: "T/F"
    },
    10: {
        text: "In conflicts, you tend to:",
        A: "Focus on finding the correct solution",
        B: "Focus on maintaining relationships",
        type: "T/F"
    },
    11: {
        text: "You value more:",
        A: "Truth, even if it might hurt feelings",
        B: "Tact and maintaining harmony",
        type: "T/F"
    },
    12: {
        text: "When giving feedback, you are:",
        A: "Direct and objective",
        B: "Gentle and encouraging",
        type: "T/F"
    },
    13: {
        text: "You prefer to:",
        A: "Have a clear plan and schedule",
        B: "Keep options open and flexible",
        type: "J/P"
    },
    14: {
        text: "Your work style is more:",
        A: "Structured and organized",
        B: "Flexible and adaptable",
        type: "J/P"
    },
    15: {
        text: "You feel better when things are:",
        A: "Planned and decided",
        B: "Open-ended and spontaneous",
        type: "J/P"
    },
    16: {
        text: "In your daily life, you prefer to:",
        A: "Follow a routine",
        B: "Go with the flow",
        type: "J/P"
    }
};

// SNTI Type Descriptions
const mbtiTypes = {
    'ISTJ': {
        name: 'The Inspector',
        description: 'Practical, responsible, and detail-oriented. You have a strong sense of duty and take a methodical approach to life, valuing tradition, order, and competence.',
        strengths: ['Organized', 'Reliable', 'Detail-oriented', 'Practical'],
        growth_areas: ['Being more open to change', 'Expressing emotions', 'Considering long-term possibilities']
    },
    'ISFJ': {
        name: 'The Protector',
        description: 'Caring, loyal, and traditional. You have a deep sense of responsibility to others and work diligently to fulfill your duties while maintaining harmony.',
        strengths: ['Supportive', 'Reliable', 'Patient', 'Detail-oriented'],
        growth_areas: ['Setting boundaries', 'Handling criticism', 'Expressing needs']
    },
    'INFJ': {
        name: 'The Counselor',
        description: 'Insightful, creative, and principled. You have a deep understanding of human nature and work towards making positive changes in the world.',
        strengths: ['Insightful', 'Creative', 'Dedicated', 'Compassionate'],
        growth_areas: ['Being more assertive', 'Sharing feelings', 'Accepting imperfection']
    },
    'INTJ': {
        name: 'The Architect',
        description: 'Strategic, innovative, and logical. You excel at developing systems and strategies, with a focus on continuous improvement and efficiency.',
        strengths: ['Strategic', 'Independent', 'Analytical', 'Determined'],
        growth_areas: ['Emotional expression', 'Social interaction', 'Patience with others']
    },
    'ISTP': {
        name: 'The Craftsperson',
        description: 'Practical, adaptable, and action-oriented. You excel at understanding how things work and finding practical solutions to problems.',
        strengths: ['Adaptable', 'Practical', 'Logical', 'Action-oriented'],
        growth_areas: ['Long-term planning', 'Emotional expression', 'Following routines']
    },
    'ISFP': {
        name: 'The Composer',
        description: 'Artistic, sensitive, and caring. You have a strong aesthetic sense and value authenticity in relationships and personal expression.',
        strengths: ['Creative', 'Sensitive', 'Caring', 'Adaptable'],
        growth_areas: ['Assertiveness', 'Long-term planning', 'Handling criticism']
    },
    'INFP': {
        name: 'The Healer',
        description: 'Idealistic, creative, and empathetic. You seek to understand yourself and others deeply, working towards personal growth and meaningful connections.',
        strengths: ['Empathetic', 'Creative', 'Idealistic', 'Loyal'],
        growth_areas: ['Practical matters', 'Taking criticism', 'Following through']
    },
    'INTP': {
        name: 'The Architect',
        description: 'Analytical, innovative, and objective. You excel at understanding complex systems and developing creative solutions to problems.',
        strengths: ['Analytical', 'Objective', 'Creative', 'Independent'],
        growth_areas: ['Emotional awareness', 'Following through', 'Social interaction']
    },
    'ESTP': {
        name: 'The Dynamo',
        description: 'Energetic, practical, and spontaneous. You excel at problem-solving in the moment and enjoy taking action to get things done.',
        strengths: ['Energetic', 'Practical', 'Adaptable', 'Persuasive'],
        growth_areas: ['Long-term planning', 'Following through', 'Emotional sensitivity']
    },
    'ESFP': {
        name: 'The Performer',
        description: 'Enthusiastic, friendly, and spontaneous. You bring joy to others and excel at making the most of every moment.',
        strengths: ['Enthusiastic', 'Friendly', 'Adaptable', 'Practical'],
        growth_areas: ['Long-term planning', 'Focus', 'Dealing with criticism']
    },
    'ENFP': {
        name: 'The Champion',
        description: 'Enthusiastic, creative, and people-oriented. You see possibilities everywhere and inspire others with your warmth and imagination.',
        strengths: ['Creative', 'Enthusiastic', 'Empathetic', 'Adaptable'],
        growth_areas: ['Following through', 'Focus', 'Practical details']
    },
    'ENTP': {
        name: 'The Visionary',
        description: 'Innovative, strategic, and adaptable. You excel at seeing possibilities and developing new ideas, enjoying intellectual challenges.',
        strengths: ['Innovative', 'Strategic', 'Adaptable', 'Analytical'],
        growth_areas: ['Following through', 'Attention to detail', 'Emotional sensitivity']
    },
    'ESTJ': {
        name: 'The Supervisor',
        description: 'Practical, organized, and decisive. You excel at creating and maintaining order, with a focus on efficiency and results.',
        strengths: ['Organized', 'Practical', 'Decisive', 'Direct'],
        growth_areas: ['Flexibility', 'Emotional sensitivity', 'Considering alternatives']
    },
    'ESFJ': {
        name: 'The Provider',
        description: 'Caring, social, and organized. You excel at creating harmony and meeting others\' needs, with a strong sense of duty.',
        strengths: ['Caring', 'Organized', 'Reliable', 'Cooperative'],
        growth_areas: ['Adapting to change', 'Setting boundaries', 'Independent decision-making']
    },
    'ENFJ': {
        name: 'The Teacher',
        description: 'Charismatic, empathetic, and organized. You excel at inspiring and developing others, with a focus on personal growth.',
        strengths: ['Empathetic', 'Organized', 'Inspiring', 'Supportive'],
        growth_areas: ['Setting boundaries', 'Self-care', 'Handling criticism']
    },
    'ENTJ': {
        name: 'The Commander',
        description: 'Strategic, decisive, and confident. You excel at organizing people and resources to achieve long-term goals.',
        strengths: ['Strategic', 'Decisive', 'Confident', 'Efficient'],
        growth_areas: ['Emotional sensitivity', 'Patience', 'Personal relationships']
    }
};



// Add SNTI TEST psychology chat endpoint with session management
app.post('/api/psychology-chat', async (req, res) => {
    try {
        const { message, conversationHistory = [], userInfo } = req.body;
        
        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Create unique session identifier
        // If userInfo is provided, use email+phone as unique identifier
        // Otherwise, fall back to IP address
        let sessionIdentifier;
        if (userInfo && userInfo.email && userInfo.phone) {
            sessionIdentifier = `${userInfo.email}-${userInfo.phone}`;
        } else {
            sessionIdentifier = req.ip || req.connection.remoteAddress || 'unknown';
        }

        // Use the SNTI TEST conversation handler with user info
        const result = await handleSNTITestConversation(message, sessionIdentifier, userInfo);
        
        res.json({ 
            response: result.response,
            sessionId: result.sessionId,
            userName: result.userName,
            state: result.state,
            mbtiType: result.mbtiType,
            progress: result.progress,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in psychology chat:', error);
        res.status(500).json({ 
            error: 'Failed to get response',
            message: error.message 
        });
    }
});

// Get all active sessions (admin endpoint)
app.get('/api/sessions', async (req, res) => {
    try {
        const sessions = getAllSessions();
        res.json({ 
            sessions: sessions.map(s => ({
                id: s.id,
                name: s.name,
                ipAddress: s.ipAddress,
                state: s.state,
                mbtiType: s.mbtiType,
                createdAt: s.createdAt,
                messageCount: s.conversationHistory.length
            })),
            total: sessions.length
        });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
});

// Submit payment details endpoint
app.post('/api/submit-payment', async (req, res) => {
    try {
        const { name, email, mobile, transactionId, serviceType, personalityType, testResults } = req.body;
        
        // Validate required fields
        if (!name || !email || !mobile || !transactionId || !serviceType || !personalityType) {
            return res.status(400).json({ 
                success: false, 
                error: 'All fields are required' 
            });
        }

        // Validate mobile number format (Pakistani format)
        const mobileRegex = /^03\d{9}$/;
        if (!mobileRegex.test(mobile.replace(/[-\s]/g, ''))) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid mobile number format. Use format: 03XXXXXXXXX' 
            });
        }

        // Create payment record
        const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        const paymentRecord = {
            id: paymentId,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            mobile: mobile.replace(/[-\s]/g, ''), // Remove spaces and dashes
            transactionId: transactionId.trim(),
            serviceType, // 'report' or 'ai-session'
            personalityType,
            testResults: testResults || {},
            amount: 50,
            currency: 'PKR',
            status: 'PENDING',
            submittedAt: new Date().toISOString(),
            verifiedAt: null,
            verifiedBy: null,
            ipAddress: req.ip || req.connection.remoteAddress || 'unknown'
        };

        // Store in database (using JSON file)
        const paymentsFile = path.join(__dirname, 'data', 'payments.json');
        
        let payments = [];
        try {
            const data = await fs.readFile(paymentsFile, 'utf8');
            payments = JSON.parse(data);
        } catch (err) {
            // File doesn't exist yet, will be created
            console.log('Creating new payments.json file');
        }
        
        // Check for duplicate transaction ID
        const existingPayment = payments.find(p => p.transactionId === transactionId);
        if (existingPayment) {
            return res.status(400).json({ 
                success: false, 
                error: 'This transaction ID has already been submitted' 
            });
        }
        
        payments.push(paymentRecord);
        await fs.writeFile(paymentsFile, JSON.stringify(payments, null, 2));

        console.log(`Payment submitted: ${paymentId} - ${name} - ${serviceType}`);

        // TODO: Send confirmation email to user
        // TODO: Send notification to admin

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
            error: 'Failed to submit payment details',
            message: error.message 
        });
    }
});

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Hardcoded admin credentials (secure in production with env variables)
        const ADMIN_EMAIL = 'khanjawadkhalid@gmail.com';
        const ADMIN_PASSWORD = 'LukeSkywalker';
        
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            // Generate simple token (use JWT in production)
            const token = `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            res.json({ 
                success: true, 
                token,
                admin: { email: ADMIN_EMAIL }
            });
            
            console.log(`Admin login successful: ${email}`);
        } else {
            res.status(401).json({ 
                success: false, 
                error: 'Invalid email or password' 
            });
        }
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Login failed',
            message: error.message 
        });
    }
});

// Get all payments (admin endpoint)
app.get('/api/admin/payments', async (req, res) => {
    try {
        const { status } = req.query; // PENDING, VERIFIED, REJECTED, ALL
        
        const paymentsFile = path.join(__dirname, 'data', 'payments.json');
        
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

        res.json({ 
            payments,
            total: payments.length 
        });
    } catch (error) {
        console.error('Failed to fetch payments:', error);
        res.status(500).json({ 
            error: 'Failed to fetch payments',
            message: error.message 
        });
    }
});

// Get all user sessions (admin endpoint)
app.get('/api/admin/sessions', async (req, res) => {
    try {
        const { scope = 'ALL', payment = 'ALL', personality = 'ALL' } = req.query;

        // 1) In-memory sessions
        const liveSessions = getAllSessions();

        // 2) Persisted sessions from filesystem
        const sessionsDir = path.join(__dirname, 'data', 'sessions');
        let fileSessions = [];
        try {
            const files = await fs.readdir(sessionsDir);
            const jsonFiles = files.filter(f => f.endsWith('.json'));
            const reads = await Promise.allSettled(
                jsonFiles.map(f => fs.readFile(path.join(sessionsDir, f), 'utf8'))
            );
            fileSessions = reads
                .filter(r => r.status === 'fulfilled')
                .map(r => {
                    try { return JSON.parse(r.value); } catch { return null; }
                })
                .filter(Boolean);
        } catch (err) {
            // No persisted sessions yet - that's fine
            fileSessions = [];
        }

        // 3) Merge by session id (prefer in-memory for freshest data)
        const sessionMap = new Map();
        fileSessions.forEach(s => { if (s && s.id) sessionMap.set(s.id, s); });
        liveSessions.forEach(s => { if (s && s.id) sessionMap.set(s.id, s); });
        let sessions = Array.from(sessionMap.values());

        // 4) Attach payment status by matching email+phone
        const paymentsFile = path.join(__dirname, 'data', 'payments.json');
        let payments = [];
        try {
            const pData = await fs.readFile(paymentsFile, 'utf8');
            payments = JSON.parse(pData);
        } catch {}

        const findPaymentStatus = (email, phone) => {
            if (!email && !phone) return 'NONE';
            const userPays = payments.filter(p => (
                (email && p.email && p.email.toLowerCase() === email.toLowerCase()) ||
                (phone && p.mobile && p.mobile === phone)
            ));
            if (userPays.some(p => p.status === 'VERIFIED')) return 'VERIFIED';
            if (userPays.some(p => p.status === 'PENDING')) return 'PENDING';
            if (userPays.some(p => p.status === 'REJECTED')) return 'REJECTED';
            return 'NONE';
        };

        // 5) Normalize and enrich
        sessions = sessions.map(s => {
            const ui = s.userInfo || {};
            const paymentStatus = findPaymentStatus(ui.email, ui.phone);
            const totalQ = s.totalQuestions || 20; // Use dynamic total from session
            const progress = s.state === 'TEST_IN_PROGRESS' && Array.isArray(s.answers)
                ? `${Math.min(s.answers.length, totalQ)}/${totalQ}`
                : (s.state === 'TEST_COMPLETE' ? `${totalQ}/${totalQ}` : null);
            return {
                id: s.id,
                identifier: s.identifier || s.ipAddress,
                name: s.name || ui.name || null,
                email: ui.email || null,
                phone: ui.phone || null,
                age: ui.age || null,
                rollNumber: ui.rollNumber || null,
                institution: ui.institution || null,
                state: s.state,
                mbtiType: s.mbtiType || null,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt || s.createdAt,
                paymentStatus,
                progress,
                assessmentVariant: s.assessmentVariant || 'classic',
                language: s.language || 'english'
            };
        });

        // 6) Scope filtering
        if (scope === 'ACTIVE') sessions = sessions.filter(s => s.state !== 'TEST_COMPLETE');
        if (scope === 'COMPLETED') sessions = sessions.filter(s => s.state === 'TEST_COMPLETE');

        // 7) Payment filter
        if (payment !== 'ALL') sessions = sessions.filter(s => s.paymentStatus === payment);

        // 8) Personality type filter (16 MBTI types)
        if (personality !== 'ALL') sessions = sessions.filter(s => s.mbtiType === personality);

        // 9) Sort by updatedAt/createdAt desc
        sessions.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

        res.json({
            sessions,
            total: sessions.length
        });
    } catch (error) {
        console.error('Failed to fetch sessions:', error);
        res.status(500).json({
            error: 'Failed to fetch sessions',
            message: error.message
        });
    }
});

// Verify or reject payment (admin endpoint)
app.post('/api/admin/verify-payment', async (req, res) => {
    try {
        const { paymentId, action, rejectionReason } = req.body;
        
        if (!paymentId || !action) {
            return res.status(400).json({ 
                success: false, 
                error: 'Payment ID and action are required' 
            });
        }

        if (action !== 'APPROVE' && action !== 'REJECT') {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid action. Use APPROVE or REJECT' 
            });
        }

        const paymentsFile = path.join(__dirname, 'data', 'payments.json');
        
        let payments = [];
        try {
            const data = await fs.readFile(paymentsFile, 'utf8');
            payments = JSON.parse(data);
        } catch (err) {
            return res.status(404).json({ 
                success: false, 
                error: 'No payments found' 
            });
        }
        
        const paymentIndex = payments.findIndex(p => p.id === paymentId);
        if (paymentIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                error: 'Payment not found' 
            });
        }

        const payment = payments[paymentIndex];

        if (action === 'APPROVE') {
            payment.status = 'VERIFIED';
            payment.verifiedAt = new Date().toISOString();
            payment.verifiedBy = 'khanjawadkhalid@gmail.com';

            console.log(`✅ Payment APPROVED: ${paymentId} - ${payment.name} - ${payment.serviceType}`);
            
            // TODO: Send confirmation email to user
            // TODO: If AI session, enable AI chat access
            
        } else if (action === 'REJECT') {
            payment.status = 'REJECTED';
            payment.rejectionReason = rejectionReason || 'No reason provided';
            payment.rejectedAt = new Date().toISOString();
            payment.rejectedBy = 'khanjawadkhalid@gmail.com';

            console.log(`❌ Payment REJECTED: ${paymentId} - ${payment.name} - Reason: ${payment.rejectionReason}`);
            
            // TODO: Send rejection email to user
        }

        payments[paymentIndex] = payment;
        await fs.writeFile(paymentsFile, JSON.stringify(payments, null, 2));

        res.json({ 
            success: true, 
            payment,
            message: `Payment ${action === 'APPROVE' ? 'approved' : 'rejected'} successfully`
        });

    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to verify payment',
            message: error.message 
        });
    }
});

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Socket connection handler
io.on("connection", (socket) => {
    console.log("Frontend connected");

    socket.on("disconnect", () => {
        console.log("Frontend disconnected");
    });
});

// Calculate SNTI type from answers
function calculateMBTIType(answers) {
    let E = 0, I = 0, S = 0, N = 0, T = 0, F = 0, J = 0, P = 0;
    
    for (const [id, answer] of Object.entries(answers)) {
        const qid = parseInt(id);
        if (qid <= 4) { // E/I questions
            answer === 'A' ? E++ : I++;
        } else if (qid <= 8) { // S/N questions
            answer === 'A' ? S++ : N++;
        } else if (qid <= 12) { // T/F questions
            answer === 'A' ? T++ : F++;
        } else { // J/P questions
            answer === 'A' ? J++ : P++;
        }
    }
    
    return (E > I ? 'E' : 'I') +
           (S > N ? 'S' : 'N') +
           (T > F ? 'T' : 'F') +
           (J > P ? 'J' : 'P');
}

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

