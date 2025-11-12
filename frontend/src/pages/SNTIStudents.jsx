import React from 'react';
import { Link } from 'react-router-dom';

function SNTIStudents() {
  const learningStyles = [
    {
      type: 'ISTJ',
      title: 'The Logician Student',
      style: 'Structured & Methodical',
      strengths: ['Detailed note-taking', 'Organized study schedules', 'Fact retention', 'Systematic learning'],
      tips: ['Use flashcards and outlines', 'Create study timetables', 'Break tasks into steps'],
      color: 'bg-blue-100 text-blue-800'
    },
    {
      type: 'ENFP',
      title: 'The Creative Learner',
      style: 'Innovative & Exploratory',
      strengths: ['Conceptual thinking', 'Group discussions', 'Creative projects', 'Making connections'],
      tips: ['Use mind maps and visuals', 'Study with peers', 'Explore topics deeply'],
      color: 'bg-purple-100 text-purple-800'
    },
    {
      type: 'INTJ',
      title: 'The Strategic Scholar',
      style: 'Independent & Analytical',
      strengths: ['Self-directed learning', 'Critical analysis', 'Pattern recognition', 'Long-term planning'],
      tips: ['Deep research sessions', 'Theory before practice', 'Create frameworks'],
      color: 'bg-indigo-100 text-indigo-800'
    },
    {
      type: 'ESFJ',
      title: 'The Collaborative Student',
      style: 'Social & Supportive',
      strengths: ['Study groups', 'Helping others', 'Structured environments', 'Practical application'],
      tips: ['Form study groups', 'Teach concepts to peers', 'Use real-world examples'],
      color: 'bg-green-100 text-green-800'
    }
  ];

  const academicBenefits = [
    {
      icon: '📚',
      title: 'Personalized Study Strategies',
      description: 'Discover study techniques that align with your cognitive functions for better retention and understanding.'
    },
    {
      icon: '🎓',
      title: 'Learning Style Analysis',
      description: 'Understand whether you\'re a visual, auditory, kinesthetic, or reading/writing learner based on your type.'
    },
    {
      icon: '🧠',
      title: 'Memory Optimization',
      description: 'Learn memory techniques tailored to your personality type for exam preparation and information recall.'
    },
    {
      icon: '⏰',
      title: 'Time Management',
      description: 'Get scheduling strategies that work with your natural energy patterns and focus cycles.'
    },
    {
      icon: '🤝',
      title: 'Group Work Dynamics',
      description: 'Understand your role in team projects and how to collaborate effectively with different personality types.'
    },
    {
      icon: '🎯',
      title: 'Goal Setting & Motivation',
      description: 'Discover what motivates you academically and how to set achievable goals that keep you engaged.'
    }
  ];

  const subjectRecommendations = [
    {
      category: 'Analysts (NT)',
      types: 'INTJ, INTP, ENTJ, ENTP',
      subjects: ['Mathematics', 'Physics', 'Computer Science', 'Philosophy', 'Economics', 'Engineering'],
      icon: '🔬'
    },
    {
      category: 'Diplomats (NF)',
      types: 'INFJ, INFP, ENFJ, ENFP',
      subjects: ['Psychology', 'Literature', 'Creative Writing', 'Social Work', 'Languages', 'Arts'],
      icon: '🎨'
    },
    {
      category: 'Sentinels (SJ)',
      types: 'ISTJ, ISFJ, ESTJ, ESFJ',
      subjects: ['Accounting', 'Business Admin', 'Law', 'Medicine', 'Teaching', 'Architecture'],
      icon: '📊'
    },
    {
      category: 'Explorers (SP)',
      types: 'ISTP, ISFP, ESTP, ESFP',
      subjects: ['Graphic Design', 'Sports Science', 'Culinary Arts', 'Performing Arts', 'Marketing', 'Entrepreneurship'],
      icon: '🚀'
    }
  ];

  const studentTestimonials = [
    {
      name: 'Emily Johnson',
      grade: '11th Grade, High School',
      quote: 'SNTI Students helped me understand why I struggle with memorization but excel in conceptual subjects. Now I use mind maps and visual aids—my grades have improved dramatically!',
      type: 'INTP',
      image: '👩‍🎓'
    },
    {
      name: 'Ahmed Hassan',
      grade: 'University Freshman',
      quote: 'Knowing I\'m an ESTJ helped me realize I need structured study schedules. I created a detailed timetable and my productivity doubled!',
      type: 'ESTJ',
      image: '👨‍🎓'
    },
    {
      name: 'Sofia Martinez',
      grade: 'Graduate Student',
      quote: 'As an ENFP, I always felt guilty for needing variety in my study routine. SNTI Students validated my learning style and gave me strategies that actually work for me.',
      type: 'ENFP',
      image: '👩‍💻'
    }
  ];

  const features = [
    {
      title: 'Study Habit Analysis',
      description: 'Identify your natural study patterns and optimize them for better academic performance.',
      icon: '📖'
    },
    {
      title: 'Exam Preparation Guide',
      description: 'Get personality-specific strategies for test preparation, anxiety management, and exam-day performance.',
      icon: '✍️'
    },
    {
      title: 'Major Selection Advice',
      description: 'Receive recommendations on academic majors that align with your strengths and career aspirations.',
      icon: '🎯'
    },
    {
      title: 'Campus Life Insights',
      description: 'Understand your social needs, extracurricular preferences, and how to balance academics with social life.',
      icon: '🏫'
    }
  ];

  return (
    <div className="snti-students">
      {/* Hero Section */}
      <section className="hero-section bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 bg-white text-blue-600 rounded-full text-sm font-semibold mb-4 shadow-md">
              🎓 Student Edition
            </span>
            <h1 className="text-5xl font-bold mb-6 font-display">
              Unlock Your Academic Potential with SNTI Students
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Discover your unique learning style and study strategies tailored to your personality type. 
              Achieve better grades with less stress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/mbti-assessment?variant=students" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-lg font-bold transition-colors inline-block">
                Take Student Assessment (12 min)
              </Link>
              <button className="bg-transparent hover:bg-white hover:bg-opacity-10 text-white text-lg px-8 py-4 border-2 border-white rounded-lg font-bold transition-colors">
                View Sample Study Guide
              </button>
            </div>
            <p className="mt-6 text-sm opacity-75">
              ✓ 850,000+ students assessed  ✓ 92% report improved grades  ✓ Free personalized study plan
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">850K+</div>
              <div className="text-gray-600">Students Helped</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">92%</div>
              <div className="text-gray-600">Grade Improvement</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">3,200+</div>
              <div className="text-gray-600">Schools Using SNTI</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">16</div>
              <div className="text-gray-600">Learning Profiles</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-dark mb-4 font-display">
              Why SNTI Students Assessment?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every student learns differently. Discover study strategies scientifically matched to your personality type.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {academicBenefits.map((benefit, index) => (
              <div key={index} className="card bg-white hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-primary-dark mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Styles Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-dark mb-4 font-display">
              Learning Styles by Personality Type
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understand how your personality influences your learning preferences and study habits.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {learningStyles.map((style, index) => (
              <div key={index} className="card bg-white hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`badge ${style.color} text-lg font-bold px-4 py-2`}>
                    {style.type}
                  </span>
                  <div>
                    <div className="font-semibold text-primary-dark">{style.title}</div>
                    <div className="text-sm text-gray-600">{style.style}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm font-semibold text-primary mb-2">✨ Your Strengths:</div>
                  <div className="flex flex-wrap gap-2">
                    {style.strengths.map((strength, idx) => (
                      <span key={idx} className="badge bg-gray-100 text-gray-700 text-xs">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-secondary mb-2">💡 Study Tips:</div>
                  <ul className="space-y-1">
                    {style.tips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-primary mt-1">→</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/personality-types" className="btn btn-secondary">
              Explore All 16 Learning Profiles
            </Link>
          </div>
        </div>
      </section>

      {/* Subject Recommendations */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-dark mb-4 font-display">
              Subject Recommendations by Temperament
            </h2>
            <p className="text-xl text-gray-600">
              Discover academic fields where your personality type naturally excels
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {subjectRecommendations.map((rec, index) => (
              <div key={index} className="card bg-white hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{rec.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-primary-dark">{rec.category}</h3>
                    <p className="text-sm text-gray-600">{rec.types}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-sm font-semibold text-secondary mb-3">Recommended Subjects:</div>
                  <div className="flex flex-wrap gap-2">
                    {rec.subjects.map((subject, idx) => (
                      <span key={idx} className="badge bg-primary-light text-white">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-dark mb-4 font-display">
              What's Included in Your Student Report
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="card bg-cream text-center hover:shadow-md transition-shadow">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-primary-dark mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 font-display">
              How SNTI Students Works
            </h2>
            <p className="text-xl opacity-90">
              Transform your academic performance in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 text-blue-600 shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-3">Take the Assessment</h3>
              <p className="opacity-90">
                Answer 48 questions about your study habits, learning preferences, and academic challenges. Takes just 12 minutes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 text-blue-600 shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-3">Get Your Profile</h3>
              <p className="opacity-90">
                Receive a detailed learning profile with your personality type, study strategies, and personalized recommendations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 text-blue-600 shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-3">Improve Your Grades</h3>
              <p className="opacity-90">
                Apply your customized study techniques and watch your academic performance improve while reducing stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-dark mb-4 font-display">
              Student Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Real students who transformed their academic performance with SNTI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {studentTestimonials.map((testimonial, index) => (
              <div key={index} className="card bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl">{testimonial.image}</span>
                  <span className={`badge bg-primary text-white`}>
                    {testimonial.type}
                  </span>
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="border-t border-gray-200 pt-4">
                  <div className="font-semibold text-primary-dark">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.grade}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white text-center">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 font-display">
              Ready to Unlock Your Learning Potential?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join 850,000+ students who have improved their grades and reduced academic stress. 
              Your personalized study plan awaits.
            </p>
            <Link to="/mbti-assessment?variant=students" className="btn btn-secondary text-lg px-10 py-4">
              Start Student Assessment (Free)
            </Link>
            <p className="mt-6 text-sm opacity-75">
              ✓ No account required  ✓ Results in 12 minutes  ✓ Downloadable study guide
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SNTIStudents;
