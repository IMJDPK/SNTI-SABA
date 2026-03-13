const withDimension = (dimension, questions) =>
  questions.map((question) => ({ ...question, dimension }));

const withDomain = (domain, questions) =>
  questions.map((question) => ({ ...question, domain }));

export const AGE_GROUPS = [
  {
    key: 'junior',
    label: 'Junior Bank',
    ageRange: '8-11',
    description: 'Short, concrete questions with read-aloud support and a child-friendly response scale.',
    personalityQuestionCount: 20,
    estimatedTime: '10-12 minutes',
  },
  {
    key: 'pilot',
    label: 'Pilot Bank',
    ageRange: '12-15',
    description: 'Full adolescent assessment using the 5-point SNTI bipolar scale.',
    personalityQuestionCount: 80,
    estimatedTime: '20-25 minutes',
  },
  {
    key: 'advanced',
    label: 'Advanced Bank',
    ageRange: '16+',
    description: 'Full senior assessment with detailed adult-context prompts and screening follow-up.',
    personalityQuestionCount: 80,
    estimatedTime: '20-25 minutes',
  },
];

const juniorQuestions = [
  ...withDimension('EI', [
    {
      id: 'J01',
      question: 'Do you like playing with lots of friends or with just one or two friends?',
      pole_a_label: 'Lots of friends',
      pole_a_trait: 'E',
      pole_b_label: 'One or two friends',
      pole_b_trait: 'I',
      tts_prompt: 'Do you like playing with lots of friends, or with just one or two friends?',
    },
    {
      id: 'J02',
      question: 'After school, do you want to go outside and play or stay home and rest?',
      pole_a_label: 'Go outside and play',
      pole_a_trait: 'E',
      pole_b_label: 'Stay home and rest',
      pole_b_trait: 'I',
      tts_prompt: 'After school, do you want to go outside and play, or stay home and rest?',
    },
    {
      id: 'J03',
      question: "In class, do you like answering the teacher's questions out loud?",
      pole_a_label: 'Yes, I love it',
      pole_a_trait: 'E',
      pole_b_label: 'I prefer to think quietly',
      pole_b_trait: 'I',
      tts_prompt: 'In class, do you like answering the teacher out loud, or do you prefer to think quietly?',
    },
    {
      id: 'J04',
      question: 'When you feel sad, do you want to talk to someone or be alone?',
      pole_a_label: 'Talk to someone',
      pole_a_trait: 'E',
      pole_b_label: 'Be alone for a while',
      pole_b_trait: 'I',
      tts_prompt: 'When you feel sad, do you want to talk to someone, or do you want to be alone for a while?',
    },
    {
      id: 'J05',
      question: 'Do you like meeting new children at school?',
      pole_a_label: 'Yes, it is fun',
      pole_a_trait: 'E',
      pole_b_label: 'I prefer my own friends',
      pole_b_trait: 'I',
      tts_prompt: 'Do you like meeting new children at school, or do you prefer staying with your own friends?',
    },
  ]),
  ...withDimension('SN', [
    {
      id: 'J06',
      question: 'Do you like stories about real things or made-up stories?',
      pole_a_label: 'Real things that happened',
      pole_a_trait: 'S',
      pole_b_label: 'Made-up and magical stories',
      pole_b_trait: 'N',
      tts_prompt: 'Do you like stories about real things that happened, or made-up and magical stories?',
    },
    {
      id: 'J07',
      question: 'When you draw a picture, do you copy what you see or draw from your imagination?',
      pole_a_label: 'Copy what I see',
      pole_a_trait: 'S',
      pole_b_label: 'Draw from my imagination',
      pole_b_trait: 'N',
      tts_prompt: 'When you draw, do you copy what you see, or do you draw from your imagination?',
    },
    {
      id: 'J08',
      question: 'Do you like following instructions step by step, or figuring things out yourself?',
      pole_a_label: 'Follow instructions',
      pole_a_trait: 'S',
      pole_b_label: 'Figure it out myself',
      pole_b_trait: 'N',
      tts_prompt: 'Do you like following instructions step by step, or figuring things out yourself?',
    },
    {
      id: 'J09',
      question: 'Do you think more about what is happening today or what might happen in the future?',
      pole_a_label: 'What is happening today',
      pole_a_trait: 'S',
      pole_b_label: 'What might happen in the future',
      pole_b_trait: 'N',
      tts_prompt: 'Do you think more about what is happening today, or what might happen in the future?',
    },
    {
      id: 'J10',
      question: 'Do you like craft activities that follow a pattern, or ones where you can do anything you want?',
      pole_a_label: 'Follow a pattern',
      pole_a_trait: 'S',
      pole_b_label: 'Do anything I want',
      pole_b_trait: 'N',
      tts_prompt: 'Do you like craft activities that follow a pattern, or ones where you can do anything you want?',
    },
  ]),
  ...withDimension('TF', [
    {
      id: 'J11',
      question: 'When a friend is sad, what do you do first?',
      pole_a_label: 'Try to solve the problem',
      pole_a_trait: 'T',
      pole_b_label: 'Give a hug and listen',
      pole_b_trait: 'F',
      tts_prompt: 'When a friend is sad, do you try to solve the problem first, or do you give a hug and listen?',
    },
    {
      id: 'J12',
      question: 'If a friend did something wrong, what do you do?',
      pole_a_label: 'Tell them honestly',
      pole_a_trait: 'T',
      pole_b_label: "Stay quiet so I don't hurt them",
      pole_b_trait: 'F',
      tts_prompt: "If a friend did something wrong, do you tell them honestly, or stay quiet so you don't hurt their feelings?",
    },
    {
      id: 'J13',
      question: 'When you play a game, what matters more to you?',
      pole_a_label: 'Winning the game',
      pole_a_trait: 'T',
      pole_b_label: 'Everyone having fun',
      pole_b_trait: 'F',
      tts_prompt: 'When you play a game, does winning matter more to you, or does everyone having fun matter more?',
    },
    {
      id: 'J14',
      question: 'How do you usually make a decision?',
      pole_a_label: 'By thinking carefully about it',
      pole_a_trait: 'T',
      pole_b_label: 'By how I feel inside',
      pole_b_trait: 'F',
      tts_prompt: 'How do you usually make a decision? By thinking carefully, or by how you feel inside?',
    },
    {
      id: 'J15',
      question: 'When two friends are arguing, how do you help them?',
      pole_a_label: 'Figure out who is right',
      pole_a_trait: 'T',
      pole_b_label: 'Help them both feel better',
      pole_b_trait: 'F',
      tts_prompt: 'When two friends argue, do you try to figure out who is right, or help them both feel better?',
    },
  ]),
  ...withDimension('JP', [
    {
      id: 'J16',
      question: 'Do you finish your homework right away or leave it for later?',
      pole_a_label: 'Right away',
      pole_a_trait: 'J',
      pole_b_label: 'When I feel like it later',
      pole_b_trait: 'P',
      tts_prompt: 'Do you finish your homework right away, or leave it for when you feel like it later?',
    },
    {
      id: 'J17',
      question: 'Do you like knowing what will happen next, or do you like surprises?',
      pole_a_label: 'Knowing what will happen',
      pole_a_trait: 'J',
      pole_b_label: 'I love surprises',
      pole_b_trait: 'P',
      tts_prompt: 'Do you like knowing what will happen next, or do you love surprises?',
    },
    {
      id: 'J18',
      question: 'Is your school bag and desk usually neat or a bit messy?',
      pole_a_label: 'Neat and tidy',
      pole_a_trait: 'J',
      pole_b_label: 'A bit messy',
      pole_b_trait: 'P',
      tts_prompt: 'Is your school bag usually neat and tidy, or a bit messy?',
    },
    {
      id: 'J19',
      question: 'When you start a drawing, do you plan it first or just start?',
      pole_a_label: 'Plan what I will draw first',
      pole_a_trait: 'J',
      pole_b_label: 'Just start and see what happens',
      pole_b_trait: 'P',
      tts_prompt: 'When you start a drawing, do you plan it first, or just start and see what happens?',
    },
    {
      id: 'J20',
      question: 'When you have a task to do, do you start it quickly or explore other things first?',
      pole_a_label: 'Start it quickly',
      pole_a_trait: 'J',
      pole_b_label: 'Explore other things first',
      pole_b_trait: 'P',
      tts_prompt: 'When you have a task to do, do you start it quickly, or explore other things first?',
    },
  ]),
];

