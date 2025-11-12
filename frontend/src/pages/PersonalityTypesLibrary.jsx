import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function PersonalityTypesLibrary() {
  const [selectedGroup, setSelectedGroup] = useState('all');

  const personalityTypes = [
    {
      type: 'INTJ',
      title: 'The Architect',
      nickname: 'The Mastermind',
      group: 'analysts',
      description: 'Strategic, innovative, and independent thinkers who excel at developing long-term plans and solving complex problems.',
      strengths: ['Strategic thinking', 'Independent', 'Determined', 'Innovative', 'Analytical'],
      weaknesses: ['Overly critical', 'Arrogant', 'Dismissive of emotions', 'Perfectionist'],
      careers: ['Software Engineer', 'Data Scientist', 'Strategic Consultant', 'Architect', 'Professor'],
      famous: ['Elon Musk', 'Mark Zuckerberg', 'Isaac Newton'],
      percentage: '2.1%',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      type: 'INTP',
      title: 'The Logician',
      nickname: 'The Thinker',
      group: 'analysts',
      description: 'Innovative inventors with an unquenchable thirst for knowledge and understanding of complex systems.',
      strengths: ['Analytical', 'Original', 'Open-minded', 'Curious', 'Objective'],
      weaknesses: ['Absent-minded', 'Insensitive', 'Condescending', 'Overthinking'],
      careers: ['Physicist', 'Mathematician', 'Philosopher', 'Software Developer', 'Researcher'],
      famous: ['Albert Einstein', 'Bill Gates', 'Marie Curie'],
      percentage: '3.3%',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      type: 'ENTJ',
      title: 'The Commander',
      nickname: 'The Executive',
      group: 'analysts',
      description: 'Bold, imaginative, and strong-willed leaders who find or make a way to achieve their goals.',
      strengths: ['Efficient', 'Energetic', 'Self-confident', 'Strategic', 'Charismatic'],
      weaknesses: ['Stubborn', 'Intolerant', 'Impatient', 'Arrogant', 'Cold'],
      careers: ['CEO', 'Business Strategist', 'Judge', 'Investment Banker', 'Operations Director'],
      famous: ['Steve Jobs', 'Margaret Thatcher', 'Napoleon Bonaparte'],
      percentage: '1.8%',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      type: 'ENTP',
      title: 'The Debater',
      nickname: 'The Visionary',
      group: 'analysts',
      description: 'Smart and curious thinkers who love intellectual challenges and debating ideas.',
      strengths: ['Quick thinker', 'Charismatic', 'Energetic', 'Original', 'Knowledgeable'],
      weaknesses: ['Argumentative', 'Insensitive', 'Intolerant', 'Unfocused'],
      careers: ['Entrepreneur', 'Lawyer', 'Marketing Director', 'Inventor', 'Political Analyst'],
      famous: ['Mark Twain', 'Leonardo da Vinci', 'Benjamin Franklin'],
      percentage: '3.2%',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      type: 'INFJ',
      title: 'The Advocate',
      nickname: 'The Counselor',
      group: 'diplomats',
      description: 'Quiet and mystical, yet inspiring and idealistic advocates who strive to make the world a better place.',
      strengths: ['Creative', 'Insightful', 'Principled', 'Passionate', 'Altruistic'],
      weaknesses: ['Sensitive', 'Perfectionist', 'Private', 'Burnout-prone'],
      careers: ['Counselor', 'Psychologist', 'Writer', 'Social Worker', 'Human Rights Advocate'],
      famous: ['Nelson Mandela', 'Mother Teresa', 'Martin Luther King Jr.'],
      percentage: '1.5%',
      color: 'bg-green-100 text-green-800'
    },
    {
      type: 'INFP',
      title: 'The Mediator',
      nickname: 'The Healer',
      group: 'diplomats',
      description: 'Poetic, kind, and altruistic people always eager to help and find harmony in relationships.',
      strengths: ['Idealistic', 'Open-minded', 'Flexible', 'Creative', 'Passionate'],
      weaknesses: ['Impractical', 'Self-critical', 'Emotionally vulnerable', 'Difficult to know'],
      careers: ['Writer', 'Graphic Designer', 'Therapist', 'Teacher', 'Artist'],
      famous: ['William Shakespeare', 'J.R.R. Tolkien', 'Princess Diana'],
      percentage: '4.4%',
      color: 'bg-green-100 text-green-800'
    },
    {
      type: 'ENFJ',
      title: 'The Protagonist',
      nickname: 'The Teacher',
      group: 'diplomats',
      description: 'Charismatic and inspiring leaders who captivate and motivate others with their vision.',
      strengths: ['Tolerant', 'Reliable', 'Charismatic', 'Altruistic', 'Natural leaders'],
      weaknesses: ['Overly idealistic', 'Too selfless', 'Sensitive', 'Fluctuating self-esteem'],
      careers: ['HR Manager', 'Teacher', 'Counselor', 'Public Relations Director', 'Politician'],
      famous: ['Oprah Winfrey', 'Barack Obama', 'Maya Angelou'],
      percentage: '2.5%',
      color: 'bg-teal-100 text-teal-800'
    },
    {
      type: 'ENFP',
      title: 'The Campaigner',
      nickname: 'The Inspirer',
      group: 'diplomats',
      description: 'Enthusiastic, creative, and sociable free spirits who find reasons to smile in every situation.',
      strengths: ['Curious', 'Observant', 'Energetic', 'Enthusiastic', 'Excellent communicator'],
      weaknesses: ['Poor practical skills', 'Overthinking', 'Get stressed easily', 'Unfocused'],
      careers: ['Marketing Manager', 'Actor', 'Journalist', 'Entrepreneur', 'Creative Director'],
      famous: ['Robin Williams', 'Ellen DeGeneres', 'Walt Disney'],
      percentage: '8.1%',
      color: 'bg-teal-100 text-teal-800'
    },
    {
      type: 'ISTJ',
      title: 'The Logistician',
      nickname: 'The Inspector',
      group: 'sentinels',
      description: 'Practical and fact-minded individuals whose reliability cannot be doubted.',
      strengths: ['Honest', 'Direct', 'Strong-willed', 'Dutiful', 'Organized'],
      weaknesses: ['Stubborn', 'Insensitive', 'Judgmental', 'Inflexible'],
      careers: ['Accountant', 'Military Officer', 'Judge', 'Administrator', 'Auditor'],
      famous: ['George Washington', 'Warren Buffett', 'Queen Elizabeth II'],
      percentage: '11.6%',
      color: 'bg-cyan-100 text-cyan-800'
    },
    {
      type: 'ISFJ',
      title: 'The Defender',
      nickname: 'The Protector',
      group: 'sentinels',
      description: 'Dedicated and warm protectors ready to defend their loved ones and uphold traditions.',
      strengths: ['Supportive', 'Reliable', 'Patient', 'Practical', 'Loyal'],
      weaknesses: ['Shy', 'Reluctant to change', 'Takes things personally', 'Represses feelings'],
      careers: ['Nurse', 'Administrative Manager', 'Elementary Teacher', 'Social Worker', 'Librarian'],
      famous: ['Mother Teresa', 'Kate Middleton', 'Jimmy Carter'],
      percentage: '13.8%',
      color: 'bg-cyan-100 text-cyan-800'
    },
    {
      type: 'ESTJ',
      title: 'The Executive',
      nickname: 'The Supervisor',
      group: 'sentinels',
      description: 'Excellent administrators who manage projects and people with clear standards and dedication.',
      strengths: ['Dedicated', 'Strong-willed', 'Direct', 'Honest', 'Loyal'],
      weaknesses: ['Inflexible', 'Uncomfortable with unconventional', 'Judgmental', 'Difficult to relax'],
      careers: ['CEO', 'Project Manager', 'Police Officer', 'Financial Officer', 'Judge'],
      famous: ['Sonia Sotomayor', 'Frank Sinatra', 'John D. Rockefeller'],
      percentage: '8.7%',
      color: 'bg-indigo-100 text-indigo-800'
    },
    {
      type: 'ESFJ',
      title: 'The Consul',
      nickname: 'The Provider',
      group: 'sentinels',
      description: 'Caring and social people who are eager to help others and maintain harmony.',
      strengths: ['Strong practical skills', 'Loyal', 'Sensitive', 'Warm', 'Good at connecting'],
      weaknesses: ['Worried about social status', 'Inflexible', 'Needy', 'Too selfless'],
      careers: ['Event Coordinator', 'Nurse', 'Teacher', 'PR Manager', 'Sales Representative'],
      famous: ['Taylor Swift', 'Bill Clinton', 'Jennifer Garner'],
      percentage: '12.3%',
      color: 'bg-indigo-100 text-indigo-800'
    },
    {
      type: 'ISTP',
      title: 'The Virtuoso',
      nickname: 'The Craftsman',
      group: 'explorers',
      description: 'Bold and practical experimenters who master tools and techniques with remarkable skill.',
      strengths: ['Optimistic', 'Energetic', 'Creative', 'Practical', 'Spontaneous'],
      weaknesses: ['Stubborn', 'Insensitive', 'Private', 'Risky behavior'],
      careers: ['Mechanical Engineer', 'Pilot', 'Forensic Analyst', 'Chef', 'Carpenter'],
      famous: ['Clint Eastwood', 'Tom Cruise', 'Bruce Lee'],
      percentage: '5.4%',
      color: 'bg-orange-100 text-orange-800'
    },
    {
      type: 'ISFP',
      title: 'The Adventurer',
      nickname: 'The Composer',
      group: 'explorers',
      description: 'Flexible and charming artists always ready to explore and experience something new.',
      strengths: ['Charming', 'Sensitive to others', 'Imaginative', 'Passionate', 'Curious'],
      weaknesses: ['Fiercely independent', 'Unpredictable', 'Easily stressed', 'Competitive'],
      careers: ['Designer', 'Musician', 'Chef', 'Nurse', 'Veterinarian'],
      famous: ['Michael Jackson', 'Marilyn Monroe', 'Bob Dylan'],
      percentage: '8.8%',
      color: 'bg-orange-100 text-orange-800'
    },
    {
      type: 'ESTP',
      title: 'The Entrepreneur',
      nickname: 'The Doer',
      group: 'explorers',
      description: 'Smart, energetic, and perceptive people who truly enjoy living on the edge.',
      strengths: ['Bold', 'Rational', 'Practical', 'Original', 'Perceptive'],
      weaknesses: ['Insensitive', 'Impatient', 'Risk-prone', 'Unstructured', 'Defiant'],
      careers: ['Sales Executive', 'Marketing Director', 'Real Estate Agent', 'Paramedic', 'Entrepreneur'],
      famous: ['Donald Trump', 'Ernest Hemingway', 'Madonna'],
      percentage: '4.3%',
      color: 'bg-red-100 text-red-800'
    },
    {
      type: 'ESFP',
      title: 'The Entertainer',
      nickname: 'The Performer',
      group: 'explorers',
      description: 'Spontaneous, energetic, and enthusiastic entertainers who light up any room they enter.',
      strengths: ['Bold', 'Original', 'Practical', 'Observant', 'Excellent people skills'],
      weaknesses: ['Sensitive', 'Conflict-averse', 'Poor long-term planner', 'Unfocused'],
      careers: ['Actor', 'Event Planner', 'Sales Representative', 'Tour Guide', 'Social Media Manager'],
      famous: ['Marilyn Monroe', 'Elvis Presley', 'Jamie Oliver'],
      percentage: '8.5%',
      color: 'bg-red-100 text-red-800'
    }
  ];

  const groups = [
    { id: 'all', name: 'All Types', count: 16 },
    { id: 'analysts', name: 'Analysts', subtitle: 'Rational & Innovative', count: 4 },
    { id: 'diplomats', name: 'Diplomats', subtitle: 'Empathetic & Idealistic', count: 4 },
    { id: 'sentinels', name: 'Sentinels', subtitle: 'Practical & Organized', count: 4 },
    { id: 'explorers', name: 'Explorers', subtitle: 'Spontaneous & Adaptable', count: 4 }
  ];

  const filteredTypes = selectedGroup === 'all' 
    ? personalityTypes 
    : personalityTypes.filter(t => t.group === selectedGroup);

  return (
    <div className="personality-types-library">
      {/* Hero Section */}
      <section className="hero-section bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 font-display">
              The 16 Personality Types
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Explore the complete library of MBTI personality types. Discover strengths, weaknesses, 
              career paths, and famous personalities for each type.
            </p>
            <Link to="/mbti-assessment" className="btn btn-secondary text-lg px-8 py-4">
              Discover Your Type
            </Link>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedGroup === group.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{group.name}</span>
                  <span className="text-sm opacity-75">({group.count})</span>
                </div>
                {group.subtitle && (
                  <div className="text-xs mt-1 opacity-75">{group.subtitle}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Personality Types Grid */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTypes.map((type) => (
              <div key={type.type} className="card bg-white hover:shadow-xl transition-shadow">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className={`badge ${type.color} text-xl font-bold px-4 py-2`}>
                      {type.type}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">Population: {type.percentage}</div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-primary-dark mb-1">{type.title}</h3>
                <p className="text-sm text-secondary font-semibold mb-3">{type.nickname}</p>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  {type.description}
                </p>

                {/* Strengths */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-green-700 mb-2">✨ Strengths:</div>
                  <div className="flex flex-wrap gap-1">
                    {type.strengths.slice(0, 4).map((strength, idx) => (
                      <span key={idx} className="badge bg-green-100 text-green-800 text-xs">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Weaknesses */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-red-700 mb-2">⚠️ Challenges:</div>
                  <div className="flex flex-wrap gap-1">
                    {type.weaknesses.slice(0, 3).map((weakness, idx) => (
                      <span key={idx} className="badge bg-red-100 text-red-800 text-xs">
                        {weakness}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Top Careers */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-primary mb-2">💼 Top Careers:</div>
                  <ul className="space-y-1">
                    {type.careers.slice(0, 3).map((career, idx) => (
                      <li key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                        <span className="text-primary">→</span>
                        {career}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Famous People */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-xs font-semibold text-gray-600 mb-2">⭐ Famous {type.type}s:</div>
                  <div className="flex flex-wrap gap-2">
                    {type.famous.map((person, idx) => (
                      <span key={idx} className="text-xs text-gray-600">
                        {person}{idx < type.famous.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Link 
                  to={`/personality/${type.type.toLowerCase()}`}
                  className="btn btn-primary w-full mt-4 text-sm"
                >
                  View Full Profile
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-dark mb-4 font-display">
              Understanding the Four Temperaments
            </h2>
            <p className="text-xl text-gray-600">
              Each personality type belongs to one of four temperament groups
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="card bg-purple-50 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🔬</span>
                <div>
                  <h3 className="text-2xl font-bold text-purple-800">Analysts (NT)</h3>
                  <p className="text-sm text-purple-600">INTJ, INTP, ENTJ, ENTP</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                Rational and innovative thinkers who excel at strategic thinking and problem-solving.
              </p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>✓ Embrace rationality and objective analysis</li>
                <li>✓ Question everything and seek improvement</li>
                <li>✓ Excel in complex problem-solving</li>
                <li>✓ Value competence and knowledge</li>
              </ul>
            </div>

            <div className="card bg-green-50 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">💚</span>
                <div>
                  <h3 className="text-2xl font-bold text-green-800">Diplomats (NF)</h3>
                  <p className="text-sm text-green-600">INFJ, INFP, ENFJ, ENFP</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                Empathetic and idealistic people focused on helping others and finding meaning.
              </p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>✓ Deeply empathetic and caring</li>
                <li>✓ Seek harmony and authenticity</li>
                <li>✓ Driven by personal values</li>
                <li>✓ Excel in understanding people</li>
              </ul>
            </div>

            <div className="card bg-blue-50 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🛡️</span>
                <div>
                  <h3 className="text-2xl font-bold text-blue-800">Sentinels (SJ)</h3>
                  <p className="text-sm text-blue-600">ISTJ, ISFJ, ESTJ, ESFJ</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                Practical and organized individuals who value stability, tradition, and cooperation.
              </p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>✓ Highly responsible and reliable</li>
                <li>✓ Value tradition and order</li>
                <li>✓ Excel at planning and organizing</li>
                <li>✓ Strong work ethic</li>
              </ul>
            </div>

            <div className="card bg-orange-50 border-2 border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🚀</span>
                <div>
                  <h3 className="text-2xl font-bold text-orange-800">Explorers (SP)</h3>
                  <p className="text-sm text-orange-600">ISTP, ISFP, ESTP, ESFP</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                Spontaneous and adaptable people who live in the moment and embrace new experiences.
              </p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>✓ Highly adaptable and flexible</li>
                <li>✓ Live in the present moment</li>
                <li>✓ Excel in hands-on activities</li>
                <li>✓ Bold and action-oriented</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white text-center">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 font-display">
              Which Personality Type Are You?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Take our free SNTI assessment to discover your unique personality type and unlock 
              personalized insights about your strengths, career paths, and relationships.
            </p>
            <Link to="/mbti-assessment" className="btn btn-secondary text-lg px-10 py-4">
              Take the Free Assessment
            </Link>
            <p className="mt-6 text-sm opacity-75">
              ✓ 20 questions  ✓ Takes 10 minutes  ✓ Instant results
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PersonalityTypesLibrary;
