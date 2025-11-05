import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import MBTIAssessment from './pages/MBTIAssessment';
import PsychologyChat from './pages/PsychologyChat';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SabaLogo from './assets/saba-logo.png';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <img 
                    src={SabaLogo} 
                    alt="SABA" 
                    className="h-20 w-auto"
                  />
                </Link>
              </div>
              <div className="flex items-center space-x-8">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link 
                  to="/mbti-assessment" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  SNTI Assessment
                </Link>
                <Link 
                  to="/psychology-chat" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Psychology Chat
                </Link>
                <Link 
                  to="/admin" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mbti-assessment" element={<MBTIAssessment />} />
          <Route path="/psychology-chat" element={<PsychologyChat />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/old" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
