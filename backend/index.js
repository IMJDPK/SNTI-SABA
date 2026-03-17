import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promises as fs } from 'fs';
import { getEmpatheticResponse, TOPIC_TREES, MBTI_TEMPLATES } from './ai_handler.js';
import { generateConversationalResponse, generateTypeAwareGuidanceResponse, evaluateBehaviorRisk, handleSNTITestConversation } from './gemini_simple.js';
import { getAllSessions, getOrCreateSession, updateSession } from './session_manager.js';
import dotenv from 'dotenv';
import { createUser, verifyUser, getAllUsers, upsertGoogleUser, saveUserAssessmentResult, getLatestAssessmentByEmail, findUserByEmail, updateUserProfile } from './users_store.js';
import { getMetrics, incrementCounter, setTotalUsers } from './metrics_store.js';
import { generateJwt, requireAdmin, requireAuth, verifyJwt } from './auth_middleware.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);

// Load environment variables
dotenv.config();
const isBypassEnabled = process.env.NODE_ENV !== 'production' && process.env.DISABLE_AUTH_FOR_TESTING === 'true';

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
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

function getAuthUserFromRequest(req) {
    const auth = req.headers['authorization'] || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return null;
    try {
        return verifyJwt(token);
    } catch {
        return null;
    }
}

async function readPersistedSessions() {
    const sessionsDir = path.join(__dirname, 'data', 'sessions');
    try {
        const files = await fs.readdir(sessionsDir);
        const jsonFiles = files.filter((file) => file.endsWith('.json'));
        const reads = await Promise.allSettled(
            jsonFiles.map((file) => fs.readFile(path.join(sessionsDir, file), 'utf8'))
        );

        return reads
            .filter((result) => result.status === 'fulfilled')
            .map((result) => {
                try {
                    return JSON.parse(result.value);
                } catch {
                    return null;
                }
            })
            .filter(Boolean);
    } catch {
        return [];
    }
}

function mergeSessions(liveSessions = [], persistedSessions = []) {
    const sessionMap = new Map();
    persistedSessions.forEach((session) => { if (session?.id) sessionMap.set(session.id, session); });
    liveSessions.forEach((session) => { if (session?.id) sessionMap.set(session.id, session); });
    return Array.from(sessionMap.values());
}