const pilotQuestions = [
  ...withDimension('EI', [
    { id: 'P01', question: 'After school, would you rather join friends for cricket or go home to relax?', pole_a_label: 'Playing cricket with friends', pole_a_trait: 'E', pole_b_label: 'Relaxing alone at home', pole_b_trait: 'I' },
    { id: 'P02', question: 'How do you feel when meeting many new people at once?', pole_a_label: 'Excited and energised', pole_a_trait: 'E', pole_b_label: 'Tired and overwhelmed', pole_b_trait: 'I' },
    { id: 'P03', question: "In class, how often do you answer the teacher's questions without being asked?", pole_a_label: 'Often — I enjoy it', pole_a_trait: 'E', pole_b_label: 'Rarely — I prefer to think', pole_b_trait: 'I' },
    { id: 'P04', question: 'At a wedding, how do you prefer to spend your time?', pole_a_label: 'Moving between different groups', pole_a_trait: 'E', pole_b_label: 'Staying with a few close people', pole_b_trait: 'I' },
    { id: 'P05', question: 'How easily do you talk to strangers in the school canteen?', pole_a_label: 'Very easily — I start conversation', pole_a_trait: 'E', pole_b_label: 'Only when I have to', pole_b_trait: 'I' },
    { id: 'P06', question: 'In a group project, what role do you prefer?', pole_a_label: 'Leading and organising everyone', pole_a_trait: 'E', pole_b_label: 'Working on my own part quietly', pole_b_trait: 'I' },
    { id: 'P07', question: 'How do you feel after spending an entire day alone?', pole_a_label: 'Bored and restless', pole_a_trait: 'E', pole_b_label: 'Relaxed and recharged', pole_b_trait: 'I' },
    { id: 'P08', question: 'How do you feel about telling stories or presenting in front of the class?', pole_a_label: 'I enjoy it', pole_a_trait: 'E', pole_b_label: 'I find it stressful', pole_b_trait: 'I' },
    { id: 'P09', question: 'When you meet someone new, what do you usually do?', pole_a_label: 'Start the conversation', pole_a_trait: 'E', pole_b_label: 'Wait for them to speak first', pole_b_trait: 'I' },
    { id: 'P10', question: 'How many group chats or friend circles do you actively participate in?', pole_a_label: 'Many — I am in lots of groups', pole_a_trait: 'E', pole_b_label: 'Just a few close ones', pole_b_trait: 'I' },
    { id: 'P11', question: 'How would you prefer to celebrate your birthday?', pole_a_label: 'Big party with many people', pole_a_trait: 'E', pole_b_label: 'Small gathering with close friends', pole_b_trait: 'I' },
    { id: 'P12', question: 'At recess, where are you usually found?', pole_a_label: 'In a big, noisy group', pole_a_trait: 'E', pole_b_label: 'With one friend or alone', pole_b_trait: 'I' },
    { id: 'P13', question: 'Do people ever tell you that you talk loudly without realising?', pole_a_label: 'Yes, often', pole_a_trait: 'E', pole_b_label: 'No, I am usually quiet', pole_b_trait: 'I' },
    { id: 'P14', question: 'How comfortable are you in a loud, noisy environment?', pole_a_label: 'Very comfortable — I like the energy', pole_a_trait: 'E', pole_b_label: 'Uncomfortable — I prefer quiet', pole_b_trait: 'I' },
    { id: 'P15', question: 'What do you do when nothing is happening around you?', pole_a_label: 'Look for something fun to do with others', pole_a_trait: 'E', pole_b_label: 'Enjoy the quiet time alone', pole_b_trait: 'I' },
    { id: 'P16', question: 'How often do you initiate fun activities or outings with friends?', pole_a_label: 'Often — I usually suggest plans', pole_a_trait: 'E', pole_b_label: 'Rarely — I wait for others to plan', pole_b_trait: 'I' },
    { id: 'P17', question: 'How comfortable are you giving a speech in school assembly?', pole_a_label: 'Comfortable — I enjoy it', pole_a_trait: 'E', pole_b_label: 'Nervous — I dislike it', pole_b_trait: 'I' },
    { id: 'P18', question: 'How easily do you share your thoughts and feelings with others?', pole_a_label: 'Very easily — with almost anyone', pole_a_trait: 'E', pole_b_label: 'Only with very close friends', pole_b_trait: 'I' },
    { id: 'P19', question: 'How do you feel about making new friends?', pole_a_label: 'I love meeting new people', pole_a_trait: 'E', pole_b_label: 'I prefer to keep my current circle', pole_b_trait: 'I' },
    { id: 'P20', question: 'After a long social event, how do you feel?', pole_a_label: 'Energised and happy', pole_a_trait: 'E', pole_b_label: 'Drained and needing rest', pole_b_trait: 'I' },
  ]),
  ...withDimension('SN', [
    { id: 'P21', question: 'When learning something new, what works best for you?', pole_a_label: 'Clear step-by-step examples', pole_a_trait: 'S', pole_b_label: 'Understanding the big idea first', pole_b_trait: 'N' },
    { id: 'P22', question: 'In science class, how well do you remember exact facts and figures?', pole_a_label: 'Very well — I remember details', pole_a_trait: 'S', pole_b_label: 'I remember concepts, not exact figures', pole_b_trait: 'N' },
    { id: 'P23', question: 'Would you notice if a friend changed their hairstyle today?', pole_a_label: 'Yes — I notice small changes', pole_a_trait: 'S', pole_b_label: 'Probably not — I focus on the big picture', pole_b_trait: 'N' },
    { id: 'P24', question: 'When studying, which do you prefer?', pole_a_label: 'Detailed notes with full information', pole_a_trait: 'S', pole_b_label: 'Short summaries and key concepts', pole_b_trait: 'N' },
    { id: 'P25', question: 'Before starting a task, what do you need?', pole_a_label: 'Clear and specific instructions', pole_a_trait: 'S', pole_b_label: 'Just the goal — I figure out the rest', pole_b_trait: 'N' },
    { id: 'P26', question: 'When making a decision, what do you trust more?', pole_a_label: 'My own past experience', pole_a_trait: 'S', pole_b_label: 'My instinct about what could work', pole_b_trait: 'N' },
    { id: 'P27', question: 'What do you find more interesting?', pole_a_label: 'Fixing and improving real things', pole_a_trait: 'S', pole_b_label: 'Imagining and inventing new things', pole_b_trait: 'N' },
    { id: 'P28', question: 'In art class, what do you prefer to create?', pole_a_label: 'Realistic drawings of real objects', pole_a_trait: 'S', pole_b_label: 'Imaginative scenes from my mind', pole_b_trait: 'N' },
    { id: 'P29', question: 'How well do you remember exactly what happened last weekend?', pole_a_label: 'Very well — I remember exact details', pole_a_trait: 'S', pole_b_label: 'Roughly — I remember the feeling, not details', pole_b_trait: 'N' },
    { id: 'P30', question: 'What do you prefer to talk about with friends?', pole_a_label: 'What is happening now in real life', pole_a_trait: 'S', pole_b_label: 'Future possibilities and ideas', pole_b_trait: 'N' },
    { id: 'P31', question: 'How do you prefer to work on a task?', pole_a_label: 'Focus on one thing at a time', pole_a_trait: 'S', pole_b_label: 'Jump between many ideas at once', pole_b_trait: 'N' },
    { id: 'P32', question: 'Which type of story do you enjoy more?', pole_a_label: 'Real-life stories that actually happened', pole_a_trait: 'S', pole_b_label: 'Fantasy and science fiction', pole_b_trait: 'N' },
    { id: 'P33', question: 'When cooking or building something, what do you do?', pole_a_label: 'Follow the recipe or plan exactly', pole_a_trait: 'S', pole_b_label: 'Experiment and try my own way', pole_b_trait: 'N' },
    { id: 'P34', question: 'What do you find more exciting?', pole_a_label: 'Practical projects you can touch and use', pole_a_trait: 'S', pole_b_label: 'Creative projects with no fixed rules', pole_b_trait: 'N' },
    { id: 'P35', question: 'What kind of gift would you prefer to receive?', pole_a_label: 'Something practical and useful', pole_a_trait: 'S', pole_b_label: 'Something unusual and surprising', pole_b_trait: 'N' },
    { id: 'P36', question: 'Before playing a new game, what do you want?', pole_a_label: 'To know all the rules first', pole_a_trait: 'S', pole_b_label: 'To just start and figure it out', pole_b_trait: 'N' },
    { id: 'P37', question: 'What do you enjoy more?', pole_a_label: 'Watching a real cricket or football match', pole_a_trait: 'S', pole_b_label: 'Imagining how the perfect game would be', pole_b_trait: 'N' },
    { id: 'P38', question: 'What do you trust more?', pole_a_label: 'Things you can see and prove', pole_a_trait: 'S', pole_b_label: 'Patterns and ideas in your mind', pole_b_trait: 'N' },
    { id: 'P39', question: 'How do you prefer to learn a new skill?', pole_a_label: 'Hands-on practice', pole_a_trait: 'S', pole_b_label: 'Understanding the theory first', pole_b_trait: 'N' },
    { id: 'P40', question: 'After reading a book or watching a film, what do you remember more?', pole_a_label: 'Exact scenes and details', pole_a_trait: 'S', pole_b_label: 'The overall meaning or message', pole_b_trait: 'N' },
  ]),
  ...withDimension('TF', [
    { id: 'P41', question: 'When a friend breaks a rule, how do you think about it?', pole_a_label: 'Was the rule broken or not — facts first', pole_a_trait: 'T', pole_b_label: 'Why did they do it — their situation matters', pole_b_trait: 'F' },
    { id: 'P42', question: 'When you disagree with someone, what matters more to you?', pole_a_label: 'Finding the correct answer', pole_a_trait: 'T', pole_b_label: 'Keeping the relationship peaceful', pole_b_trait: 'F' },
    { id: 'P43', question: 'When two friends are in a fight and ask you to help, what do you focus on?', pole_a_label: 'Who is factually right', pole_a_trait: 'T', pole_b_label: 'How both of them are feeling', pole_b_trait: 'F' },
    { id: 'P44', question: "If telling the truth will hurt someone's feelings, what do you prefer?", pole_a_label: 'Tell the truth — it is better for them', pole_a_trait: 'T', pole_b_label: 'Be gentle — feelings matter too', pole_b_trait: 'F' },
    { id: 'P45', question: 'What kind of teacher do you respond to better?', pole_a_label: 'One who explains clearly and logically', pole_a_trait: 'T', pole_b_label: 'One who is warm and encouraging', pole_b_trait: 'F' },
    { id: 'P46', question: 'How do you give feedback to a friend who made a mistake?', pole_a_label: 'Directly and clearly', pole_a_trait: 'T', pole_b_label: 'Gently and carefully', pole_b_trait: 'F' },
    { id: 'P47', question: 'When a classmate fails an exam, what is your first response?', pole_a_label: 'Think about what they can do better', pole_a_trait: 'T', pole_b_label: 'Check how they are feeling first', pole_b_trait: 'F' },
    { id: 'P48', question: 'Do you think rules should apply the same way to everyone?', pole_a_label: 'Yes — consistency is fair', pole_a_trait: 'T', pole_b_label: "It depends on the person's situation", pole_b_trait: 'F' },
    { id: 'P49', question: 'What do you enjoy doing more when a friend has a problem?', pole_a_label: 'Helping solve the problem', pole_a_trait: 'T', pole_b_label: 'Listening and being there for them', pole_b_trait: 'F' },
    { id: 'P50', question: 'When watching a match, what do you focus on?', pole_a_label: 'Team strategy and tactics', pole_a_trait: 'T', pole_b_label: 'How the players are feeling and their stories', pole_b_trait: 'F' },
    { id: 'P51', question: 'How easily can you keep personal feelings separate from a task or decision?', pole_a_label: 'Easily — I prefer to stay objective', pole_a_trait: 'T', pole_b_label: 'Difficult — my feelings always matter to me', pole_b_trait: 'F' },
    { id: 'P52', question: "When evaluating someone's work, what matters more to you?", pole_a_label: 'The quality of the final result', pole_a_trait: 'T', pole_b_label: 'The effort and care they put in', pole_b_trait: 'F' },
    { id: 'P53', question: 'When something goes wrong, what do you focus on first?', pole_a_label: 'Figuring out how to fix it', pole_a_trait: 'T', pole_b_label: 'Processing how it made everyone feel', pole_b_trait: 'F' },
    { id: 'P54', question: 'In your mind, which is more important?', pole_a_label: 'Being accurate and truthful', pole_a_trait: 'T', pole_b_label: 'Being kind and considerate', pole_b_trait: 'F' },
    { id: 'P55', question: 'When giving advice, what kind do you give?', pole_a_label: 'Practical and actionable, even if hard to hear', pole_a_trait: 'T', pole_b_label: 'Supportive and encouraging, keeping feelings in mind', pole_b_trait: 'F' },
    { id: 'P56', question: 'How do you feel about a healthy debate or argument?', pole_a_label: 'I enjoy intellectual debate', pole_a_trait: 'T', pole_b_label: 'I find arguments uncomfortable', pole_b_trait: 'F' },
    { id: 'P57', question: 'How do you think emotions affect decision-making?', pole_a_label: 'They often get in the way', pole_a_trait: 'T', pole_b_label: 'They are important to include', pole_b_trait: 'F' },
    { id: 'P58', question: 'When something is not fair but it would keep the peace, what do you choose?', pole_a_label: 'I push for what is fair', pole_a_trait: 'T', pole_b_label: 'I accept it to keep harmony', pole_b_trait: 'F' },
    { id: 'P59', question: 'When making a group decision, how do you contribute?', pole_a_label: 'I push for the most logical option', pole_a_trait: 'T', pole_b_label: 'I make sure everyone agrees and feels heard', pole_b_trait: 'F' },
    { id: 'P60', question: 'In your opinion, which is more reliable?', pole_a_label: 'Objective facts and evidence', pole_a_trait: 'T', pole_b_label: "People's personal experience and feelings", pole_b_trait: 'F' },
  ]),
  ...withDimension('JP', [
    { id: 'P61', question: 'When is your homework usually done relative to the deadline?', pole_a_label: 'Well before the deadline', pole_a_trait: 'J', pole_b_label: 'Around or just before the deadline', pole_b_trait: 'P' },
    { id: 'P62', question: 'How would you describe your desk or study area?', pole_a_label: 'Neat and organised', pole_a_trait: 'J', pole_b_label: 'Spread out and flexible', pole_b_trait: 'P' },
    { id: 'P63', question: 'How do you prepare for exams?', pole_a_label: 'I make a study plan and follow it', pole_a_trait: 'J', pole_b_label: 'I study when the mood is right', pole_b_trait: 'P' },
    { id: 'P64', question: 'What kind of daily schedule do you prefer?', pole_a_label: 'A fixed timetable I follow', pole_a_trait: 'J', pole_b_label: 'Deciding what to do as the day goes', pole_b_trait: 'P' },
    { id: 'P65', question: 'How do you prepare your school bag?', pole_a_label: 'The night before, everything ready', pole_a_trait: 'J', pole_b_label: 'In the morning, quickly', pole_b_trait: 'P' },
    { id: 'P66', question: 'How do you prefer to work on tasks?', pole_a_label: 'Start and finish one thing before the next', pole_a_trait: 'J', pole_b_label: 'Work on many things at the same time', pole_b_trait: 'P' },
    { id: 'P67', question: 'How do you feel when plans suddenly change?', pole_a_label: 'Stressed — I prefer plans to be kept', pole_a_trait: 'J', pole_b_label: 'Fine — I adapt easily', pole_b_trait: 'P' },
    { id: 'P68', question: 'Do you follow rules even when nobody is watching?', pole_a_label: 'Yes — I follow rules regardless', pole_a_trait: 'J', pole_b_label: 'Situation-dependent — I use my judgement', pole_b_trait: 'P' },
    { id: 'P69', question: 'How do you like events and outings to be organised?', pole_a_label: 'Planned in advance with clear details', pole_a_trait: 'J', pole_b_label: 'Spontaneous — decided at the last minute', pole_b_trait: 'P' },
    { id: 'P70', question: 'How do you feel about making a to-do list?', pole_a_label: 'I love lists and ticking things off', pole_a_trait: 'J', pole_b_label: 'Lists feel restrictive to me', pole_b_trait: 'P' },
    { id: 'P71', question: 'How early do you usually arrive to events or school?', pole_a_label: 'Early — I dislike being late', pole_a_trait: 'J', pole_b_label: 'On time or sometimes a bit late', pole_b_trait: 'P' },
    { id: 'P72', question: 'How do you plan your weekend?', pole_a_label: 'I plan it in advance', pole_a_trait: 'J', pole_b_label: 'I decide when the weekend arrives', pole_b_trait: 'P' },
    { id: 'P73', question: 'How do you feel in a messy or disorganised environment?', pole_a_label: 'Uncomfortable — I prefer order', pole_a_trait: 'J', pole_b_label: 'Fine — I do not notice it much', pole_b_trait: 'P' },
    { id: 'P74', question: 'Do you like setting goals for yourself?', pole_a_label: 'Yes — clear goals help me focus', pole_a_trait: 'J', pole_b_label: 'I prefer to go with the flow', pole_b_trait: 'P' },
    { id: 'P75', question: 'When starting a new activity, what do you prefer?', pole_a_label: 'Step-by-step instructions', pole_a_trait: 'J', pole_b_label: 'Figure it out as I go', pole_b_trait: 'P' },
    { id: 'P76', question: 'How do you handle chores or responsibilities at home?', pole_a_label: 'Regularly on a schedule', pole_a_trait: 'J', pole_b_label: 'When I feel like it or when asked', pole_b_trait: 'P' },
    { id: 'P77', question: 'Do you complete one project fully before starting another?', pole_a_label: 'Yes — I finish what I start', pole_a_trait: 'J', pole_b_label: 'I often start new things before finishing', pole_b_trait: 'P' },
    { id: 'P78', question: 'How are your shelves, books, or belongings usually kept?', pole_a_label: 'Organised with a clear system', pole_a_trait: 'J', pole_b_label: 'A flexible arrangement that works for me', pole_b_trait: 'P' },
    { id: 'P79', question: 'How often do you check your progress on a task or goal?', pole_a_label: 'Regularly — I track my progress', pole_a_trait: 'J', pole_b_label: 'Rarely — I focus on doing, not tracking', pole_b_trait: 'P' },
    { id: 'P80', question: 'If a plan changes at the last minute, what do you do?', pole_a_label: 'Feel unsettled and need time to adjust', pole_a_trait: 'J', pole_b_label: 'Adapt immediately — I enjoy the change', pole_b_trait: 'P' },
  ]),
];

