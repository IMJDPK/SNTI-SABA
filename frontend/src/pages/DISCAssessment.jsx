import ComingSoon from './ComingSoon';

function DISCAssessment() {
  const relatedTests = [
    {
      name: 'TypeFinder® Personality',
      description: 'Discover your MBTI type with our comprehensive assessment',
      icon: '🧠',
      path: '/mbti-assessment'
    },
    {
      name: 'Team Assessment',
      description: 'Build stronger teams with personality insights',
      icon: '👥',
      path: '/for-teams'
    },
    {
      name: 'Career Assessment',
      description: 'Find your ideal career path based on your personality',
      icon: '💼',
      path: '/snti-career'
    }
  ];

  return (
    <ComingSoon 
      testName="DISC Personality Assessment"
      testDescription="Understand your behavioral style through the DISC model: Dominance, Influence, Steadiness, and Conscientiousness. Perfect for improving workplace communication and team dynamics."
      estimatedLaunch="Coming February 2026"
      relatedTests={relatedTests}
    />
  );
}

export default DISCAssessment;
