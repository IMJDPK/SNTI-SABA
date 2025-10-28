import React, { useState, useEffect, useRef } from 'react';

export default function MBTIChat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [studentId, setStudentId] = useState('student123');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('Ready to chat');
  const messagesEndRef = useRef(null);

  const API_BASE = 'http://localhost:8001';

  useEffect(() => {
    // Add initial greeting message
    setMessages([
      {
        id: 1,
        type: 'ai',
        text: "Hello! I'm SABA, your AI psychologist. I'm here to help you with any concerns about your studies, stress, or personal development. How can I support you today?",
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setStatus('SABA is thinking...');

    try {
      const response = await fetch(`${API_BASE}/psychology/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: inputMessage, 
          student_id: studentId 
        })
      });

      const data = await response.json();
      
      if (data.reply) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          text: data.reply,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setStatus('Ready to chat');
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        text: `Sorry, I encountered an error: ${error.message}. Please make sure the MBTI server is running on port 8001.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setStatus('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = async () => {
    try {
      await fetch(`${API_BASE}/psychology/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId })
      });
      
      setMessages([
        {
          id: 1,
          type: 'ai',
          text: "Hello! I'm SABA, your AI psychologist. I'm here to help you with any concerns about your studies, stress, or personal development. How can I support you today?",
          timestamp: new Date()
        }
      ]);
      setStatus('Conversation reset');
    } catch {
      setStatus('Reset failed');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">💬 Chat with SABA</h1>
                <p className="text-blue-100">Your AI Psychology Assistant • Always Here to Help</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  status.includes('error') ? 'bg-red-500' : 
                  status.includes('thinking') ? 'bg-yellow-500' : 'bg-green-500'
                }`}>
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  {status}
                </div>
              </div>
            </div>
          </div>

          {/* Student ID Input */}
          <div className="bg-gray-50 border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Student ID:</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your student ID"
                />
              </div>
              <button
                onClick={resetConversation}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Reset Chat
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 chat-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} message-bubble`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : message.type === 'error'
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="mb-1">
                    <span className="font-medium text-xs opacity-75">
                      {message.type === 'user' ? 'You' : message.type === 'error' ? 'Error' : 'SABA'}
                    </span>
                    <span className="float-right text-xs opacity-60">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed">{message.text}</div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 max-w-xs px-4 py-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <div className="loading-dots">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <span className="text-sm">SABA is typing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t bg-gray-50 p-6">
            <div className="flex space-x-4">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                className="flex-1 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows="2"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                Send
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-500 text-center">
              💡 Ask about exam anxiety, study strategies, personality insights, career guidance, stress management, and more!
            </div>
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>🌟</span>
            Popular Chat Topics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "I'm feeling anxious about my upcoming exams. Can you help me?",
              "What are some effective study strategies for my personality type?",
              "I'm having trouble managing my time. Any advice?",
              "Can you help me understand my strengths and weaknesses?",
              "I'm unsure about my career path. What should I consider?",
              "How can I deal with academic stress and pressure?"
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(suggestion)}
                className="text-left p-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl text-sm text-gray-700 border border-blue-100 hover:border-blue-200 transition-all duration-200 group"
              >
                <span className="group-hover:text-blue-600 transition-colors">{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
