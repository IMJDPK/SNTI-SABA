import ComingSoon from './ComingSoon';

function WorkplaceTest() {
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
      testName="Workplace Personality Assessment"
      testDescription="Understand your work style, communication preferences, and team dynamics. Optimize your professional relationships and career success with insights tailored for the workplace environment."
      estimatedLaunch="Coming May 2026"
      relatedTests={relatedTests}
    />
  );
}

export default WorkplaceTest;
