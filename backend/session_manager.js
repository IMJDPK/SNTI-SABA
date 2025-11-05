import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Session storage
const sessions = new Map();

// SNTI TEST Questions (20 questions for comprehensive MBTI assessment)
export const SNTI_QUESTIONS = [
    // E/I - Extraversion vs Introversion (5 questions)
    {
        id: 1,
        text: "When you're at a social gathering, do you:",
        A: "Feel energized by meeting lots of new people",
        B: "Prefer deep conversations with a few close friends",
        type: "E/I"
    },
    {
        id: 2,
        text: "After a long, tiring day, you prefer to:",
        A: "Go out with friends to recharge your energy",
        B: "Spend quiet time alone to restore yourself",
        type: "E/I"
    },
    {
        id: 3,
        text: "In a team project, you typically:",
        A: "Take the lead and engage with everyone actively",
        B: "Work independently on your assigned tasks",
        type: "E/I"
    },
    {
        id: 4,
        text: "Your ideal weekend includes:",
        A: "Multiple social events and activities with others",
        B: "Personal hobbies and peaceful, quiet moments",
        type: "E/I"
    },
    {
        id: 5,
        text: "When sharing ideas, you prefer to:",
        A: "Think out loud and discuss with others",
        B: "Reflect internally before speaking",
        type: "E/I"
    },
    
    // S/N - Sensing vs Intuition (5 questions)
    {
        id: 6,
        text: "When solving problems, you trust more in:",
        A: "Past experience and proven methods",
        B: "Gut feelings and innovative approaches",
        type: "S/N"
    },
    {
        id: 7,
        text: "You are more interested in:",
        A: "What is real, practical, and present",
        B: "What could be possible and future potential",
        type: "S/N"
    },
    {
        id: 8,
        text: "When learning something new, you prefer:",
        A: "Step-by-step practical instructions",
        B: "Understanding underlying concepts and theories first",
        type: "S/N"
    },
    {
        id: 9,
        text: "You tend to:",
        A: "Focus on details, facts, and specifics",
        B: "See patterns, connections, and the big picture",
        type: "S/N"
    },
    {
        id: 10,
        text: "When reading or watching stories, you enjoy:",
        A: "Realistic, practical narratives",
        B: "Imaginative, abstract, and symbolic themes",
        type: "S/N"
    },
    
    // T/F - Thinking vs Feeling (5 questions)
    {
        id: 11,
        text: "When making important decisions, you primarily consider:",
        A: "Logic, facts, and objective analysis",
        B: "Impact on people and emotional harmony",
        type: "T/F"
    },
    {
        id: 12,
        text: "In conflicts or disagreements, you tend to:",
        A: "Focus on finding the correct, logical solution",
        B: "Focus on maintaining relationships and feelings",
        type: "T/F"
    },
    {
        id: 13,
        text: "You value more:",
        A: "Truth and accuracy, even if it might hurt",
        B: "Tact, kindness, and maintaining harmony",
        type: "T/F"
    },
    {
        id: 14,
        text: "When giving feedback to others, you are:",
        A: "Direct, honest, and objective",
        B: "Gentle, encouraging, and supportive",
        type: "T/F"
    },
    {
        id: 15,
        text: "You are more proud when people say you are:",
        A: "Competent, logical, and fair",
        B: "Caring, empathetic, and understanding",
        type: "T/F"
    },
    
    // J/P - Judging vs Perceiving (5 questions)
    {
        id: 16,
        text: "You prefer to:",
        A: "Have a clear plan and schedule in advance",
        B: "Keep options open and decide as you go",
        type: "J/P"
    },
    {
        id: 17,
        text: "Your work style is more:",
        A: "Structured, organized, and methodical",
        B: "Flexible, spontaneous, and adaptable",
        type: "J/P"
    },
    {
        id: 18,
        text: "You feel better when things are:",
        A: "Planned, decided, and settled",
        B: "Open-ended and spontaneous",
        type: "J/P"
    },
    {
        id: 19,
        text: "In your daily life, you prefer to:",
        A: "Follow a routine and stick to deadlines",
        B: "Go with the flow and adapt as needed",
        type: "J/P"
    },
    {
        id: 20,
        text: "When starting a project, you typically:",
        A: "Make a detailed plan before beginning",
        B: "Jump in and figure it out as you go",
        type: "J/P"
    }
];

