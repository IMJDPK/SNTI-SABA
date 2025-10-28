import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MBTI Questions Database
const mbtiQuestions = {
    EI: [ // Extraversion vs Introversion
        {
            id: 1,
            question: "When you're at a gathering, do you:",
            optionA: "Feel energized by meeting lots of people",
            optionB: "Prefer deep conversations with a few close individuals"
        },
        {
            id: 2,
            question: "After a long day, you prefer to:",
            optionA: "Go out with friends to recharge",
            optionB: "Spend quiet time alone to restore energy"
        },
        {
            id: 3,
            question: "In group projects, you typically:",
            optionA: "Take the lead and engage with everyone",
            optionB: "Work independently on your assigned part"
        },
        {
            id: 4,
            question: "Your ideal weekend includes:",
            optionA: "Social events and activities with others",
            optionB: "Personal hobbies and peaceful moments"
        }
    ],
    SN: [ // Sensing vs Intuition
        {
            id: 5,
            question: "When solving problems, you trust more in:",
            optionA: "Past experience and proven methods",
            optionB: "Gut feelings and innovative approaches"
        },
        {
            id: 6,
            question: "You are more interested in:",
            optionA: "What is real and present",
            optionB: "What could be possible in the future"
        },
        {
            id: 7,
            question: "When learning something new, you prefer:",
            optionA: "Step-by-step practical instructions",
            optionB: "Understanding the underlying concepts first"
        },
        {
            id: 8,
            question: "You tend to:",
            optionA: "Focus on details and specific facts",
            optionB: "See patterns and make connections"
        }
    ],
    TF: [ // Thinking vs Feeling
        {
            id: 9,
            question: "When making decisions, you primarily consider:",
            optionA: "Logic and objective analysis",
            optionB: "Impact on people and harmony"
        },
        {
            id: 10,
            question: "In conflicts, you tend to:",
            optionA: "Focus on finding the correct solution",
            optionB: "Focus on maintaining relationships"
        },
        {
            id: 11,
            question: "You value more:",
            optionA: "Truth, even if it might hurt feelings",
            optionB: "Tact and maintaining harmony"
        },
        {
            id: 12,
            question: "When giving feedback, you are:",
            optionA: "Direct and objective",
            optionB: "Gentle and encouraging"
        }
    ],
    JP: [ // Judging vs Perceiving
        {
            id: 13,
            question: "You prefer to:",
            optionA: "Have a clear plan and schedule",
            optionB: "Keep options open and flexible"
        },
        {
            id: 14,
            question: "Your work style is more:",
            optionA: "Structured and organized",
            optionB: "Flexible and adaptable"
        },
        {
            id: 15,
            question: "You feel better when things are:",
            optionA: "Planned and decided",
            optionB: "Open-ended and spontaneous"
        },
        {
            id: 16,
            question: "In your daily life, you prefer to:",
            optionA: "Follow a routine",
            optionB: "Go with the flow"
        }
    ]
};

// MBTI Type Descriptions
const mbtiTypes = {
    ISTJ: {
        label: "The Inspector",
        summary: "Practical, fact-minded, and reliable. You value tradition, order, and attention to detail. Your structured approach to life helps create stability and maintain high standards.",
        emotional_patterns: "You process emotions privately and may find it challenging to express feelings openly. In stress, you might become more critical and rigid.",
        growth_guidance: "Practice being more open to change and expressing emotions. Remember that flexibility can lead to new opportunities.",
        career_insight: "Excel in roles requiring accuracy, reliability, and systematic thinking. Strong in management, accounting, and quality assurance."
    },
    // Add other types here...
};

// Ensure data directory exists
const createDataDir = async () => {
    const dir = path.join(__dirname, '../data/mbti');
    await fs.mkdir(dir, { recursive: true });
};

createDataDir().catch(console.error);

// Get current question
router.get('/question/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let question = null;
    
    // Find question by ID
    for (const axis of Object.values(mbtiQuestions)) {
        question = axis.find(q => q.id === id);
        if (question) break;
    }
    
    if (!question) {
        return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json(question);
});

// Submit answer and get next question or result
router.post('/submit-answer', async (req, res) => {
    const { userId, questionId, answer } = req.body;
    
    if (!userId || !questionId || !answer) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        // Store answer
        const userDataPath = path.join(__dirname, '../data/mbti', `${userId}.json`);
        let userData = { answers: {}, timestamp: new Date().toISOString() };
        
        try {
            const existing = await fs.readFile(userDataPath, 'utf-8');
            userData = JSON.parse(existing);
        } catch (error) {
            // File doesn't exist yet, use default
        }
        
        userData.answers[questionId] = answer;
        await fs.writeFile(userDataPath, JSON.stringify(userData, null, 2));
        
        // Check if assessment is complete
        if (Object.keys(userData.answers).length === 16) {
            const type = calculateMBTIType(userData.answers);
            const interpretation = mbtiTypes[type];
            return res.json({ 
                complete: true, 
                type,
                interpretation
            });
        }
        
        // Get next question
        const nextId = questionId + 1;
        let nextQuestion = null;
        
        for (const axis of Object.values(mbtiQuestions)) {
            nextQuestion = axis.find(q => q.id === nextId);
            if (nextQuestion) break;
        }
        
        res.json({
            complete: false,
            nextQuestion
        });
        
    } catch (error) {
        console.error('Error processing answer:', error);
        res.status(500).json({ error: 'Failed to process answer' });
    }
});

// Calculate MBTI type from answers
function calculateMBTIType(answers) {
    let E = 0, I = 0, S = 0, N = 0, T = 0, F = 0, J = 0, P = 0;
    
    // Count answers for each dimension
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
    
    // Determine type
    return (E > I ? 'E' : 'I') +
           (S > N ? 'S' : 'N') +
           (T > F ? 'T' : 'F') +
           (J > P ? 'J' : 'P');
}

// Get assessment progress
router.get('/progress/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
        const userDataPath = path.join(__dirname, '../data/mbti', `${userId}.json`);
        const userData = JSON.parse(await fs.readFile(userDataPath, 'utf-8'));
        
        res.json({
            questionsAnswered: Object.keys(userData.answers).length,
            totalQuestions: 16,
            timestamp: userData.timestamp
        });
    } catch (error) {
        res.status(404).json({ error: 'Assessment not found' });
    }
});

export default router;
