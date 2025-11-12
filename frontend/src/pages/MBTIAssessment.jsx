import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MBTIAssessment() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('snti_user');
    if (!userData) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Sample SNTI questions in Truity slider format
  const questions = [
    {
      id: 1,
      leftStatement: "I am often disorganized",
      rightStatement: "I keep myself organized",
      category: "J/P"
    },
    {
      id: 2,
      leftStatement: "I make decisions with my head",
      rightStatement: "I make decisions with my heart",
      category: "T/F"
    },
    {
      id: 3,
      leftStatement: "I like to try to innovate",
      rightStatement: "I like to use trusted methods",
      category: "S/N"
    },
    {
      id: 4,
      leftStatement: "I keep my thoughts to myself",
      rightStatement: "I speak up",
      category: "E/I"
    },
    {
      id: 5,
      leftStatement: "I seek attention from others",
      rightStatement: "I avoid attention from others",
      category: "E/I"
    },
    {
      id: 6,
      leftStatement: "I focus on possibilities",
      rightStatement: "I focus on reality",
      category: "S/N"
    },
    {
      id: 7,
      leftStatement: "I prefer flexible schedules",
      rightStatement: "I prefer structured routines",
      category: "J/P"
    },
    {
      id: 8,
      leftStatement: "I value logic over feelings",
      rightStatement: "I value feelings over logic",
      category: "T/F"
    },
    {
      id: 9,
      leftStatement: "I feel energized by social events",
      rightStatement: "I feel drained by social events",
      category: "E/I"
    },
    {
      id: 10,
      leftStatement: "I prefer abstract concepts",
      rightStatement: "I prefer concrete facts",
      category: "S/N"
    },
    {
      id: 11,
      leftStatement: "I make quick decisions",
      rightStatement: "I keep my options open",
      category: "J/P"
    },
    {
      id: 12,
      leftStatement: "I am blunt and direct",
      rightStatement: "I am tactful and diplomatic",
      category: "T/F"
    },
  ];

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    // Calculate MBTI type based on answers
    const personalityType = "INFP"; // Simplified for now
    
    // Save test results to localStorage
    const testSession = {
      type: personalityType,
      date: new Date().toISOString(),
      answers: answers,
      testType: 'MBTI Assessment'
    };
    
    const sessions = JSON.parse(localStorage.getItem('snti_test_sessions') || '[]');
    sessions.push(testSession);
    localStorage.setItem('snti_test_sessions', JSON.stringify(sessions));
    
    return `${personalityType} - The Mediator`;
  };

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your SNTI Results</h2>
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-2xl font-semibold text-blue-900">{calculateResults()}</h3>
            </div>
            <p className="text-gray-600 mb-8">
              Your personality type suggests you are introspective, creative, and value harmony. 
              You tend to be idealistic and driven by your values.
            </p>
            <button
              onClick={() => {
                setShowResults(false);
                setCurrentQuestion(0);
                setAnswers({});
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Take Assessment Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">SNTI Assessment</h2>
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-12">
          <div className="bg-gradient-to-r from-amber-100 to-amber-50 rounded-lg p-6 mb-8">
            <p className="text-center text-gray-700 font-medium uppercase text-sm tracking-wide">
              From each pair, choose the phrase that describes you best.
            </p>
          </div>
          
          {/* Slider Question */}
          <div className="space-y-8">
            {/* Left Statement */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 text-left">
                <p className="text-lg text-gray-700 font-medium">
                  {questions[currentQuestion].leftStatement}
                </p>
              </div>
              
              {/* Radio Buttons in Center */}
              <div className="flex items-center justify-center space-x-4 px-8">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${questions[currentQuestion].id}`}
                      value={value}
                      checked={answers[questions[currentQuestion].id] === value}
                      onChange={(e) => handleAnswer(questions[currentQuestion].id, parseInt(e.target.value))}
                      className="h-6 w-6 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
              
              {/* Right Statement */}
              <div className="flex-1 text-right">
                <p className="text-lg text-gray-700 font-medium">
                  {questions[currentQuestion].rightStatement}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={nextQuestion}
            disabled={!answers[questions[currentQuestion].id]}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MBTIAssessment;
