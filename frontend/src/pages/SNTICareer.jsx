import React from 'react';
import { Link } from 'react-router-dom';

function SNTICareer() {
  const careerPaths = [
    {
      type: 'INTJ',
      title: 'The Architect',
      careers: ['Software Engineer', 'Data Scientist', 'Strategic Consultant', 'Research Analyst'],
      industry: 'Technology & Innovation',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      type: 'ENTJ',
      title: 'The Commander',
      careers: ['CEO', 'Business Strategist', 'Investment Banker', 'Operations Director'],
      industry: 'Business & Finance',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      type: 'ENFJ',
      title: 'The Protagonist',
      careers: ['HR Manager', 'Counselor', 'Teacher', 'Public Relations Director'],
      industry: 'Education & Social Services',
      color: 'bg-green-100 text-green-800'
    },
    {
      type: 'ISFJ',
      title: 'The Defender',
      careers: ['Nurse', 'Administrative Manager', 'Accountant', 'Elementary Teacher'],
      industry: 'Healthcare & Administration',
      color: 'bg-cyan-100 text-cyan-800'
    },
    {
      type: 'ISTP',
      title: 'The Virtuoso',
      careers: ['Mechanical Engineer', 'Pilot', 'Forensic Analyst', 'Chef'],
      industry: 'Engineering & Skilled Trades',
      color: 'bg-orange-100 text-orange-800'
    },
    {
      type: 'ESTP',
      title: 'The Entrepreneur',
      careers: ['Sales Executive', 'Marketing Director', 'Real Estate Agent', 'Paramedic'],
      industry: 'Sales & Emergency Services',
      color: 'bg-red-100 text-red-800'
    }
  ];

  const benefits = [
    {
      icon: '🎯',
      title: 'Tailored Career Insights',
      description: 'Get personalized job recommendations based on your unique personality profile and strengths.'
    },
    {
      icon: '📊',
      title: 'Industry Analysis',
      description: 'Understand which industries align best with your cognitive functions and work style preferences.'
    },
    {
      icon: '💼',
      title: 'Career Path Mapping',
      description: 'Visualize potential career trajectories with growth opportunities suited to your personality type.'
    },
    {
      icon: '🤝',
      title: 'Work Environment Match',
      description: 'Discover corporate cultures and team dynamics where you\'ll thrive and feel most fulfilled.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer → Product Manager',
      quote: 'SNTI Career helped me realize my ENFP personality was better suited for product management. I made the switch and couldn\'t be happier!',
      image: '👩‍💼'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Recent Graduate → Data Analyst',
      quote: 'As an INTJ, I was torn between multiple career paths. The assessment gave me clarity on data science—perfect for my analytical mind.',
      image: '👨‍💻'
    },
    {
      name: 'Priya Sharma',
      role: 'Career Counselor',
      quote: 'I recommend SNTI Career to all my clients. It provides insights that traditional career tests miss completely.',
      image: '👩‍🏫'
    }
  ];

  const faqItems = [
    {
      question: 'How is SNTI Career different from other career tests?',
      answer: 'SNTI Career combines cognitive function analysis with real-world career data. Unlike generic assessments, we map your personality to specific job roles, industries, and work environments based on thousands of success stories.'
    },
    {
      question: 'How long does the assessment take?',
      answer: 'The SNTI Career assessment takes approximately 15-20 minutes. You\'ll answer 60 questions about your work preferences, decision-making style, and communication patterns.'
    },
    {
      question: 'What will I receive in my career report?',
      answer: 'Your comprehensive report includes: personality type breakdown, top 10 career matches, industry recommendations, ideal work environment, communication style, leadership potential, and personalized growth strategies.'
    },
    {
      question: 'Can I retake the test if my career goals change?',
      answer: 'Absolutely! Your personality is stable, but your career interests may evolve. We recommend retaking the assessment every 2-3 years or during major career transitions.'
    }
  ];

  return (
    <div className="snti-career">
      {/* Hero Section */}
      <section className="hero-section bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 bg-white text-blue-600 rounded-full text-sm font-semibold mb-4 shadow-md">
              🚀 Career Discovery Edition
            </span>
            <h1 className="text-5xl font-bold mb-6 font-display">
              Find Your Ideal Career Path with SNTI Career Assessment
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Discover careers that align with your personality, strengths, and cognitive functions. 
              Get personalized job recommendations backed by personality science.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/mbti-assessment?variant=career" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-lg font-bold transition-colors inline-block">
                Take Career Assessment (15 min)
              </Link>
              <button className="bg-transparent hover:bg-white hover:bg-opacity-10 text-white text-lg px-8 py-4 border-2 border-white rounded-lg font-bold transition-colors">
                View Sample Report
              </button>
            </div>
            <p className="mt-6 text-sm opacity-75">
              ✓ 2.4 Million professionals tested  ✓ 95% career satisfaction rate  ✓ Free detailed report
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">2.4M+</div>
              <div className="text-gray-600">Professionals Assessed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Career Paths Mapped</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">16</div>
              <div className="text-gray-600">Personality Types</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-dark mb-4 font-display">
              Why Choose SNTI Career Assessment?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Go beyond generic career advice. Get insights tailored to your unique cognitive functions and work style preferences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="card bg-white text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-primary-dark mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Paths Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-dark mb-4 font-display">
              Career Paths by Personality Type
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each personality type has unique strengths that align with specific career paths. 
              Discover where you'll thrive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {careerPaths.map((path, index) => (
              <div key={index} className="card bg-white hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`badge ${path.color} text-lg font-bold px-4 py-2`}>
                    {path.type}
                  </span>
                  <span className="text-gray-600 font-medium">{path.title}</span>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-secondary font-semibold mb-2">
                    🏢 {path.industry}
                  </div>
                  <div className="text-sm text-gray-600">Top Career Matches:</div>
                </div>
                <ul className="space-y-2">
                  {path.careers.map((career, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <span className="text-primary">✓</span>
                      {career}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/personality-types" className="btn btn-secondary">
              Explore All 16 Career Profiles
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 font-display">
              How SNTI Career Assessment Works
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Our scientifically-backed methodology helps you discover your ideal career path in four simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 text-blue-600 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Answer Questions</h3>
              <p className="opacity-90">
                Complete 60 questions about your work preferences, decision-making, and communication style.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 text-blue-600 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
              <p className="opacity-90">
                Our algorithm analyzes your cognitive functions and maps them to career success patterns.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 text-blue-600 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Your Report</h3>
              <p className="opacity-90">
                Receive a detailed career profile with top job matches, industry insights, and growth strategies.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 text-blue-600 shadow-lg">
                4
              </div>
              <h3 className="text-xl font-semibold mb-3">Take Action</h3>
              <p className="opacity-90">
                Use your personalized roadmap to make informed career decisions and unlock your potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-dark mb-4 font-display">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Real professionals who found their ideal careers with SNTI Career Assessment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card bg-white">
                <div className="text-5xl mb-4 text-center">{testimonial.image}</div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="border-t border-gray-200 pt-4">
                  <div className="font-semibold text-primary-dark">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary-dark mb-4 font-display">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              {faqItems.map((faq, index) => (
                <div key={index} className="card bg-cream hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold text-primary-dark mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white text-center">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 font-display">
              Ready to Discover Your Ideal Career Path?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join over 2.4 million professionals who have found career clarity with SNTI Career Assessment. 
              Your dream job is waiting.
            </p>
            <Link to="/mbti-assessment?variant=career" className="btn btn-secondary text-lg px-10 py-4">
              Start Career Assessment Now (Free)
            </Link>
            <p className="mt-6 text-sm opacity-75">
              ✓ No credit card required  ✓ Results in 15 minutes  ✓ Downloadable PDF report
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SNTICareer;
