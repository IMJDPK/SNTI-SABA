import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation.jsx';
import LegacyThemeWrapper from './components/LegacyThemeWrapper.jsx';
import SiteFooter from './components/SiteFooter.jsx';
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
import About from './pages/About.jsx';
import SNTIFramework from './pages/SNTIFramework.jsx';
import Beneficiaries from './pages/Beneficiaries.jsx';
import Careers from './pages/Careers.jsx';
import { isPreviewAuthEnabled } from './utils/previewAuth.js';
import './styles/design-system.css';

function App() {
  const previewAuthEnabled = isPreviewAuthEnabled();
  const withLegacyTheme = (element) => <LegacyThemeWrapper>{element}</LegacyThemeWrapper>;

  return (
    <Router>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        {/* Enhanced Navigation with Dropdowns */}
        <Navigation />

        {/* Routes */}
        <div className="flex-1">
          <Routes>
          <Route path="/" element={withLegacyTheme(<NewHome />)} />
          <Route path="/app" element={<MBTIAssessment />} />
          <Route path="/old-home" element={withLegacyTheme(<Home />)} />
          <Route path="/mbti-assessment" element={<MBTIAssessment />} />
          <Route path="/psychology-chat" element={withLegacyTheme(<PsychologyChat />)} />
          <Route path="/personality/:type" element={withLegacyTheme(<PersonalityProfile />)} />
          <Route path="/about" element={<About />} />
          <Route path="/snti-framework" element={<SNTIFramework />} />
          <Route path="/beneficiaries" element={<Beneficiaries />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/admin" element={withLegacyTheme(previewAuthEnabled ? <AdminDashboard /> : <AdminLogin />)} />
          <Route path="/admin/login" element={withLegacyTheme(previewAuthEnabled ? <AdminDashboard /> : <AdminLogin />)} />
          <Route path="/admin/dashboard" element={withLegacyTheme(<AdminDashboard />)} />
          <Route path="/admin/old" element={withLegacyTheme(<Admin />)} />
          
          {/* Test Variant Pages */}
          <Route path="/snti-career" element={withLegacyTheme(<SNTICareer />)} />
          <Route path="/snti-students" element={withLegacyTheme(<SNTIStudents />)} />
          <Route path="/for-teams" element={withLegacyTheme(<ForTeams />)} />
          
          {/* Resources Pages */}
          <Route path="/blog" element={withLegacyTheme(<Blog />)} />
          <Route path="/personality-types" element={withLegacyTheme(<PersonalityTypesLibrary />)} />
          <Route path="/about-mbti" element={withLegacyTheme(<AboutMBTI />)} />
          
          {/* Coming Soon Test Pages */}
          <Route path="/big-five" element={withLegacyTheme(<BigFiveTest />)} />
          <Route path="/enneagram" element={withLegacyTheme(<EnneagramTest />)} />
          <Route path="/disc-assessment" element={withLegacyTheme(<DISCAssessment />)} />
          <Route path="/relationship-test" element={withLegacyTheme(<RelationshipTest />)} />
          <Route path="/love-language" element={withLegacyTheme(<LoveLanguageTest />)} />
          <Route path="/workplace-test" element={withLegacyTheme(<WorkplaceTest />)} />
          
          {/* Placeholder routes for upcoming pages */}
          <Route path="/all-tests" element={withLegacyTheme(<Home />)} />
          <Route path="/for-schools" element={withLegacyTheme(<Home />)} />
          <Route path="/for-universities" element={withLegacyTheme(<Home />)} />
          <Route path="/bulk-pricing" element={withLegacyTheme(<Home />)} />
          <Route path="/careers-guide" element={withLegacyTheme(<Home />)} />
          <Route path="/compatibility" element={withLegacyTheme(<Home />)} />
          
          {/* Auth Routes */}
          <Route path="/login" element={withLegacyTheme(previewAuthEnabled ? <Dashboard /> : <Login />)} />
          <Route path="/signup" element={withLegacyTheme(previewAuthEnabled ? <MBTIAssessment /> : <Signup />)} />
          <Route path="/dashboard" element={withLegacyTheme(<Dashboard />)} />
          
          {/* 404 Not Found - Must be last */}
          <Route path="*" element={withLegacyTheme(<NotFound />)} />
          </Routes>
        </div>

        <SiteFooter />
      </div>
    </Router>
  );
}

export default App;
