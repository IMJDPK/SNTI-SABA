import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { 
    getOrCreateSession, 
    updateSession, 
    saveSession, 
    calculateMBTIType,
    SNTI_QUESTIONS,
    MBTI_TYPES
} from './session_manager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: join(__dirname, '../.env') });

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyACoZFv626A3XwkwdRz8Ci-KvAD88fE36U';
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Main SNTI TEST conversation handler with session management
 * @param {string} userMessage - The user's current message
 * @param {string} sessionIdentifier - Unique identifier for the session (email-phone or IP)
 * @param {Object} userInfo - User registration data (name, phone, email, rollNumber, institution)
 * @returns {Promise<Object>} - Response with text and session info
 */
export async function handleSNTITestConversation(userMessage, sessionIdentifier, userInfo = null) {
    try {
        // Get or create session (using sessionIdentifier instead of ipAddress)
        let session = getOrCreateSession(sessionIdentifier);
        
        // Store user info if provided (from registration modal)
        if (userInfo && !session.userInfo) {
            session.userInfo = userInfo;
            session.name = userInfo.name;
            // Generate session ID with phone last 4 digits for easy identification
            const timestamp = Date.now().toString().slice(-6);
            const phoneDigits = userInfo.phone.slice(-4);
            session.id = `SNTI-${timestamp}-${phoneDigits}`;
            // Skip name request state, go directly to assessment start
            session.state = 'ASSESSMENT_START';
            
            console.log(`👤 User registered: ${userInfo.name} (${userInfo.email}), Session: ${session.id}`);
        }
        
        // Add user message to conversation history
        session.conversationHistory.push({
            sender: 'user',
            text: userMessage,
            timestamp: new Date()
        });
        
        let response = '';
        
        // STATE: ASSESSMENT_START - User registered via modal, welcome them directly
        if (session.state === 'ASSESSMENT_START') {
            session.state = 'TEST_INTRO';
            updateSession(sessionIdentifier, session);
            
            const institutionText = session.userInfo.institution ? ` from ${session.userInfo.institution}` : '';
            response = `Hello ${session.name}!${institutionText} 👋 It's wonderful to meet you!\n\n` +
                      `Your unique session ID is: **${session.id}**\n` +
                      `(Please save this ID - you can use it to continue our conversation anytime!)\n\n` +
                      `I'm here to guide you through the **SNTI TEST BY SULNAQ x IMJD** - a comprehensive personality assessment based on the Myers-Briggs Type Indicator (MBTI).\n\n` +
                      `This test will help you:\n` +
                      `✨ Discover your unique personality type\n` +
                      `💡 Understand your strengths and areas for growth\n` +
                      `🎯 Get personalized career guidance\n` +
                      `❤️ Learn about your relationship patterns\n\n` +
                      `The test consists of 20 carefully crafted questions. There are no right or wrong answers - just be honest with yourself!\n\n` +
                      `Ready to begin, ${session.name}? Reply with "START" to begin your journey! 🚀`;
        }
        
        // STATE: NAME_REQUEST - Ask for name and generate ID
        else if (session.state === 'NAME_REQUEST' && !session.name) {
            // Check if user provided their name
            const nameMatch = userMessage.match(/(?:my name is|i am|i'm|call me)\s+([a-zA-Z]+)/i);
            const isNameLike = /^[a-zA-Z]{2,20}$/.test(userMessage.trim());
            
            if (nameMatch && nameMatch[1]) {
                session.name = nameMatch[1];
                session.state = 'TEST_INTRO';
                updateSession(sessionIdentifier, session);
                
                response = `Hello ${session.name}! 👋 It's wonderful to meet you!\n\n` +
                          `Your unique session ID is: **${session.id}**\n` +
                          `(Please save this ID - you can use it to continue our conversation anytime!)\n\n` +
                          `I'm here to guide you through the **SNTI TEST BY SULNAQ x IMJD** - a comprehensive personality assessment based on the Myers-Briggs Type Indicator (MBTI).\n\n` +
                          `This test will help you:\n` +
                          `✨ Discover your unique personality type\n` +
                          `💡 Understand your strengths and areas for growth\n` +
                          `🎯 Get personalized career guidance\n` +
                          `❤️ Learn about your relationship patterns\n\n` +
                          `The test consists of 20 carefully crafted questions. There are no right or wrong answers - just be honest with yourself!\n\n` +
                          `Ready to begin, ${session.name}? Reply with "START" to begin your journey! 🚀`;
            } else if (isNameLike) {
                session.name = userMessage.trim();
                session.state = 'TEST_INTRO';
                updateSession(sessionIdentifier, session);
                
                response = `Hello ${session.name}! 👋 It's wonderful to meet you!\n\n` +
                          `Your unique session ID is: **${session.id}**\n` +
                          `(Please save this ID - you can use it to continue our conversation anytime!)\n\n` +
                          `I'm here to guide you through the **SNTI TEST BY SULNAQ x IMJD** - a comprehensive personality assessment based on the Myers-Briggs Type Indicator (MBTI).\n\n` +
                          `This test will help you:\n` +
                          `✨ Discover your unique personality type\n` +
                          `💡 Understand your strengths and areas for growth\n` +
                          `🎯 Get personalized career guidance\n` +
                          `❤️ Learn about your relationship patterns\n\n` +
                          `The test consists of 20 carefully crafted questions. There are no right or wrong answers - just be honest with yourself!\n\n` +
                          `Ready to begin, ${session.name}? Reply with "START" to begin your journey! 🚀`;
            } else {
                response = `Hello! 👋 Welcome to the **SNTI TEST BY SULNAQ x IMJD**!\n\n` +
                          `I'm your friendly psychology assistant, and I'll be guiding you through a personalized personality assessment.\n\n` +
                          `Before we begin, I'd love to know your name! What should I call you? 😊`;
            }
        }
        
        // STATE: TEST_INTRO - Waiting for START command
        else if (session.state === 'TEST_INTRO') {
            if (userMessage.toLowerCase().includes('start') || userMessage.toLowerCase().includes('yes') || userMessage.toLowerCase().includes('ready')) {
                session.state = 'TEST_IN_PROGRESS';
                session.currentQuestion = 0;
                updateSession(sessionIdentifier, session);
                
                const question = SNTI_QUESTIONS[0];
                response = `Excellent, ${session.name}! Let's begin! 🎯\n\n` +
                          `**Question 1 of 20**\n\n` +
                          `${question.text}\n\n` +
                          `A) ${question.A}\n` +
                          `B) ${question.B}\n\n` +
                          `Please reply with "A" or "B"`;
            } else {
                response = `No problem, ${session.name}! Take your time. 😊\n\n` +
                          `The SNTI TEST is a powerful tool for self-discovery. When you're ready to begin, just reply with "START"!\n\n` +
                          `If you have any questions about the test, feel free to ask!`;
            }
        }
        
        // STATE: TEST_IN_PROGRESS - Ask questions and collect answers
        else if (session.state === 'TEST_IN_PROGRESS') {
            const answer = userMessage.trim().toUpperCase();
            
            if (answer === 'A' || answer === 'B') {
                // Save the answer
                session.answers.push(answer);
                session.currentQuestion++;
                updateSession(sessionIdentifier, session);
                
                // Check if test is complete
                if (session.currentQuestion >= SNTI_QUESTIONS.length) {
                    // Calculate SNTI type
                    const mbtiType = calculateMBTIType(session.answers);
                    session.mbtiType = mbtiType;
                    session.state = 'TEST_COMPLETE';
                    updateSession(sessionIdentifier, session);
                    
                    // Save session to file system
                    await saveSession(session);
                    
                    // Get type description
                    const typeInfo = MBTI_TYPES[mbtiType];
                    
                    response = `🎉 **Congratulations, ${session.name}!** You've completed the SNTI TEST! 🎉\n\n` +
                              `**Your Personality Type: ${mbtiType}**\n` +
                              `**"${typeInfo.name}"** - ${typeInfo.title}\n\n` +
                              `**About Your Type:**\n${typeInfo.description}\n\n` +
                              `**Your Strengths:**\n${typeInfo.strengths.map(s => `✓ ${s}`).join('\n')}\n\n` +
                              `**Areas for Growth:**\n${typeInfo.weaknesses.map(w => `→ ${w}`).join('\n')}\n\n` +
                              `**Career Paths That Suit You:**\n${typeInfo.careers.slice(0, 4).map(c => `💼 ${c}`).join('\n')}\n\n` +
                              `**In Relationships:**\n${typeInfo.relationships}\n\n` +
                              `**Personal Growth Advice:**\n${typeInfo.growth}\n\n` +
                              `---\n\n` +
                              `Your results have been saved with ID: **${session.id}**\n\n` +
                              `${session.name}, feel free to ask me anything about your personality type, or we can continue our conversation about psychology, personal growth, or any challenges you're facing! 😊`;
                } else {
                    // Ask next question
                    const question = SNTI_QUESTIONS[session.currentQuestion];
                    const progress = `${session.currentQuestion + 1}/20`;
                    
                    response = `Thanks, ${session.name}! 📝\n\n` +
                              `**Question ${progress}**\n\n` +
                              `${question.text}\n\n` +
                              `A) ${question.A}\n` +
                              `B) ${question.B}\n\n` +
                              `Please reply with "A" or "B"`;
                }
            } else {
                // Invalid answer
                const question = SNTI_QUESTIONS[session.currentQuestion];
                const progress = `${session.currentQuestion + 1}/20`;
                
                response = `${session.name}, please choose either "A" or "B" 😊\n\n` +
                          `**Question ${progress}**\n\n` +
                          `${question.text}\n\n` +
                          `A) ${question.A}\n` +
                          `B) ${question.B}`;
            }
        }
        
        // STATE: TEST_COMPLETE - Provide guidance and continued conversation
        else if (session.state === 'TEST_COMPLETE') {
            // Generate personalized response using Gemini AI
            const model = genAI.getGenerativeModel({ model: MODEL_NAME });
            
            const typeInfo = MBTI_TYPES[session.mbtiType];
            
            const systemPrompt = `You are an empathetic psychology assistant helping ${session.name} (MBTI Type: ${session.mbtiType} - ${typeInfo.name}).

Key information about ${session.name}:
- Personality Type: ${session.mbtiType}
- Type Description: ${typeInfo.description}
- Strengths: ${typeInfo.strengths.join(', ')}
- Growth Areas: ${typeInfo.weaknesses.join(', ')}

Your role:
- Always address them by their name (${session.name})
- Provide personalized advice based on their ${session.mbtiType} type
- Be warm, supportive, and professional
- Offer specific, actionable guidance
- Relate advice to their personality type when relevant
- Remember their session ID: ${session.id}

Conversation history:
${session.conversationHistory.slice(-5).map(m => `${m.sender === 'user' ? session.name : 'Assistant'}: ${m.text}`).join('\n')}

Respond to their message with empathy and personalized guidance:`;

            const prompt = `${systemPrompt}\n\n${session.name}: ${userMessage}\n\nAssistant:`;
            
            const result = await model.generateContent(prompt);
            const aiResponse = await result.response;
            response = aiResponse.text();
        }
        
        // Add assistant response to conversation history
        session.conversationHistory.push({
            sender: 'assistant',
            text: response,
            timestamp: new Date()
        });
        updateSession(sessionIdentifier, session);
        
        return {
            response,
            sessionId: session.id,
            userName: session.name,
            state: session.state,
            mbtiType: session.mbtiType,
            progress: session.state === 'TEST_IN_PROGRESS' ? `${session.currentQuestion}/${SNTI_QUESTIONS.length}` : null
        };
        
    } catch (error) {
        console.error('Error in SNTI TEST conversation:', error);
        throw new Error('Failed to process conversation: ' + error.message);
    }
}

/**
 * Generate empathetic psychology response using Gemini AI
 * @param {string} userMessage - The user's message
 * @param {string} context - Additional context or system prompt
 * @returns {Promise<string>} - AI generated response
 */
export async function generatePsychologyResponse(userMessage, context = '') {
    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const systemPrompt = `You are an empathetic, professional psychology assistant. 
Your role is to:
- Provide supportive, understanding responses
- Acknowledge the user's feelings and validate their experiences
- Offer helpful guidance and coping strategies
- Maintain professional boundaries while being warm and caring
- Ask thoughtful follow-up questions to understand deeper
- Suggest evidence-based psychological techniques when appropriate

${context}

Respond naturally and conversationally. Be compassionate, non-judgmental, and helpful.`;

        const prompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error('Error generating psychology response:', error);
        throw new Error('Failed to generate AI response: ' + error.message);
    }
}

/**
 * Generate conversational response with conversation history
 * @param {string} userMessage - The user's current message
 * @param {Array} conversationHistory - Array of previous messages
 * @returns {Promise<string>} - AI generated response
 */
export async function generateConversationalResponse(userMessage, conversationHistory = []) {
    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        // Build conversation context
        let contextPrompt = `You are an empathetic psychology assistant helping users with their mental health and emotional well-being. Provide supportive, understanding, and professional guidance.\n\n`;

        if (conversationHistory.length > 0) {
            contextPrompt += "Previous conversation:\n";
            // Include last 5 messages for context
            conversationHistory.slice(-5).forEach(msg => {
                const role = msg.sender === 'user' ? 'User' : 'Assistant';
                contextPrompt += `${role}: ${msg.text}\n`;
            });
            contextPrompt += "\n";
        }

        contextPrompt += `User: ${userMessage}\n\nProvide a thoughtful, empathetic response that acknowledges their feelings and offers helpful guidance:\nAssistant:`;

        const result = await model.generateContent(contextPrompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error('Error in conversational response:', error);
        throw new Error('Failed to generate response: ' + error.message);
    }
}

export default {
    generatePsychologyResponse,
    generateConversationalResponse
};