const advancedQuestions = [
  ...withDimension('EI', [
    { id: 'A01', question: 'After class, would you rather join friends for tea or go home to rest?', pole_a_label: 'Tea with friends', pole_a_trait: 'E', pole_b_label: 'Go home and recharge', pole_b_trait: 'I' },
    { id: 'A02', question: 'How do you feel about group study sessions?', pole_a_label: 'I prefer group study — the energy helps', pole_a_trait: 'E', pole_b_label: 'I focus better studying alone', pole_b_trait: 'I' },
    { id: 'A03', question: 'At a university event, how do you interact?', pole_a_label: 'Mingle with many people I do not know', pole_a_trait: 'E', pole_b_label: 'Stick to people I already know', pole_b_trait: 'I' },
    { id: 'A04', question: 'How do you feel after attending a large gathering or party?', pole_a_label: 'More alive and energised than before', pole_a_trait: 'E', pole_b_label: 'Tired and needing recovery time', pole_b_trait: 'I' },
    { id: 'A05', question: 'How often do you start conversations with strangers?', pole_a_label: 'Often — I find it natural', pole_a_trait: 'E', pole_b_label: 'Rarely — I wait for others to approach', pole_b_trait: 'I' },
    { id: 'A06', question: 'In a group project, what role suits you best?', pole_a_label: 'Presenter and team coordinator', pole_a_trait: 'E', pole_b_label: 'Researcher working independently', pole_b_trait: 'I' },
    { id: 'A07', question: 'How does a full day alone feel to you?', pole_a_label: 'Boring and isolating', pole_a_trait: 'E', pole_b_label: 'Peaceful and productive', pole_b_trait: 'I' },
    { id: 'A08', question: 'How easily do you join new clubs, societies, or groups?', pole_a_label: 'Very easily — I enjoy new groups', pole_a_trait: 'E', pole_b_label: 'Cautiously — I observe before joining', pole_b_trait: 'I' },
    { id: 'A09', question: 'How openly do you share updates from your life on social media?', pole_a_label: 'I share freely and openly', pole_a_trait: 'E', pole_b_label: 'I prefer to keep my life private', pole_b_trait: 'I' },
    { id: 'A10', question: 'In a conversation, what describes you better?', pole_a_label: 'I speak more than I listen', pole_a_trait: 'E', pole_b_label: 'I listen more than I speak', pole_b_trait: 'I' },
    { id: 'A11', question: 'For an internship or job, what environment do you prefer?', pole_a_label: 'A large, collaborative team', pole_a_trait: 'E', pole_b_label: 'A small team or independent work', pole_b_trait: 'I' },
    { id: 'A12', question: 'At weddings, how do you spend your time?', pole_a_label: 'Moving between many guest groups', pole_a_trait: 'E', pole_b_label: 'Staying with a small group I know', pole_b_trait: 'I' },
    { id: 'A13', question: 'How comfortable are you speaking up in a class debate?', pole_a_label: 'Very comfortable — I enjoy it', pole_a_trait: 'E', pole_b_label: 'I prefer to listen and observe', pole_b_trait: 'I' },
    { id: 'A14', question: 'How do you feel in a busy marketplace or crowded place?', pole_a_label: 'Comfortable and stimulated', pole_a_trait: 'E', pole_b_label: 'Overwhelmed and wanting to leave', pole_b_trait: 'I' },
    { id: 'A15', question: 'Who usually organises social plans in your friend group?', pole_a_label: 'Me — I enjoy planning outings', pole_a_trait: 'E', pole_b_label: 'Usually others — I follow along', pole_b_trait: 'I' },
    { id: 'A16', question: 'How do you feel about networking events for career purposes?', pole_a_label: 'I find them valuable and enjoy them', pole_a_trait: 'E', pole_b_label: 'I find them exhausting', pole_b_trait: 'I' },
    { id: 'A17', question: 'How comfortable are you introducing yourself to senior professionals?', pole_a_label: 'Very comfortable', pole_a_trait: 'E', pole_b_label: 'I find it nerve-wracking', pole_b_trait: 'I' },
    { id: 'A18', question: 'How quickly do you make friends in a new place?', pole_a_label: 'Very quickly', pole_a_trait: 'E', pole_b_label: 'Slowly — it takes time to open up', pole_b_trait: 'I' },
    { id: 'A19', question: 'How do you feel about public speaking?', pole_a_label: 'I enjoy it', pole_a_trait: 'E', pole_b_label: 'I avoid it when possible', pole_b_trait: 'I' },
    { id: 'A20', question: 'How do you feel without social interaction for an extended period?', pole_a_label: 'Restless and bored', pole_a_trait: 'E', pole_b_label: 'Comfortable and productive', pole_b_trait: 'I' },
  ]),
  ...withDimension('SN', [
    { id: 'A21', question: 'How do you prefer to learn?', pole_a_label: 'Practical examples and hands-on work', pole_a_trait: 'S', pole_b_label: 'Theory and conceptual frameworks', pole_b_trait: 'N' },
    { id: 'A22', question: 'After a lecture, what do you tend to remember?', pole_a_label: 'Exact figures, names, and facts', pole_a_trait: 'S', pole_b_label: 'The main argument and ideas', pole_b_trait: 'N' },
    { id: 'A23', question: 'Before starting a project or task, what do you need?', pole_a_label: 'Step-by-step instructions', pole_a_trait: 'S', pole_b_label: 'Just the end goal — I will work it out', pole_b_trait: 'N' },
    { id: 'A24', question: 'When reading or watching the news, what do you focus on?', pole_a_label: 'The specific details and facts', pole_a_trait: 'S', pole_b_label: 'What the event means in the bigger picture', pole_b_trait: 'N' },
    { id: 'A25', question: 'Would you notice if a colleague changed something minor about their appearance?', pole_a_label: 'Yes — I notice small details', pole_a_trait: 'S', pole_b_label: 'Probably not — I focus on the bigger picture', pole_b_trait: 'N' },
    { id: 'A26', question: 'When making decisions, what do you rely on more?', pole_a_label: 'Past experience and proven facts', pole_a_trait: 'S', pole_b_label: 'Intuition and pattern recognition', pole_b_trait: 'N' },
    { id: 'A27', question: 'What do you prefer in academic or professional work?', pole_a_label: 'Clear data and specific evidence', pole_a_trait: 'S', pole_b_label: 'Abstract theories and creative ideas', pole_b_trait: 'N' },
    { id: 'A28', question: 'In design or creative work, what style do you gravitate toward?', pole_a_label: 'Realistic and detail-oriented', pole_a_trait: 'S', pole_b_label: 'Abstract and conceptual', pole_b_trait: 'N' },
    { id: 'A29', question: 'When working with tools or technology, what interests you more?', pole_a_label: 'How it physically works', pole_a_trait: 'S', pole_b_label: 'What new things it could enable', pole_b_trait: 'N' },
    { id: 'A30', question: 'How well do you recall exactly what was said in a conversation?', pole_a_label: 'Very well — near verbatim', pole_a_trait: 'S', pole_b_label: 'I recall the meaning, not exact words', pole_b_trait: 'N' },
    { id: 'A31', question: 'Do you prefer to talk about current events or future trends?', pole_a_label: 'What is happening now', pole_a_trait: 'S', pole_b_label: 'Where things are heading in the future', pole_b_trait: 'N' },
    { id: 'A32', question: 'When solving a problem, what do you trust more?', pole_a_label: 'Proven methods that have worked before', pole_a_trait: 'S', pole_b_label: 'Experimenting with new approaches', pole_b_trait: 'N' },
    { id: 'A33', question: 'When preparing a dish or building something, how do you work?', pole_a_label: 'Measure and follow the instructions carefully', pole_a_trait: 'S', pole_b_label: 'Improvise based on what feels right', pole_b_trait: 'N' },
    { id: 'A34', question: 'What drives your work more?', pole_a_label: 'What I can observe and verify', pole_a_trait: 'S', pole_b_label: 'What I can imagine and create', pole_b_trait: 'N' },
    { id: 'A35', question: 'What kind of gift do you prefer?', pole_a_label: 'Something practical and useful', pole_a_trait: 'S', pole_b_label: 'Something thoughtful and unexpected', pole_b_trait: 'N' },
    { id: 'A36', question: 'Where do you place more focus in your work?', pole_a_label: 'How to do it', pole_a_trait: 'S', pole_b_label: 'Why it matters', pole_b_trait: 'N' },
    { id: 'A37', question: 'What enriches your learning more?', pole_a_label: 'Visiting real places and seeing things in person', pole_a_trait: 'S', pole_b_label: 'Exploring ideas and possibilities conceptually', pole_b_trait: 'N' },
    { id: 'A38', question: 'What kind of work gives you more satisfaction?', pole_a_label: 'Hands-on, tangible work with visible results', pole_a_trait: 'S', pole_b_label: 'Brainstorming and generating new ideas', pole_b_trait: 'N' },
    { id: 'A39', question: 'What do you tend to notice first in a new environment?', pole_a_label: "Specific details — layout, objects, people's expressions", pole_a_trait: 'S', pole_b_label: 'The overall atmosphere and what it means', pole_b_trait: 'N' },
    { id: 'A40', question: 'When presenting or writing, what do you focus on?', pole_a_label: 'Facts, data, and concrete evidence', pole_a_trait: 'S', pole_b_label: 'Ideas, vision, and possibilities', pole_b_trait: 'N' },
  ]),
  ...withDimension('TF', [
    { id: 'A41', question: 'When giving critical feedback in a group, how do you deliver it?', pole_a_label: 'Directly and clearly, for improvement', pole_a_trait: 'T', pole_b_label: 'Carefully, making sure the person feels supported', pole_b_trait: 'F' },
    { id: 'A42', question: 'When choosing between two career opportunities, what do you evaluate first?', pole_a_label: 'Salary, growth potential, and outcomes', pole_a_trait: 'T', pole_b_label: 'Team culture and how meaningful the work is', pole_b_trait: 'F' },
    { id: 'A43', question: 'When friends disagree, how do you evaluate the situation?', pole_a_label: 'I assess who has the stronger argument', pole_a_trait: 'T', pole_b_label: "I consider everyone's perspective and feelings", pole_b_trait: 'F' },
    { id: 'A44', question: 'If truth will hurt someone\'s feelings, what do you choose?', pole_a_label: 'Honesty — it serves them better long-term', pole_a_trait: 'T', pole_b_label: 'Compassion — I soften the truth', pole_b_trait: 'F' },
    { id: 'A45', question: 'What motivates you more at work or study?', pole_a_label: 'Being right and achieving results', pole_a_trait: 'T', pole_b_label: 'Being valued and maintaining positive relationships', pole_b_trait: 'F' },
    { id: 'A46', question: 'What kind of supervisor or teacher do you prefer?', pole_a_label: 'Strict, clear, and logical', pole_a_trait: 'T', pole_b_label: 'Warm, understanding, and encouraging', pole_b_trait: 'F' },
    { id: 'A47', question: 'How do you typically give feedback to someone struggling?', pole_a_label: 'Focus on specific, actionable improvements', pole_a_trait: 'T', pole_b_label: 'First ensure they feel supported and understood', pole_b_trait: 'F' },
    { id: 'A48', question: 'How do you think policies and rules should be applied?', pole_a_label: 'Consistently, the same for everyone', pole_a_trait: 'T', pole_b_label: 'Flexibly, based on individual circumstances', pole_b_trait: 'F' },
    { id: 'A49', question: 'What do you enjoy more in a competitive environment?', pole_a_label: 'The challenge of competing and winning', pole_a_trait: 'T', pole_b_label: 'Collaborating and seeing everyone grow', pole_b_trait: 'F' },
    { id: 'A50', question: 'How easily do you keep professional and personal matters separate?', pole_a_label: 'Very easily — I compartmentalise well', pole_a_trait: 'T', pole_b_label: 'Difficult — relationships always matter to me', pole_b_trait: 'F' },
    { id: 'A51', question: 'When evaluating someone\'s work, what weighs more?', pole_a_label: 'The measurable output and results', pole_a_trait: 'T', pole_b_label: 'The dedication and care they invested', pole_b_trait: 'F' },
    { id: 'A52', question: 'When a problem arises in your team, what is your instinct?', pole_a_label: 'Diagnose the root cause and fix it', pole_a_trait: 'T', pole_b_label: 'Understand how everybody is affected first', pole_b_trait: 'F' },
    { id: 'A53', question: 'Which matters more in communication?', pole_a_label: 'Being precise and accurate', pole_a_trait: 'T', pole_b_label: 'Being empathetic and considerate', pole_b_trait: 'F' },
    { id: 'A54', question: 'How do you enjoy intellectual discussion?', pole_a_label: 'Debating and challenging each other\'s reasoning', pole_a_trait: 'T', pole_b_label: 'Sharing perspectives and building understanding together', pole_b_trait: 'F' },
    { id: 'A55', question: 'How do you think emotions affect professional decisions?', pole_a_label: 'They often reduce objectivity', pole_a_trait: 'T', pole_b_label: 'They provide important human context', pole_b_trait: 'F' },
    { id: 'A56', question: 'When something is unfair but resolves quickly, what do you do?', pole_a_label: 'Raise it — fairness matters more than peace', pole_a_trait: 'T', pole_b_label: 'Let it go — harmony matters more', pole_b_trait: 'F' },
    { id: 'A57', question: 'When making a difficult group decision, what drives you?', pole_a_label: 'The most rational and effective outcome', pole_a_trait: 'T', pole_b_label: 'An outcome everyone is comfortable with', pole_b_trait: 'F' },
    { id: 'A58', question: 'What do you believe leads to better outcomes?', pole_a_label: 'Objective analysis of facts', pole_a_trait: 'T', pole_b_label: 'Understanding the human side of a situation', pole_b_trait: 'F' },
    { id: 'A59', question: 'How do you handle personal disagreement with a colleague?', pole_a_label: 'Address it directly and focus on the issue', pole_a_trait: 'T', pole_b_label: 'Work on the relationship first, then the issue', pole_b_trait: 'F' },
    { id: 'A60', question: 'What inspires you to work harder?', pole_a_label: 'Seeing a clear and logical goal', pole_a_trait: 'T', pole_b_label: 'Knowing the work matters to people', pole_b_trait: 'F' },
  ]),
  ...withDimension('JP', [
    { id: 'A61', question: 'When do you typically complete assignments relative to the deadline?', pole_a_label: 'Well in advance', pole_a_trait: 'J', pole_b_label: 'Around the deadline — pressure helps', pole_b_trait: 'P' },
    { id: 'A62', question: 'How organised are your study notes or work files?', pole_a_label: 'Clearly structured and easy to find', pole_a_trait: 'J', pole_b_label: 'Spread out — I know where things are', pole_b_trait: 'P' },
    { id: 'A63', question: 'How do you prepare for exams or important events?', pole_a_label: 'Create a schedule and follow it', pole_a_trait: 'J', pole_b_label: 'Prepare when I feel ready', pole_b_trait: 'P' },
    { id: 'A64', question: 'What kind of plans do you prefer?', pole_a_label: 'Fixed and confirmed in advance', pole_a_trait: 'J', pole_b_label: 'Open and flexible', pole_b_trait: 'P' },
    { id: 'A65', question: 'How do you prepare for an important interview or presentation?', pole_a_label: 'Thoroughly in advance with a clear plan', pole_a_trait: 'J', pole_b_label: 'I rely on my ability to improvise', pole_b_trait: 'P' },
    { id: 'A66', question: 'How important is a daily routine to you?', pole_a_label: 'Very important — I follow it consistently', pole_a_trait: 'J', pole_b_label: 'Not important — I prefer variety', pole_b_trait: 'P' },
    { id: 'A67', question: 'How do you react when plans change unexpectedly?', pole_a_label: 'I feel unsettled and need time to readjust', pole_a_trait: 'J', pole_b_label: 'I adapt quickly and see it as an opportunity', pole_b_trait: 'P' },
    { id: 'A68', question: 'How do you feel when you complete all tasks for the day?', pole_a_label: 'Satisfied — a clear mind is important to me', pole_a_trait: 'J', pole_b_label: 'Neutral — there is always more to explore', pole_b_trait: 'P' },
    { id: 'A69', question: 'When attending a meeting, what do you prefer?', pole_a_label: 'A full agenda sent in advance', pole_a_trait: 'J', pole_b_label: 'A loose direction and open discussion', pole_b_trait: 'P' },
    { id: 'A70', question: 'How early do you usually arrive to important events?', pole_a_label: 'Early — I dislike being late', pole_a_trait: 'J', pole_b_label: 'On time or occasionally a little late', pole_b_trait: 'P' },
    { id: 'A71', question: 'How detailed is your planning for travel or major events?', pole_a_label: 'Thoroughly planned with little left to chance', pole_a_trait: 'J', pole_b_label: 'Loosely planned — I like to discover as I go', pole_b_trait: 'P' },
    { id: 'A72', question: 'How do you feel about leaving things unfinished?', pole_a_label: 'It bothers me — I prefer closure', pole_a_trait: 'J', pole_b_label: 'I am comfortable returning to things later', pole_b_trait: 'P' },
    { id: 'A73', question: 'When starting a new process, what do you prefer?', pole_a_label: 'Clear step-by-step instructions', pole_a_trait: 'J', pole_b_label: 'An open brief with room to explore', pole_b_trait: 'P' },
    { id: 'A74', question: 'How consistently do you meet deadlines?', pole_a_label: 'Always — I plan to avoid last-minute rushes', pole_a_trait: 'J', pole_b_label: 'Mostly — sometimes the deadline motivates me', pole_b_trait: 'P' },
    { id: 'A75', question: 'Do you use a personal calendar or planner?', pole_a_label: 'Yes — I rely on it', pole_a_trait: 'J', pole_b_label: 'Rarely — I keep it in my head', pole_b_trait: 'P' },
    { id: 'A76', question: 'How do you prefer to structure your work time?', pole_a_label: 'Defined blocks with clear goals', pole_a_trait: 'J', pole_b_label: 'Flexible — based on energy and inspiration', pole_b_trait: 'P' },
    { id: 'A77', question: 'How is your workspace usually kept?', pole_a_label: 'Organised with a consistent system', pole_a_trait: 'J', pole_b_label: 'Dynamic — it reflects my current work', pole_b_trait: 'P' },
    { id: 'A78', question: 'How do you handle multiple ongoing projects?', pole_a_label: 'Complete one before starting the next', pole_a_trait: 'J', pole_b_label: 'Work on all simultaneously based on interest', pole_b_trait: 'P' },
    { id: 'A79', question: 'How do you approach tracking your academic or professional goals?', pole_a_label: 'Regular check-ins and milestones', pole_a_trait: 'J', pole_b_label: 'I focus on the work, not the tracking', pole_b_trait: 'P' },
    { id: 'A80', question: 'If your team suddenly changes the direction of a project, how do you respond?', pole_a_label: 'I need time to re-plan before proceeding', pole_a_trait: 'J', pole_b_label: 'I pivot immediately and enjoy the new challenge', pole_b_trait: 'P' },
  ]),
];

