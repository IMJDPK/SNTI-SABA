import ComingSoon from './ComingSoon';

function RelationshipTest() {
  const relatedTests = [
    {
      name: 'TypeFinder® Personality',
      description: 'Discover your MBTI type with our comprehensive assessment',
      icon: '🧠',
      path: '/mbti-assessment'
    },
    {
      name: 'Student Assessment',
      description: 'Optimize your learning style and academic success',
      icon: '🎓',
      path: '/snti-students'
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
      testName="Relationship Compatibility Test"
      testDescription="Discover how your personality interacts with others in romantic relationships, friendships, and partnerships. Learn what makes your relationships thrive and how to navigate differences."
      estimatedLaunch="Coming March 2026"
      relatedTests={relatedTests}
    />
  );
}

export default RelationshipTest;
