import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SabaLogo from '../assets/saba-logo.png';

const Navigation = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('snti_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = () => {
      const userData = localStorage.getItem('snti_user');
      setUser(userData ? JSON.parse(userData) : null);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleMouseEnter = (menu) => {
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('snti_user');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={SabaLogo} 
              alt="SABA - Student Academic & Behavioral Assistant" 
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation - disabled (use hamburger on all sizes) */}
          <div className="hidden">
            {/* SNTI Tests Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => handleMouseEnter('tests')}
              onMouseLeave={handleMouseLeave}
            >
              <button className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-semibold uppercase tracking-wide flex items-center transition-colors whitespace-nowrap ${activeDropdown === 'tests' ? 'bg-blue-50' : ''}`}>
                TESTS
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeDropdown === 'tests' && (
                <div className="absolute left-0 top-full pt-2 w-80 z-50">
                  <div className="bg-white rounded-lg shadow-xl border border-gray-100 py-3">
                    <div className="px-4 py-2">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Personality Tests</h3>
                    </div>
                    
                    <Link to="/mbti-assessment" className="block px-4 py-3 hover:bg-blue-50 transition-colors">
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">🎯</span>
                        <div>
                          <div className="font-semibold text-gray-900">TypeFinder® Personality</div>
                          <div className="text-xs text-gray-600 mt-1">Discover your 16-type personality profile</div>
                        </div>
                      </div>
                    </Link>

                    <Link to="/big-five" className="block px-4 py-3 hover:bg-blue-50 transition-colors">
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">⭐</span>
                        <div>
                          <div className="font-semibold text-gray-900">Big Five Test</div>
                          <div className="text-xs text-gray-600 mt-1">Measure your 5 core traits</div>
                        </div>
                      </div>
                    </Link>

                    <Link to="/enneagram" className="block px-4 py-3 hover:bg-blue-50 transition-colors">
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">🔷</span>
                        <div>
                          <div className="font-semibold text-gray-900">Enneagram Test</div>
                          <div className="text-xs text-gray-600 mt-1">Find your Enneagram type</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* For Institutions Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => handleMouseEnter('business')}
              onMouseLeave={handleMouseLeave}
            >
              <button className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-semibold uppercase tracking-wide flex items-center transition-colors whitespace-nowrap ${activeDropdown === 'business' ? 'bg-blue-50' : ''}`}>
                INSTITUTIONS
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeDropdown === 'business' && (
                <div className="absolute left-0 top-full pt-2 w-64 z-50">
                  <div className="bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                    <Link to="/for-schools" className="block px-4 py-3 hover:bg-blue-50 transition-colors">
                      <div className="font-semibold text-gray-900">For Schools</div>
                    </Link>
                    <Link to="/for-universities" className="block px-4 py-3 hover:bg-blue-50 transition-colors">
                      <div className="font-semibold text-gray-900">For Universities</div>
                    </Link>
                    <Link to="/for-teams" className="block px-4 py-3 hover:bg-blue-50 transition-colors">
                      <div className="font-semibold text-gray-900">For Teams</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => handleMouseEnter('resources')}
              onMouseLeave={handleMouseLeave}
            >
              <button className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-semibold uppercase tracking-wide flex items-center transition-colors whitespace-nowrap ${activeDropdown === 'resources' ? 'bg-blue-50' : ''}`}>
                RESOURCES
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeDropdown === 'resources' && (
                <div className="absolute left-0 top-full pt-2 w-64 z-50">
                  <div className="bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                    <Link to="/blog" className="block px-4 py-3 hover:bg-blue-50 transition-colors">
                      <div className="font-semibold text-gray-900">Blog</div>
                    </Link>
                    <Link to="/personality-types" className="block px-4 py-3 hover:bg-blue-50 transition-colors">
                      <div className="font-semibold text-gray-900">Personality Types</div>
                    </Link>
                    <Link to="/about-mbti" className="block px-4 py-3 hover:bg-blue-50 transition-colors">
                      <div className="font-semibold text-gray-900">About MBTI</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* AI Chat Link */}
            <Link 
              to="/psychology-chat" 
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors whitespace-nowrap ${window.location.pathname === '/psychology-chat' ? 'bg-blue-50' : ''}`}
            >
              AI CHAT
            </Link>
          </div>

          {/* Auth Buttons or User Menu - disabled on desktop (handled in drawer) */}
          <div className="hidden">
            {user ? (
              <Link 
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{user.name?.[0]?.toUpperCase()}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </Link>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 uppercase tracking-wide transition-colors whitespace-nowrap"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="bg-blue-600 text-white px-6 py-2.5 text-sm rounded-lg font-semibold hover:bg-blue-700 uppercase tracking-wide transition-colors whitespace-nowrap"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Menu Button - visible on all sizes */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu Drawer (all sizes) */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Menu Drawer */}
          <div className="fixed top-0 right-0 h-full w-80 md:w-96 bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              {/* Close Button */}
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* User Section */}
              {user ? (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">{user.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </div>
                  <Link 
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block mt-4 text-center bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-100 transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full bg-red-50 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="mb-6 pb-6 border-b border-gray-200 space-y-3">
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/signup');
                    }}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Menu Items */}
              <div className="space-y-1">
                {/* Tests Section */}
                <div className="mb-4">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">Tests</div>
                  <Link to="/mbti-assessment" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    TypeFinder® Personality
                  </Link>
                  <Link to="/big-five" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Big Five Test
                  </Link>
                  <Link to="/enneagram" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Enneagram Test
                  </Link>
                  <Link to="/disc-assessment" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    DISC Assessment
                  </Link>
                  <Link to="/relationship-test" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Relationship Test
                  </Link>
                  <Link to="/love-language" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Love Language Test
                  </Link>
                  <Link to="/workplace-test" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Workplace Personality Test
                  </Link>
                  <Link to="/snti-career" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Career Test
                  </Link>
                  <Link to="/snti-students" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Student Test
                  </Link>
                  <Link to="/all-tests" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Browse All Tests
                  </Link>
                </div>

                {/* Institutions Section */}
                <div className="mb-4">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">For Institutions</div>
                  <Link to="/for-schools" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    For Schools
                  </Link>
                  <Link to="/for-universities" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    For Universities
                  </Link>
                  <Link to="/for-teams" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    For Teams
                  </Link>
                </div>

                {/* Resources Section */}
                <div className="mb-4">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">Resources</div>
                  <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Blog
                  </Link>
                  <Link to="/personality-types" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Personality Types
                  </Link>
                  <Link to="/about-mbti" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    About MBTI
                  </Link>
                </div>

                {/* Tools */}
                <div className="mb-4">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">Tools</div>
                  <Link to="/psychology-chat" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-semibold transition-colors">
                    Psychology Chat
                  </Link>
                  <Link to="/personality-types" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Personality Types Library
                  </Link>
                  <Link to="/compatibility" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Compatibility Tool
                  </Link>
                  <Link to="/careers-guide" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Careers Guide
                  </Link>
                  <Link to="/bulk-pricing" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Bulk Pricing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navigation;
