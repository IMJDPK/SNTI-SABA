import ComingSoon from './ComingSoon';

function EnneagramTest() {
  const relatedTests = [
    {
      name: 'TypeFinder® Personality',
      description: 'Discover your MBTI type with our comprehensive assessment',
      icon: '🧠',
      path: '/mbti-assessment'
    },
    {
      name: 'Career Assessment',
      description: 'Find your ideal career path based on your personality',
      icon: '💼',
      path: '/snti-career'
    },
    {
      name: 'Team Assessment',
      description: 'Build stronger teams with personality insights',
      icon: '👥',
      path: '/for-teams'
    }
  ];

  return (
    <ComingSoon 
      testName="Enneagram Personality Test"
      testDescription="Discover your core motivations and fears through the nine Enneagram types. Understand what drives your behavior and how to achieve personal growth and healthier relationships."
      estimatedLaunch="Coming January 2026"
      relatedTests={relatedTests}
    />
  );
}

export default EnneagramTest;
