import ComingSoon from './ComingSoon';

function LoveLanguageTest() {
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
      name: 'Student Assessment',
      description: 'Optimize your learning style and academic success',
      icon: '🎓',
      path: '/snti-students'
    }
  ];

  return (
    <ComingSoon 
      testName="Love Languages Assessment"
      testDescription="Discover your primary love language and learn how you give and receive love. Improve your relationships by understanding how to communicate affection effectively with partners, family, and friends."
      estimatedLaunch="Coming April 2026"
      relatedTests={relatedTests}
    />
  );
}

export default LoveLanguageTest;
