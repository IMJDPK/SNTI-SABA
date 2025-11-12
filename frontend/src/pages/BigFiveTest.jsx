import ComingSoon from './ComingSoon';

function BigFiveTest() {
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
      testName="Big Five Personality Test"
      testDescription="Explore the five fundamental dimensions of personality: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism. Gain deep insights into your behavioral patterns and emotional responses."
      estimatedLaunch="Coming December 2025"
      relatedTests={relatedTests}
    />
  );
}

export default BigFiveTest;
