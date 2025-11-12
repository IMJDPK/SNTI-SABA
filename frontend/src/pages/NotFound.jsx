import { Link } from 'react-router-dom';

function NotFound() {
  const popularTests = [
    { name: 'TypeFinder® Personality', path: '/mbti-assessment', icon: '🧠' },
    { name: 'Career Assessment', path: '/snti-career', icon: '💼' },
    { name: 'Student Assessment', path: '/snti-students', icon: '🎓' },
    { name: 'Team Assessment', path: '/for-teams', icon: '👥' },
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'All Tests', path: '/all-tests' },
    { name: 'Blog', path: '/blog' },
    { name: 'AI Counselor', path: '/psychology-chat' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
          <div className="text-6xl mb-6">🔍</div>
        </div>

        {/* Main Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Oops! The page you're looking for seems to have wandered off. 
          Let's help you find your way back to discovering your personality.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link 
            to="/"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            ← Back to Home
          </Link>
          <Link 
            to="/dashboard"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-blue-600"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Popular Tests */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Popular Personality Tests
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularTests.map((test) => (
              <Link
                key={test.path}
                to={test.path}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 hover:border-blue-300"
              >
                <div className="text-4xl mb-3">{test.icon}</div>
                <div className="font-semibold text-gray-900 text-sm">
                  {test.name}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Links
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <p className="text-gray-500 mt-8 text-sm">
          Still can't find what you're looking for? Try searching or{' '}
          <Link to="/psychology-chat" className="text-blue-600 hover:underline font-medium">
            chat with our AI counselor
          </Link>
        </p>
      </div>
    </div>
  );
}

export default NotFound;
