import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Client } from 'whatsapp-web.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promises as fs } from 'fs';
import QRCode from 'qrcode';
import { getEmpatheticResponse, TOPIC_TREES, MBTI_TEMPLATES } from './ai_handler.js';
import { generateConversationalResponse, handleSNTITestConversation } from './gemini_simple.js';
import { getAllSessions } from './session_manager.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);

// Add QR code state
let qrCode = null;

// Add connection status
let isClientReady = false;

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

// MBTI Questions Database
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

// MBTI Type Descriptions
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

// Add QR endpoint
app.get('/qr', (req, res) => {
    if (qrCode) {
        res.json({ qr: qrCode });
    } else {
        res.status(404).json({ message: 'QR Code not available yet' });
    }
});

// Add status endpoint
app.get('/status', (req, res) => {
    res.json({ 
        isConnected: isClientReady,
        qr: qrCode,
        message: isClientReady ? 'WhatsApp connected' : 'WhatsApp not connected'
    });
});

// Add disconnect endpoint
app.post('/disconnect-whatsapp', (req, res) => {
    try {
        if (client) {
            client.destroy();
            isClientReady = false;
            qrCode = null;
            res.json({ message: 'WhatsApp disconnected successfully' });
        } else {
            res.json({ message: 'WhatsApp was not connected' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error disconnecting WhatsApp' });
    }
});

// Add SNTI TEST psychology chat endpoint with session management
app.post('/api/psychology-chat', async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;
        
        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get user's IP address for session tracking
        const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';

        // Use the SNTI TEST conversation handler
        const result = await handleSNTITestConversation(message, ipAddress);
        
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

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// WhatsApp client setup
const client = new Client({
    puppeteer: {
        args: ["--no-sandbox"]
    }
});

// Event handlers
client.on("qr", async (qr) => {
    console.log("QR Code received");
    try {
        // Convert QR code string to base64 image
        const qrImageBase64 = await QRCode.toDataURL(qr);
        // Remove the data:image/png;base64, prefix to get just the base64 string
        const base64String = qrImageBase64.replace(/^data:image\/png;base64,/, '');
        
        qrCode = base64String;
        isClientReady = false;
        io.emit("qr", base64String);
        console.log("QR Code converted and sent to clients");
    } catch (error) {
        console.error("Error generating QR code image:", error);
    }
});

client.on("ready", () => {
    console.log("WhatsApp client is ready");
    qrCode = null;
    isClientReady = true;
    io.emit("ready");
});

client.on("message", async (message) => {
    console.log("Message received:", message.body);
    io.emit("message", message);
    
    try {
        // Format the phone number for user_id
        const phone = message.from.replace("@s.whatsapp.net", "");
        
        // Check for assessment state
        const userDataPath = path.join(__dirname, 'data/mbti', `${phone}.json`);
        let userData = null;
        let inAssessment = false;
        
        try {
            const data = await fs.readFile(userDataPath, 'utf-8');
            userData = JSON.parse(data);
            inAssessment = true;
        } catch (error) {
            // Not in assessment
        }

        // Handle initial greeting or start command
        if (!inAssessment && (message.body.toLowerCase() === 'hi' || 
            message.body.toLowerCase() === 'hello' ||
            message.body.toLowerCase() === 'start')) {
            const greeting = `Hello! I'm SABA – your AI personality psychologist from IMJD.asia, powered by Sulnaq Consulting and PAITECH under the PECTAA initiative.\n\n` +
                           `Would you like to begin a guided MBTI session to understand your personality type? It only takes a few minutes and can help you in personal, academic, and professional life.\n\n` +
                           `Reply with 'YES' to begin the assessment.`;
            await message.reply(greeting);
            return;
        }

        // Handle assessment start
        if (!inAssessment && message.body.toLowerCase() === 'yes') {
            // Initialize new assessment
            userData = {
                userId: phone,
                answers: {},
                timestamp: new Date().toISOString(),
                assessmentComplete: false,
                mbtiType: null,
                learningProgress: {
                    topics: Object.fromEntries(
                        Object.keys(TOPIC_TREES).map(topic => [topic, {
                            completed: [],
                            current: null,
                            lastAccessed: null
                        }])
                    ),
                    currentGoals: [],
                    achievements: []
                },
                conversationHistory: [],
                emotionalStates: []
            };
            await fs.mkdir(path.join(__dirname, 'data/mbti'), { recursive: true });
            await fs.writeFile(userDataPath, JSON.stringify(userData, null, 2));

            // Send first question
            const firstQuestion = `Let's begin your MBTI assessment!\n\n` +
                                `*Question 1*\n${mbtiQuestions[1].text}\n\n` +
                                `*A)* ${mbtiQuestions[1].A}\n` +
                                `*B)* ${mbtiQuestions[1].B}\n\n` +
                                `Reply with A or B.`;
            await message.reply(firstQuestion);
            return;
        }

        // Handle assessment answers
        if (inAssessment && (message.body.toUpperCase() === 'A' || message.body.toUpperCase() === 'B')) {
            const currentQuestion = Object.keys(userData.answers).length + 1;
            userData.answers[currentQuestion] = message.body.toUpperCase();
            await fs.writeFile(userDataPath, JSON.stringify(userData, null, 2));

            if (currentQuestion === 16) {
                // Calculate MBTI type
                const type = calculateMBTIType(userData.answers);
                const typeInfo = mbtiTypes[type];
                
                // Send results
                const result = `🎯 *Your MBTI Assessment Results*\n\n` +
                             `Your personality type is: *${type} - ${typeInfo.name}*\n\n` +
                             `📝 *Description*\n${typeInfo.description}\n\n` +
                             `💪 *Your Strengths*\n${typeInfo.strengths.map(s => '• ' + s).join('\n')}\n\n` +
                             `🌱 *Growth Areas*\n${typeInfo.growth_areas.map(g => '• ' + g).join('\n')}\n\n` +
                             `Would you like to:\n` +
                             `1. Get a detailed PDF report\n` +
                             `2. Speak to a certified psychologist\n` +
                             `3. Learn more about your type\n\n` +
                             `Reply with the number of your choice.`;
                await message.reply(result);
            } else {
                // Send next question
                const nextQ = mbtiQuestions[currentQuestion + 1];
                const nextQuestion = `*Question ${currentQuestion + 1}*\n${nextQ.text}\n\n` +
                                   `*A)* ${nextQ.A}\n` +
                                   `*B)* ${nextQ.B}\n\n` +
                                   `Reply with A or B.`;
                await message.reply(nextQuestion);
            }
            return;
        }

        // Handle invalid responses during assessment
        if (inAssessment) {
            await message.reply("Please respond with either A or B to continue the assessment.");
            return;
        }

        // Handle post-assessment conversation with emotional AI
        if (userData.assessmentComplete) {
            // Track conversation in history
            userData.conversationHistory.push({
                role: 'user',
                content: message.body,
                timestamp: new Date().toISOString()
            });

            // Get AI response
            const aiResponse = await getEmpatheticResponse(
                message.body,
                userData.mbtiType,
                userData.conversationHistory
            );

            // Update user's learning progress
            const currentTopic = userData.learningProgress.topics[Object.keys(userData.learningProgress.topics)[0]];
            if (currentTopic && currentTopic.current) {
                currentTopic.lastAccessed = new Date().toISOString();
            }

            // Store response in history
            userData.conversationHistory.push({
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date().toISOString()
            });

            // Save updated user data
            await fs.writeFile(userDataPath, JSON.stringify(userData, null, 2));

            // Send response
            await message.reply(aiResponse);
            return;
        }

        // Default response for unrecognized commands
        await message.reply("Hello! To start your MBTI personality assessment, please reply with 'START'.");

    } catch (error) {
        console.error("Error processing message:", error);
        await message.reply("I apologize, but I'm having trouble processing your message right now. Please try again in a moment.");
    }
});

// Initialize WhatsApp client with error handling
client.initialize()
    .catch(err => {
        console.error('Failed to initialize WhatsApp client:', err);
        qrCode = null;
        isClientReady = false;
        io.emit("error", "Failed to initialize WhatsApp");
    });

// Socket connection handler
io.on("connection", (socket) => {
    console.log("Frontend connected");
    
    // Send current QR code if available and not ready
    if (qrCode && !isClientReady) {
        socket.emit("qr", qrCode);
    }
    
    // Send ready state if client is ready
    if (isClientReady) {
        socket.emit("ready");
    }

    socket.on("disconnect", () => {
        console.log("Frontend disconnected");
    });
});

// Calculate MBTI type from answers
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

