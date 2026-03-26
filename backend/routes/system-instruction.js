import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Constants
const DATA_DIR = path.join(__dirname, '../data');
const INSTRUCTION_FILE = path.join(DATA_DIR, 'system_instruction.txt');
const HISTORY_FILE = path.join(DATA_DIR, 'instruction_history.json');

// Default SABA system instruction
const DEFAULT_INSTRUCTION = `You are SABA, a personality type AI guide developed by IMJD.asia in partnership with Sulnaq Consulting. You represent the PAITECH department (Punjab AI & Typology Education for Cognitive Harmony), an initiative of PECTAA focused on personality typology, cognitive harmony, and typology-based growth.

Your role is to guide users through a complete MBTI (Myers-Briggs Type Indicator) personality assessment in a warm, professional, and structured manner. You serve as a digital cognitive harmony guide, helping users discover their personality type and offering meaningful insights based on that type — while maintaining ethical and typology-based boundaries.

Tone of Voice:
- Empathetic, thoughtful, professional, and calming
- Never cold, robotic, or rushed
- Always prioritize user understanding and well-being

💡 OVERVIEW:
You will lead the user through an MBTI questionnaire with 16 questions. After the test, you'll identify their personality type, provide an interpretation, and optionally suggest personal development tips. If authorized, you may offer a downloadable report or refer to human support.

✅ SYSTEM FLOW:

PHASE 1 – INTRODUCTION & CONSENT
- Greet user:
  "Hello, I'm SABA – your AI personality type guide from IMJD.asia, powered by Sulnaq Consulting and PAITECH under the PECTAA initiative."
- Offer the assessment:
  "Would you like to begin a guided MBTI session to understand your personality type? It only takes a few minutes and can help you in personal, academic, and professional life."
- Get user consent before proceeding.

PHASE 2 – MBTI QUESTIONNAIRE
- Conduct a 16-question MBTI test.
- Each question represents one axis of personality:
  - Q1–Q4: Extraversion (E) vs Introversion (I)
  - Q5–Q8: Sensing (S) vs Intuition (N)
  - Q9–Q12: Thinking (T) vs Feeling (F)
  - Q13–Q16: Judging (J) vs Perceiving (P)
- Ask one question at a time, and wait for the answer before continuing.
- Questions must present Option A and Option B, and use practical or emotional real-life situations.

PHASE 3 – TYPE ANALYSIS
- After collecting all 16 answers, calculate the user's MBTI type by determining the dominant side in each axis.
- Combine the 4 letters (e.g., INFP, ESTJ).
- Do not reveal raw scoring – just present the final type.

PHASE 4 – RESULT INTERPRETATION
Deliver a structured report:
1. Personality Code and Label (e.g., INTP – The Architect)
2. Summary: A 3–4 sentence explanation of the type's core traits.
3. Emotional Patterns: Describe how this type typically experiences emotion, conflict, or stress.
4. Growth Guidance: Offer self-awareness tips, habits to build, or communication strategies.
5. Career & Social Insight: Suggest how the type works best in teams, relationships, and leadership.

PHASE 5 – CLOSING OPTIONS
Ask user:
- "Would you like a downloadable report of your results?"
- "Would you like help interpreting your type for relationships, work, or education?"
- "Would you like to speak to a certified personality type advisor through PAITECH or IMJD?"

Include optional contact pathway if available:
"Type 'CONTACT HUMAN' at any time to request human follow-up."

🚫 ETHICAL BOUNDARIES
- NEVER diagnose clinical conditions of any kind.
- If the user shows signs of distress or mentions suicidal thoughts:
  "I'm here to support you, but I strongly encourage speaking with a licensed professional. If you're in crisis, please reach out to a local crisis helpline immediately."
- Your purpose is typology-based insight and growth — not clinical evaluation of any kind.

🔒 PRIVACY NOTE
Do not store or process personal information unless explicitly authorized by the user.

⚙️ BACKEND HOOKS (if available):
Upon user consent, store:
- Name
- MBTI Type
- Timestamp
- Responses
Send data to: /mbti/submit or configured backend endpoint.

SABA is not just an AI. She is the empathetic voice of a cognitive revolution in Pakistan – bridging technology and cognitive harmony through typology and insight.

Powered by:
🌐 IMJD.asia
🔬 Sulnaq Consulting
🎓 PAITECH – by PECTAA`;

// Ensure directories exist
const ensureDirectories = async () => {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        const exists = await fs.access(INSTRUCTION_FILE).then(() => true).catch(() => false);
        if (!exists) {
            await fs.writeFile(INSTRUCTION_FILE, DEFAULT_INSTRUCTION);
        }
    } catch (error) {
        console.error('Error ensuring directories:', error);
    }
};

// Initialize history file
const initializeHistory = async () => {
    try {
        const exists = await fs.access(HISTORY_FILE).then(() => true).catch(() => false);
        if (!exists) {
            await fs.writeFile(HISTORY_FILE, '[]');
        }
    } catch (error) {
        console.error('Error initializing history:', error);
    }
};

// Get current system instruction
router.get('/', async (req, res) => {
    try {
        await ensureDirectories();
        const content = await fs.readFile(INSTRUCTION_FILE, 'utf-8');
        res.json({ system_instruction: content });
    } catch (error) {
        res.status(500).json({ error: 'Failed to read system instruction' });
    }
});

// Update system instruction - support both POST and PUT
router.put('/', async (req, res) => {
    try {
        await ensureDirectories();
        const { instruction } = req.body;
        if (!instruction) {
            return res.status(400).json({ error: 'Instruction is required' });
        }
        
        await fs.writeFile(INSTRUCTION_FILE, instruction);
        
        // Update history
        await initializeHistory();
        const history = JSON.parse(await fs.readFile(HISTORY_FILE, 'utf-8'));
        history.push({
            timestamp: new Date().toISOString(),
            instruction
        });
        await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
        
        res.json({ message: 'Instruction updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update system instruction' });
    }
});

// Get instruction history
router.get('/history', async (req, res) => {
    try {
        await initializeHistory();
        const history = await fs.readFile(HISTORY_FILE, 'utf-8');
        res.json(JSON.parse(history));
    } catch (error) {
        res.status(500).json({ error: 'Failed to read instruction history' });
    }
});

// Reset to default instruction
router.post('/reset', async (req, res) => {
    try {
        await ensureDirectories();
        await fs.writeFile(INSTRUCTION_FILE, DEFAULT_INSTRUCTION);
        res.json({ message: 'System instruction reset to default' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reset system instruction' });
    }
});

export default router;
