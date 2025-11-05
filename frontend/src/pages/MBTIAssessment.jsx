import { useState } from 'react';

function MBTIAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Sample SNTI questions (you can expand this)
  const questions = [
    {
      id: 1,
      text: "You find it easy to introduce yourself to other people.",
      category: "E/I"
    },
    {
      id: 2,
      text: "You often get so lost in thoughts that you ignore or forget your surroundings.",
      category: "S/N"
    },
    {
      id: 3,
      text: "You think that everyone's views should be respected regardless of whether they are supported by facts or not.",
      category: "T/F"
    },
    {
      id: 4,
      text: "You like to have a to-do list for each day.",
      category: "J/P"
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
    // Simple calculation for demo purposes
    return "INFP - The Mediator";
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

        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {questions[currentQuestion].text}
          </h3>
          
          <div className="space-y-3">
            {['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'].map((option, index) => (
              <label key={option} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${questions[currentQuestion].id}`}
                  value={5 - index}
                  checked={answers[questions[currentQuestion].id] === 5 - index}
                  onChange={(e) => handleAnswer(questions[currentQuestion].id, parseInt(e.target.value))}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
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
