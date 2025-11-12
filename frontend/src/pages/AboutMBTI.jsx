import React from 'react';
import { Link } from 'react-router-dom';

function AboutMBTI() {
  const cognitiveFunction = [
    {
      name: 'Extraverted Thinking (Te)',
      description: 'Organizing and structuring the external world based on logic and efficiency',
      types: 'ENTJ, ESTJ, INTJ, ISTJ',
      icon: '📊'
    },
    {
      name: 'Introverted Thinking (Ti)',
      description: 'Analyzing and understanding internal logical frameworks and systems',
      types: 'INTP, ISTP, ENTP, ESTP',
      icon: '🧩'
    },
    {
      name: 'Extraverted Feeling (Fe)',
      description: 'Creating harmony and understanding others\' emotions in social settings',
      types: 'ENFJ, ESFJ, INFJ, ISFJ',
      icon: '❤️'
    },
    {
      name: 'Introverted Feeling (Fi)',
      description: 'Maintaining authentic values and deep personal emotional understanding',
      types: 'INFP, ISFP, ENFP, ESFP',
      icon: '💎'
    },
    {
      name: 'Extraverted Intuition (Ne)',
      description: 'Exploring possibilities and making connections between ideas',
      types: 'ENTP, ENFP, INTP, INFP',
      icon: '🌈'
    },
    {
      name: 'Introverted Intuition (Ni)',
      description: 'Forming insights and visualizing future implications',
      types: 'INTJ, INFJ, ENTJ, ENFJ',
      icon: '🔮'
    },
    {
      name: 'Extraverted Sensing (Se)',
      description: 'Engaging with and experiencing the present moment fully',
      types: 'ESTP, ESFP, ISTP, ISFP',
      icon: '⚡'
    },
    {
      name: 'Introverted Sensing (Si)',
      description: 'Recalling past experiences and maintaining traditions',
      types: 'ISTJ, ISFJ, ESTJ, ESFJ',
      icon: '📖'
    }
  ];

  const mbtiHistory = [
    {
      year: '1920s',
      event: 'Carl Jung\'s Psychological Types',
      description: 'Swiss psychiatrist Carl Jung published his theory of psychological types, introducing the concepts of introversion/extraversion and cognitive functions.'
    },
    {
      year: '1940s',
      event: 'Myers-Briggs Development',
      description: 'Katharine Cook Briggs and Isabel Briggs Myers began developing the MBTI assessment based on Jung\'s theories during World War II.'
    },
    {
      year: '1962',
      event: 'Official Publication',
      description: 'The Myers-Briggs Type Indicator was officially published and began gaining recognition in psychology and career counseling.'
    },
    {
      year: '1970s-Present',
      event: 'Global Adoption',
      description: 'MBTI became one of the most widely used personality assessments worldwide, with millions taking the test annually.'
    },
    {
      year: '2024',
      event: 'SNTI Evolution',
      description: 'SNTI (Smart Natural Temperament Inventory) integrates classical MBTI with AI-powered insights for modern applications.'
    }
  ];

  const dimensions = [
    {
      title: 'Energy Direction',
      pair: 'Extraversion (E) vs Introversion (I)',
      description: 'Where you direct your energy and gain motivation',
      extravert: 'Gain energy from social interaction, think out loud, broad range of relationships',
      introvert: 'Gain energy from solitude, think internally first, deep meaningful connections',
      icon: '⚡'
    },
    {
      title: 'Information Gathering',
      pair: 'Sensing (S) vs Intuition (N)',
      description: 'How you perceive and process information',
      sensing: 'Focus on facts and details, trust proven methods, live in the present',
      intuition: 'Focus on patterns and possibilities, trust innovation, future-oriented',
      icon: '👁️'
    },
    {
      title: 'Decision Making',
      pair: 'Thinking (T) vs Feeling (F)',
      description: 'How you make decisions and judgments',
      thinking: 'Decide based on logic and objective analysis, value truth and fairness',
      feeling: 'Decide based on values and impact on people, value harmony and compassion',
      icon: '🤔'
    },
    {
      title: 'Lifestyle Approach',
      pair: 'Judging (J) vs Perceiving (P)',
      description: 'How you approach structure and organization',
      judging: 'Prefer plans and structure, decisive, seek closure and completion',
      perceiving: 'Prefer flexibility and spontaneity, adaptable, keep options open',
      icon: '📅'
    }
  ];

  return (
    <div className="about-mbti">
      {/* Hero Section */}
      <section className="hero-section bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 font-display">
              Understanding MBTI & SNTI
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Discover the science, history, and methodology behind the world's most popular personality assessment. 
              Learn how SNTI builds upon Myers-Briggs foundations.
            </p>
            <Link to="/mbti-assessment" className="btn btn-secondary text-lg px-8 py-4">
              Take Your Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* What is MBTI Section */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-primary-dark mb-6 font-display text-center">
              What is MBTI?
            </h2>
            <div className="card bg-white">
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                The <strong>Myers-Briggs Type Indicator (MBTI)</strong> is a psychological assessment tool 
                that categorizes individuals into 16 distinct personality types based on their preferences 
                across four dimensions of human behavior.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Developed by Katharine Cook Briggs and her daughter Isabel Briggs Myers, the MBTI is based 
                on Carl Jung's theory of psychological types. It helps people understand their own preferences, 
                communication styles, decision-making processes, and how they interact with the world.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                <strong>SNTI (Smart Natural Temperament Inventory)</strong> enhances the classical MBTI 
                framework with AI-powered analysis, providing deeper insights into career paths, learning 
                styles, and personal development strategies tailored to your unique type.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Four Dimensions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-dark mb-4 font-display">
              The Four Personality Dimensions
            </h2>
            <p className="text-xl text-gray-600">
              Each dimension represents a spectrum of preferences that shape how you interact with the world
            </p>
          </div>

          <div className="space-y-8 max-w-5xl mx-auto">
            {dimensions.map((dimension, index) => (
              <div key={index} className="card bg-cream">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{dimension.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-primary-dark">{dimension.title}</h3>
                    <p className="text-secondary font-semibold">{dimension.pair}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">{dimension.description}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="card bg-blue-50 border-2 border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      {dimension.pair.split(' vs ')[0]}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {dimension.extravert || dimension.sensing || dimension.thinking || dimension.judging}
                    </p>
                  </div>
                  <div className="card bg-green-50 border-2 border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">
                      {dimension.pair.split(' vs ')[1].replace(/[()]/g, '')}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {dimension.introvert || dimension.intuition || dimension.feeling || dimension.perceiving}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cognitive Functions */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-dark mb-4 font-display">
              The 8 Cognitive Functions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Beyond the four letters, each personality type uses a unique stack of cognitive functions 
              that determine how they process information and make decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cognitiveFunction.map((func, index) => (
              <div key={index} className="card bg-white hover:shadow-lg transition-shadow text-center">
                <div className="text-5xl mb-4">{func.icon}</div>
                <h3 className="text-lg font-bold text-primary-dark mb-2">{func.name}</h3>
                <p className="text-sm text-gray-700 mb-3">{func.description}</p>
                <div className="text-xs text-secondary font-semibold">
                  Used by: {func.types}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-dark mb-4 font-display">
              The History of MBTI
            </h2>
            <p className="text-xl text-gray-600">
              From Jung's theories to modern AI-powered assessments
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {mbtiHistory.map((item, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {item.year}
                  </div>
                </div>
                <div className="flex-1 card bg-cream">
                  <h3 className="text-xl font-bold text-primary-dark mb-2">{item.event}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Validity & Research */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-primary-dark mb-8 font-display text-center">
              Scientific Validity & Research
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="card bg-white text-center">
                <div className="text-4xl mb-3">📊</div>
                <div className="text-3xl font-bold text-primary mb-2">88%</div>
                <div className="text-sm text-gray-600">Test-Retest Reliability</div>
              </div>
              <div className="card bg-white text-center">
                <div className="text-4xl mb-3">🌍</div>
                <div className="text-3xl font-bold text-primary mb-2">30+</div>
                <div className="text-sm text-gray-600">Languages Translated</div>
              </div>
              <div className="card bg-white text-center">
                <div className="text-4xl mb-3">👥</div>
                <div className="text-3xl font-bold text-primary mb-2">2M+</div>
                <div className="text-sm text-gray-600">Annual Users Worldwide</div>
              </div>
            </div>

            <div className="card bg-white">
              <h3 className="text-2xl font-bold text-primary-dark mb-4">Research Findings</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">✓</span>
                  <span className="text-gray-700">
                    <strong>Reliability:</strong> Studies show 75-88% consistency when individuals retake 
                    the assessment after several weeks, indicating stable personality preferences.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">✓</span>
                  <span className="text-gray-700">
                    <strong>Predictive Validity:</strong> MBTI types correlate with career satisfaction, 
                    communication preferences, and learning styles across multiple studies.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">✓</span>
                  <span className="text-gray-700">
                    <strong>Neurological Basis:</strong> Brain imaging studies reveal differences in neural 
                    activation patterns between types, supporting biological foundations of preferences.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">✓</span>
                  <span className="text-gray-700">
                    <strong>Cross-Cultural Validation:</strong> The 16 personality types have been identified 
                    across diverse cultures, demonstrating universal applicability.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Common Misconceptions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-primary-dark mb-8 font-display text-center">
              Common Misconceptions
            </h2>

            <div className="space-y-4">
              {[
                {
                  myth: 'MBTI puts you in a box',
                  truth: 'MBTI identifies preferences, not abilities. You can develop skills outside your type and express different facets in various contexts.'
                },
                {
                  myth: 'Your type never changes',
                  truth: 'While core preferences remain stable, life experiences and personal growth can shift how you express your type or lead to retyping.'
                },
                {
                  myth: 'Some types are better than others',
                  truth: 'All types have equal value. Each brings unique strengths and perspectives that are essential in different situations and roles.'
                },
                {
                  myth: 'MBTI predicts success or intelligence',
                  truth: 'MBTI measures preferences, not capability. Success depends on skills, effort, and circumstances—not personality type.'
                }
              ].map((item, index) => (
                <div key={index} className="card bg-cream">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">❌</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-red-700 mb-2">Myth: {item.myth}</h3>
                      <div className="flex items-start gap-2">
                        <span className="text-2xl text-green-600">✓</span>
                        <p className="text-gray-700">
                          <strong className="text-green-700">Truth:</strong> {item.truth}
                        </p>
                      </div>
                    </div>
                  </div>
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
              Ready to Discover Your Type?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Take the SNTI assessment to understand your unique personality type and unlock 
              personalized insights for career, relationships, and personal growth.
            </p>
            <Link to="/mbti-assessment" className="btn btn-secondary text-lg px-10 py-4">
              Take Free Assessment
            </Link>
            <p className="mt-6 text-sm opacity-75">
              ✓ 20 questions  ✓ 10 minutes  ✓ Instant detailed results
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutMBTI;
