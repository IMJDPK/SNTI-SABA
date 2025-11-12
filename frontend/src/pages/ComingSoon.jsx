import { Link } from 'react-router-dom';

function ComingSoon({ testName, testDescription, estimatedLaunch, relatedTests = [] }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Icon */}
          <div className="mb-8">
            <div className="inline-block bg-white bg-opacity-20 rounded-full p-8">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Main Content */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Coming Soon
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            {testName}
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            {testDescription}
          </p>
          
          {estimatedLaunch && (
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <div className="text-sm uppercase tracking-wider text-blue-200 mb-2">
                Estimated Launch
              </div>
              <div className="text-2xl font-bold">
                {estimatedLaunch}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              to="/mbti-assessment"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
            >
              Take TypeFinder® Test Now
            </Link>
            <Link 
              to="/"
              className="bg-transparent text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors border-2 border-white"
            >
              ← Back to Home
            </Link>
          </div>

          {/* Notify Me Form */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Get Notified When We Launch</h3>
            <p className="text-blue-100 mb-6">
              Be the first to know when this assessment becomes available
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button 
                type="submit"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                Notify Me
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Related Tests Section */}
      {relatedTests.length > 0 && (
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Available Tests You Might Like
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedTests.map((test) => (
                  <Link
                    key={test.path}
                    to={test.path}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg hover:shadow-xl transition-shadow border border-gray-200 hover:border-blue-300"
                  >
                    <div className="text-4xl mb-4">{test.icon}</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {test.name}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {test.description}
                    </p>
                    <div className="text-blue-600 font-semibold flex items-center">
                      Take Test 
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComingSoon;
