import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import IMJDLogo from '../assets/imjd-logo.png';

const NewHome = () => {
  const [testsCount, setTestsCount] = useState(0);

  // Animated counter for tests taken
  useEffect(() => {
    const target = 15847;
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setTestsCount(target);
        clearInterval(timer);
      } else {
        setTestsCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  const testCards = [
    {
      icon: '🧠',
      title: 'SNTI Assessment',
      subtitle: '16 PERSONALITY TYPES',
      description: 'Discover your unique personality type through our scientifically validated assessment',
      link: '/mbti-assessment',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '💼',
      title: 'Career Finder',
      subtitle: 'FIND YOUR IDEAL CAREER',
      description: 'Match your personality with careers where you\'ll naturally excel and find fulfillment',
      link: '/snti-career',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: '📚',
      title: 'Study Guide',
      subtitle: 'PERSONALIZED LEARNING',
      description: 'Get study strategies tailored to your cognitive style and learning preferences',
      link: '/snti-students',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: '❤️',
      title: 'Compatibility',
      subtitle: 'RELATIONSHIPS & TEAMS',
      description: 'Understand how your type interacts with others for better relationships',
      link: '/compatibility',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: '🤖',
      title: 'AI Counselor',
      subtitle: '24/7 SUPPORT',
      description: 'Get instant psychological guidance and support from our AI-powered counselor',
      link: '/psychology-chat',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: '🏫',
      title: 'For Institutions',
      subtitle: 'BULK TESTING',
      description: 'Comprehensive assessment solutions for schools, universities, and organizations',
      link: '/for-schools',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const personalityTypes = [
    { code: 'INTJ', name: 'The Mastermind', color: 'bg-purple-100 text-purple-800' },
    { code: 'INFJ', name: 'The Counselor', color: 'bg-blue-100 text-blue-800' },
    { code: 'INFP', name: 'The Healer', color: 'bg-teal-100 text-teal-800' },
    { code: 'INTP', name: 'The Architect', color: 'bg-indigo-100 text-indigo-800' },
    { code: 'ENTJ', name: 'The Commander', color: 'bg-red-100 text-red-800' },
    { code: 'ENFJ', name: 'The Teacher', color: 'bg-green-100 text-green-800' },
    { code: 'ENFP', name: 'The Champion', color: 'bg-yellow-100 text-yellow-800' },
    { code: 'ENTP', name: 'The Visionary', color: 'bg-pink-100 text-pink-800' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-teal rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="badge mb-6">
                ✨ SCIENTIFICALLY VALIDATED ASSESSMENTS
              </div>
              <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Discover Your True <span style={{ color: 'var(--color-secondary)' }}>Personality</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Accurate, insightful personality assessments powered by AI and backed by psychological research. 
                Understand yourself better and unlock your potential.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/mbti-assessment" className="btn btn-primary btn-lg">
                  Take Free Test
                </Link>
                <Link to="/about-mbti" className="btn btn-outline btn-lg" style={{ 
                  borderColor: 'white',
                  color: 'white'
                }}>
                  Learn More
                </Link>
              </div>
              
              {/* Social Proof */}
              <div className="mt-12 flex items-center gap-8">
                <div>
                  <div className="text-3xl font-bold text-secondary">{testsCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-300">Tests Taken This Year</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">4.9★</div>
                  <div className="text-sm text-gray-300">Average Rating</div>
                </div>
              </div>
            </div>

            <div className="animate-slide-in">
              <div className="relative">
                <div className="absolute inset-0 bg-secondary opacity-20 rounded-full blur-3xl"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-secondary rounded-full mb-4">
                      <span className="text-4xl">🎯</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Quick Assessment</h3>
                    <p className="text-gray-300">Get your results in 10-15 minutes</p>
                  </div>
                  <ul className="space-y-4 text-white">
                    <li className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>No registration required to start</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Available in English & Urdu</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Detailed personality profile</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Career recommendations included</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Test Cards Section */}
      <section className="section-lg bg-secondary">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--color-primary-dark)' }}>
              Explore Our Assessments
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From personality typing to career guidance, we offer comprehensive assessments 
              designed to help you understand yourself and make better life decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testCards.map((card, index) => (
              <Link 
                key={index}
                to={card.link}
                className="card group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <div className="text-xs font-bold tracking-wider mb-2" style={{ color: 'var(--color-secondary-dark)' }}>
                  {card.subtitle}
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-primary-dark)' }}>
                  {card.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {card.description}
                </p>
                <div className="flex items-center gap-2 font-semibold" style={{ color: 'var(--color-secondary-dark)' }}>
                  Learn More 
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Personality Types Preview */}
      <section className="section bg-primary">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              The 16 Personality Types
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Based on Carl Jung's theory and Isabel Myers' research, discover which of the 16 types describes you best.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {personalityTypes.map((type, index) => (
              <Link
                key={index}
                to={`/personality/${type.code.toLowerCase()}`}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all hover:scale-105"
              >
                <div className="text-2xl font-bold text-white mb-2">{type.code}</div>
                <div className="text-sm text-gray-300">{type.name}</div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link to="/personality-types" className="btn btn-secondary btn-lg">
              View All 16 Types
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-primary-dark)' }}>
              Trusted by Leading Institutions
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-center">
              <div className="text-4xl mb-2">🎓</div>
              <div className="font-semibold text-gray-700">Universities</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🏫</div>
              <div className="font-semibold text-gray-700">Schools</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💼</div>
              <div className="font-semibold text-gray-700">Corporations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🤝</div>
              <div className="font-semibold text-gray-700">NGOs</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-lg" style={{ background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-accent-teal) 100%)' }}>
        <div className="container text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Discover Your Personality?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of students and professionals who have gained valuable insights into their personalities, 
            strengths, and ideal career paths.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/mbti-assessment" className="btn btn-primary btn-lg">
              Start Free Assessment
            </Link>
            <Link to="/for-schools" className="btn btn-outline btn-lg" style={{ 
              borderColor: 'white',
              color: 'white'
            }}>
              Institutional Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold text-white">SABA</span>
                <span className="badge">SNTI Powered</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering students through personality-based learning and AI-powered psychological support.
              </p>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm text-gray-500">Developed by:</span>
                <a 
                  href="https://imjd.asia" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:opacity-80 transition-opacity"
                >
                  <img 
                    src={IMJDLogo} 
                    alt="IMJD - Your Digital Media Partner" 
                    className="h-8 w-auto"
                  />
                </a>
              </div>
              <div className="flex space-x-4">
                <a 
                  href="https://instagram.com/imjd.asia" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://facebook.com/imjd.asia" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Tests</h4>
              <ul className="space-y-2">
                <li><Link to="/mbti-assessment" className="text-gray-400 hover:text-secondary transition-colors">SNTI Assessment</Link></li>
                <li><Link to="/snti-career" className="text-gray-400 hover:text-secondary transition-colors">Career Test</Link></li>
                <li><Link to="/snti-students" className="text-gray-400 hover:text-secondary transition-colors">Study Guide</Link></li>
                <li><Link to="/all-tests" className="text-gray-400 hover:text-secondary transition-colors">All Tests</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/personality-types" className="text-gray-400 hover:text-secondary transition-colors">16 Types</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-secondary transition-colors">Blog</Link></li>
                <li><Link to="/about-mbti" className="text-gray-400 hover:text-secondary transition-colors">About MBTI</Link></li>
                <li><Link to="/psychology-chat" className="text-gray-400 hover:text-secondary transition-colors">AI Counselor</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
              <div className="mb-4 md:mb-0">
                © 2025 SABA - Student Academic & Behavioral Assistant. All rights reserved.
              </div>
              <div className="flex space-x-6">
                <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
                <Link to="/admin" className="hover:text-secondary transition-colors">Admin</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewHome;