// MBTI Type Descriptions with comprehensive guidance
export const MBTI_TYPES = {
    'ISTJ': {
        name: 'The Inspector',
        title: 'Practical, Responsible, Dependable',
        description: 'ISTJs are organized, responsible, and thorough. They value tradition, loyalty, and hard work. With a strong sense of duty and practical mindset, they excel at creating and maintaining systems.',
        strengths: ['Reliable', 'Organized', 'Detail-oriented', 'Practical', 'Logical', 'Responsible'],
        weaknesses: ['Can be inflexible', 'May struggle with change', 'Sometimes insensitive', 'May overlook emotions'],
        careers: ['Accountant', 'Military Officer', 'Legal Professional', 'Administrator', 'Engineer', 'Auditor'],
        relationships: 'ISTJs are loyal and committed partners who value stability. They show love through actions rather than words.',
        growth: 'Work on being more flexible and open to new ideas. Practice expressing emotions and considering others\' feelings.'
    },
    'ISFJ': {
        name: 'The Protector',
        title: 'Caring, Loyal, Supportive',
        description: 'ISFJs are warm, caring individuals who are deeply committed to their responsibilities. They have excellent memories for details about people and are highly attuned to others\' needs.',
        strengths: ['Supportive', 'Reliable', 'Patient', 'Observant', 'Practical', 'Loyal'],
        weaknesses: ['Can be too selfless', 'Dislikes conflict', 'May avoid change', 'Can be overly sensitive'],
        careers: ['Nurse', 'Teacher', 'Counselor', 'Administrator', 'Social Worker', 'Librarian'],
        relationships: 'ISFJs are devoted partners who create warm, stable relationships. They express love through caring actions.',
        growth: 'Learn to say no and prioritize self-care. Practice accepting and adapting to change more easily.'
    },
    'INFJ': {
        name: 'The Counselor',
        title: 'Insightful, Idealistic, Principled',
        description: 'INFJs are deep, complex individuals with strong values and convictions. They have a unique ability to understand people and are driven by their vision of how things should be.',
        strengths: ['Insightful', 'Creative', 'Principled', 'Passionate', 'Empathetic', 'Inspiring'],
        weaknesses: ['Can be perfectionistic', 'May burn out', 'Sometimes too private', 'Can be stubborn'],
        careers: ['Counselor', 'Psychologist', 'Writer', 'Teacher', 'Artist', 'Social Worker'],
        relationships: 'INFJs seek deep, meaningful connections. They are supportive partners who value authenticity and understanding.',
        growth: 'Practice self-care and setting boundaries. Learn to be more flexible and accept imperfection.'
    },
    'INTJ': {
        name: 'The Mastermind',
        title: 'Strategic, Independent, Analytical',
        description: 'INTJs are strategic thinkers with original minds and great drive. They are independent, analytical, and have high standards for themselves and others.',
        strengths: ['Strategic', 'Independent', 'Analytical', 'Confident', 'Innovative', 'Determined'],
        weaknesses: ['Can be arrogant', 'May dismiss emotions', 'Sometimes too critical', 'Can be overly analytical'],
        careers: ['Scientist', 'Engineer', 'Professor', 'Consultant', 'Architect', 'Programmer'],
        relationships: 'INTJs value intelligence and competence in relationships. They show commitment through loyalty and support.',
        growth: 'Work on emotional expression and empathy. Practice patience with those who think differently.'
    },
    'ISTP': {
        name: 'The Craftsman',
        title: 'Practical, Logical, Adaptable',
        description: 'ISTPs are practical problem-solvers who enjoy working with their hands. They are logical, adaptable, and excellent in crisis situations.',
        strengths: ['Practical', 'Logical', 'Adaptable', 'Calm', 'Efficient', 'Independent'],
        weaknesses: ['Can be insensitive', 'Risk-taking', 'May be stubborn', 'Sometimes private'],
        careers: ['Mechanic', 'Engineer', 'Pilot', 'Forensic Scientist', 'Athlete', 'Programmer'],
        relationships: 'ISTPs are loyal but need independence. They show love through acts of service and quality time.',
        growth: 'Practice expressing emotions and long-term planning. Work on being more open with feelings.'
    },
    'ISFP': {
        name: 'The Composer',
        title: 'Gentle, Artistic, Spontaneous',
        description: 'ISFPs are gentle, caring individuals with a strong aesthetic sense. They live in the moment and have a deep appreciation for beauty and harmony.',
        strengths: ['Artistic', 'Gentle', 'Flexible', 'Passionate', 'Loyal', 'Observant'],
        weaknesses: ['Can be overly competitive', 'May be unpredictable', 'Dislikes conflict', 'Sometimes too sensitive'],
        careers: ['Artist', 'Musician', 'Designer', 'Veterinarian', 'Chef', 'Nurse'],
        relationships: 'ISFPs are warm, supportive partners who value harmony and authenticity in relationships.',
        growth: 'Work on long-term planning and assertiveness. Practice handling conflict constructively.'
    },
    'INFP': {
        name: 'The Healer',
        title: 'Idealistic, Creative, Compassionate',
        description: 'INFPs are idealistic, creative souls guided by their values. They are empathetic, open-minded, and deeply committed to personal growth and helping others.',
        strengths: ['Idealistic', 'Creative', 'Empathetic', 'Open-minded', 'Passionate', 'Authentic'],
        weaknesses: ['Can be too idealistic', 'May take things personally', 'Sometimes impractical', 'Can be self-critical'],
        careers: ['Writer', 'Counselor', 'Artist', 'Psychologist', 'Social Worker', 'Teacher'],
        relationships: 'INFPs seek deep, authentic connections. They are supportive, loyal partners who value understanding.',
        growth: 'Practice being more practical and assertive. Learn to separate personal worth from external criticism.'
    },
    'INTP': {
        name: 'The Architect',
        title: 'Analytical, Innovative, Curious',
        description: 'INTPs are logical, analytical thinkers who love theories and abstract concepts. They are innovative problem-solvers with a deep curiosity about how things work.',
        strengths: ['Analytical', 'Innovative', 'Logical', 'Objective', 'Creative', 'Independent'],
        weaknesses: ['Can be insensitive', 'May be absent-minded', 'Sometimes condescending', 'Can procrastinate'],
        careers: ['Scientist', 'Programmer', 'Professor', 'Analyst', 'Researcher', 'Engineer'],
        relationships: 'INTPs value intellectual connection. They are loyal partners who show love through sharing ideas.',
        growth: 'Work on emotional awareness and follow-through. Practice being more considerate of others\' feelings.'
    },
    'ESTP': {
        name: 'The Dynamo',
        title: 'Energetic, Action-Oriented, Bold',
        description: 'ESTPs are energetic, action-oriented individuals who live in the moment. They are bold, practical problem-solvers who excel in dynamic environments.',
        strengths: ['Energetic', 'Practical', 'Bold', 'Perceptive', 'Sociable', 'Adaptable'],
        weaknesses: ['Can be impulsive', 'May be insensitive', 'Risk-taking', 'Sometimes impatient'],
        careers: ['Entrepreneur', 'Sales', 'Paramedic', 'Detective', 'Athlete', 'Marketer'],
        relationships: 'ESTPs are fun, spontaneous partners who bring excitement to relationships.',
        growth: 'Practice long-term planning and consideration of consequences. Work on emotional sensitivity.'
    },
    'ESFP': {
        name: 'The Performer',
        title: 'Spontaneous, Enthusiastic, Friendly',
        description: 'ESFPs are spontaneous, enthusiastic people who love being the center of attention. They bring fun and energy wherever they go and have a natural ability to entertain.',
        strengths: ['Enthusiastic', 'Friendly', 'Spontaneous', 'Practical', 'Observant', 'Excellent people skills'],
        weaknesses: ['Can be impulsive', 'May avoid conflict', 'Sometimes unfocused', 'Can be overly sensitive'],
        careers: ['Actor', 'Event Planner', 'Sales', 'Teacher', 'Social Worker', 'Artist'],
        relationships: 'ESFPs are warm, generous partners who create fun, exciting relationships.',
        growth: 'Work on long-term planning and focus. Practice handling criticism constructively.'
    },
    'ENFP': {
        name: 'The Champion',
        title: 'Enthusiastic, Creative, Warm',
        description: 'ENFPs are enthusiastic, creative individuals with a contagious energy. They see life as full of possibilities and are driven by their values and desire to help others.',
        strengths: ['Enthusiastic', 'Creative', 'Warm', 'Excellent communicators', 'Curious', 'Empathetic'],
        weaknesses: ['Can be unfocused', 'May overthink', 'Sometimes overly emotional', 'Can procrastinate'],
        careers: ['Counselor', 'Writer', 'Teacher', 'Actor', 'Entrepreneur', 'Social Worker'],
        relationships: 'ENFPs are passionate, supportive partners who value deep emotional connections.',
        growth: 'Practice focus and follow-through. Work on managing emotions and being more practical.'
    },
    'ENTP': {
        name: 'The Visionary',
        title: 'Innovative, Clever, Energetic',
        description: 'ENTPs are innovative, clever individuals who love intellectual challenges. They are quick-witted debaters who enjoy exploring new ideas and possibilities.',
        strengths: ['Innovative', 'Clever', 'Energetic', 'Quick-thinking', 'Charismatic', 'Knowledgeable'],
        weaknesses: ['Can be argumentative', 'May be insensitive', 'Sometimes unfocused', 'Can be intolerant'],
        careers: ['Entrepreneur', 'Lawyer', 'Inventor', 'Consultant', 'Journalist', 'Programmer'],
        relationships: 'ENTPs are stimulating partners who value intellectual connection and debate.',
        growth: 'Work on emotional sensitivity and follow-through. Practice patience and consideration.'
    },
    'ESTJ': {
        name: 'The Supervisor',
        title: 'Organized, Practical, Traditional',
        description: 'ESTJs are organized, practical individuals who value tradition and order. They are natural leaders who excel at managing and organizing people and resources.',
        strengths: ['Organized', 'Practical', 'Decisive', 'Direct', 'Responsible', 'Traditional'],
        weaknesses: ['Can be inflexible', 'May be judgmental', 'Sometimes insensitive', 'Can be stubborn'],
        careers: ['Manager', 'Military Officer', 'Judge', 'Financial Officer', 'Administrator', 'Coach'],
        relationships: 'ESTJs are loyal, committed partners who value stability and traditional values.',
        growth: 'Practice flexibility and open-mindedness. Work on emotional awareness and empathy.'
    },
    'ESFJ': {
        name: 'The Provider',
        title: 'Caring, Social, Traditional',
        description: 'ESFJs are caring, social individuals who thrive on helping others. They are warm, conscientious, and have a strong desire to belong and contribute to their community.',
        strengths: ['Caring', 'Social', 'Loyal', 'Practical', 'Organized', 'Supportive'],
        weaknesses: ['Can be too selfless', 'May be needy', 'Sometimes inflexible', 'Can be overly sensitive'],
        careers: ['Nurse', 'Teacher', 'Social Worker', 'Event Coordinator', 'Office Manager', 'Counselor'],
        relationships: 'ESFJs are devoted, warm partners who create harmonious, supportive relationships.',
        growth: 'Learn to prioritize self-care. Practice accepting change and handling criticism.'
    },
    'ENFJ': {
        name: 'The Teacher',
        title: 'Charismatic, Inspiring, Altruistic',
        description: 'ENFJs are charismatic, inspiring leaders who are driven by their desire to help others reach their potential. They are natural teachers with excellent people skills.',
        strengths: ['Charismatic', 'Inspiring', 'Altruistic', 'Excellent communicators', 'Empathetic', 'Organized'],
        weaknesses: ['Can be overly idealistic', 'May be too selfless', 'Sometimes manipulative', 'Can be overprotective'],
        careers: ['Teacher', 'Counselor', 'Politician', 'Coach', 'HR Manager', 'Public Relations'],
        relationships: 'ENFJs are devoted partners who invest deeply in relationships and personal growth.',
        growth: 'Work on self-care and boundaries. Practice accepting that you can\'t help everyone.'
    },
    'ENTJ': {
        name: 'The Commander',
        title: 'Bold, Strategic, Confident',
        description: 'ENTJs are bold, strategic leaders who excel at organizing and planning. They are confident, decisive, and driven to achieve their goals efficiently.',
        strengths: ['Strategic', 'Confident', 'Bold', 'Efficient', 'Charismatic', 'Strong-willed'],
        weaknesses: ['Can be arrogant', 'May be insensitive', 'Sometimes impatient', 'Can be stubborn'],
        careers: ['CEO', 'Lawyer', 'Business Consultant', 'Judge', 'Entrepreneur', 'Military Leader'],
        relationships: 'ENTJs are committed partners who value growth and achievement in relationships.',
        growth: 'Practice empathy and patience. Work on being more flexible and emotionally expressive.'
    }
};

