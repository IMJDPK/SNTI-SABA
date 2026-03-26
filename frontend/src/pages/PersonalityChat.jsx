import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleSignInButton from '../components/GoogleSignInButton.jsx';
import { isPreviewAuthEnabled } from '../utils/previewAuth.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function PersonalityChat() {
  const navigate = useNavigate();
  const previewAuthEnabled = isPreviewAuthEnabled();
  const [theme, setTheme] = useState(() => localStorage.getItem('snti_chat_theme') || 'dark');

  const storedAssessment = (() => {
    try {
      return JSON.parse(localStorage.getItem('snti_test_session') || 'null');
    } catch {
      return null;
    }
  })();
  const hasAssessment = Boolean(storedAssessment?.mbtiType);

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
  const usePostAssessmentMode = hasAssessment;
  const [requiresGoogleSignIn, setRequiresGoogleSignIn] = useState(
    usePostAssessmentMode && !previewAuthEnabled && userInfo?.provider !== 'google'
  );
  const [authError, setAuthError] = useState('');
  const [sessionInfo, setSessionInfo] = useState({
    sessionId: null,
    userName: userInfo?.name || null,
    state: hasAssessment ? 'POST_ASSESSMENT_CHAT' : null,
    mbtiType: storedAssessment?.mbtiType || null,
    progress: null
  });

  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (!messagesContainerRef.current) return;
    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    localStorage.setItem('snti_chat_theme', theme);
  }, [theme]);

  useEffect(() => {
    const initializePostAssessmentChat = async () => {
      if (!hasAssessment || !usePostAssessmentMode || requiresGoogleSignIn || messages.length > 0) return;

      try {
        setIsTyping(true);
        const token = localStorage.getItem('userToken');
        const response = await fetch(`${API_URL}/api/personality-chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            mode: 'post_assessment',
            message: `Hello, I completed my SNTI assessment. My type is ${storedAssessment.mbtiType}.`,
            mbtiType: storedAssessment?.mbtiType,
            riskTier: storedAssessment?.riskTier,
            conversationHistory: [],
          }),
        });

        const data = await response.json();
        if (!previewAuthEnabled && response.status === 401 && data.requiresGoogleSignIn) {
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
  }, [hasAssessment, usePostAssessmentMode, previewAuthEnabled, requiresGoogleSignIn, messages.length, storedAssessment?.mbtiType]);

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
      const response = await fetch(`${API_URL}/api/personality-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: messages,
          userInfo: userInfo, // Include user registration data
          mode: usePostAssessmentMode ? 'post_assessment' : 'chat',
          ...(usePostAssessmentMode
            ? {
                mbtiType: storedAssessment?.mbtiType,
                riskTier: storedAssessment?.riskTier,
              }
            : {}),
        })
      });

      const data = await response.json();
      if (usePostAssessmentMode && !previewAuthEnabled && response.status === 401 && data.requiresGoogleSignIn) {
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
      if (!usePostAssessmentMode && (data.state === 'ASSESSMENT_COMPLETE' || data.state === 'TEST_COMPLETE') && data.mbtiType) {
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

  const starterChips = [
    'Help me understand my type better',
    'I feel anxious before exams',
    'Give me a 7-day study routine',
    'How can I improve focus?',
    'Help me build confidence',
  ];

  const showLanding = messages.length === 0 && !isTyping;
  const isDark = theme === 'dark';

  return (
    <div className={`h-[calc(100vh-6rem)] overflow-hidden md:h-[calc(100vh-7rem)] ${isDark ? 'bg-[#0b0d12] text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      <div className="mx-auto flex h-full w-full max-w-[1920px]">
      <aside className={`hidden w-64 shrink-0 px-4 py-4 xl:flex xl:flex-col ${isDark ? 'border-r border-slate-800 bg-[#11141b]' : 'border-r border-slate-200 bg-white'}`}>
        <div className="mb-6 flex items-center gap-3 px-2">
          <span className="inline-block h-3 w-3 rounded-full bg-cyan-400" aria-hidden="true" />
          <span className={`text-lg font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>SABA</span>
        </div>
        <button
          type="button"
          className={`mb-4 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${isDark ? 'border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800' : 'border border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
          onClick={() => {
            setMessages([]);
            setInputMessage('');
          }}
        >
          + New chat
        </button>
        <div className={`space-y-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <div className={`rounded-xl px-3 py-2 ${isDark ? 'bg-slate-900/70' : 'bg-slate-100'}`}>Personality type support</div>
          <div className={`rounded-xl px-3 py-2 ${isDark ? 'bg-slate-900/40' : 'bg-slate-100'}`}>Study routines</div>
          <div className={`rounded-xl px-3 py-2 ${isDark ? 'bg-slate-900/40' : 'bg-slate-100'}`}>Wellbeing check-ins</div>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <div className={`border-b px-4 py-3 sm:px-6 ${isDark ? 'border-slate-800 bg-[#0e1118]' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-lg font-semibold sm:text-xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>SNTI AI Guidance</h1>
              <p className={`mt-1 text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Personalized to your SNTI profile</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs text-emerald-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                AI Online
              </div>
              <button
                type="button"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${isDark ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800' : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {isDark ? 'Light mode' : 'Dark mode'}
              </button>
            </div>
          </div>

          {sessionInfo.sessionId && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className={`rounded-full border px-3 py-1 ${isDark ? 'border-slate-700 bg-slate-900 text-slate-300' : 'border-slate-300 bg-slate-100 text-slate-700'}`}>👤 {sessionInfo.userName || 'Student'}</span>
              <span className={`rounded-full border px-3 py-1 ${isDark ? 'border-slate-700 bg-slate-900 text-slate-300' : 'border-slate-300 bg-slate-100 text-slate-700'}`}>🆔 {sessionInfo.sessionId}</span>
              {sessionInfo.mbtiType && (
                <span className="rounded-full border border-cyan-500/50 bg-cyan-500/10 px-3 py-1 font-semibold text-cyan-200">🎯 {sessionInfo.mbtiType}</span>
              )}
              {previewAuthEnabled && (
                <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-amber-200">Testing Mode</span>
              )}
            </div>
          )}

          {usePostAssessmentMode && requiresGoogleSignIn && (
            <div className="mt-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
              <p className="mb-3 text-sm leading-6 text-amber-100">
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
              {authError && <p className="mt-3 text-sm text-rose-300">{authError}</p>}
            </div>
          )}
        </div>

        <div className="min-h-0 flex flex-1 flex-col">
          <div ref={messagesContainerRef} className={`min-h-0 flex-1 overflow-y-auto ${showLanding ? 'flex items-center justify-center px-4 py-8' : 'px-4 py-5 sm:px-6'}`}>
            {showLanding ? (
              <div className="mx-auto w-full max-w-3xl text-center">
                <div className="mb-3 text-sm text-cyan-300">Hi {sessionInfo.userName || 'there'}</div>
                <h2 className={`text-3xl font-semibold sm:text-4xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Where should we start?</h2>
                <p className={`mx-auto mt-3 max-w-2xl text-sm leading-7 sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Ask SABA anything about your personality profile, exam anxiety, focus, study planning, or emotional wellbeing.
                </p>
              </div>
            ) : (
              <div className="mx-auto w-full max-w-5xl space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="w-full px-1">
                    <div className={`mb-1 text-[11px] uppercase tracking-[0.16em] ${message.sender === 'user' ? 'text-right text-cyan-300' : isDark ? 'text-left text-slate-400' : 'text-left text-slate-500'}`}>
                      {message.sender === 'user' ? 'You' : 'SABA'}
                    </div>
                    <div className={`whitespace-pre-wrap text-sm leading-7 sm:text-base ${message.sender === 'user' ? isDark ? 'text-right text-slate-100' : 'text-right text-slate-900' : isDark ? 'text-left text-slate-200' : 'text-left text-slate-700'}`}>
                      {message.text.split('\n').map((line, i) => {
                        if (line.includes('**')) {
                          const parts = line.split('**');
                          return (
                            <p key={i} className={i > 0 ? 'mt-2' : ''}>
                              {parts.map((part, j) => (j % 2 === 1 ? <strong key={j}>{part}</strong> : part))}
                            </p>
                          );
                        }
                        if (
                          line.trim().startsWith('✓') ||
                          line.trim().startsWith('→') ||
                          line.trim().startsWith('✨') ||
                          line.trim().startsWith('💼') ||
                          line.trim().startsWith('💡') ||
                          line.trim().startsWith('🎯') ||
                          line.trim().startsWith('❤️')
                        ) {
                          return <p key={i} className="mt-1">{line}</p>;
                        }
                        if (line.trim().endsWith(':') && line.length < 50) {
                          return <p key={i} className="mb-1 mt-3 font-semibold">{line}</p>;
                        }
                        return line ? <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p> : <br key={i} />;
                      })}
                    </div>
                    <p className={`mt-2 text-[11px] ${message.sender === 'user' ? 'text-right text-slate-500' : 'text-left text-slate-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}

                {isTyping && (
                  <div className="w-full px-1 text-left">
                    <div className="mb-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">SABA</div>
                    <div className="flex space-x-1 py-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-slate-500" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-slate-500" style={{ animationDelay: '0.1s' }} />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-slate-500" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={`border-t p-4 sm:px-6 ${isDark ? 'border-slate-800 bg-[#0e1118]' : 'border-slate-200 bg-white'}`}>
            <div className="mx-auto w-full max-w-5xl">
              {showLanding && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {starterChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setInputMessage(chip)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition ${isDark ? 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:bg-slate-800' : 'border-slate-300 bg-slate-100 text-slate-700 hover:border-slate-400 hover:bg-slate-200'}`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              <div className={`rounded-3xl border p-3 shadow-lg ${isDark ? 'border-slate-700 bg-slate-900/80' : 'border-slate-300 bg-slate-50'}`}>
                <div className="flex items-end gap-3">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={usePostAssessmentMode && requiresGoogleSignIn ? 'Sign in with Google to unlock AI guidance chat...' : 'Ask SABA anything...'}
                    disabled={usePostAssessmentMode && requiresGoogleSignIn}
                    className={`max-h-32 min-h-[52px] flex-1 resize-none rounded-2xl border px-4 py-3 text-sm outline-none focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60 ${isDark ? 'border-slate-700 bg-[#11141b] text-slate-100' : 'border-slate-300 bg-white text-slate-900'}`}
                    rows="2"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping || (usePostAssessmentMode && requiresGoogleSignIn)}
                    className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </div>

              <p className={`mt-2 text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                {usePostAssessmentMode
                  ? 'AI guidance is personalized by your saved SNTI type. Post-assessment mode keeps your profile context in every response.'
                  : 'Testing mode is active. Google sign-in gating is bypassed for local testing.'}
              </p>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}

export default PersonalityChat;
