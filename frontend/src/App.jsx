import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import MBTIAssessment from './pages/MBTIAssessment';
import PsychologyChat from './pages/PsychologyChat';
import Admin from './pages/Admin';
import WhatsAppIntegration from './components/WhatsAppIntegration';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-gray-900">
                  SABA
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
                  MBTI Assessment
                </Link>
                <Link 
                  to="/psychology-chat" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Psychology Chat
                </Link>
                <Link 
                  to="/whatsapp" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  WhatsApp
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
          <Route path="/whatsapp" element={<WhatsAppIntegration />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
