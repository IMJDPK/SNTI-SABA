import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { 
    getOrCreateSession, 
    updateSession, 
    saveSession, 
    calculateMBTIType,
    calculateMBTITypeYesNo,
    SNTI_QUESTIONS,
    SNTI_QUESTIONS_BALANCED,
    MBTI_TYPES
} from './session_manager.js';
import { incrementCounter } from './metrics_store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: join(__dirname, '../.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL_NAME = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
const OPENROUTER_URL = process.env.OPENROUTER_URL || 'https://openrouter.ai/api/v1/chat/completions';

const RISK_KEYWORDS = {
    RED: [
        'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die',
        'self-harm', 'hurt myself', 'i should disappear', 'no reason to live'
    ],
    AMBER: [
        'hopeless', 'panic attacks', 'can\'t sleep', 'drugs', 'alcohol',
        'violence', 'fight everyone', 'run away', 'drop out', 'worthless'
    ]
};

// Initialize Gemini only when a key is configured.
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

async function generateAIText(prompt) {
    // Prefer OpenRouter when configured.
    if (OPENROUTER_API_KEY) {
        const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
                'X-Title': 'SNTI-SABA Psychology Chat'
            },
            body: JSON.stringify({
                model: OPENROUTER_MODEL_NAME,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter request failed (${response.status}): ${errorText.slice(0, 300)}`);
        }

        const payload = await response.json();
        const text = payload?.choices?.[0]?.message?.content;
        if (!text || !text.trim()) {
            throw new Error('OpenRouter returned an empty response');
        }
        return text.trim();
    }

    if (!genAI) {
        throw new Error('No AI provider configured. Set OPENROUTER_API_KEY or GEMINI_API_KEY.');
    }

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });
    const result = await model.generateContent(prompt);
    const geminiResponse = await result.response;
    return geminiResponse.text();
}

export function evaluateBehaviorRisk(userMessage = '') {
    const lower = String(userMessage).toLowerCase();
    const redHits = RISK_KEYWORDS.RED.filter((k) => lower.includes(k));
    const amberHits = RISK_KEYWORDS.AMBER.filter((k) => lower.includes(k));

    if (redHits.length > 0) {
        return {
            level: 'RED',
            requiresHumanIntervention: true,
            flags: redHits,
            note: 'Immediate safeguarding review recommended.'
        };
    }

    if (amberHits.length > 0) {
        return {
            level: 'AMBER',
            requiresHumanIntervention: true,
            flags: amberHits,
            note: 'Follow-up review recommended within 24 hours.'
        };
    }

    return {
        level: 'GREEN',
        requiresHumanIntervention: false,
        flags: [],
        note: null
    };
}

export async function generateTypeAwareGuidanceResponse(userMessage, profile, conversationHistory = []) {
    const typeCode = profile?.mbtiType || 'UNKNOWN';
    const studentName = profile?.name || 'Student';
    const historyLines = (conversationHistory || []).slice(-6).map((m) => {
        const role = m.sender === 'user' ? 'Student' : 'Assistant';
        return `${role}: ${m.text}`;
    }).join('\n');

    const prompt = `You are SABA, a child-safe psychology and learning support assistant.

Safety requirements:
- Keep language age-appropriate and compassionate.
- Never shame or frighten the student.
- If severe self-harm or suicide intent appears, urge immediate contact with local emergency services and a trusted adult.
- Provide practical coping steps, emotional validation, and clear next actions.

Student profile:
- Name: ${studentName}
- MBTI Type: ${typeCode}
- Risk Tier from assessment: ${profile?.riskTier || 'GREEN'}

Type-aware guidance requirement:
- Personalize your suggestions to MBTI strengths and growth areas.
- Start with a supportive acknowledgment, then 2-4 actionable steps.

Conversation context:
${historyLines || 'No prior messages.'}

Student message:
${userMessage}

Respond as SABA:`;

    return generateAIText(prompt);
}

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
            
            // Determine assessment variant based on age
            const age = parseInt(userInfo.age, 10);
            if (age >= 10 && age <= 17) {
                session.assessmentVariant = 'balanced';
            } else {
                session.assessmentVariant = 'classic';
            }
            
            // Set language preference
            session.language = userInfo.language || 'english';
            
            // Generate session ID with phone last 4 digits for easy identification
            const timestamp = Date.now().toString().slice(-6);
            const phoneDigits = userInfo.phone.slice(-4);
            session.id = `SNTI-${timestamp}-${phoneDigits}`;
            // Skip name request state, go directly to assessment start
            session.state = 'ASSESSMENT_START';
            
            console.log(`👤 User registered: ${userInfo.name} (${userInfo.email}), Age: ${age}, Variant: ${session.assessmentVariant}, Language: ${session.language}, Session: ${session.id}`);
        }
        
        // Add user message to conversation history
        session.conversationHistory.push({
            sender: 'user',
            text: userMessage,
            timestamp: new Date()
        });

        // Safety monitoring: record risk signals for admin review and human escalation.
        const riskSignal = evaluateBehaviorRisk(userMessage);
        if (riskSignal.level !== 'GREEN') {
            const existingFlags = Array.isArray(session.riskFlags) ? session.riskFlags : [];
            const mergedFlags = Array.from(new Set([...existingFlags, ...riskSignal.flags]));
            session.alertLevel = riskSignal.level;
            session.riskFlags = mergedFlags;
            session.requiresHumanIntervention = Boolean(riskSignal.requiresHumanIntervention);
            session.lastRiskAt = new Date().toISOString();
            updateSession(sessionIdentifier, session);
        }

        if (riskSignal.level === 'RED') {
            // Don't attempt covert detection. Provide immediate supportive response and resources.
            session.conversationHistory.push({ sender: 'assistant', text: 'CRISIS_RESPONSE_TRIGGERED', timestamp: new Date() });
            updateSession(sessionIdentifier, session);
            const crisisResponse = `I'm really sorry you're feeling this way — I want to help keep you safe. If you're thinking about harming yourself or ending your life, please contact your local emergency services right now or call a crisis hotline. ` +
                `If you're in the United States you can call or text 988 to reach the Suicide & Crisis Lifeline. ` +
                `If you're elsewhere, please reach out to local emergency services or a trusted person nearby. Would you like me to help find resources or connect you with professional support?`;

            return {
                response: crisisResponse,
                sessionId: session.id,
                userName: session.name,
                state: 'CRISIS',
                mbtiType: session.mbtiType,
                progress: null,
                alertLevel: session.alertLevel,
                requiresHumanIntervention: session.requiresHumanIntervention
            };
        }
        
        let response = '';
        
        // STATE: ASSESSMENT_START - User registered via modal, welcome them directly
        if (session.state === 'ASSESSMENT_START') {
            session.state = 'TEST_INTRO';
            updateSession(sessionIdentifier, session);

            const institutionText = session.userInfo.institution ? ` from ${session.userInfo.institution}` : '';
            const institutionTextUrdu = session.userInfo.institution ? ` ${session.userInfo.institution} سے` : '';

            const isBalanced = session.assessmentVariant === 'balanced';
            // Determine question bank and total count dynamically
            const questionBank = isBalanced ? SNTI_QUESTIONS_BALANCED : SNTI_QUESTIONS;
            // By default use full bank length unless explicitly set
            session.totalQuestions = session.totalQuestions || questionBank.length;
            // Shuffle and store per-session so repeated runs show different orders
            function shuffleArray(arr) {
                const a = arr.slice();
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [a[j], a[i]];
                }
                return a;
            }
            session.questionBank = shuffleArray(questionBank).slice(0, session.totalQuestions);
            updateSession(sessionIdentifier, session);
            const questionCount = session.totalQuestions;
            const answerFormat = isBalanced ? 'YES or NO' : '"A" or "B"';
            const answerFormatUrdu = isBalanced ? 'ہاں یا نہیں' : '"A" یا "B"';

            if (session.language === 'urdu') {
                response = `ہیلو ${session.name}!${institutionTextUrdu} 👋 آپ سے مل کر بہت خوشی ہوئی!\n\n` +
                          `آپ کا منفرد سیشن آئی ڈی ہے: **${session.id}**\n` +
                          `(براہ کرم اس آئی ڈی کو محفوظ کریں - آپ اسے کسی بھی وقت ہماری بات چیت جاری رکھنے کے لیے استعمال کر سکتے ہیں!)\n\n` +
                          `میں آپ کو **SNTI TEST BY SULNAQ x IMJD** میں رہنمائی کرنے کے لیے یہاں ہوں - یہ Myers-Briggs Type Indicator (MBTI) پر مبنی ایک جامع شخصیت کا جائزہ ہے۔\n\n` +
                          `یہ ٹیسٹ آپ کو مدد کرے گا:\n` +
                          `✨ اپنی منفرد شخصیت کی قسم دریافت کریں\n` +
                          `💡 اپنی طاقتوں اور بہتری کے شعبوں کو سمجھیں\n` +
                          `🎯 ذاتی کیریئر کی رہنمائی حاصل کریں\n` +
                          `❤️ اپنے تعلقات کے نمونوں کے بارے میں جانیں\n\n` +
                          `ٹیسٹ ${questionCount} احتیاط سے تیار کردہ سوالات پر مشتمل ہے۔ کوئی صحیح یا غلط جواب نہیں ہے - بس اپنے ساتھ ایماندار رہیں!\n\n` +
                          `شروع کرنے کے لیے تیار ہیں، ${session.name}؟ اپنے سفر کو شروع کرنے کے لیے "START" کے ساتھ جواب دیں! 🚀`;
            } else {
                response = `Hello ${session.name}!${institutionText} 👋 It's wonderful to meet you!\n\n` +
                          `Your unique session ID is: **${session.id}**\n` +
                          `(Please save this ID - you can use it to continue our conversation anytime!)\n\n` +
                          `I'm here to guide you through the **SNTI TEST BY SULNAQ x IMJD** - a comprehensive personality assessment based on the Myers-Briggs Type Indicator (MBTI).\n\n` +
                          `This test will help you:\n` +
                          `✨ Discover your unique personality type\n` +
                          `💡 Understand your strengths and areas for growth\n` +
                          `🎯 Get personalized career guidance\n` +
                          `❤️ Learn about your relationship patterns\n\n` +
                          `The test consists of ${questionCount} carefully crafted questions. There are no right or wrong answers - just be honest with yourself!\n\n` +
                          `Ready to begin, ${session.name}? Reply with "START" to begin your journey! 🚀`;
            }
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
                          `The test consists of 12 carefully crafted questions. There are no right or wrong answers - just be honest with yourself!\n\n` +
                          `Ready to begin, ${session.name}? Reply with \"START\" to begin your journey! 🚀`;
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
                          `The test consists of 12 carefully crafted questions. There are no right or wrong answers - just be honest with yourself!\n\n` +
                          `Ready to begin, ${session.name}? Reply with \"START\" to begin your journey! 🚀`;
            } else {
                response = `Hello! 👋 Welcome to the **SNTI TEST BY SULNAQ x IMJD**!\n\n` +
                          `I'm your friendly psychology assistant, and I'll be guiding you through a personalized personality assessment.\n\n` +
                          `Before we begin, I'd love to know your name! What should I call you? 😊`;
            }
        }
        
        // STATE: TEST_INTRO - Waiting for START command
        else if (session.state === 'TEST_INTRO') {
            if (userMessage.toLowerCase().includes('start') || userMessage.toLowerCase().includes('yes') || userMessage.toLowerCase().includes('ready') || userMessage.toLowerCase().includes('شروع')) {
                session.state = 'TEST_IN_PROGRESS';
                session.currentQuestion = 0;
                updateSession(sessionIdentifier, session);
                try { await incrementCounter('totalTestsStarted', 1); } catch {}
                
                // Use the per-session prepared question bank if available
                const isBalanced = session.assessmentVariant === 'balanced';
                const questionBank = session.questionBank || (isBalanced ? SNTI_QUESTIONS_BALANCED : SNTI_QUESTIONS);
                const question = questionBank[0];
                const totalQ = session.totalQuestions || questionBank.length;
                
                if (isBalanced) {
                    // YES/NO format for balanced
                    if (session.language === 'urdu') {
                        response = `بہترین، ${session.name}! چلیں شروع کرتے ہیں! 🎯\n\n` +
                                  `**سوال 1 از ${totalQ}**\n\n` +
                                  `${question.textUrdu}\n\n` +
                                  `براہ کرم "ہاں" یا "نہیں" کے ساتھ جواب دیں`;
                    } else {
                        response = `Excellent, ${session.name}! Let's begin! 🎯\n\n` +
                                  `**Question 1 of ${totalQ}**\n\n` +
                                  `${question.text}\n\n` +
                                  `Please reply with "YES" or "NO"`;
                    }
                } else {
                    // A/B format for classic
                    if (session.language === 'urdu') {
                        response = `بہترین، ${session.name}! چلیں شروع کرتے ہیں! 🎯\n\n` +
                                  `**سوال 1 از ${totalQ}**\n\n` +
                                  `${question.textUrdu}\n\n` +
                                  `A) ${question.AUrdu}\n` +
                                  `B) ${question.BUrdu}\n\n` +
                                  `براہ کرم "A" یا "B" کے ساتھ جواب دیں`;
                    } else {
                        response = `Excellent, ${session.name}! Let's begin! 🎯\n\n` +
                                  `**Question 1 of ${totalQ}**\n\n` +
                                  `${question.text}\n\n` +
                                  `A) ${question.A}\n` +
                                  `B) ${question.B}\n\n` +
                                  `Please reply with "A" or "B"`;
                    }
                }
            } else {
                if (session.language === 'urdu') {
                    response = `کوئی مسئلہ نہیں، ${session.name}! اپنا وقت لیں۔ 😊\n\n` +
                              `SNTI TEST خود دریافت کے لیے ایک طاقتور ذریعہ ہے۔ جب آپ شروع کرنے کے لیے تیار ہوں تو "START" کے ساتھ جواب دیں!\n\n` +
                              `اگر آپ کو ٹیسٹ کے بارے میں کوئی سوال ہے تو بلا جھجھک پوچھیں!`;
                } else {
                    response = `No problem, ${session.name}! Take your time. 😊\n\n` +
                              `The SNTI TEST is a powerful tool for self-discovery. When you're ready to begin, just reply with "START"!\n\n` +
                              `If you have any questions about the test, feel free to ask!`;
                }
            }
        }
        
        // STATE: TEST_IN_PROGRESS - Ask questions and collect answers
        else if (session.state === 'TEST_IN_PROGRESS') {
            const answer = userMessage.trim().toUpperCase();
            const isBalanced = session.assessmentVariant === 'balanced';
            const questionBank = session.questionBank || (isBalanced ? SNTI_QUESTIONS_BALANCED : SNTI_QUESTIONS);
            const totalQ = session.totalQuestions || questionBank.length;
            
            let validAnswer = false;
            let normalizedAnswer = '';
            
            if (isBalanced) {
                // Strict YES/NO validation for balanced variant
                // Accept: YES, Y, NO, N, ہاں, نہیں (case-insensitive)
                if (answer === 'YES' || answer === 'Y' || answer === 'ہاں') {
                    validAnswer = true;
                    normalizedAnswer = 'YES';
                } else if (answer === 'NO' || answer === 'N' || answer === 'نہیں') {
                    validAnswer = true;
                    normalizedAnswer = 'NO';
                }
            } else {
                // A/B validation for classic variant
                if (answer === 'A' || answer === 'B') {
                    validAnswer = true;
                    normalizedAnswer = answer;
                }
            }
            
            if (validAnswer) {
                // Save the normalized answer
                session.answers.push(normalizedAnswer);
                session.currentQuestion++;
                updateSession(sessionIdentifier, session);
                
                // Check if test is complete
                if (session.currentQuestion >= totalQ) {
                    // Calculate MBTI type
                    let mbtiType;
                    if (session.assessmentVariant === 'balanced') {
                        mbtiType = calculateMBTITypeYesNo(session.answers, session.questionBank || questionBank);
                    } else {
                        mbtiType = calculateMBTIType(session.answers);
                    }
                    
                    session.mbtiType = mbtiType;
                    session.state = 'TEST_COMPLETE';
                    updateSession(sessionIdentifier, session);
                    try { await incrementCounter('totalTestsCompleted', 1); } catch {}
                    
                    // Save session to file system
                    await saveSession(session);
                    
                    // Get type description
                    const typeInfo = MBTI_TYPES[mbtiType];
                    
                    if (session.language === 'urdu') {
                        response = `🎉 **مبارک ہو، ${session.name}!** آپ نے SNTI TEST مکمل کر لیا! 🎉\n\n` +
                                  `**آپ کی شخصیت کی قسم: ${mbtiType}**\n` +
                                  `**\"${typeInfo.name}\"** - ${typeInfo.title}\n\n` +
                                  `**آپ کی قسم کے بارے میں:**\n${typeInfo.description}\n\n` +
                                  `**آپ کی طاقتیں:**\n${typeInfo.strengths.map(s => `✓ ${s}`).join('\n')}\n\n` +
                                  `**بہتری کے شعبے:**\n${typeInfo.weaknesses.map(w => `→ ${w}`).join('\n')}\n\n` +
                                  `**آپ کے لیے موزوں کیریئر راستے:**\n${typeInfo.careers.slice(0, 4).map(c => `💼 ${c}`).join('\n')}\n\n` +
                                  `**تعلقات میں:**\n${typeInfo.relationships}\n\n` +
                                  `**ذاتی ترقی کا مشورہ:**\n${typeInfo.growth}\n\n` +
                                  `---\n\n` +
                                  `آپ کے نتائج آئی ڈی کے ساتھ محفوظ کر دیے گئے ہیں: **${session.id}**\n\n` +
                                  `${session.name}، بلا جھجھک مجھ سے اپنی شخصیت کی قسم کے بارے میں کچھ بھی پوچھیں، یا ہم نفسیات، ذاتی ترقی، یا کسی بھی چیلنج کے بارے میں بات چیت جاری رکھ سکتے ہیں! 😊`;
                    } else {
                        response = `🎉 **Congratulations, ${session.name}!** You've completed the SNTI TEST! 🎉\n\n` +
                                  `**Your Personality Type: ${mbtiType}**\n` +
                                  `**\"${typeInfo.name}\"** - ${typeInfo.title}\n\n` +
                                  `**About Your Type:**\n${typeInfo.description}\n\n` +
                                  `**Your Strengths:**\n${typeInfo.strengths.map(s => `✓ ${s}`).join('\n')}\n\n` +
                                  `**Areas for Growth:**\n${typeInfo.weaknesses.map(w => `→ ${w}`).join('\n')}\n\n` +
                                  `**Career Paths That Suit You:**\n${typeInfo.careers.slice(0, 4).map(c => `💼 ${c}`).join('\n')}\n\n` +
                                  `**In Relationships:**\n${typeInfo.relationships}\n\n` +
                                  `**Personal Growth Advice:**\n${typeInfo.growth}\n\n` +
                                  `---\n\n` +
                                  `Your results have been saved with ID: **${session.id}**\n\n` +
                                  `${session.name}, feel free to ask me anything about your personality type, or we can continue our conversation about psychology, personal growth, or any challenges you're facing! 😊`;
                    }
                } else {
                    // Ask next question
                    const question = (session.questionBank || questionBank)[session.currentQuestion];
                    const progress = `${session.currentQuestion + 1}/${totalQ}`;
                    
                    if (isBalanced) {
                        // YES/NO format
                        if (session.language === 'urdu') {
                            response = `شکریہ، ${session.name}! 📝\n\n` +
                                      `**سوال ${progress}**\n\n` +
                                      `${question.textUrdu}\n\n` +
                                      `براہ کرم "ہاں" یا "نہیں" کے ساتھ جواب دیں`;
                        } else {
                            response = `Thanks, ${session.name}! 📝\n\n` +
                                      `**Question ${progress}**\n\n` +
                                      `${question.text}\n\n` +
                                      `Please reply with "YES" or "NO"`;
                        }
                    } else {
                        // A/B format
                        if (session.language === 'urdu') {
                            response = `شکریہ، ${session.name}! 📝\n\n` +
                                      `**سوال ${progress}**\n\n` +
                                      `${question.textUrdu}\n\n` +
                                      `A) ${question.AUrdu}\n` +
                                      `B) ${question.BUrdu}\n\n` +
                                      `براہ کرم "A" یا "B" کے ساتھ جواب دیں`;
                        } else {
                            response = `Thanks, ${session.name}! 📝\n\n` +
                                      `**Question ${progress}**\n\n` +
                                      `${question.text}\n\n` +
                                      `A) ${question.A}\n` +
                                      `B) ${question.B}\n\n` +
                                      `Please reply with "A" or "B"`;
                        }
                    }
                }
            } else {
                // Invalid answer - re-prompt with same question
                const question = (session.questionBank || questionBank)[session.currentQuestion];
                const progress = `${session.currentQuestion + 1}/${totalQ}`;
                
                if (isBalanced) {
                    // Error message for YES/NO variant
                    if (session.language === 'urdu') {
                        response = `${session.name}، براہ کرم صرف "ہاں" یا "نہیں" کے ساتھ جواب دیں۔ 😊\n\n` +
                                  `**سوال ${progress}**\n\n` +
                                  `${question.textUrdu}\n\n` +
                                  `براہ کرم "ہاں" یا "نہیں" کے ساتھ جواب دیں`;
                    } else {
                        response = `${session.name}, please reply with only "YES" or "NO" 😊\n\n` +
                                  `**Question ${progress}**\n\n` +
                                  `${question.text}\n\n` +
                                  `Please reply with "YES" or "NO"`;
                    }
                } else {
                    // Error message for A/B variant
                    if (session.language === 'urdu') {
                        response = `${session.name}، براہ کرم "A" یا "B" میں سے انتخاب کریں 😊\n\n` +
                                  `**سوال ${progress}**\n\n` +
                                  `${question.textUrdu}\n\n` +
                                  `A) ${question.AUrdu}\n` +
                                  `B) ${question.BUrdu}`;
                    } else {
                        response = `${session.name}, please choose either "A" or "B" 😊\n\n` +
                                  `**Question ${progress}**\n\n` +
                                  `${question.text}\n\n` +
                                  `A) ${question.A}\n` +
                                  `B) ${question.B}`;
                    }
                }
            }
        }
        
        // STATE: TEST_COMPLETE - Provide guidance and continued conversation
        else if (session.state === 'TEST_COMPLETE') {
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

            response = await generateAIText(prompt);
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
            progress: session.state === 'TEST_IN_PROGRESS' ? `${session.currentQuestion}/${session.totalQuestions || (session.questionBank ? session.questionBank.length : SNTI_QUESTIONS.length)}` : null,
            alertLevel: session.alertLevel || 'GREEN',
            requiresHumanIntervention: Boolean(session.requiresHumanIntervention),
            riskFlags: session.riskFlags || []
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

        const text = await generateAIText(prompt);

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

        const text = await generateAIText(contextPrompt);

        return text;
    } catch (error) {
        console.error('Error in conversational response:', error);
        throw new Error('Failed to generate response: ' + error.message);
    }
}

export default {
    generatePsychologyResponse,
    generateConversationalResponse,
    generateTypeAwareGuidanceResponse,
    evaluateBehaviorRisk
};