export const MENTAL_HEALTH_INTRO = 'The next few questions are about how you have been feeling recently. There are no right or wrong answers. You will not get in trouble for your answers. We ask because we care.';

export const MENTAL_HEALTH_QUESTIONS = [
  ...withDomain('depression', [
    { id: 'MH01', source: 'PHQ-A adapted', question: 'Over the past 2 weeks, how often have you felt little interest or pleasure in things you usually enjoy?', risk_weight: 1, amber_threshold: 3, red_threshold: 5 },
    { id: 'MH02', source: 'PHQ-A adapted', question: 'How often have you felt sad, empty, or hopeless?', risk_weight: 1, amber_threshold: 3, red_threshold: 5 },
    { id: 'MH03', source: 'PHQ-A adapted', question: 'How often have you had trouble sleeping, or slept too much?', risk_weight: 1, amber_threshold: 3, red_threshold: 5 },
    { id: 'MH04', source: 'PHQ-A adapted', question: 'How often have you felt tired or had very little energy, even after resting?', risk_weight: 1, amber_threshold: 3, red_threshold: 5 },
    { id: 'MH05', source: 'PHQ-A adapted', question: 'How often have you had little appetite or eaten too much more than usual?', risk_weight: 1, amber_threshold: 3, red_threshold: 5 },
    { id: 'MH06', source: 'PHQ-A adapted', question: 'How often have you felt like a failure, or like you have let your family or yourself down?', risk_weight: 2, amber_threshold: 3, red_threshold: 4 },
    { id: 'MH07', source: 'PHQ-A adapted', question: 'How often have you found it difficult to concentrate on schoolwork or tasks you need to do?', risk_weight: 1, amber_threshold: 3, red_threshold: 5 },
    { id: 'MH08', source: 'PHQ-A adapted', question: 'How often have you felt so slowed down, or so restless, that others could notice?', risk_weight: 1, amber_threshold: 3, red_threshold: 5 },
    { id: 'MH09', source: 'PHQ-A / C-SSRS CRITICAL', question: 'How often have you had thoughts that things would be better if you were not here, or that you would rather not be alive?', risk_weight: 5, amber_threshold: 2, red_threshold: 3, auto_red_flag: true, note: 'Any score of 2 or above triggers amber. Score of 3 or above triggers immediate red regardless of total score.' },
  ]),
  ...withDomain('anxiety', [
    { id: 'MH10', source: 'GAD-7 adapted', question: 'How often have you felt nervous, anxious, or on edge without a clear reason?', risk_weight: 1, amber_threshold: 3, red_threshold: 5 },
    { id: 'MH11', source: 'GAD-7 adapted', question: 'How often have you been unable to stop worrying, even when you wanted to?', risk_weight: 1, amber_threshold: 3, red_threshold: 5 },
    { id: 'MH12', source: 'GAD-7 adapted', question: 'How often have you felt afraid that something bad was going to happen?', risk_weight: 2, amber_threshold: 3, red_threshold: 4 },
    { id: 'MH13', source: 'GAD-7 adapted', question: 'How often has worrying made it hard for you to relax or enjoy things?', risk_weight: 1, amber_threshold: 3, red_threshold: 5 },
  ]),
  ...withDomain('self_harm', [
    { id: 'MH14', source: 'C-SSRS adapted', question: 'Have you had thoughts of wishing you were not alive or of going to sleep and not waking up?', scale_override: { 1: 'Never', 2: 'Once or twice', 3: 'More than twice' }, risk_weight: 5, amber_threshold: 2, red_threshold: 2, auto_red_flag: false, note: 'Score of 2 or above = amber. Feeds into total risk calculation.' },
    { id: 'MH15', source: 'C-SSRS adapted — CRITICAL', question: 'Have you had thoughts of hurting yourself?', scale_override: { 1: 'Never', 2: 'Once or twice', 3: 'More than twice' }, risk_weight: 10, amber_threshold: 2, red_threshold: 2, auto_red_flag: true, note: 'Any score above 1 triggers immediate red alert.' },
    { id: 'MH16', source: 'C-SSRS adapted — CRITICAL', question: 'Have you made a plan to hurt yourself?', scale_override: { 1: 'No', 2: 'I thought about it', 3: 'Yes, I have a plan' }, risk_weight: 10, amber_threshold: 2, red_threshold: 2, auto_red_flag: true, note: 'Any score above 1 triggers immediate red alert.' },
    { id: 'MH17', source: 'C-SSRS adapted — CRITICAL', question: 'Have you ever hurt yourself on purpose?', scale_override: { 1: 'Never', 2: 'In the past but not recently', 3: 'Recently' }, risk_weight: 10, amber_threshold: 2, red_threshold: 3, auto_red_flag: true, note: 'Score of 3 (recently) = immediate red alert.' },
  ]),
  ...withDomain('social', [
    { id: 'MH18', source: 'SDQ adapted', question: 'How often do you feel lonely at school, even when others are around?', risk_weight: 2, amber_threshold: 3, red_threshold: 5 },
    { id: 'MH19', source: 'SDQ adapted', question: 'How often do you feel that the other students do not like you or leave you out?', risk_weight: 2, amber_threshold: 3, red_threshold: 5 },
    { id: 'MH20', source: 'SDQ adapted', question: 'How often do you feel frightened or very worried about going to school?', risk_weight: 2, amber_threshold: 3, red_threshold: 5 },
  ]),
];

