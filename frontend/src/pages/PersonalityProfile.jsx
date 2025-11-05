import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';

// Personality type data with free preview and locked premium content
const PERSONALITY_DATA = {
  INTJ: {
    code: 'INTJ',
    name: 'The Architect',
    tagline: 'Imaginative and strategic thinkers, with a plan for everything.',
    traits: ['Introversion', 'Intuition', 'Thinking', 'Judging'],
    color: 'purple',
    emoji: '🏛️',
    overview: 'INTJs are analytical problem-solvers, eager to improve systems and processes with their innovative ideas. They have a talent for seeing possibilities for improvement, whether at work, at home, or in themselves.',
    strengths: ['Strategic thinking', 'Independent', 'Determined', 'Curious', 'Original'],
    weaknesses: ['Arrogant', 'Dismissive of emotions', 'Overly critical', 'Combative'],
    // Premium locked content
    careers: ['Software Architect', 'Management Consultant', 'Engineer', 'Scientist', 'Strategic Planner'],
    relationships: 'INTJs value intellectual conversations and partners who can match their analytical depth...',
    growthTips: 'Focus on developing emotional intelligence and learning to appreciate others\' perspectives...',
    famousPeople: ['Elon Musk', 'Isaac Newton', 'Mark Zuckerberg', 'Christopher Nolan']
  },
  INTP: {
    code: 'INTP',
    name: 'The Logician',
    tagline: 'Innovative inventors with an unquenchable thirst for knowledge.',
    traits: ['Introversion', 'Intuition', 'Thinking', 'Perceiving'],
    color: 'purple',
    emoji: '🔬',
    overview: 'INTPs pride themselves on their unique perspectives and vigorous intellect. They can\'t help but puzzle over the mysteries of the universe.',
    strengths: ['Analytical', 'Original', 'Open-minded', 'Curious', 'Objective'],
    weaknesses: ['Disconnected', 'Insensitive', 'Dissatisfied', 'Impatient'],
    careers: ['Physicist', 'Philosopher', 'Software Developer', 'Mathematician', 'Analyst'],
    relationships: 'INTPs seek partners who can engage in deep theoretical discussions...',
    growthTips: 'Work on completing projects and translating ideas into action...',
    famousPeople: ['Albert Einstein', 'Bill Gates', 'Marie Curie', 'Charles Darwin']
  },
  ENTJ: {
    code: 'ENTJ',
    name: 'The Commander',
    tagline: 'Bold, imaginative and strong-willed leaders, always finding a way.',
    traits: ['Extraversion', 'Intuition', 'Thinking', 'Judging'],
    color: 'purple',
    emoji: '👑',
    overview: 'ENTJs are natural-born leaders. People with this personality type embody the gifts of charisma and confidence, and project authority in a way that draws crowds together.',
    strengths: ['Efficient', 'Energetic', 'Self-confident', 'Strong-willed', 'Strategic'],
    weaknesses: ['Stubborn', 'Intolerant', 'Impatient', 'Arrogant', 'Poor handling of emotions'],
    careers: ['CEO', 'Lawyer', 'Judge', 'Business Administrator', 'Entrepreneur'],
    relationships: 'ENTJs approach relationships with the same strategic mindset as their careers...',
    growthTips: 'Learn to balance efficiency with empathy and value others\' contributions...',
    famousPeople: ['Steve Jobs', 'Margaret Thatcher', 'Franklin D. Roosevelt', 'Napoleon Bonaparte']
  },
  ENTP: {
    code: 'ENTP',
    name: 'The Debater',
    tagline: 'Smart and curious thinkers who cannot resist an intellectual challenge.',
    traits: ['Extraversion', 'Intuition', 'Thinking', 'Perceiving'],
    color: 'purple',
    emoji: '💡',
    overview: 'ENTPs are the ultimate devil\'s advocates, thriving on the process of shredding arguments and beliefs and letting the ribbons drift in the wind.',
    strengths: ['Knowledgeable', 'Quick thinkers', 'Original', 'Excellent brainstormers', 'Charismatic'],
    weaknesses: ['Argumentative', 'Insensitive', 'Intolerant', 'Can find it difficult to focus'],
    careers: ['Entrepreneur', 'Lawyer', 'Psychologist', 'Inventor', 'Marketing Strategist'],
    relationships: 'ENTPs enjoy the mental exercise of debating and discussing ideas with partners...',
    growthTips: 'Develop follow-through and sensitivity to others\' feelings...',
    famousPeople: ['Thomas Edison', 'Leonardo da Vinci', 'Mark Twain', 'Socrates']
  },
  INFJ: {
    code: 'INFJ',
    name: 'The Advocate',
    tagline: 'Quiet and mystical, yet very inspiring and tireless idealists.',
    traits: ['Introversion', 'Intuition', 'Feeling', 'Judging'],
    color: 'green',
    emoji: '🌟',
    overview: 'INFJs are the rarest personality type. They have a deep sense of idealism and integrity, but they aren\'t idle dreamers – they take concrete steps to realize their goals.',
    strengths: ['Creative', 'Insightful', 'Principled', 'Passionate', 'Altruistic'],
    weaknesses: ['Sensitive', 'Extremely private', 'Perfectionist', 'Reluctant to open up'],
    careers: ['Counselor', 'Writer', 'Psychologist', 'Human Resources', 'Teacher'],
    relationships: 'INFJs seek depth and authenticity in their relationships...',
    growthTips: 'Balance idealism with practical action and learn to accept imperfection...',
    famousPeople: ['Martin Luther King Jr.', 'Nelson Mandela', 'Mother Teresa', 'Plato']
  },
  INFP: {
    code: 'INFP',
    name: 'The Mediator',
    tagline: 'Poetic, kind and altruistic people, always eager to help a good cause.',
    traits: ['Introversion', 'Intuition', 'Feeling', 'Perceiving'],
    color: 'green',
    emoji: '🕊️',
    overview: 'INFPs are guided by their principles rather than by logic, excitement, or practicality. When deciding how to move forward, they will look to honor and beauty.',
    strengths: ['Idealistic', 'Seek and value harmony', 'Open-minded', 'Flexible', 'Creative'],
    weaknesses: ['Too idealistic', 'Too altruistic', 'Impractical', 'Dislikes dealing with data'],
    careers: ['Writer', 'Artist', 'Counselor', 'Graphic Designer', 'Social Worker'],
    relationships: 'INFPs are dreamers and idealists, seeking harmony and deep connections...',
    growthTips: 'Ground ideals in practical reality and develop assertiveness...',
    famousPeople: ['William Shakespeare', 'J.R.R. Tolkien', 'Vincent van Gogh', 'Princess Diana']
  },
  ENFJ: {
    code: 'ENFJ',
    name: 'The Protagonist',
    tagline: 'Charismatic and inspiring leaders, able to mesmerize their listeners.',
    traits: ['Extraversion', 'Intuition', 'Feeling', 'Judging'],
    color: 'green',
    emoji: '🎭',
    overview: 'ENFJs are natural-born leaders, full of passion and charisma. They reach out and inspire others to achieve and to do good in the world.',
    strengths: ['Tolerant', 'Reliable', 'Charismatic', 'Altruistic', 'Natural leaders'],
    weaknesses: ['Overly idealistic', 'Too selfless', 'Too sensitive', 'Fluctuating self-esteem'],
    careers: ['Teacher', 'Counselor', 'Sales Manager', 'HR Director', 'Event Coordinator'],
    relationships: 'ENFJs are warm, affectionate partners who invest deeply in relationships...',
    growthTips: 'Learn to set boundaries and prioritize self-care...',
    famousPeople: ['Barack Obama', 'Oprah Winfrey', 'Maya Angelou', 'Martin Luther King Jr.']
  },
  ENFP: {
    code: 'ENFP',
    name: 'The Campaigner',
    tagline: 'Enthusiastic, creative and sociable free spirits.',
    traits: ['Extraversion', 'Intuition', 'Feeling', 'Perceiving'],
    color: 'green',
    emoji: '🎨',
    overview: 'ENFPs are true free spirits – outgoing, openhearted, and open-minded. With their lively, upbeat approach to life, they stand out in any crowd.',
    strengths: ['Curious', 'Observant', 'Energetic', 'Enthusiastic', 'Excellent communicators'],
    weaknesses: ['Poor practical skills', 'Difficulty focusing', 'Overthinking', 'Get stressed easily'],
    careers: ['Journalist', 'Actor', 'Entrepreneur', 'Consultant', 'Marketing Manager'],
    relationships: 'ENFPs bring creativity and spontaneity to their relationships...',
    growthTips: 'Develop focus and follow-through on commitments...',
    famousPeople: ['Robin Williams', 'Walt Disney', 'Ellen DeGeneres', 'Oscar Wilde']
  },
  ISTJ: {
    code: 'ISTJ',
    name: 'The Logistician',
    tagline: 'Practical and fact-minded individuals, whose reliability cannot be doubted.',
    traits: ['Introversion', 'Sensing', 'Thinking', 'Judging'],
    color: 'blue',
    emoji: '📋',
    overview: 'ISTJs are responsible organizers, driven to create and enforce order within systems and institutions. They are neat and orderly, inside and out.',
    strengths: ['Honest', 'Direct', 'Strong-willed', 'Dutiful', 'Responsible', 'Practical'],
    weaknesses: ['Stubborn', 'Insensitive', 'Always by the book', 'Judgmental'],
    careers: ['Accountant', 'Auditor', 'Military Officer', 'Dentist', 'Project Manager'],
    relationships: 'ISTJs value stability and traditional relationship structures...',
    growthTips: 'Practice flexibility and openness to new approaches...',
    famousPeople: ['George Washington', 'Warren Buffett', 'Angela Merkel', 'Natalie Portman']
  },
  ISFJ: {
    code: 'ISFJ',
    name: 'The Defender',
    tagline: 'Very dedicated and warm protectors, always ready to defend their loved ones.',
    traits: ['Introversion', 'Sensing', 'Feeling', 'Judging'],
    color: 'blue',
    emoji: '🛡️',
    overview: 'ISFJs are warm and caring, always eager to help. They have a strong sense of responsibility and are dedicated to meeting their commitments.',
    strengths: ['Supportive', 'Reliable', 'Patient', 'Imaginative', 'Observant', 'Enthusiastic'],
    weaknesses: ['Humble', 'Shy', 'Take things too personally', 'Repress their feelings'],
    careers: ['Nurse', 'Teacher', 'Social Worker', 'Interior Designer', 'Librarian'],
    relationships: 'ISFJs are devoted and caring partners who value stability...',
    growthTips: 'Learn to assert your needs and embrace change...',
    famousPeople: ['Mother Teresa', 'Queen Elizabeth II', 'Kate Middleton', 'Rosa Parks']
  },
  ESTJ: {
    code: 'ESTJ',
    name: 'The Executive',
    tagline: 'Excellent administrators, unsurpassed at managing things or people.',
    traits: ['Extraversion', 'Sensing', 'Thinking', 'Judging'],
    color: 'blue',
    emoji: '⚖️',
    overview: 'ESTJs are representatives of tradition and order, utilizing their understanding of what is right, wrong and socially acceptable to bring families and communities together.',
    strengths: ['Dedicated', 'Strong-willed', 'Direct', 'Honest', 'Loyal', 'Patient'],
    weaknesses: ['Inflexible', 'Uncomfortable with unconventional situations', 'Judgmental', 'Difficult to relax'],
    careers: ['Judge', 'Police Officer', 'Financial Officer', 'Hotel Manager', 'Real Estate Agent'],
    relationships: 'ESTJs approach relationships with traditional values and clear expectations...',
    growthTips: 'Develop empathy and openness to different perspectives...',
    famousPeople: ['Judge Judy', 'John D. Rockefeller', 'Lyndon B. Johnson', 'Boromir']
  },
  ESFJ: {
    code: 'ESFJ',
    name: 'The Consul',
    tagline: 'Extraordinarily caring, social and popular people, always eager to help.',
    traits: ['Extraversion', 'Sensing', 'Feeling', 'Judging'],
    color: 'blue',
    emoji: '🤝',
    overview: 'ESFJs are social creatures with a strong moral compass. They seek harmony and care deeply about being helpful and doing what\'s right.',
    strengths: ['Strong practical skills', 'Strong sense of duty', 'Loyal', 'Sensitive', 'Warm'],
    weaknesses: ['Worried about social status', 'Inflexible', 'Reluctant to innovate', 'Needy'],
    careers: ['Event Coordinator', 'Nurse', 'Teacher', 'Sales Representative', 'Office Manager'],
    relationships: 'ESFJs are warm, loyal partners who value harmony and tradition...',
    growthTips: 'Learn to accept criticism constructively and embrace change...',
    famousPeople: ['Taylor Swift', 'Jennifer Garner', 'Bill Clinton', 'Sally Field']
  },
  ISTP: {
    code: 'ISTP',
    name: 'The Virtuoso',
    tagline: 'Bold and practical experimenters, masters of all kinds of tools.',
    traits: ['Introversion', 'Sensing', 'Thinking', 'Perceiving'],
    color: 'yellow',
    emoji: '🔧',
    overview: 'ISTPs love to explore with their hands and their eyes, touching and examining the world around them with cool rationalism and spirited curiosity.',
    strengths: ['Optimistic', 'Energetic', 'Creative', 'Practical', 'Spontaneous', 'Rational'],
    weaknesses: ['Stubborn', 'Insensitive', 'Private', 'Easily bored', 'Risky behavior'],
    careers: ['Mechanic', 'Engineer', 'Pilot', 'Forensic Scientist', 'Athlete'],
    relationships: 'ISTPs are independent partners who value freedom and spontaneity...',
    growthTips: 'Develop long-term planning skills and emotional expressiveness...',
    famousPeople: ['Clint Eastwood', 'Amelia Earhart', 'Michael Jordan', 'Bruce Lee']
  },
  ISFP: {
    code: 'ISFP',
    name: 'The Adventurer',
    tagline: 'Flexible and charming artists, always ready to explore and experience something new.',
    traits: ['Introversion', 'Sensing', 'Feeling', 'Perceiving'],
    color: 'yellow',
    emoji: '🎭',
    overview: 'ISFPs are true artists – though not necessarily in the conventional sense. They live in a colorful, sensual world, inspired by connections with people and ideas.',
    strengths: ['Charming', 'Sensitive', 'Imaginative', 'Passionate', 'Curious', 'Artistic'],
    weaknesses: ['Fiercely independent', 'Unpredictable', 'Easily stressed', 'Overly competitive'],
    careers: ['Artist', 'Musician', 'Chef', 'Designer', 'Photographer', 'Veterinarian'],
    relationships: 'ISFPs are warm, caring partners who value authenticity and present-moment connection...',
    growthTips: 'Develop long-term planning and assertiveness...',
    famousPeople: ['Michael Jackson', 'Marilyn Monroe', 'Lady Gaga', 'Bob Dylan']
  },
  ESTP: {
    code: 'ESTP',
    name: 'The Entrepreneur',
    tagline: 'Smart, energetic and very perceptive people, who truly enjoy living on the edge.',
    traits: ['Extraversion', 'Sensing', 'Thinking', 'Perceiving'],
    color: 'yellow',
    emoji: '⚡',
    overview: 'ESTPs are always impacting their immediate surroundings. They are energetic thrillseekers who are at their best when they can move about and take action.',
    strengths: ['Bold', 'Rational', 'Practical', 'Original', 'Perceptive', 'Direct'],
    weaknesses: ['Insensitive', 'Impatient', 'Risk-prone', 'Unstructured', 'Defiant'],
    careers: ['Entrepreneur', 'Sales Manager', 'Paramedic', 'Detective', 'Stockbroker'],
    relationships: 'ESTPs are exciting, spontaneous partners who live in the moment...',
    growthTips: 'Develop patience and sensitivity to others\' needs...',
    famousPeople: ['Donald Trump', 'Ernest Hemingway', 'Eddie Murphy', 'Madonna']
  },
  ESFP: {
    code: 'ESFP',
    name: 'The Entertainer',
    tagline: 'Spontaneous, energetic and enthusiastic people – life is never boring around them.',
    traits: ['Extraversion', 'Sensing', 'Feeling', 'Perceiving'],
    color: 'yellow',
    emoji: '🎉',
    overview: 'ESFPs love to be the center of attention. They are warm, generous, and friendly, radiating energy wherever they go.',
    strengths: ['Bold', 'Original', 'Aesthetic', 'Showmanship', 'Practical', 'Observant'],
    weaknesses: ['Sensitive', 'Conflict-averse', 'Easily bored', 'Poor long-term planners', 'Unfocused'],
    careers: ['Performer', 'Event Planner', 'Flight Attendant', 'Fashion Designer', 'Sales Representative'],
    relationships: 'ESFPs are fun-loving, spontaneous partners who bring excitement to relationships...',
    growthTips: 'Develop focus and long-term planning skills...',
    famousPeople: ['Marilyn Monroe', 'Jamie Oliver', 'Adele', 'Will Smith']
  }
};

