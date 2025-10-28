import axios from 'axios';

// Topic Trees for Casual Conversation Curriculum
const TOPIC_TREES = {
    kindness: {
        themes: ['empathy', 'compassion', 'helping others', 'understanding differences'],
        stories: ['The Kind Stranger', 'The Ripple Effect', 'Small Acts, Big Impact'],
        exercises: ['Random Acts of Kindness', 'Empathy Journal', 'Gratitude Practice']
    },
    responsibility: {
        themes: ['accountability', 'reliability', 'leadership', 'self-discipline'],
        stories: ['The Trusted Leader', 'Choices and Consequences', 'Building Trust'],
        exercises: ['Goal Setting', 'Time Management', 'Decision Making Practice']
    },
    identity: {
        themes: ['self-awareness', 'personal values', 'cultural heritage', 'growth mindset'],
        stories: ['The Journey Within', 'Roots and Wings', 'Finding Your Voice'],
        exercises: ['Values Exploration', 'Cultural Celebration', 'Future Self Vision']
    },
    spirituality: {
        themes: ['inner peace', 'purpose', 'connection', 'mindfulness'],
        stories: ['The Seeker\'s Path', 'Universal Wisdom', 'Sacred Moments'],
        exercises: ['Mindfulness Practice', 'Purpose Reflection', 'Gratitude Ritual']
    }
};

// MBTI-based Response Templates
const MBTI_TEMPLATES = {
    'I': {
        reflectionStyle: 'deep, thoughtful responses that allow for internal processing',
        communicationPace: 'measured and unhurried',
        socialEnergy: 'respect for personal space and one-on-one interaction'
    },
    'E': {
        reflectionStyle: 'interactive, engaging responses that encourage external processing',
        communicationPace: 'energetic and enthusiastic',
        socialEnergy: 'encouragement of social connection and group activities'
    },
    'S': {
        detailLevel: 'specific, concrete examples and practical applications',
        focusArea: 'immediate, tangible results and real-world examples',
        learningStyle: 'step-by-step guidance and practical exercises'
    },
    'N': {
        detailLevel: 'big picture concepts and future possibilities',
        focusArea: 'patterns, connections, and potential innovations',
        learningStyle: 'metaphors, analogies, and theoretical frameworks'
    },
    'T': {
        decisionFramework: 'logical analysis and objective criteria',
        feedbackStyle: 'direct, honest feedback focused on improvement',
        problemSolving: 'systematic, analytical approaches'
    },
    'F': {
        decisionFramework: 'values-based considerations and impact on people',
        feedbackStyle: 'supportive, encouraging feedback focused on growth',
        problemSolving: 'harmony-oriented, empathetic approaches'
    },
    'J': {
        structureLevel: 'clear plans and defined outcomes',
        timeManagement: 'scheduled, organized approach',
        adaptability: 'preference for closure and decision-making'
    },
    'P': {
        structureLevel: 'flexible options and open possibilities',
        timeManagement: 'adaptable, spontaneous approach',
        adaptability: 'comfort with ambiguity and exploration'
    }
};

/**
 * Detects emotions in user's message using natural language processing
 * @param {string} message - User's message
 * @returns {Object} Detected emotions and their intensities
 */
async function detectEmotions(message) {
    try {
        const response = await axios.post("http://localhost:5000/analyze/emotions", {
            text: message
        });
        return response.data.emotions;
    } catch (error) {
        console.error("Error detecting emotions:", error);
        return { neutral: 1.0 }; // Default to neutral if emotion detection fails
    }
}

/**
 * Gets a curriculum topic based on conversation context and user's progress
 * @param {string} mbtiType - User's MBTI type
 * @param {Object} emotions - Detected emotions
 * @returns {Object} Selected topic and relevant content
 */
function getCurriculumTopic(mbtiType, emotions) {
    // Select appropriate topic based on emotional state and MBTI preferences
    const dominantEmotion = Object.entries(emotions)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];
    
    // Map emotions to appropriate topics
    const topicMapping = {
        joy: ['kindness', 'identity'],
        sadness: ['spirituality', 'kindness'],
        anger: ['responsibility', 'spirituality'],
        fear: ['identity', 'responsibility'],
        neutral: Object.keys(TOPIC_TREES)
    };

    const possibleTopics = topicMapping[dominantEmotion] || topicMapping.neutral;
    const selectedTopic = possibleTopics[Math.floor(Math.random() * possibleTopics.length)];
    
    return TOPIC_TREES[selectedTopic];
}

/**
 * Creates a personalized response based on MBTI type and emotional context
 * @param {string} mbtiType - User's MBTI type
 * @param {Object} topic - Selected curriculum topic
 * @param {Object} emotions - Detected emotions
 * @returns {string} Tailored response template
 */
function createPersonalizedResponse(mbtiType, topic, emotions) {
    const preferences = mbtiType.split('').map(letter => MBTI_TEMPLATES[letter]);
    
    // Combine MBTI preferences into response style
    const responseStyle = preferences.reduce((style, pref) => ({
        ...style,
        ...pref
    }), {});

    return responseStyle;
}

/**
 * Main function to get empathetic, personalized response
 * @param {string} message - User's message
 * @param {string} mbtiType - User's MBTI type
 * @param {Array} history - Conversation history
 * @returns {Promise<string>} AI's response
 */
async function getEmpatheticResponse(message, mbtiType, history = []) {
    try {
        // Detect emotions in user's message
        const emotions = await detectEmotions(message);
        
        // Get appropriate curriculum topic
        const topic = getCurriculumTopic(mbtiType, emotions);
        
        // Create personalized response style
        const responseStyle = createPersonalizedResponse(mbtiType, topic, emotions);

        // Construct prompt for Gemini API
        const prompt = {
            role: "system",
            content: `You are SABA, an emotionally intelligent AI guide. 
            The user has MBTI type ${mbtiType}. 
            Current emotional state: ${JSON.stringify(emotions)}.
            Use this response style: ${JSON.stringify(responseStyle)}.
            Topic focus: ${JSON.stringify(topic)}.
            Maintain natural, empathetic conversation while subtly weaving in life lessons.`
        };

        // Get response from Gemini
        const res = await axios.post("http://localhost:5000/gemini/train", {
            content: message,
            systemPrompt: prompt,
            history: history
        });

        return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || 
               "I'm here to listen and support you. Would you like to explore this further?";

    } catch (error) {
        console.error("Error in empathetic response:", error);
        return "I'm here to support you, but I'm having trouble finding the right words. Can we try again?";
    }
}

export { getEmpatheticResponse, detectEmotions, TOPIC_TREES, MBTI_TEMPLATES };