/**
 * Generate a unique 5-digit ID
 */
function generateUniqueId() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

/**
 * Get existing session or create new one
 * @param {string} identifier - Session identifier (email-phone or IP address)
 * @returns {Object} - Session object
 */
export function getOrCreateSession(identifier) {
    let session = sessions.get(identifier);
    
    if (!session) {
        session = {
            id: generateUniqueId(),
            identifier: identifier, // Store the identifier (could be email-phone or IP)
            ipAddress: identifier, // Keep for backward compatibility
            name: null,
            userInfo: null, // Will store: {name, phone, email, rollNumber, institution}
            state: 'NAME_REQUEST', // NAME_REQUEST, ASSESSMENT_START, TEST_IN_PROGRESS, TEST_COMPLETE
            currentQuestion: 0,
            answers: [],
            mbtiType: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            conversationHistory: []
        };
        sessions.set(identifier, session);
        console.log(`✅ New session created: ${session.id} for identifier: ${identifier.substring(0, 20)}...`);
        
        // Persist immediately so admin can see incomplete sessions even after restart
        saveSession(session).catch(err => console.error('Failed to persist new session:', err));
    }
    
    return session;
}

/**
 * Update session data
 */
/**
 * Update existing session
 * @param {string} identifier - Session identifier (email-phone or IP address)
 * @param {Object} updates - Updates to apply to session
 * @returns {Object} - Updated session object
 */