export const QUESTION_BANKS = {
  junior: juniorQuestions,
  pilot: pilotQuestions,
  advanced: advancedQuestions,
};

export const PERSONALITY_SCALE = [
  { value: 1, label: 'Strongly left' },
  { value: 2, label: 'Slightly left' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Slightly right' },
  { value: 5, label: 'Strongly right' },
];

export const JUNIOR_SCALE = [
  { value: 1, label: 'A lot like the left side', face: ':D' },
  { value: 2, label: 'A little like the left side', face: ':)' },
  { value: 3, label: 'In the middle', face: ':|' },
  { value: 4, label: 'A little like the right side', face: ':/' },
  { value: 5, label: 'A lot like the right side', face: ':(' },
];

export const DEFAULT_FREQUENCY_SCALE = [
  { value: 1, label: 'Never' },
  { value: 2, label: 'Rarely' },
  { value: 3, label: 'Sometimes' },
  { value: 4, label: 'Often' },
  { value: 5, label: 'Almost Always' },
];

export function getAssessmentTrack(age) {
  if (age >= 8 && age <= 11) {
    return 'junior';
  }

  if (age >= 12 && age <= 15) {
    return 'pilot';
  }

  if (age >= 16) {
    return 'advanced';
  }

  return null;
}

export function getQuestionSet(track) {
  const personalityQuestions = QUESTION_BANKS[track] || [];
  return {
    personalityQuestions,
    mentalHealthQuestions: MENTAL_HEALTH_QUESTIONS,
    allQuestions: [...personalityQuestions, ...MENTAL_HEALTH_QUESTIONS],
  };
}

export function calculateSNTIType(answers, questions) {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  questions.forEach((question) => {
    const response = answers[question.id];
    if (!response) {
      return;
    }

    if (response === 1) {
      scores[question.pole_a_trait] += 2;
    } else if (response === 2) {
      scores[question.pole_a_trait] += 1;
    } else if (response === 4) {
      scores[question.pole_b_trait] += 1;
    } else if (response === 5) {
      scores[question.pole_b_trait] += 2;
    }
  });

  const dimensions = [
    { key: 'EI', pair: ['E', 'I'] },
    { key: 'SN', pair: ['S', 'N'] },
    { key: 'TF', pair: ['T', 'F'] },
    { key: 'JP', pair: ['J', 'P'] },
  ];

  let type = '';
  const dimensionScores = {};
  const borderlines = [];

  dimensions.forEach(({ key, pair: [traitA, traitB] }) => {
    const diff = scores[traitA] - scores[traitB];
    dimensionScores[key] = diff;
    type += diff >= 0 ? traitA : traitB;

    if (Math.abs(diff) <= 3) {
      borderlines.push(key);
    }
  });

  return {
    type,
    traitScores: scores,
    dimensionScores,
    borderlines,
  };
}

export function calculateRiskTier(answers) {
  const triggers = [];
  let immediateRed = false;
  let totalWeightedScore = 0;

  MENTAL_HEALTH_QUESTIONS.forEach((question) => {
    const response = answers[question.id];
    if (!response) {
      return;
    }

    totalWeightedScore += response * question.risk_weight;

    if (question.auto_red_flag && response >= question.red_threshold) {
      immediateRed = true;
      triggers.push({
        questionId: question.id,
        severity: 'RED',
        response,
        reason: 'auto_flag',
      });
      return;
    }

    if (response >= question.amber_threshold) {
      triggers.push({
        questionId: question.id,
        severity: 'AMBER',
        response,
        reason: 'threshold_met',
      });
    }
  });

  let tier = 'GREEN';
  if (immediateRed || totalWeightedScore >= 80) {
    tier = 'RED';
  } else if (totalWeightedScore >= 40 || triggers.some((trigger) => trigger.severity === 'AMBER')) {
    tier = 'AMBER';
  }

  return {
    tier,
    triggers,
    totalWeightedScore,
  };
}