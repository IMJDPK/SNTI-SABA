import React, { useState } from 'react';

export default function MBTIAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [studentId, setStudentId] = useState('student123');
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost:8001';

  // MBTI Questions (16 questions covering all 4 dimensions)
  const questions = [
    // Extraversion vs Introversion
    {
      id: 1,
      text: "At a party, you usually:",
      options: [
        { value: "E", text: "Interact with many people, including strangers" },
        { value: "I", text: "Stay close to a few people you know well" }
      ]
    },
    {
      id: 2,
      text: "You feel more energized when:",
      options: [
        { value: "E", text: "You're around other people and engaged in activities" },
        { value: "I", text: "You have time alone to think and reflect" }
      ]
    },
    {
      id: 3,
      text: "When working on a project, you prefer to:",
      options: [
        { value: "E", text: "Brainstorm and discuss ideas with others" },
        { value: "I", text: "Work through ideas independently first" }
      ]
    },
    {
      id: 4,
      text: "In social situations, you tend to:",
      options: [
        { value: "E", text: "Share your thoughts and feelings openly" },
        { value: "I", text: "Keep your thoughts and feelings private" }
      ]
    },
    // Sensing vs Intuition
    {
      id: 5,
      text: "When learning something new, you prefer:",
      options: [
        { value: "S", text: "Concrete examples and practical applications" },
        { value: "N", text: "Theoretical concepts and big-picture ideas" }
      ]
    },
    {
      id: 6,
      text: "You are more interested in:",
      options: [
        { value: "S", text: "What is real and practical" },
        { value: "N", text: "What is possible and innovative" }
      ]
    },
    {
      id: 7,
      text: "When given instructions, you prefer:",
      options: [
        { value: "S", text: "Step-by-step detailed directions" },
        { value: "N", text: "General guidelines and freedom to improvise" }
      ]
    },
    {
      id: 8,
      text: "You tend to focus on:",
      options: [
        { value: "S", text: "Details and specifics" },
        { value: "N", text: "Patterns and meanings" }
      ]
    },
    // Thinking vs Feeling
    {
      id: 9,
      text: "When making decisions, you rely more on:",
      options: [
        { value: "T", text: "Logical analysis and objective criteria" },
        { value: "F", text: "Personal values and impact on people" }
      ]
    },
    {
      id: 10,
      text: "You are more convinced by:",
      options: [
        { value: "T", text: "Logical reasoning and evidence" },
        { value: "F", text: "Emotional appeal and personal values" }
      ]
    },
    {
      id: 11,
      text: "When giving feedback, you tend to:",
      options: [
        { value: "T", text: "Be direct and focus on facts" },
        { value: "F", text: "Be tactful and consider feelings" }
      ]
    },
    {
      id: 12,
      text: "You value more:",
      options: [
        { value: "T", text: "Fairness and justice" },
        { value: "F", text: "Harmony and compassion" }
      ]
    },
    // Judging vs Perceiving
    {
      id: 13,
      text: "You prefer to:",
      options: [
        { value: "J", text: "Plan ahead and stick to schedules" },
        { value: "P", text: "Be spontaneous and flexible" }
      ]
    },
    {
      id: 14,
      text: "Your workspace tends to be:",
      options: [
        { value: "J", text: "Neat and organized" },
        { value: "P", text: "Flexible and adaptable to current needs" }
      ]
    },
    {
      id: 15,
      text: "When approaching deadlines, you:",
      options: [
        { value: "J", text: "Work steadily to finish early" },
        { value: "P", text: "Work best under pressure at the last minute" }
      ]
    },
    {
      id: 16,
      text: "You feel more comfortable when:",
      options: [
        { value: "J", text: "Decisions are made and plans are set" },
        { value: "P", text: "Options are kept open for new possibilities" }
      ]
    }
  ];

  const startAssessment = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/assessment/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId })
      });

      const data = await response.json();
      
      if (data.status === 'started') {
        setIsStarted(true);
        setCurrentQuestion(0);
        setAnswers([]);
      } else {
        throw new Error(data.error || 'Failed to start assessment');
      }
    } catch (err) {
      setError(`Error starting assessment: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const selectAnswer = (answerValue) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerValue;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitAssessment();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitAssessment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/assessment/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          student_id: studentId,
          answers: answers
        })
      });

      const data = await response.json();
      
      if (data.personality_type) {
        setResult(data);
        setIsComplete(true);
      } else {
        throw new Error(data.error || 'Failed to process assessment');
      }
    } catch (err) {
      setError(`Error submitting assessment: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsStarted(false);
    setIsComplete(false);
    setResult(null);
    setError(null);
  };

  const getPersonalityDescription = (type) => {
    const descriptions = {
      'INTJ': 'The Architect - Independent, strategic, and analytical. Natural leaders who enjoy solving complex problems.',
      'INTP': 'The Thinker - Curious, theoretical, and independent. Love to understand how things work.',
      'ENTJ': 'The Commander - Natural born leaders, strategic and efficient. Enjoy organizing people and resources.',
      'ENTP': 'The Debater - Quick, ingenious, and stimulating. Love to explore new ideas and possibilities.',
      'INFJ': 'The Advocate - Creative, insightful, and inspiring. Driven by values and vision for humanity.',
      'INFP': 'The Mediator - Idealistic, loyal, and passionate. Guided by their values and beliefs.',
      'ENFJ': 'The Protagonist - Charismatic, inspiring, and natural teachers. Focused on helping others grow.',
      'ENFP': 'The Campaigner - Enthusiastic, creative, and sociable. See life as full of possibilities.',
      'ISTJ': 'The Logistician - Practical, fact-minded, and reliable. The backbone of organizations.',
      'ISFJ': 'The Protector - Warm-hearted, conscientious, and cooperative. Natural caregivers.',
      'ESTJ': 'The Executive - Organized, hardworking, and traditional. Natural administrators.',
      'ESFJ': 'The Consul - Caring, social, and popular. Focused on helping and serving others.',
      'ISTP': 'The Virtuoso - Bold, practical, and experimental. Masters of tools and techniques.',
      'ISFP': 'The Adventurer - Flexible, charming, and artistic. True artists in life.',
      'ESTP': 'The Entrepreneur - Smart, energetic, and perceptive. Truly enjoy living on the edge.',
      'ESFP': 'The Entertainer - Spontaneous, energetic, and enthusiastic. Love to be the center of attention.'
    };
    return descriptions[type] || 'Personality type description not available.';
  };

  if (!isStarted && !isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">🧩 MBTI Personality Assessment</h1>
                <p className="text-blue-100 text-lg mb-6">
                  Discover your personality type through 16 carefully crafted questions. 
                  This assessment will help you understand your preferences in how you process information and make decisions.
                </p>
                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                  <p className="text-white text-sm flex items-center justify-center gap-2">
                    <span className="text-xl">⏱️</span>
                    <span><strong>Estimated time:</strong> 10-15 minutes</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    Energy Source
                  </h3>
                  <p className="text-sm text-blue-600">Extraversion vs Introversion</p>
                  <p className="text-xs text-blue-500 mt-1">How you gain and direct energy</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                    <span className="text-xl">🔍</span>
                    Information Processing
                  </h3>
                  <p className="text-sm text-green-600">Sensing vs Intuition</p>
                  <p className="text-xs text-green-500 mt-1">How you take in information</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                    <span className="text-xl">🤔</span>
                    Decision Making
                  </h3>
                  <p className="text-sm text-purple-600">Thinking vs Feeling</p>
                  <p className="text-xs text-purple-500 mt-1">How you make decisions</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                  <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                    <span className="text-xl">📅</span>
                    Lifestyle
                  </h3>
                  <p className="text-sm text-orange-600">Judging vs Perceiving</p>
                  <p className="text-xs text-orange-500 mt-1">How you approach life</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Student ID:
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full max-w-xs mx-auto px-4 py-3 border border-gray-300 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your student ID"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 max-w-md mx-auto">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">⚠️</span>
                      {error}
                    </div>
                  </div>
                )}

                <button
                  onClick={startAssessment}
                  disabled={isLoading || !studentId.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Starting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="text-xl">🚀</span>
                      Start Assessment
                    </span>
                  )}
                </button>

                <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">💡 Tip:</span> Answer honestly based on your natural preferences, not what you think others expect.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Celebration Header */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-4xl font-bold mb-4">Assessment Complete!</h1>
              <p className="text-green-100 text-lg">You've successfully discovered your personality type</p>
            </div>

            <div className="p-8">
              {/* Personality Type Display */}
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl mb-6">
                  <h2 className="text-6xl font-bold mb-4">{result.personality_type}</h2>
                  <p className="text-2xl text-blue-100">{getPersonalityDescription(result.personality_type)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Preferences Breakdown */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-blue-100">
                  <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Your Preferences
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                      <span className="font-medium">Energy Source:</span>
                      <span className="font-bold text-blue-600 text-lg">
                        {result.personality_type[0] === 'E' ? '⚡ Extraversion' : '🔋 Introversion'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                      <span className="font-medium">Information:</span>
                      <span className="font-bold text-green-600 text-lg">
                        {result.personality_type[1] === 'S' ? '👁️ Sensing' : '💡 Intuition'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                      <span className="font-medium">Decisions:</span>
                      <span className="font-bold text-purple-600 text-lg">
                        {result.personality_type[2] === 'T' ? '🧠 Thinking' : '❤️ Feeling'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                      <span className="font-medium">Lifestyle:</span>
                      <span className="font-bold text-orange-600 text-lg">
                        {result.personality_type[3] === 'J' ? '📅 Judging' : '🎯 Perceiving'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Study Recommendations */}
                <div className="bg-gradient-to-br from-green-50 to-purple-50 p-6 rounded-2xl border border-green-100">
                  <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    Study Recommendations
                  </h3>
                  <div className="space-y-3">
                    {result.personality_type[0] === 'E' ? (
                      <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                        <span className="text-blue-500 text-lg">👥</span>
                        <span className="text-sm">Study in groups and discuss concepts aloud</span>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                        <span className="text-blue-500 text-lg">🏠</span>
                        <span className="text-sm">Create quiet study spaces for deep focus</span>
                      </div>
                    )}
                    {result.personality_type[1] === 'S' ? (
                      <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                        <span className="text-green-500 text-lg">🔬</span>
                        <span className="text-sm">Use concrete examples and hands-on practice</span>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                        <span className="text-green-500 text-lg">💭</span>
                        <span className="text-sm">Focus on big picture concepts and theories</span>
                      </div>
                    )}
                    {result.personality_type[2] === 'T' ? (
                      <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                        <span className="text-purple-500 text-lg">📋</span>
                        <span className="text-sm">Organize information logically and analytically</span>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                        <span className="text-purple-500 text-lg">💖</span>
                        <span className="text-sm">Connect learning to personal values and meaning</span>
                      </div>
                    )}
                    {result.personality_type[3] === 'J' ? (
                      <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                        <span className="text-orange-500 text-lg">📊</span>
                        <span className="text-sm">Create structured study schedules and deadlines</span>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                        <span className="text-orange-500 text-lg">🌊</span>
                        <span className="text-sm">Allow flexibility and adapt study methods</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Academic Strengths */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl mb-8 border border-blue-200">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  Your Academic Strengths
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {result.analysis || "Your personality type suggests specific strengths in academic settings. Consider discussing these insights with your academic advisor or in a psychology chat session."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={resetAssessment}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Take Again
                </button>
                
                <button
                  onClick={() => window.location.href = '/chat'}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                  <span className="text-xl">💬</span>
                  Discuss Results with SABA
                </button>
              </div>

              <div className="mt-8 text-center">
                <div className="bg-white p-4 rounded-xl shadow-sm inline-block">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Assessment completed:</span> {new Date().toLocaleDateString()} 
                    <span className="mx-2">•</span>
                    <span className="font-medium">Student ID:</span> {studentId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Assessment in progress
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with Progress */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">MBTI Assessment</h1>
              <div className="text-right">
                <div className="text-lg font-semibold">Question {currentQuestion + 1} of {questions.length}</div>
                <div className="text-blue-200 text-sm">{Math.round(progress)}% Complete</div>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="p-8">
            {/* Question */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center leading-relaxed">
                {currentQ.text}
              </h2>
              
              <div className="space-y-4 max-w-2xl mx-auto">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectAnswer(option.value)}
                    className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-200 transform hover:scale-102 ${
                      answers[currentQuestion] === option.value
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-800 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                        answers[currentQuestion] === option.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQuestion] === option.value && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="text-lg leading-relaxed">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 max-w-md mx-auto">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">⚠️</span>
                  {error}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center max-w-2xl mx-auto">
              <button
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-all duration-200 font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Previous
              </button>
              
              <div className="text-center">
                <button
                  onClick={resetAssessment}
                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                >
                  Cancel Assessment
                </button>
              </div>

              <button
                onClick={nextQuestion}
                disabled={!answers[currentQuestion] || isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : currentQuestion === questions.length - 1 ? (
                  <>
                    Complete Assessment
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </>
                ) : (
                  <>
                    Next
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
