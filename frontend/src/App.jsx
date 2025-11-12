import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation.jsx';
import Home from './pages/Home.jsx';
import NewHome from './pages/NewHome.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MBTIAssessment from './pages/MBTIAssessment.jsx';
import PsychologyChat from './pages/PsychologyChat.jsx';
import Admin from './pages/Admin.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import PersonalityProfile from './pages/PersonalityProfile.jsx';
import SNTICareer from './pages/SNTICareer.jsx';
import SNTIStudents from './pages/SNTIStudents.jsx';
import ForTeams from './pages/ForTeams.jsx';
import PersonalityTypesLibrary from './pages/PersonalityTypesLibrary.jsx';
import Blog from './pages/Blog.jsx';
import AboutMBTI from './pages/AboutMBTI.jsx';
import NotFound from './pages/NotFound.jsx';
import BigFiveTest from './pages/BigFiveTest.jsx';
import EnneagramTest from './pages/EnneagramTest.jsx';
import DISCAssessment from './pages/DISCAssessment.jsx';
import RelationshipTest from './pages/RelationshipTest.jsx';
import LoveLanguageTest from './pages/LoveLanguageTest.jsx';
import WorkplaceTest from './pages/WorkplaceTest.jsx';
import './styles/design-system.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        {/* Enhanced Navigation with Dropdowns */}
        <Navigation />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<NewHome />} />
          <Route path="/old-home" element={<Home />} />
          <Route path="/mbti-assessment" element={<MBTIAssessment />} />
          <Route path="/psychology-chat" element={<PsychologyChat />} />
          <Route path="/personality/:type" element={<PersonalityProfile />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/old" element={<Admin />} />
          
          {/* Test Variant Pages */}
          <Route path="/snti-career" element={<SNTICareer />} />
          <Route path="/snti-students" element={<SNTIStudents />} />
          <Route path="/for-teams" element={<ForTeams />} />
          
          {/* Resources Pages */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/personality-types" element={<PersonalityTypesLibrary />} />
          <Route path="/about-mbti" element={<AboutMBTI />} />
          
          {/* Coming Soon Test Pages */}
          <Route path="/big-five" element={<BigFiveTest />} />
          <Route path="/enneagram" element={<EnneagramTest />} />
          <Route path="/disc-assessment" element={<DISCAssessment />} />
          <Route path="/relationship-test" element={<RelationshipTest />} />
          <Route path="/love-language" element={<LoveLanguageTest />} />
          <Route path="/workplace-test" element={<WorkplaceTest />} />
          
          {/* Placeholder routes for upcoming pages */}
          <Route path="/all-tests" element={<Home />} />
          <Route path="/for-schools" element={<Home />} />
          <Route path="/for-universities" element={<Home />} />
          <Route path="/bulk-pricing" element={<Home />} />
          <Route path="/careers-guide" element={<Home />} />
          <Route path="/compatibility" element={<Home />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* 404 Not Found - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
