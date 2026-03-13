import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isPreviewAuthEnabled } from '../utils/previewAuth.js';
import PaitechLogo from '../assets/paitech-logo.png';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const previewAuthEnabled = isPreviewAuthEnabled();

  useEffect(() => {
    const userData = localStorage.getItem('snti_user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else if (previewAuthEnabled) {
      const guestUser = { id: 'preview-user', name: 'Preview User', email: 'preview@snti.local' };
      localStorage.setItem('snti_user', JSON.stringify(guestUser));
      setUser(guestUser);
    }
    const handleStorageChange = () => {
      const d = localStorage.getItem('snti_user');
      setUser(d ? JSON.parse(d) : null);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [previewAuthEnabled]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('snti_user');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/about', label: 'About' },
    { to: '/snti-framework', label: 'The Science' },
    { to: '/beneficiaries', label: 'Beneficiaries' },
    { to: '/careers', label: 'Careers' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24 md:h-28">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={PaitechLogo}
              alt="PAITECH Logo"
              className="h-28 w-28 md:h-32 md:w-32 rounded-2xl object-contain shadow-sm"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide rounded-lg transition-colors ${
                  location.pathname === link.to
                    ? 'bg-cyan-50 text-cyan-700'
                    : 'text-blue-700 hover:text-cyan-700 hover:bg-cyan-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/dashboard"
              className="px-4 py-2 text-sm font-semibold text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {user ? 'Dashboard' : 'Gov Dashboard'}
            </Link>
            <Link
              to="/app"
              className="bg-blue-700 text-white px-5 py-2.5 text-sm rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Take Assessment
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mb-6 mt-2">
                <div className="mb-3">
                  <img src={PaitechLogo} alt="PAITECH Logo" className="h-24 w-24 rounded-2xl object-cover shadow-sm" />
                </div>
              </div>

              <div className="space-y-1 mb-6">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-semibold transition-colors ${
                      location.pathname === link.to
                        ? 'bg-cyan-50 text-cyan-700'
                        : 'text-blue-700 hover:bg-cyan-50 hover:text-cyan-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-3">
                <Link
                  to="/app"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                >
                  Take SNTI Assessment
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center border border-blue-200 text-blue-700 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Government Dashboard
                </Link>
                {user && (
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-50 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-100 transition-colors"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navigation;