async function readPayments() {
    const paymentsFile = path.join(__dirname, 'data', 'payments.json');
    try {
        const raw = await fs.readFile(paymentsFile, 'utf8');
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function getPaymentStatus(payments = [], email, phone) {
    if (!email && !phone) return 'NONE';

    const matches = payments.filter((payment) => (
        (email && payment.email && payment.email.toLowerCase() === email.toLowerCase()) ||
        (phone && payment.mobile && payment.mobile === phone)
    ));

    if (matches.some((payment) => payment.status === 'VERIFIED')) return 'VERIFIED';
    if (matches.some((payment) => payment.status === 'PENDING')) return 'PENDING';
    if (matches.some((payment) => payment.status === 'REJECTED')) return 'REJECTED';
    return 'NONE';
}

function normalizeAdminSession(session, payments = []) {
    const userInfo = session.userInfo || {};
    const paymentStatus = getPaymentStatus(payments, userInfo.email || session.email || null, userInfo.phone || session.phone || null);
    const totalQuestions = session.totalQuestions || 20;
    const progress = session.state === 'TEST_IN_PROGRESS' && Array.isArray(session.answers)
        ? `${Math.min(session.answers.length, totalQuestions)}/${totalQuestions}`
        : (session.state === 'TEST_COMPLETE' ? `${totalQuestions}/${totalQuestions}` : null);

    return {
        id: session.id,
        identifier: session.identifier || session.ipAddress,
        name: session.name || userInfo.name || null,
        email: userInfo.email || session.email || null,
        phone: userInfo.phone || session.phone || null,
        age: userInfo.age || session.age || null,
        rollNumber: userInfo.rollNumber || session.rollNumber || null,
        institution: userInfo.institution || session.institution || null,
        state: session.state,
        mbtiType: session.mbtiType || null,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt || session.createdAt,
        paymentStatus,
        progress,
        assessmentVariant: session.assessmentVariant || 'classic',
        language: session.language || 'english',
        alertLevel: session.alertLevel || 'GREEN',
        requiresHumanIntervention: Boolean(session.requiresHumanIntervention),
        riskFlags: Array.isArray(session.riskFlags) ? session.riskFlags : [],
        lastRiskAt: session.lastRiskAt || null,
        recommendedOutreach: (session.alertLevel === 'RED' || session.requiresHumanIntervention)
            ? 'Immediate phone outreach and safeguarding review'
            : (session.alertLevel === 'AMBER'
                ? 'Counsellor phone follow-up within 24 hours'
                : 'Monitor during normal review cycle'),
        answers: Array.isArray(session.answers) ? session.answers : [],
    };
}

const RISK_CASE_STATUS = ['NEW', 'CONTACTED', 'ESCALATED', 'CLOSED'];
const riskCasesFile = path.join(__dirname, 'data', 'risk_cases.json');
const riskAlertLogFile = path.join(__dirname, 'data', 'risk_alerts.log');

async function readRiskCases() {
    try {
        const raw = await fs.readFile(riskCasesFile, 'utf8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

async function writeRiskCases(riskCases) {
    await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
    await fs.writeFile(riskCasesFile, JSON.stringify(riskCases, null, 2));
}

async function appendRiskAlertLog(entry) {
    await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
    await fs.appendFile(riskAlertLogFile, `${JSON.stringify(entry)}\n`);
}

function buildRiskCaseFromSession(session) {
    return {
        sessionId: session.id,
        name: session.name || null,
        email: session.email || null,
        phone: session.phone || null,
        age: session.age || null,
        rollNumber: session.rollNumber || null,
        institution: session.institution || null,
        mbtiType: session.mbtiType || null,
        alertLevel: session.alertLevel || 'GREEN',
        requiresHumanIntervention: Boolean(session.requiresHumanIntervention),
        riskFlags: Array.isArray(session.riskFlags) ? session.riskFlags : [],
        lastRiskAt: session.lastRiskAt || session.updatedAt || null,
        recommendedOutreach: session.recommendedOutreach || 'Counsellor review required',
    };
}

async function sendRiskAlert(riskCase) {
    const payload = {
        type: 'RED_RISK_CASE',
        timestamp: new Date().toISOString(),
        riskCase,
    };

    const webhookUrl = process.env.RISK_ALERT_WEBHOOK_URL;
    if (webhookUrl) {
        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        } catch (error) {
            console.error('Failed to send risk webhook alert:', error.message);
        }
    }

    await appendRiskAlertLog(payload);
}

async function upsertRiskCaseFromSession(session, options = {}) {
    if (!session || !session.id) return null;
    if (!session.requiresHumanIntervention && session.alertLevel === 'GREEN') return null;

    const riskCases = await readRiskCases();
    const now = new Date().toISOString();
    const nextCase = buildRiskCaseFromSession(session);
    const existingIndex = riskCases.findIndex((item) => item.sessionId === session.id);

    if (existingIndex === -1) {
        const newRiskCase = {
            ...nextCase,
            caseStatus: 'NEW',
            adminNotes: '',
            createdAt: now,
            updatedAt: now,
            source: options.source || 'chat',
            lastAlertSentAt: null,
        };
        riskCases.push(newRiskCase);

        if (newRiskCase.alertLevel === 'RED') {
            await sendRiskAlert(newRiskCase);
            newRiskCase.lastAlertSentAt = now;
        }

        await writeRiskCases(riskCases);
        return newRiskCase;
    }

    const existing = riskCases[existingIndex];
    const updated = {
        ...existing,
        ...nextCase,
        updatedAt: now,
    };

    const shouldNotifyRed = updated.alertLevel === 'RED'
        && (!existing.lastAlertSentAt || new Date(updated.lastRiskAt || now) > new Date(existing.lastAlertSentAt));

    if (shouldNotifyRed) {
        await sendRiskAlert(updated);
        updated.lastAlertSentAt = now;
    }

    riskCases[existingIndex] = updated;
    await writeRiskCases(riskCases);
    return updated;
}

async function verifyGoogleIdToken(idToken) {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Google token verification failed (${response.status}): ${text.slice(0, 200)}`);
    }

    const payload = await response.json();
    if (payload.email_verified !== 'true' && payload.email_verified !== true) {
        throw new Error('Google account email is not verified');
    }

    const expectedClientId = process.env.GOOGLE_CLIENT_ID;
    if (expectedClientId && payload.aud !== expectedClientId) {
        throw new Error('Google token audience mismatch');
    }

    return payload;
}

// -----------------
// Simple health & configuration status endpoint
app.get('/api/health', (req, res) => {
    const status = {
        uptime: process.uptime(),
        timestamp: Date.now(),
        hasAdminEmail: Boolean(process.env.ADMIN_EMAIL),
        hasAdminPassword: Boolean(process.env.ADMIN_PASSWORD),
        aiProvider: process.env.OPENROUTER_API_KEY ? 'openrouter' : 'none',
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
        frontendUrl: process.env.FRONTEND_URL || null
    };
    res.json({ status: 'ok', ...status });
});
// Auth: Users (JWT)
// -----------------
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, phone, rollNumber } = req.body || {};
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ success: false, error: 'Name, email, password, and phone are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
        }
        const user = await createUser({ name, email, password, phone, rollNumber });
        // Update metrics
        const users = await getAllUsers();
        await setTotalUsers(users.length);
        const token = generateJwt({ sub: user.id, email: user.email, name: user.name });
        return res.json({ success: true, token, user });
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message || 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password required' });
        const user = await verifyUser(email, password);
        if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });
        const token = generateJwt({ sub: user.id, email: user.email, name: user.name });
        return res.json({ success: true, token, user });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Login failed' });
    }
});

app.post('/api/auth/google', async (req, res) => {
    try {
        const { idToken } = req.body || {};
        if (!idToken) return res.status(400).json({ success: false, error: 'idToken is required' });

        const googlePayload = await verifyGoogleIdToken(idToken);
        const user = await upsertGoogleUser({
            googleId: googlePayload.sub,
            email: googlePayload.email,
            name: googlePayload.name,
            avatar: googlePayload.picture
        });

        const token = generateJwt({
            sub: user.id,
            email: user.email,
            name: user.name,
            provider: 'google',
            googleId: googlePayload.sub
        });

        return res.json({ success: true, token, user });
    } catch (err) {
        return res.status(401).json({ success: false, error: err.message || 'Google sign-in failed' });
    }
});

app.post('/api/assessment/result', requireAuth, async (req, res) => {
    try {
        const { mbtiType, track, age, riskTier, dimensionScores, traitScores, borderlines, mentalHealth, source } = req.body || {};
        if (!mbtiType) {
            return res.status(400).json({ success: false, error: 'mbtiType is required' });
        }

        const saved = await saveUserAssessmentResult(req.user.email, {
            mbtiType,
            track,
            age,
            riskTier,
            dimensionScores,
            traitScores,
            borderlines,
            mentalHealth,
            source: source || 'SNTI Assessment'
        });

        return res.json({ success: true, assessment: saved });
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message || 'Failed to save assessment result' });
    }
});

app.get('/api/assessment/latest', requireAuth, async (req, res) => {
    try {
        const latest = await getLatestAssessmentByEmail(req.user.email);
        return res.json({ success: true, assessment: latest });
    } catch {
        return res.status(500).json({ success: false, error: 'Failed to load latest assessment' });
    }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
    try {
        const user = await findUserByEmail(req.user.email);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        return res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone || null,
                rollNumber: user.rollNumber || null,
                institution: user.institution || null,
                avatar: user.avatar || null,
                authProvider: user.authProvider || 'local',
                createdAt: user.createdAt,
                lastLoginAt: user.lastLoginAt || null,
            }
        });
    } catch {
        return res.status(500).json({ success: false, error: 'Failed to load user profile' });
    }
});

app.patch('/api/auth/profile', requireAuth, async (req, res) => {
    try {
        const { phone, rollNumber, institution } = req.body || {};
        const updatedUser = await updateUserProfile(req.user.email, {
            phone,
            rollNumber,
            institution,
        });

        return res.json({ success: true, user: updatedUser });
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message || 'Failed to update profile' });
    }
});

app.post('/api/auth/logout', requireAuth, async (req, res) => {
    // Stateless JWT logout handled on client; endpoint for symmetry
    return res.json({ success: true });
});

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
        const { message, conversationHistory = [], userInfo, mode, mbtiType, riskTier } = req.body;
        
        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const authUser = getAuthUserFromRequest(req);

        // General chat mode: direct empathetic conversation without assessment flow.
        if (mode === 'chat') {
            const sessionIdentifier = authUser?.email
                ? `chat-${authUser.email.toLowerCase()}`
                : userInfo?.email
                    ? `chat-${String(userInfo.email).toLowerCase()}`
                    : `chat-${req.ip || req.connection.remoteAddress || 'unknown'}`;
            const session = getOrCreateSession(sessionIdentifier);
            const riskSignal = evaluateBehaviorRisk(message);
            const effectiveName = authUser?.name || userInfo?.name || 'Student';

            const updatedSession = updateSession(sessionIdentifier, {
                name: effectiveName,
                state: 'GENERAL_CHAT',
                alertLevel: riskSignal.level,
                riskFlags: Array.from(new Set([...(session.riskFlags || []), ...riskSignal.flags])),
                requiresHumanIntervention: riskSignal.requiresHumanIntervention,
                ...(riskSignal.level !== 'GREEN' ? { lastRiskAt: new Date().toISOString() } : {})
            });

            if (riskSignal.level !== 'GREEN') {
                await upsertRiskCaseFromSession(normalizeAdminSession(updatedSession || session, await readPayments()), { source: 'general_chat' });
            }

            const responseText = await generateConversationalResponse(message, conversationHistory);

            return res.json({
                response: responseText,
                sessionId: session.id,
                userName: effectiveName,
                state: 'GENERAL_CHAT',
                mbtiType: null,
                progress: null,
                alertLevel: riskSignal.level,
                requiresHumanIntervention: riskSignal.requiresHumanIntervention,
                riskFlags: riskSignal.flags,
                timestamp: new Date().toISOString()
            });
        }

        // Post-assessment guidance mode requires verified Google sign-in in normal mode.
        // During local testing bypass, we allow request-provided assessment context.
        if (mode === 'post_assessment') {
            if ((!authUser || authUser.provider !== 'google') && !isBypassEnabled) {
                return res.status(401).json({
                    error: 'Google sign-in required',
                    requiresGoogleSignIn: true,
                    message: 'Please sign in with Google to continue AI guidance after assessment.'
                });
            }

            let latestAssessment = null;
            if (authUser?.email) {
                latestAssessment = await getLatestAssessmentByEmail(authUser.email);
            }

            if ((!latestAssessment || !latestAssessment.mbtiType) && isBypassEnabled && mbtiType) {
                latestAssessment = {
                    mbtiType,
                    riskTier: riskTier || 'GREEN'
                };
            }

            if (!latestAssessment || !latestAssessment.mbtiType) {
                return res.status(400).json({
                    error: 'No saved assessment found',
                    message: 'Please complete and save the SNTI assessment before starting AI guidance chat.'
                });
            }

            const sessionIdentifier = authUser?.email
                ? `google-${authUser.email.toLowerCase()}`
                : `preview-${req.ip || req.connection.remoteAddress || 'unknown'}`;
            const session = getOrCreateSession(sessionIdentifier);
            const riskSignal = evaluateBehaviorRisk(message);
            const effectiveName = authUser?.name || userInfo?.name || 'Student';
            const effectiveEmail = authUser?.email || userInfo?.email || 'preview@snti.local';
            if (riskSignal.level !== 'GREEN') {
                const mergedFlags = Array.from(new Set([...(session.riskFlags || []), ...riskSignal.flags]));
                const updatedSession = updateSession(sessionIdentifier, {
                    userInfo: {
                        ...(session.userInfo || {}),
                        email: effectiveEmail,
                        name: effectiveName
                    },
                    name: effectiveName,
                    alertLevel: riskSignal.level,
                    riskFlags: mergedFlags,
                    requiresHumanIntervention: riskSignal.requiresHumanIntervention,
                    lastRiskAt: new Date().toISOString(),
                    mbtiType: latestAssessment.mbtiType,
                    state: 'POST_ASSESSMENT_CHAT'
                });

                await upsertRiskCaseFromSession(normalizeAdminSession(updatedSession || session, await readPayments()), { source: 'post_assessment_chat' });
            } else {
                updateSession(sessionIdentifier, {
                    userInfo: {
                        ...(session.userInfo || {}),
                        email: effectiveEmail,
                        name: effectiveName
                    },
                    name: effectiveName,
                    mbtiType: latestAssessment.mbtiType,
                    state: 'POST_ASSESSMENT_CHAT'
                });
            }

            const responseText = await generateTypeAwareGuidanceResponse(
                message,
                {
                    name: effectiveName,
                    mbtiType: latestAssessment.mbtiType,
                    riskTier: latestAssessment.riskTier || 'GREEN'
                },
                conversationHistory
            );

            return res.json({
                response: responseText,
                sessionId: session.id,
                userName: effectiveName,
                state: 'POST_ASSESSMENT_CHAT',
                mbtiType: latestAssessment.mbtiType,
                progress: null,
                alertLevel: riskSignal.level,
                requiresHumanIntervention: riskSignal.requiresHumanIntervention,
                riskFlags: riskSignal.flags,
                timestamp: new Date().toISOString()
            });
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

        if (result.alertLevel && result.alertLevel !== 'GREEN') {
            const session = getOrCreateSession(sessionIdentifier);
            await upsertRiskCaseFromSession(normalizeAdminSession(session, await readPayments()), { source: 'assessment_flow' });
        }
        
        res.json({ 
            response: result.response,
            sessionId: result.sessionId,
            userName: result.userName,
            state: result.state,
            mbtiType: result.mbtiType,
            progress: result.progress,
            alertLevel: result.alertLevel || 'GREEN',
            requiresHumanIntervention: Boolean(result.requiresHumanIntervention),
            riskFlags: result.riskFlags || [],
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
app.get('/api/sessions', requireAdmin, async (req, res) => {
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
        if (isBypassEnabled) {
            const token = generateJwt({ role: 'admin', email: 'admin@snti.local' });
            return res.json({ success: true, token, admin: { email: 'admin@snti.local' } });
        }

        const { email, password } = req.body;
        // Enforce environment-defined admin credentials with no insecure fallback in production
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
            // Explicit error to surface misconfiguration instead of silently accepting defaults
            return res.status(500).json({
                success: false,
                error: 'Admin credentials not configured',
                message: 'Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables.'
            });
        }

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            // Issue JWT with admin role
            const token = generateJwt({ role: 'admin', email: ADMIN_EMAIL });
            res.json({ success: true, token, admin: { email: ADMIN_EMAIL } });
            
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
app.get('/api/admin/payments', requireAdmin, async (req, res) => {
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
app.get('/api/admin/sessions', requireAdmin, async (req, res) => {
    try {
        const { scope = 'ALL', payment = 'ALL', personality = 'ALL' } = req.query;
        const liveSessions = getAllSessions();
        const fileSessions = await readPersistedSessions();
        const payments = await readPayments();
        let sessions = mergeSessions(liveSessions, fileSessions).map((session) => normalizeAdminSession(session, payments));

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

app.get('/api/admin/risk-cases', requireAdmin, async (req, res) => {
    try {
        const { status = 'ALL', level = 'ALL' } = req.query;
        let riskCases = await readRiskCases();

        if (status !== 'ALL') {
            riskCases = riskCases.filter((riskCase) => riskCase.caseStatus === status);
        }

        if (level !== 'ALL') {
            if (level === 'FLAGGED') {
                riskCases = riskCases.filter((riskCase) => riskCase.alertLevel !== 'GREEN' || riskCase.requiresHumanIntervention);
            } else {
                riskCases = riskCases.filter((riskCase) => riskCase.alertLevel === level);
            }
        }

        riskCases.sort((left, right) => new Date(right.lastRiskAt || right.updatedAt || 0) - new Date(left.lastRiskAt || left.updatedAt || 0));
        return res.json({ success: true, riskCases, total: riskCases.length });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Failed to load risk cases' });
    }
});

app.patch('/api/admin/risk-cases/:sessionId', requireAdmin, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { caseStatus, adminNotes } = req.body || {};

        const riskCases = await readRiskCases();
        const idx = riskCases.findIndex((riskCase) => riskCase.sessionId === sessionId);
        if (idx === -1) {
            return res.status(404).json({ success: false, error: 'Risk case not found' });
        }

        if (caseStatus && !RISK_CASE_STATUS.includes(caseStatus)) {
            return res.status(400).json({ success: false, error: 'Invalid case status' });
        }

        const nextCase = {
            ...riskCases[idx],
            ...(caseStatus ? { caseStatus } : {}),
            ...(typeof adminNotes === 'string' ? { adminNotes: adminNotes.trim() } : {}),
            updatedAt: new Date().toISOString(),
        };

        riskCases[idx] = nextCase;
        await writeRiskCases(riskCases);
        return res.json({ success: true, riskCase: nextCase });
    } catch {
        return res.status(500).json({ success: false, error: 'Failed to update risk case' });
    }
});

// Verify or reject payment (admin endpoint)
app.post('/api/admin/verify-payment', requireAdmin, async (req, res) => {
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

// Admin user & test statistics
app.get('/api/admin/user-stats', requireAdmin, async (req, res) => {
    try {
        const users = await getAllUsers();
        const metrics = await getMetrics();
        const sessions = mergeSessions(getAllSessions(), await readPersistedSessions());
        const payments = await readPayments();
        const activeTests = sessions.filter(s => s.state !== 'TEST_COMPLETE').length;
        const completedSessions = sessions.filter(s => s.state === 'TEST_COMPLETE');
        const personalityDistribution = completedSessions.reduce((acc, s) => {
            if (s.mbtiType) acc[s.mbtiType] = (acc[s.mbtiType] || 0) + 1;
            return acc;
        }, {});

        const normalizedSessions = sessions.map((session) => normalizeAdminSession(session, payments));
        const persistedRiskCases = await readRiskCases();
        const riskCaseMap = new Map(persistedRiskCases.map((riskCase) => [riskCase.sessionId, riskCase]));

        // Map sessions to users by email
        const userTestsMap = {};
        normalizedSessions.forEach(session => {
            const email = session.email || null;
            if (!email) return;
            if (!userTestsMap[email]) userTestsMap[email] = [];
            userTestsMap[email].push({
                sessionId: session.id,
                state: session.state,
                mbtiType: session.mbtiType || null,
                answers: session.answers || [],
                createdAt: session.createdAt,
                updatedAt: session.updatedAt,
                progress: session.progress || null,
                assessmentVariant: session.assessmentVariant || 'classic',
                language: session.language || 'english',
                rollNumber: session.rollNumber || null,
                institution: session.institution || null,
                age: session.age || null,
                alertLevel: session.alertLevel || 'GREEN',
                requiresHumanIntervention: Boolean(session.requiresHumanIntervention),
                riskFlags: Array.isArray(session.riskFlags) ? session.riskFlags : [],
                lastRiskAt: session.lastRiskAt || null,
                recommendedOutreach: session.recommendedOutreach,
                caseStatus: riskCaseMap.get(session.id)?.caseStatus || (session.alertLevel === 'RED' || session.requiresHumanIntervention ? 'NEW' : null),
                adminNotes: riskCaseMap.get(session.id)?.adminNotes || '',
            });
        });

        const riskCases = normalizedSessions
            .filter((session) => session.alertLevel === 'RED' || session.requiresHumanIntervention || riskCaseMap.has(session.id))
            .map((session) => {
                const persisted = riskCaseMap.get(session.id);
                return {
                    ...session,
                    caseStatus: persisted?.caseStatus || 'NEW',
                    adminNotes: persisted?.adminNotes || '',
                    createdAt: persisted?.createdAt || session.createdAt,
                    updatedAt: persisted?.updatedAt || session.updatedAt,
                    lastAlertSentAt: persisted?.lastAlertSentAt || null,
                };
            })
            .sort((left, right) => new Date(right.lastRiskAt || right.updatedAt || 0) - new Date(left.lastRiskAt || left.updatedAt || 0));

        res.json({
            success: true,
            totals: {
                totalUsers: metrics.totalUsers || users.length,
                totalTestsStarted: metrics.totalTestsStarted || 0,
                totalTestsCompleted: metrics.totalTestsCompleted || 0,
                activeTests,
                urgentRiskCases: riskCases.length,
            },
            personalityDistribution,
            riskCases,
            users: users.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                phone: u.phone || null,
                rollNumber: u.rollNumber || null,
                institution: u.institution || null,
                age: [...(userTestsMap[u.email] || [])].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))[0]?.age || null,
                createdAt: u.createdAt,
                lastLoginAt: u.lastLoginAt,
                tests: userTestsMap[u.email] || []
            }))
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to load stats' });
    }
});

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
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

