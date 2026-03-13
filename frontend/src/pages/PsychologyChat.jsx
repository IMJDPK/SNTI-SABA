import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GeminiLogo from '../assets/gemini-logo.png';

import UserRegistrationModal from '../components/UserRegistrationModal';
import GoogleSignInButton from '../components/GoogleSignInButton.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function PsychologyChat() {
  const navigate = useNavigate();

  const storedAssessment = (() => {
    try {
      return JSON.parse(localStorage.getItem('snti_test_session') || 'null');
    } catch {
      return null;
    }
  })();
  const hasAssessment = Boolean(storedAssessment?.mbtiType);

  const [showRegistration, setShowRegistration] = useState(!hasAssessment);
  const [userInfo, setUserInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('snti_user') || 'null');
    } catch {
      return null;
    }
  });
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [requiresGoogleSignIn, setRequiresGoogleSignIn] = useState(
    hasAssessment && userInfo?.provider !== 'google'
  );
  const [authError, setAuthError] = useState('');
  const [sessionInfo, setSessionInfo] = useState({
    sessionId: null,
    userName: userInfo?.name || null,
    state: hasAssessment ? 'POST_ASSESSMENT_CHAT' : null,
    mbtiType: storedAssessment?.mbtiType || null,
    progress: null
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializePostAssessmentChat = async () => {
      if (!hasAssessment || requiresGoogleSignIn || messages.length > 0) return;

      try {
        setIsTyping(true);
        const token = localStorage.getItem('userToken');
        const response = await fetch(`${API_URL}/api/psychology-chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mode: 'post_assessment',
            message: `Hello, I completed my SNTI assessment. My type is ${storedAssessment.mbtiType}.`,
            conversationHistory: [],
          }),
        });

        const data = await response.json();
        if (response.status === 401 && data.requiresGoogleSignIn) {
          setRequiresGoogleSignIn(true);
          setAuthError(data.message || 'Google sign-in is required for AI guidance chat.');
          return;
        }
        if (!response.ok) throw new Error(data.error || 'Failed to start chat');

        setSessionInfo((current) => ({
          ...current,
          sessionId: data.sessionId,
          userName: data.userName || current.userName,
          state: data.state,
          mbtiType: data.mbtiType || current.mbtiType,
          progress: data.progress || null,
        }));
        setMessages([{ id: 1, text: data.response, sender: 'ai', timestamp: new Date() }]);
      } catch (error) {
        setAuthError(error.message || 'Unable to initialize chat.');
      } finally {
        setIsTyping(false);
      }
    };

    initializePostAssessmentChat();
  }, [hasAssessment, requiresGoogleSignIn, messages.length, storedAssessment?.mbtiType]);

  const handleUserRegistration = async (userData) => {
    try {
      // Store user info
      setUserInfo(userData);
      setShowRegistration(false);

        // Automatically send welcome message to backend to initialize session
        setIsTyping(true);
      
        const welcomeResponse = await fetch(`${API_URL}/api/psychology-chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: 'Hello', // Trigger message
            userInfo: userData
          })
        });

        if (!welcomeResponse.ok) {
          throw new Error('Failed to initialize session');
        }

        const data = await welcomeResponse.json();
      
        // Add AI welcome response to messages
        const aiMessage = {
          id: 1,
          text: data.response,
          sender: 'ai',
          timestamp: new Date()
        };
      
        setMessages([aiMessage]);
      
        // Update session info
        setSessionInfo({
          sessionId: data.sessionId || '',
          userName: data.userName || userData.name,
          progress: data.progress || null,
          mbtiType: data.mbtiType || null
        });
      
        setIsTyping(false);
    } catch (error) {
      console.error('Registration error:', error);
        setIsTyping(false);
      alert('Failed to register. Please try again.');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('userToken');
      // Send message to SNTI backend
      const response = await fetch(`${API_URL}/api/psychology-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(hasAssessment ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: messages,
          userInfo: userInfo, // Include user registration data
          ...(hasAssessment ? { mode: 'post_assessment' } : {}),
        })
      });

      const data = await response.json();
      if (response.status === 401 && data.requiresGoogleSignIn) {
        setRequiresGoogleSignIn(true);
        setAuthError(data.message || 'Google sign-in is required for AI guidance chat.');
        throw new Error('Google sign-in required');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response from server');
      }
      
      // Update session info
      setSessionInfo({
        sessionId: data.sessionId,
        userName: data.userName,
        state: data.state,
        mbtiType: data.mbtiType,
        progress: data.progress
      });

      // If test is complete, store session and redirect to profile page
      if ((data.state === 'ASSESSMENT_COMPLETE' || data.state === 'TEST_COMPLETE') && data.mbtiType) {
        // Store session info for profile page
        localStorage.setItem('snti_test_session', JSON.stringify({
          sessionId: data.sessionId,
          userName: data.userName,
          mbtiType: data.mbtiType,
          userInfo: userInfo
        }));
        
        // Redirect to personality profile page after short delay
        setTimeout(() => {
          navigate(`/personality/${data.mbtiType.toLowerCase()}`);
        }, 2000);
      }
      
      const aiResponse = {
        id: messages.length + 2,
        text: data.response,
        sender: 'ai',
        timestamp: new Date(data.timestamp)
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback error message
      const errorResponse = {
        id: messages.length + 2,
        text: "I apologize, but I'm having trouble connecting right now. Please make sure the backend server is running and try again.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* User Registration Modal */}
      {showRegistration && (
        <UserRegistrationModal
          onSubmit={handleUserRegistration}
          onClose={() => {
            // Navigate back to home if user dismisses the registration
            setShowRegistration(false);
            navigate('/');
          }}
        />
      )}

      {hasAssessment && requiresGoogleSignIn && (
        <div className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 p-4">
          <p className="mb-3 text-sm text-amber-900">
            Google sign-in is required to continue AI guidance after assessment. Your saved MBTI profile will be used instantly once sign-in is complete.
          </p>
          <GoogleSignInButton
            onSuccess={(data) => {
              setUserInfo({ ...data.user, provider: 'google' });
              setRequiresGoogleSignIn(false);
              setAuthError('');
            }}
            onError={(message) => setAuthError(message)}
            text="signin_with"
          />
          {authError && <p className="mt-3 text-sm text-rose-700">{authError}</p>}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg h-[700px] flex flex-col">
        {/* Header with Session Info */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                SNTI TEST BY SULNAQ x IMJD
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <img 
                  src={GeminiLogo} 
                  alt="Google Gemini" 
                  className="h-4 w-auto"
                />
                <p className="text-sm text-gray-600">
                  Powered by Google Gemini AI • Discover Your Personality Type
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">AI Online</span>
            </div>
          </div>
          
          {/* Session Info Bar */}
          {sessionInfo.sessionId && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-purple-200 flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                {sessionInfo.userName && (
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-600 font-semibold">👤</span>
                    <span className="font-medium text-gray-700">{sessionInfo.userName}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600 font-semibold">🆔</span>
                  <span className="text-gray-600">{sessionInfo.sessionId}</span>
                </div>
                {sessionInfo.progress && (
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 font-semibold">📊</span>
                    <span className="text-gray-600">Progress: {sessionInfo.progress}</span>
                  </div>
                )}
              </div>
              {sessionInfo.mbtiType && (
                <div className="flex items-center space-x-2 bg-purple-100 px-3 py-1 rounded-full">
                  <span className="text-purple-700 font-semibold">🎯 {sessionInfo.mbtiType}</span>
                </div>
              )}
            </div>
          )}
          
          {sessionInfo.mbtiType && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                🎉 Assessment complete — your type is <strong className="text-blue-700">{sessionInfo.mbtiType}</strong>. All results are free to view.
              </p>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">
                  {message.text.split('\n').map((line, i) => {
                    // Handle bold text **text**
                    if (line.includes('**')) {
                      const parts = line.split('**');
                      return (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>
                          {parts.map((part, j) => 
                            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                          )}
                        </p>
                      );
                    }
                    // Handle bullet points
                    if (line.trim().startsWith('✓') || line.trim().startsWith('→') || 
                        line.trim().startsWith('✨') || line.trim().startsWith('💼') ||
                        line.trim().startsWith('💡') || line.trim().startsWith('🎯') ||
                        line.trim().startsWith('❤️')) {
                      return <p key={i} className="ml-2 mt-1">{line}</p>;
                    }
                    // Handle section headers (lines ending with :)
                    if (line.trim().endsWith(':') && line.length < 50) {
                      return <p key={i} className="font-semibold mt-3 mb-1">{line}</p>;
                    }
                    // Regular paragraphs
                    return line ? <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p> : <br key={i} />;
                  })}
                </div>
                <p className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-4">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={requiresGoogleSignIn ? 'Sign in with Google to unlock AI guidance chat...' : 'Share your thoughts...'}
              disabled={requiresGoogleSignIn}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:text-gray-500"
              rows="2"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping || requiresGoogleSignIn}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 AI guidance is personalized by your saved SNTI type. Post-assessment chat requires Google sign-in for safety monitoring and secure profile linkage.
          </p>
        </div>
      </div>

    </div>
  );
}

export default PsychologyChat;
