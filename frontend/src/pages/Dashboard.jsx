import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('snti_user');
    if (!userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));

    // Load test history from localStorage
    // In production, this would be an API call
    const loadTestHistory = () => {
      const sessions = JSON.parse(localStorage.getItem('snti_test_sessions') || '[]');
      setTestHistory(sessions);
      setLoading(false);
    };

    loadTestHistory();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('snti_user');
    navigate('/');
  };

  const getPersonalityColor = (type) => {
    const colors = {
      'INTJ': 'bg-purple-100 text-purple-800',
      'INTP': 'bg-indigo-100 text-indigo-800',
      'ENTJ': 'bg-red-100 text-red-800',
      'ENTP': 'bg-pink-100 text-pink-800',
      'INFJ': 'bg-blue-100 text-blue-800',
      'INFP': 'bg-teal-100 text-teal-800',
      'ENFJ': 'bg-green-100 text-green-800',
      'ENFP': 'bg-yellow-100 text-yellow-800',
      'ISTJ': 'bg-gray-100 text-gray-800',
      'ISFJ': 'bg-cyan-100 text-cyan-800',
      'ESTJ': 'bg-orange-100 text-orange-800',
      'ESFJ': 'bg-rose-100 text-rose-800',
      'ISTP': 'bg-slate-100 text-slate-800',
      'ISFP': 'bg-emerald-100 text-emerald-800',
      'ESTP': 'bg-amber-100 text-amber-800',
      'ESFP': 'bg-lime-100 text-lime-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="font-heading text-4xl font-bold text-primary-dark mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">Manage your personality assessments and insights</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-dark">{testHistory.length}</div>
                  <div className="text-sm text-gray-600">Tests Completed</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-dark">
                    {testHistory.filter(t => t.completed).length}
                  </div>
                  <div className="text-sm text-gray-600">Completed Profiles</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⏱️</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-dark">
                    {testHistory.filter(t => !t.completed).length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/mbti-assessment" className="card group cursor-pointer text-center hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-3 mx-auto">
                🧠
              </div>
              <h3 className="font-semibold text-primary-dark mb-1">Take New Test</h3>
              <p className="text-sm text-gray-600">Start a new assessment</p>
            </Link>

            <Link to="/snti-career" className="card group cursor-pointer text-center hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-3 mx-auto">
                💼
              </div>
              <h3 className="font-semibold text-primary-dark mb-1">Career Guide</h3>
              <p className="text-sm text-gray-600">Find ideal careers</p>
            </Link>

            <Link to="/personality-types" className="card group cursor-pointer text-center hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-3xl mb-3 mx-auto">
                📚
              </div>
              <h3 className="font-semibold text-primary-dark mb-1">Type Library</h3>
              <p className="text-sm text-gray-600">Learn about types</p>
            </Link>

            <Link to="/psychology-chat" className="card group cursor-pointer text-center hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center text-3xl mb-3 mx-auto">
                🤖
              </div>
              <h3 className="font-semibold text-primary-dark mb-1">AI Counselor</h3>
              <p className="text-sm text-gray-600">Get guidance</p>
            </Link>
          </div>
        </div>

        {/* Test History */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-primary-dark">Your Test History</h2>
            {testHistory.length > 0 && (
              <button className="text-sm font-medium" style={{ color: 'var(--color-secondary-dark)' }}>
                Download All Results
              </button>
            )}
          </div>

          {testHistory.length === 0 ? (
            <div className="card text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Tests Yet</h3>
              <p className="text-gray-600 mb-6">Start your first personality assessment to see results here</p>
              <Link to="/mbti-assessment" className="btn btn-primary inline-flex">
                Take Your First Test
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {testHistory.map((test, index) => (
                <div key={index} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getPersonalityColor(test.personalityType)}`}>
                        {test.personalityType || 'In Progress'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary-dark">{test.testType}</h3>
                        <p className="text-sm text-gray-600">
                          {test.completed ? 'Completed' : 'In Progress'} • {new Date(test.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {test.completed ? (
                        <>
                          <Link 
                            to={`/personality/${test.personalityType?.toLowerCase()}`}
                            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                          >
                            View Profile
                          </Link>
                          <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Download PDF
                          </button>
                        </>
                      ) : (
                        <Link 
                          to="/mbti-assessment"
                          className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
                        >
                          Continue Test
                        </Link>
                      )}
                    </div>
                  </div>

                  {test.completed && test.keyTraits && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {test.keyTraits.map((trait, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        {testHistory.length > 0 && testHistory.some(t => t.completed) && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-primary-dark mb-4">Recommended For You</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💼</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-dark mb-2">Career Paths for Your Type</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Discover careers that align with your personality strengths
                    </p>
                    <Link to="/snti-career" className="text-sm font-medium" style={{ color: 'var(--color-secondary-dark)' }}>
                      Explore Careers →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">❤️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-dark mb-2">Relationship Compatibility</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Learn how your type interacts with others
                    </p>
                    <Link to="/compatibility" className="text-sm font-medium" style={{ color: 'var(--color-secondary-dark)' }}>
                      View Compatibility →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