const PersonalityProfile = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [sessionInfo, setSessionInfo] = useState(null);

  const personality = PERSONALITY_DATA[type?.toUpperCase()];

  useEffect(() => {
    // Check if user came from a completed test
    const stored = localStorage.getItem('snti_test_session');
    if (stored) {
      try {
        const session = JSON.parse(stored);
        if (session.mbtiType === type?.toUpperCase()) {
          setSessionInfo(session);
        }
      } catch (e) {
        console.error('Failed to parse session:', e);
      }
    }
  }, [type]);

  if (!personality) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Personality Type Not Found</h1>
          <p className="text-gray-600 mb-6">The personality type "{type}" doesn't exist.</p>
          <button
            onClick={() => navigate('/psychology-chat')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Take the Test
          </button>
        </div>
      </div>
    );
  }

  const colorClasses = {
    purple: 'from-purple-600 to-indigo-600',
    green: 'from-green-600 to-emerald-600',
    blue: 'from-blue-600 to-cyan-600',
    yellow: 'from-amber-600 to-orange-600'
  };

  const LockedSection = ({ title, children }) => (
    <div className="relative">
      <div className="blur-sm select-none pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-white/80 to-white">
        <div className="text-center p-6 bg-white rounded-lg shadow-xl border-2 border-blue-200 max-w-md">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">Unlock detailed insights about your personality type</p>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition"
          >
            Unlock Premium Content - PKR 50
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${colorClasses[personality.color]} text-white py-16`}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <div className="text-8xl mb-4">{personality.emoji}</div>
            <h1 className="text-5xl font-bold mb-2">{personality.code}</h1>
            <h2 className="text-3xl font-semibold mb-4">{personality.name}</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">{personality.tagline}</p>
            
            {/* Trait Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {personality.traits.map((trait, idx) => (
                <div key={idx} className="bg-white/20 backdrop-blur px-6 py-2 rounded-full font-semibold">
                  {trait}
                </div>
              ))}
            </div>

            {sessionInfo && (
              <div className="mt-6 bg-white/10 backdrop-blur rounded-lg p-4 inline-block">
                <p className="text-sm">
                  <strong>{sessionInfo.userName}</strong> - Session: {sessionInfo.sessionId}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {['overview', 'strengths', 'weaknesses', 'careers', 'relationships', 'growth'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-semibold capitalize whitespace-nowrap border-b-2 transition ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {activeTab === 'overview' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">About {personality.name}</h3>
            <p className="text-gray-700 text-lg leading-relaxed">{personality.overview}</p>
          </div>
        )}

        {activeTab === 'strengths' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Key Strengths</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {personality.strengths.map((strength, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <span className="text-2xl">✓</span>
                  <span className="text-gray-800 font-medium">{strength}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'weaknesses' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Areas for Growth</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {personality.weaknesses.map((weakness, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
                  <span className="text-2xl">→</span>
                  <span className="text-gray-800 font-medium">{weakness}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'careers' && (
          <LockedSection title="Career Paths & Professional Success">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Ideal Career Paths</h3>
              <div className="space-y-4">
                {personality.careers.map((career, idx) => (
                  <div key={idx} className="p-4 bg-blue-50 rounded-lg">
                    <span className="text-gray-800 font-medium">{career}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-lg mb-3">Detailed Career Analysis</h4>
                <p className="text-gray-700">Comprehensive insights into your ideal work environment, leadership style, team dynamics, and professional growth strategies tailored to your {personality.code} personality type.</p>
              </div>
            </div>
          </LockedSection>
        )}

        {activeTab === 'relationships' && (
          <LockedSection title="Relationship Dynamics & Compatibility">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Relationships & Romance</h3>
              <p className="text-gray-700 mb-6">{personality.relationships}</p>
              <div className="space-y-6">
                <div className="p-6 bg-pink-50 rounded-lg">
                  <h4 className="font-bold text-lg mb-2">Romantic Compatibility</h4>
                  <p className="text-gray-700">Discover which personality types are most compatible with {personality.code} and why. Learn about communication styles, conflict resolution, and building lasting connections.</p>
                </div>
                <div className="p-6 bg-purple-50 rounded-lg">
                  <h4 className="font-bold text-lg mb-2">Friendship Dynamics</h4>
                  <p className="text-gray-700">Understand how {personality.code} types build and maintain friendships, their social needs, and how to nurture meaningful connections.</p>
                </div>
              </div>
            </div>
          </LockedSection>
        )}

        {activeTab === 'growth' && (
          <LockedSection title="Personal Growth & Development Plan">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Personal Growth Guide</h3>
              <p className="text-gray-700 mb-6">{personality.growthTips}</p>
              <div className="space-y-6">
                <div className="p-6 bg-indigo-50 rounded-lg">
                  <h4 className="font-bold text-lg mb-2">Development Roadmap</h4>
                  <p className="text-gray-700">A personalized plan for developing your weaker functions and maximizing your natural strengths as an {personality.code}.</p>
                </div>
                <div className="p-6 bg-teal-50 rounded-lg">
                  <h4 className="font-bold text-lg mb-2">Stress Management</h4>
                  <p className="text-gray-700">Learn how {personality.code} types experience and cope with stress, plus practical strategies for maintaining emotional balance.</p>
                </div>
                <div className="p-6 bg-emerald-50 rounded-lg">
                  <h4 className="font-bold text-lg mb-2">Famous {personality.code} Personalities</h4>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {personality.famousPeople.map((person, idx) => (
                      <span key={idx} className="bg-white px-4 py-2 rounded-full text-sm font-medium">{person}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </LockedSection>
        )}

        {/* CTA Banner */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Unlock Your Full Personality Profile</h3>
          <p className="text-lg mb-6 opacity-90">
            Get access to detailed career guidance, relationship insights, and a personalized growth plan for just PKR 50
          </p>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:shadow-xl transform hover:scale-105 transition"
          >
            Unlock Premium Content Now
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          serviceType="report"
          sessionInfo={{
            mbtiType: personality.code,
            sessionId: sessionInfo?.sessionId || 'N/A',
            userName: sessionInfo?.userName || ''
          }}
        />
      )}
    </div>
  );
};

export default PersonalityProfile;