export function updateSession(identifier, updates) {
    const session = sessions.get(identifier);
    if (session) {
        Object.assign(session, updates, { updatedAt: new Date() });
        sessions.set(identifier, session);
        
        // Persist updates so admin always sees current state
        saveSession(session).catch(err => console.error('Failed to persist session update:', err));
    }
    return session;
}

/**
 * Save session to file system
 */
export async function saveSession(session) {
    try {
        const sessionsDir = path.join(__dirname, 'data', 'sessions');
        await fs.mkdir(sessionsDir, { recursive: true });
        
        const filePath = path.join(sessionsDir, `${session.id}.json`);
        await fs.writeFile(filePath, JSON.stringify(session, null, 2));
        
        console.log(`Session ${session.id} saved to file system`);
    } catch (error) {
        console.error('Error saving session:', error);
    }
}

/**
 * Calculate MBTI type from answers
 */
export function calculateMBTIType(answers) {
    const scores = {
        'E': 0, 'I': 0,
        'S': 0, 'N': 0,
        'T': 0, 'F': 0,
        'J': 0, 'P': 0
    };
    
    answers.forEach((answer, index) => {
        const question = SNTI_QUESTIONS[index];
        if (answer === 'A') {
            // A corresponds to first letter of the type
            scores[question.type.split('/')[0]]++;
        } else {
            // B corresponds to second letter
            scores[question.type.split('/')[1]]++;
        }
    });
    
    const type = 
        (scores.E >= scores.I ? 'E' : 'I') +
        (scores.S >= scores.N ? 'S' : 'N') +
        (scores.T >= scores.F ? 'T' : 'F') +
        (scores.J >= scores.P ? 'J' : 'P');
    
    return type;
}

/**
 * Get all sessions (for admin view)
 */
export function getAllSessions() {
    return Array.from(sessions.values());
}

/**
 * Clear old sessions (older than 24 hours)
 */
export function clearOldSessions() {
    const now = new Date();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
    
    let cleared = 0;
    sessions.forEach((session, key) => {
        if (new Date(session.createdAt) < oneDayAgo) {
            sessions.delete(key);
            cleared++;
        }
    });
    
    console.log(`Cleared ${cleared} old sessions`);
    return cleared;
}

// Clear old sessions every hour
setInterval(clearOldSessions, 60 * 60 * 1000);
