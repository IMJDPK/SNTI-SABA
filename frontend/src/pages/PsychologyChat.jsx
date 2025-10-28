import { useState, useRef, useEffect } from 'react';

function PsychologyChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 Welcome to the **SNTI TEST BY SULNAQ x IMJD**!\n\nI'm your friendly psychology assistant. Before we begin, I'd love to know your name! What should I call you? 😊",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionInfo, setSessionInfo] = useState({
    sessionId: null,
    userName: null,
    state: null,
    mbtiType: null,
    progress: null
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      // Send message to SNTI TEST backend
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/psychology-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: messages
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      
      // Update session info
      setSessionInfo({
        sessionId: data.sessionId,
        userName: data.userName,
        state: data.state,
        mbtiType: data.mbtiType,
        progress: data.progress
      });
      
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
      <div className="bg-white rounded-lg shadow-lg h-[700px] flex flex-col">
        {/* Header with Session Info */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                SNTI TEST BY SULNAQ x IMJD
              </h2>
              <p className="text-sm text-gray-600">
                Powered by Google Gemini AI • Discover Your Personality Type
              </p>
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
                  <span className="text-purple-700 font-bold">{sessionInfo.mbtiType}</span>
                </div>
              )}
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
              placeholder="Share your thoughts..."
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="2"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Connected to Google Gemini AI for empathetic, real-time psychological support. Press Enter to send.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PsychologyChat;
