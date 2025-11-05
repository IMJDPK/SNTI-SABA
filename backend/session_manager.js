import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Session storage
const sessions = new Map();

// SNTI TEST Questions (20 questions for comprehensive MBTI assessment)
export const SNTI_QUESTIONS = [
    // E/I - Extraversion vs Introversion (5 questions)
    {
        id: 1,
        text: "When you're at a social gathering, do you:",
        textUrdu: "جب آپ کسی سماجی تقریب میں ہوں تو:",
        A: "Feel energized by meeting lots of new people",
        AUrdu: "بہت سے نئے لوگوں سے ملنے سے توانائی محسوس کرتے ہیں",
        B: "Prefer deep conversations with a few close friends",
        BUrdu: "چند قریبی دوستوں کے ساتھ گہری باتیں کرنا پسند کرتے ہیں",
        type: "E/I"
    },
    {
        id: 2,
        text: "After a long, tiring day, you prefer to:",
        textUrdu: "ایک طویل، تھکا دینے والے دن کے بعد، آپ ترجیح دیتے ہیں:",
        A: "Go out with friends to recharge your energy",
        AUrdu: "دوستوں کے ساتھ باہر جا کر اپنی توانائی بحال کریں",
        B: "Spend quiet time alone to restore yourself",
        BUrdu: "اکیلے پرسکون وقت گزار کر خود کو بحال کریں",
        type: "E/I"
    },
    {
        id: 3,
        text: "In a team project, you typically:",
        textUrdu: "ٹیم پروجیکٹ میں، آپ عام طور پر:",
        A: "Take the lead and engage with everyone actively",
        AUrdu: "قیادت کرتے ہیں اور سب کے ساتھ فعال طور پر مشغول ہوتے ہیں",
        B: "Work independently on your assigned tasks",
        BUrdu: "اپنے مقرر کردہ کاموں پر آزادانہ طور پر کام کرتے ہیں",
        type: "E/I"
    },
    {
        id: 4,
        text: "Your ideal weekend includes:",
        textUrdu: "آپ کے مثالی ویک اینڈ میں شامل ہے:",
        A: "Multiple social events and activities with others",
        AUrdu: "دوسروں کے ساتھ متعدد سماجی تقریبات اور سرگرمیاں",
        B: "Personal hobbies and peaceful, quiet moments",
        BUrdu: "ذاتی مشاغل اور پرامن، خاموش لمحات",
        type: "E/I"
    },
    {
        id: 5,
        text: "When sharing ideas, you prefer to:",
        textUrdu: "خیالات شیئر کرتے وقت، آپ ترجیح دیتے ہیں:",
        A: "Think out loud and discuss with others",
        AUrdu: "بلند آواز میں سوچیں اور دوسروں کے ساتھ بات چیت کریں",
        B: "Reflect internally before speaking",
        BUrdu: "بولنے سے پہلے اندرونی طور پر غور کریں",
        type: "E/I"
    },
    
    // S/N - Sensing vs Intuition (5 questions)
    {
        id: 6,
        text: "When solving problems, you trust more in:",
        textUrdu: "مسائل حل کرتے وقت، آپ زیادہ بھروسہ کرتے ہیں:",
        A: "Past experience and proven methods",
        AUrdu: "ماضی کے تجربے اور ثابت شدہ طریقوں پر",
        B: "Gut feelings and innovative approaches",
        BUrdu: "احساس اور جدید طریقوں پر",
        type: "S/N"
    },
    {
        id: 7,
        text: "You are more interested in:",
        textUrdu: "آپ زیادہ دلچسپی رکھتے ہیں:",
        A: "What is real, practical, and present",
        AUrdu: "جو حقیقی، عملی اور موجودہ ہے",
        B: "What could be possible and future potential",
        BUrdu: "جو ممکن ہو سکتا ہے اور مستقبل کی صلاحیت",
        type: "S/N"
    },
    {
        id: 8,
        text: "When learning something new, you prefer:",
        textUrdu: "کچھ نیا سیکھتے وقت، آپ ترجیح دیتے ہیں:",
        A: "Step-by-step practical instructions",
        AUrdu: "قدم بہ قدم عملی ہدایات",
        B: "Understanding underlying concepts and theories first",
        BUrdu: "پہلے بنیادی تصورات اور نظریات کو سمجھنا",
        type: "S/N"
    },
    {
        id: 9,
        text: "You tend to:",
        textUrdu: "آپ کا رجحان ہے:",
        A: "Focus on details, facts, and specifics",
        AUrdu: "تفصیلات، حقائق اور مخصوص چیزوں پر توجہ دینا",
        B: "See patterns, connections, and the big picture",
        BUrdu: "نمونے، روابط اور بڑی تصویر دیکھنا",
        type: "S/N"
    },
    {
        id: 10,
        text: "When reading or watching stories, you enjoy:",
        textUrdu: "کہانیاں پڑھتے یا دیکھتے وقت، آپ لطف اندوز ہوتے ہیں:",
        A: "Realistic, practical narratives",
        AUrdu: "حقیقت پسندانہ، عملی بیانیے",
        B: "Imaginative, abstract, and symbolic themes",
        BUrdu: "تخیلاتی، تجریدی اور علامتی موضوعات",
        type: "S/N"
    },
    
    // T/F - Thinking vs Feeling (5 questions)
    {
        id: 11,
        text: "When making important decisions, you primarily consider:",
        textUrdu: "اہم فیصلے کرتے وقت، آپ بنیادی طور پر غور کرتے ہیں:",
        A: "Logic, facts, and objective analysis",
        AUrdu: "منطق، حقائق اور معروضی تجزیہ",
        B: "Impact on people and emotional harmony",
        BUrdu: "لوگوں پر اثر اور جذباتی ہم آہنگی",
        type: "T/F"
    },
    {
        id: 12,
        text: "In conflicts or disagreements, you tend to:",
        textUrdu: "تنازعات یا اختلافات میں، آپ کا رجحان ہے:",
        A: "Focus on finding the correct, logical solution",
        AUrdu: "درست، منطقی حل تلاش کرنے پر توجہ دینا",
        B: "Focus on maintaining relationships and feelings",
        BUrdu: "تعلقات اور جذبات کو برقرار رکھنے پر توجہ دینا",
        type: "T/F"
    },
    {
        id: 13,
        text: "You value more:",
        textUrdu: "آپ زیادہ قدر کرتے ہیں:",
        A: "Truth and accuracy, even if it might hurt",
        AUrdu: "سچائی اور درستگی، چاہے وہ تکلیف دہ ہو",
        B: "Tact, kindness, and maintaining harmony",
        BUrdu: "نزاکت، مہربانی اور ہم آہنگی برقرار رکھنا",
        type: "T/F"
    },
    {
        id: 14,
        text: "When giving feedback to others, you are:",
        textUrdu: "دوسروں کو رائے دیتے وقت، آپ:",
        A: "Direct, honest, and objective",
        AUrdu: "براہ راست، ایمانداری اور معروضی ہوتے ہیں",
        B: "Gentle, encouraging, and supportive",
        BUrdu: "نرم، حوصلہ افزا اور معاون ہوتے ہیں",
        type: "T/F"
    },
    {
        id: 15,
        text: "You are more proud when people say you are:",
        textUrdu: "آپ زیادہ فخر محسوس کرتے ہیں جب لوگ کہیں کہ آپ:",
        A: "Competent, logical, and fair",
        AUrdu: "قابل، منطقی اور منصف ہیں",
        B: "Caring, empathetic, and understanding",
        BUrdu: "خیال رکھنے والے، ہمدرد اور سمجھدار ہیں",
        type: "T/F"
    },
    
    // J/P - Judging vs Perceiving (5 questions)
    {
        id: 16,
        text: "You prefer to:",
        textUrdu: "آپ ترجیح دیتے ہیں:",
        A: "Have a clear plan and schedule in advance",
        AUrdu: "پہلے سے واضح منصوبہ اور شیڈول رکھنا",
        B: "Keep options open and decide as you go",
        BUrdu: "اختیارات کھلے رکھنا اور چلتے چلتے فیصلہ کرنا",
        type: "J/P"
    },
    {
        id: 17,
        text: "Your work style is more:",
        textUrdu: "آپ کا کام کا انداز زیادہ ہے:",
        A: "Structured, organized, and methodical",
        AUrdu: "منظم، ترتیب شدہ اور طریقہ کار",
        B: "Flexible, spontaneous, and adaptable",
        BUrdu: "لچکدار، بے ساختہ اور موافق",
        type: "J/P"
    },
    {
        id: 18,
        text: "You feel better when things are:",
        textUrdu: "آپ بہتر محسوس کرتے ہیں جب چیزیں:",
        A: "Planned, decided, and settled",
        AUrdu: "منصوبہ بند، فیصلہ شدہ اور طے شدہ ہوں",
        B: "Open-ended and spontaneous",
        BUrdu: "کھلے انجام والی اور بے ساختہ ہوں",
        type: "J/P"
    },
    {
        id: 19,
        text: "In your daily life, you prefer to:",
        textUrdu: "اپنی روزمرہ زندگی میں، آپ ترجیح دیتے ہیں:",
        A: "Follow a routine and stick to deadlines",
        AUrdu: "معمول کی پیروی کرنا اور ڈیڈ لائن کا خیال رکھنا",
        B: "Go with the flow and adapt as needed",
        BUrdu: "بہاؤ کے ساتھ چلنا اور ضرورت کے مطابق ڈھالنا",
        type: "J/P"
    },
    {
        id: 20,
        text: "When starting a project, you typically:",
        textUrdu: "کوئی پروجیکٹ شروع کرتے وقت، آپ عام طور پر:",
        A: "Make a detailed plan before beginning",
        AUrdu: "شروع کرنے سے پہلے تفصیلی منصوبہ بناتے ہیں",
        B: "Jump in and figure it out as you go",
        BUrdu: "کود جاتے ہیں اور چلتے چلتے سمجھتے ہیں",
        type: "J/P"
    }
];

// SNTI TEST Questions (Balanced Edition - 40 Yes/No statements for students)
export const SNTI_QUESTIONS_BALANCED = [
    // E/I - 10 items
    { id: 1,  text: 'I feel excited and energetic when I am with people or friends.', textUrdu: 'میں لوگوں یا دوستوں کے ساتھ ہونے پر پرجوش اور توانا محسوس کرتا/کرتی ہوں۔', type: 'E/I', yesLetter: 'E' },
    { id: 2,  text: 'I enjoy quiet time alone to think or do my favorite activities.', textUrdu: 'میں سوچنے یا اپنی پسندیدہ سرگرمیاں کرنے کے لیے اکیلے خاموش وقت سے لطف اندوز ہوتا/ہوتی ہوں۔', type: 'E/I', yesLetter: 'I' },
    { id: 3,  text: 'I easily start conversations and make new friends quickly.', textUrdu: 'میں آسانی سے بات چیت شروع کرتا/کرتی ہوں اور جلدی نئے دوست بناتا/بناتی ہوں۔', type: 'E/I', yesLetter: 'E' },
    { id: 4,  text: 'I think deeply before I speak and like meaningful one-to-one talks.', textUrdu: 'میں بولنے سے پہلے گہرائی سے سوچتا/سوچتی ہوں اور بامعنی آمنے سامنے بات چیت پسند کرتا/کرتی ہوں۔', type: 'E/I', yesLetter: 'I' },
    { id: 5,  text: 'I like being part of group games and class discussions.', textUrdu: 'میں گروپ گیمز اور کلاس مباحثوں کا حصہ بننا پسند کرتا/کرتی ہوں۔', type: 'E/I', yesLetter: 'E' },
    { id: 6,  text: 'I enjoy doing solo activities like reading, drawing, or writing.', textUrdu: 'میں تنہائی میں سرگرمیاں جیسے پڑھنا، ڈرائنگ یا لکھنا پسند کرتا/کرتی ہوں۔', type: 'E/I', yesLetter: 'I' },
    { id: 7,  text: 'I express my ideas easily in front of people.', textUrdu: 'میں لوگوں کے سامنے اپنے خیالات آسانی سے ظاہر کرتا/کرتی ہوں۔', type: 'E/I', yesLetter: 'E' },
    { id: 8,  text: 'I feel comfortable observing quietly and speaking when ready.', textUrdu: 'میں خاموشی سے مشاہدہ کرنے اور جب تیار ہوں تو بولنے میں آرام محسوس کرتا/کرتی ہوں۔', type: 'E/I', yesLetter: 'I' },
    { id: 9,  text: 'I feel energized in busy, active surroundings.', textUrdu: 'میں مصروف، فعال ماحول میں توانا محسوس کرتا/کرتی ہوں۔', type: 'E/I', yesLetter: 'E' },
    { id: 10, text: 'I feel peaceful and happy in calm and silent environments.', textUrdu: 'میں پرسکون اور خاموش ماحول میں پرامن اور خوش محسوس کرتا/کرتی ہوں۔', type: 'E/I', yesLetter: 'I' },
    // S/N - 10 items
    { id: 11, text: 'I prefer learning through real examples and clear instructions.', textUrdu: 'میں حقیقی مثالوں اور واضح ہدایات کے ذریعے سیکھنا پسند کرتا/کرتی ہوں۔', type: 'S/N', yesLetter: 'S' },
    { id: 12, text: 'I enjoy imagining new ideas and thinking about future possibilities.', textUrdu: 'میں نئے خیالات کا تصور کرنے اور مستقبل کی امکانات کے بارے میں سوچنے سے لطف اندوز ہوتا/ہوتی ہوں۔', type: 'S/N', yesLetter: 'N' },
    { id: 13, text: 'I trust what I can see, touch, and experience myself.', textUrdu: 'میں اس پر بھروسہ کرتا/کرتی ہوں جو میں دیکھ، چھو اور خود تجربہ کر سکتا/سکتی ہوں۔', type: 'S/N', yesLetter: 'S' },
    { id: 14, text: 'I easily see hidden meanings or patterns in things.', textUrdu: 'میں آسانی سے چیزوں میں چھپے ہوئے معانی یا نمونے دیکھتا/دیکھتی ہوں۔', type: 'S/N', yesLetter: 'N' },
    { id: 15, text: 'I like doing practical work that has step-by-step results.', textUrdu: 'میں عملی کام کرنا پسند کرتا/کرتی ہوں جس کے قدم بہ قدم نتائج ہوں۔', type: 'S/N', yesLetter: 'S' },
    { id: 16, text: 'I like thinking of creative, different ways to do the same task.', textUrdu: 'میں ایک ہی کام کو کرنے کے تخلیقی، مختلف طریقے سوچنا پسند کرتا/کرتی ہوں۔', type: 'S/N', yesLetter: 'N' },
    { id: 17, text: 'I notice small details around me that others may miss.', textUrdu: 'میں اپنے ارد گرد چھوٹی تفصیلات کو نوٹس کرتا/کرتی ہوں جو دوسرے نظر انداز کر سکتے ہیں۔', type: 'S/N', yesLetter: 'S' },
    { id: 18, text: 'I often get new ideas or insights suddenly in my mind.', textUrdu: 'میرے ذہن میں اکثر اچانک نئے خیالات یا بصیرت آتے ہیں۔', type: 'S/N', yesLetter: 'N' },
    { id: 19, text: 'I prefer subjects like math, science, or drawing real things.', textUrdu: 'میں ریاضی، سائنس، یا حقیقی چیزیں بنانے جیسے مضامین پسند کرتا/کرتی ہوں۔', type: 'S/N', yesLetter: 'S' },
    { id: 20, text: 'I enjoy imaginative subjects like art, stories, or creative writing.', textUrdu: 'میں تخیلاتی مضامین جیسے فن، کہانیاں یا تخلیقی تحریر سے لطف اندوز ہوتا/ہوتی ہوں۔', type: 'S/N', yesLetter: 'N' },
    // T/F - 10 items
    { id: 21, text: 'I try to be fair and logical when I make decisions.', textUrdu: 'میں فیصلے کرتے وقت منصفانہ اور منطقی ہونے کی کوشش کرتا/کرتی ہوں۔', type: 'T/F', yesLetter: 'T' },
    { id: 22, text: 'I try to understand people\'s feelings before making a decision.', textUrdu: 'میں فیصلہ کرنے سے پہلے لوگوں کے جذبات کو سمجھنے کی کوشش کرتا/کرتی ہوں۔', type: 'T/F', yesLetter: 'F' },
    { id: 23, text: 'I like solving problems using clear reasoning and facts.', textUrdu: 'میں واضح استدلال اور حقائق استعمال کرتے ہوئے مسائل حل کرنا پسند کرتا/کرتی ہوں۔', type: 'T/F', yesLetter: 'T' },
    { id: 24, text: 'I like helping others feel supported and cared for.', textUrdu: 'میں دوسروں کو سہارا اور خیال محسوس کرنے میں مدد کرنا پسند کرتا/کرتی ہوں۔', type: 'T/F', yesLetter: 'F' },
    { id: 25, text: 'I believe telling the truth is more important than pleasing others.', textUrdu: 'میں یقین رکھتا/رکھتی ہوں کہ سچ بولنا دوسروں کو خوش کرنے سے زیادہ اہم ہے۔', type: 'T/F', yesLetter: 'T' },
    { id: 26, text: 'I believe being kind and polite is more important than being right.', textUrdu: 'میں یقین رکھتا/رکھتی ہوں کہ مہربان اور شائستہ ہونا درست ہونے سے زیادہ اہم ہے۔', type: 'T/F', yesLetter: 'F' },
    { id: 27, text: 'I enjoy competition and challenging ideas.', textUrdu: 'میں مقابلے اور چیلنجنگ خیالات سے لطف اندوز ہوتا/ہوتی ہوں۔', type: 'T/F', yesLetter: 'T' },
    { id: 28, text: 'I enjoy teamwork and making everyone feel included.', textUrdu: 'میں ٹیم ورک اور ہر کسی کو شامل محسوس کرانے سے لطف اندوز ہوتا/ہوتی ہوں۔', type: 'T/F', yesLetter: 'F' },
    { id: 29, text: 'I stay calm in emotional situations and focus on solutions.', textUrdu: 'میں جذباتی حالات میں پرسکون رہتا/رہتی ہوں اور حل پر توجہ دیتا/دیتی ہوں۔', type: 'T/F', yesLetter: 'T' },
    { id: 30, text: 'I notice quickly when someone is sad or hurt.', textUrdu: 'میں جلدی نوٹس کرتا/کرتی ہوں جب کوئی اداس یا زخمی ہو۔', type: 'T/F', yesLetter: 'F' },
    // J/P - 10 items
    { id: 31, text: 'I like to make plans and finish my work on time.', textUrdu: 'میں منصوبے بنانا اور اپنا کام وقت پر ختم کرنا پسند کرتا/کرتی ہوں۔', type: 'J/P', yesLetter: 'J' },
    { id: 32, text: 'I prefer keeping my options open and changing plans when needed.', textUrdu: 'میں اپنے اختیارات کھلے رکھنا اور ضرورت پر منصوبے بدلنا پسند کرتا/کرتی ہوں۔', type: 'J/P', yesLetter: 'P' },
    { id: 33, text: 'I feel relaxed when my tasks are organized and complete.', textUrdu: 'میں آرام محسوس کرتا/کرتی ہوں جب میرے کام منظم اور مکمل ہوں۔', type: 'J/P', yesLetter: 'J' },
    { id: 34, text: 'I feel comfortable working freely without strict rules.', textUrdu: 'میں سخت قوانین کے بغیر آزادانہ کام کرنے میں آرام محسوس کرتا/کرتی ہوں۔', type: 'J/P', yesLetter: 'P' },
    { id: 35, text: 'I prefer knowing what will happen next.', textUrdu: 'میں جاننا پسند کرتا/کرتی ہوں کہ آگے کیا ہوگا۔', type: 'J/P', yesLetter: 'J' },
    { id: 36, text: 'I like surprises and new experiences.', textUrdu: 'میں حیرانی اور نئے تجربات پسند کرتا/کرتی ہوں۔', type: 'J/P', yesLetter: 'P' },
    { id: 37, text: 'I like clear goals and deadlines.', textUrdu: 'میں واضح اہداف اور آخری تاریخیں پسند کرتا/کرتی ہوں۔', type: 'J/P', yesLetter: 'J' },
    { id: 38, text: 'I prefer flexible goals that can change with time.', textUrdu: 'میں لچکدار اہداف پسند کرتا/کرتی ہوں جو وقت کے ساتھ بدل سکتے ہیں۔', type: 'J/P', yesLetter: 'P' },
    { id: 39, text: 'I prepare early for exams or events.', textUrdu: 'میں امتحانات یا تقریبات کے لیے جلدی تیاری کرتا/کرتی ہوں۔', type: 'J/P', yesLetter: 'J' },
    { id: 40, text: 'I often start things when I feel inspired, not by schedule.', textUrdu: 'میں اکثر چیزیں اس وقت شروع کرتا/کرتی ہوں جب متاثر ہوں، شیڈول کے مطابق نہیں۔', type: 'J/P', yesLetter: 'P' }
];

// MBTI Type Descriptions with comprehensive guidance
export const MBTI_TYPES = {
    'ISTJ': {
        name: 'The Inspector',
        title: 'Practical, Responsible, Dependable',
        description: 'ISTJs are organized, responsible, and thorough. They value tradition, loyalty, and hard work. With a strong sense of duty and practical mindset, they excel at creating and maintaining systems.',
        strengths: ['Reliable', 'Organized', 'Detail-oriented', 'Practical', 'Logical', 'Responsible'],
        weaknesses: ['Can be inflexible', 'May struggle with change', 'Sometimes insensitive', 'May overlook emotions'],
        careers: ['Accountant', 'Military Officer', 'Legal Professional', 'Administrator', 'Engineer', 'Auditor'],
        relationships: 'ISTJs are loyal and committed partners who value stability. They show love through actions rather than words.',
        growth: 'Work on being more flexible and open to new ideas. Practice expressing emotions and considering others\' feelings.'
    },
    'ISFJ': {
        name: 'The Protector',
        title: 'Caring, Loyal, Supportive',
        description: 'ISFJs are warm, caring individuals who are deeply committed to their responsibilities. They have excellent memories for details about people and are highly attuned to others\' needs.',
        strengths: ['Supportive', 'Reliable', 'Patient', 'Observant', 'Practical', 'Loyal'],
        weaknesses: ['Can be too selfless', 'Dislikes conflict', 'May avoid change', 'Can be overly sensitive'],
        careers: ['Nurse', 'Teacher', 'Counselor', 'Administrator', 'Social Worker', 'Librarian'],
        relationships: 'ISFJs are devoted partners who create warm, stable relationships. They express love through caring actions.',
        growth: 'Learn to say no and prioritize self-care. Practice accepting and adapting to change more easily.'
    },
    'INFJ': {
        name: 'The Counselor',
        title: 'Insightful, Idealistic, Principled',
        description: 'INFJs are deep, complex individuals with strong values and convictions. They have a unique ability to understand people and are driven by their vision of how things should be.',
        strengths: ['Insightful', 'Creative', 'Principled', 'Passionate', 'Empathetic', 'Inspiring'],
        weaknesses: ['Can be perfectionistic', 'May burn out', 'Sometimes too private', 'Can be stubborn'],
        careers: ['Counselor', 'Psychologist', 'Writer', 'Teacher', 'Artist', 'Social Worker'],
        relationships: 'INFJs seek deep, meaningful connections. They are supportive partners who value authenticity and understanding.',
        growth: 'Practice self-care and setting boundaries. Learn to be more flexible and accept imperfection.'
    },
    'INTJ': {
        name: 'The Mastermind',
        title: 'Strategic, Independent, Analytical',
        description: 'INTJs are strategic thinkers with original minds and great drive. They are independent, analytical, and have high standards for themselves and others.',
        strengths: ['Strategic', 'Independent', 'Analytical', 'Confident', 'Innovative', 'Determined'],
        weaknesses: ['Can be arrogant', 'May dismiss emotions', 'Sometimes too critical', 'Can be overly analytical'],
        careers: ['Scientist', 'Engineer', 'Professor', 'Consultant', 'Architect', 'Programmer'],
        relationships: 'INTJs value intelligence and competence in relationships. They show commitment through loyalty and support.',
        growth: 'Work on emotional expression and empathy. Practice patience with those who think differently.'
    },
    'ISTP': {
        name: 'The Craftsman',
        title: 'Practical, Logical, Adaptable',
        description: 'ISTPs are practical problem-solvers who enjoy working with their hands. They are logical, adaptable, and excellent in crisis situations.',
        strengths: ['Practical', 'Logical', 'Adaptable', 'Calm', 'Efficient', 'Independent'],
        weaknesses: ['Can be insensitive', 'Risk-taking', 'May be stubborn', 'Sometimes private'],
        careers: ['Mechanic', 'Engineer', 'Pilot', 'Forensic Scientist', 'Athlete', 'Programmer'],
        relationships: 'ISTPs are loyal but need independence. They show love through acts of service and quality time.',
        growth: 'Practice expressing emotions and long-term planning. Work on being more open with feelings.'
    },
    'ISFP': {
        name: 'The Composer',
        title: 'Gentle, Artistic, Spontaneous',
        description: 'ISFPs are gentle, caring individuals with a strong aesthetic sense. They live in the moment and have a deep appreciation for beauty and harmony.',
        strengths: ['Artistic', 'Gentle', 'Flexible', 'Passionate', 'Loyal', 'Observant'],
        weaknesses: ['Can be overly competitive', 'May be unpredictable', 'Dislikes conflict', 'Sometimes too sensitive'],
        careers: ['Artist', 'Musician', 'Designer', 'Veterinarian', 'Chef', 'Nurse'],
        relationships: 'ISFPs are warm, supportive partners who value harmony and authenticity in relationships.',
        growth: 'Work on long-term planning and assertiveness. Practice handling conflict constructively.'
    },
    'INFP': {
        name: 'The Healer',
        title: 'Idealistic, Creative, Compassionate',
        description: 'INFPs are idealistic, creative souls guided by their values. They are empathetic, open-minded, and deeply committed to personal growth and helping others.',
        strengths: ['Idealistic', 'Creative', 'Empathetic', 'Open-minded', 'Passionate', 'Authentic'],
        weaknesses: ['Can be too idealistic', 'May take things personally', 'Sometimes impractical', 'Can be self-critical'],
        careers: ['Writer', 'Counselor', 'Artist', 'Psychologist', 'Social Worker', 'Teacher'],
        relationships: 'INFPs seek deep, authentic connections. They are supportive, loyal partners who value understanding.',
        growth: 'Practice being more practical and assertive. Learn to separate personal worth from external criticism.'
    },
    'INTP': {
        name: 'The Architect',
        title: 'Analytical, Innovative, Curious',
        description: 'INTPs are logical, analytical thinkers who love theories and abstract concepts. They are innovative problem-solvers with a deep curiosity about how things work.',
        strengths: ['Analytical', 'Innovative', 'Logical', 'Objective', 'Creative', 'Independent'],
        weaknesses: ['Can be insensitive', 'May be absent-minded', 'Sometimes condescending', 'Can procrastinate'],
        careers: ['Scientist', 'Programmer', 'Professor', 'Analyst', 'Researcher', 'Engineer'],
        relationships: 'INTPs value intellectual connection. They are loyal partners who show love through sharing ideas.',
        growth: 'Work on emotional awareness and follow-through. Practice being more considerate of others\' feelings.'
    },
    'ESTP': {
        name: 'The Dynamo',
        title: 'Energetic, Action-Oriented, Bold',
        description: 'ESTPs are energetic, action-oriented individuals who live in the moment. They are bold, practical problem-solvers who excel in dynamic environments.',
        strengths: ['Energetic', 'Practical', 'Bold', 'Perceptive', 'Sociable', 'Adaptable'],
        weaknesses: ['Can be impulsive', 'May be insensitive', 'Risk-taking', 'Sometimes impatient'],
        careers: ['Entrepreneur', 'Sales', 'Paramedic', 'Detective', 'Athlete', 'Marketer'],
        relationships: 'ESTPs are fun, spontaneous partners who bring excitement to relationships.',
        growth: 'Practice long-term planning and consideration of consequences. Work on emotional sensitivity.'
    },
    'ESFP': {
        name: 'The Performer',
        title: 'Spontaneous, Enthusiastic, Friendly',
        description: 'ESFPs are spontaneous, enthusiastic people who love being the center of attention. They bring fun and energy wherever they go and have a natural ability to entertain.',
        strengths: ['Enthusiastic', 'Friendly', 'Spontaneous', 'Practical', 'Observant', 'Excellent people skills'],
        weaknesses: ['Can be impulsive', 'May avoid conflict', 'Sometimes unfocused', 'Can be overly sensitive'],
        careers: ['Actor', 'Event Planner', 'Sales', 'Teacher', 'Social Worker', 'Artist'],
        relationships: 'ESFPs are warm, generous partners who create fun, exciting relationships.',
        growth: 'Work on long-term planning and focus. Practice handling criticism constructively.'
    },
    'ENFP': {
        name: 'The Champion',
        title: 'Enthusiastic, Creative, Warm',
        description: 'ENFPs are enthusiastic, creative individuals with a contagious energy. They see life as full of possibilities and are driven by their values and desire to help others.',
        strengths: ['Enthusiastic', 'Creative', 'Warm', 'Excellent communicators', 'Curious', 'Empathetic'],
        weaknesses: ['Can be unfocused', 'May overthink', 'Sometimes overly emotional', 'Can procrastinate'],
        careers: ['Counselor', 'Writer', 'Teacher', 'Actor', 'Entrepreneur', 'Social Worker'],
        relationships: 'ENFPs are passionate, supportive partners who value deep emotional connections.',
        growth: 'Practice focus and follow-through. Work on managing emotions and being more practical.'
    },
    'ENTP': {
        name: 'The Visionary',
        title: 'Innovative, Clever, Energetic',
        description: 'ENTPs are innovative, clever individuals who love intellectual challenges. They are quick-witted debaters who enjoy exploring new ideas and possibilities.',
        strengths: ['Innovative', 'Clever', 'Energetic', 'Quick-thinking', 'Charismatic', 'Knowledgeable'],
        weaknesses: ['Can be argumentative', 'May be insensitive', 'Sometimes unfocused', 'Can be intolerant'],
        careers: ['Entrepreneur', 'Lawyer', 'Inventor', 'Consultant', 'Journalist', 'Programmer'],
        relationships: 'ENTPs are stimulating partners who value intellectual connection and debate.',
        growth: 'Work on emotional sensitivity and follow-through. Practice patience and consideration.'
    },
    'ESTJ': {
        name: 'The Supervisor',
        title: 'Organized, Practical, Traditional',
        description: 'ESTJs are organized, practical individuals who value tradition and order. They are natural leaders who excel at managing and organizing people and resources.',
        strengths: ['Organized', 'Practical', 'Decisive', 'Direct', 'Responsible', 'Traditional'],
        weaknesses: ['Can be inflexible', 'May be judgmental', 'Sometimes insensitive', 'Can be stubborn'],
        careers: ['Manager', 'Military Officer', 'Judge', 'Financial Officer', 'Administrator', 'Coach'],
        relationships: 'ESTJs are loyal, committed partners who value stability and traditional values.',
        growth: 'Practice flexibility and open-mindedness. Work on emotional awareness and empathy.'
    },
    'ESFJ': {
        name: 'The Provider',
        title: 'Caring, Social, Traditional',
        description: 'ESFJs are caring, social individuals who thrive on helping others. They are warm, conscientious, and have a strong desire to belong and contribute to their community.',
        strengths: ['Caring', 'Social', 'Loyal', 'Practical', 'Organized', 'Supportive'],
        weaknesses: ['Can be too selfless', 'May be needy', 'Sometimes inflexible', 'Can be overly sensitive'],
        careers: ['Nurse', 'Teacher', 'Social Worker', 'Event Coordinator', 'Office Manager', 'Counselor'],
        relationships: 'ESFJs are devoted, warm partners who create harmonious, supportive relationships.',
        growth: 'Learn to prioritize self-care. Practice accepting change and handling criticism.'
    },
    'ENFJ': {
        name: 'The Teacher',
        title: 'Charismatic, Inspiring, Altruistic',
        description: 'ENFJs are charismatic, inspiring leaders who are driven by their desire to help others reach their potential. They are natural teachers with excellent people skills.',
        strengths: ['Charismatic', 'Inspiring', 'Altruistic', 'Excellent communicators', 'Empathetic', 'Organized'],
        weaknesses: ['Can be overly idealistic', 'May be too selfless', 'Sometimes manipulative', 'Can be overprotective'],
        careers: ['Teacher', 'Counselor', 'Politician', 'Coach', 'HR Manager', 'Public Relations'],
        relationships: 'ENFJs are devoted partners who invest deeply in relationships and personal growth.',
        growth: 'Work on self-care and boundaries. Practice accepting that you can\'t help everyone.'
    },
    'ENTJ': {
        name: 'The Commander',
        title: 'Bold, Strategic, Confident',
        description: 'ENTJs are bold, strategic leaders who excel at organizing and planning. They are confident, decisive, and driven to achieve their goals efficiently.',
        strengths: ['Strategic', 'Confident', 'Bold', 'Efficient', 'Charismatic', 'Strong-willed'],
        weaknesses: ['Can be arrogant', 'May be insensitive', 'Sometimes impatient', 'Can be stubborn'],
        careers: ['CEO', 'Lawyer', 'Business Consultant', 'Judge', 'Entrepreneur', 'Military Leader'],
        relationships: 'ENTJs are committed partners who value growth and achievement in relationships.',
        growth: 'Practice empathy and patience. Work on being more flexible and emotionally expressive.'
    }
};

/**
 * Generate a unique 5-digit ID
 */
function generateUniqueId() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

/**
 * Get existing session or create new one
 * @param {string} identifier - Session identifier (email-phone or IP address)
 * @returns {Object} - Session object
 */
export function getOrCreateSession(identifier) {
    let session = sessions.get(identifier);
    
    if (!session) {
        session = {
            id: generateUniqueId(),
            identifier: identifier, // Store the identifier (could be email-phone or IP)
            ipAddress: identifier, // Keep for backward compatibility
            name: null,
            userInfo: null, // Will store: {name, phone, email, rollNumber, institution, age, language}
            state: 'NAME_REQUEST', // NAME_REQUEST, ASSESSMENT_START, TEST_IN_PROGRESS, TEST_COMPLETE
            currentQuestion: 0,
            answers: [],
            mbtiType: null,
            assessmentVariant: null, // Will be set to 'balanced' or 'classic' based on age
            totalQuestions: null, // Will be set to 40 or 20
            language: 'english', // Default language
            createdAt: new Date(),
            updatedAt: new Date(),
            conversationHistory: []
        };
        sessions.set(identifier, session);
        console.log(`✅ New session created: ${session.id} for identifier: ${identifier.substring(0, 20)}...`);
        
        // Persist immediately so admin can see incomplete sessions even after restart
        saveSession(session).catch(err => console.error('Failed to persist new session:', err));
    }
    
    return session;
}

/**
 * Update session data
 */
/**
 * Update existing session
 * @param {string} identifier - Session identifier (email-phone or IP address)
 * @param {Object} updates - Updates to apply to session
 * @returns {Object} - Updated session object
 */
export function updateSession(identifier, updates) {
    const session = sessions.get(identifier);
    if (session) {
        Object.assign(session, updates, { updatedAt: new Date() });
        sessions.set(identifier, session);
        
        // Persist updates so admin always sees current state
        saveSession(session).catch(err => console.error('Failed to persist session update:', err));
    }
    return session;
}

/**
 * Save session to file system
 */
export async function saveSession(session) {
    try {
        const sessionsDir = path.join(__dirname, 'data', 'sessions');
        await fs.mkdir(sessionsDir, { recursive: true });
        
        const filePath = path.join(sessionsDir, `${session.id}.json`);
        await fs.writeFile(filePath, JSON.stringify(session, null, 2));
        
        console.log(`Session ${session.id} saved to file system`);
    } catch (error) {
        console.error('Error saving session:', error);
    }
}

/**
 * Calculate MBTI type from answers
 */
export function calculateMBTIType(answers) {
    const scores = {
        'E': 0, 'I': 0,
        'S': 0, 'N': 0,
        'T': 0, 'F': 0,
        'J': 0, 'P': 0
    };
    
    answers.forEach((answer, index) => {
        const question = SNTI_QUESTIONS[index];
        if (answer === 'A') {
            // A corresponds to first letter of the type
            scores[question.type.split('/')[0]]++;
        } else {
            // B corresponds to second letter
            scores[question.type.split('/')[1]]++;
        }
    });
    
    const type = 
        (scores.E >= scores.I ? 'E' : 'I') +
        (scores.S >= scores.N ? 'S' : 'N') +
        (scores.T >= scores.F ? 'T' : 'F') +
        (scores.J >= scores.P ? 'J' : 'P');
    
    return type;
}

/**
 * Calculate MBTI type from YES/NO answers with question bank providing yesLetter
 * @param {Array<string>} answers - e.g., ['YES','NO',...]
 * @param {Array<Object>} questions - question bank with {type: 'E/I', yesLetter: 'E'|'I'|...}
 */
export function calculateMBTITypeYesNo(answers, questions) {
    const scores = { 'E':0,'I':0,'S':0,'N':0,'T':0,'F':0,'J':0,'P':0 };
    for (let i = 0; i < answers.length && i < questions.length; i++) {
        const q = questions[i];
        const [first, second] = q.type.split('/');
        const yesLetter = q.yesLetter;
        const noLetter = yesLetter === first ? second : first;
        const ans = String(answers[i] || '').trim().toUpperCase();
        if (ans === 'YES' || ans === 'Y') {
            scores[yesLetter]++;
        } else if (ans === 'NO' || ans === 'N') {
            scores[noLetter]++;
        }
    }
    const type = 
        (scores.E >= scores.I ? 'E' : 'I') +
        (scores.S >= scores.N ? 'S' : 'N') +
        (scores.T >= scores.F ? 'T' : 'F') +
        (scores.J >= scores.P ? 'J' : 'P');
    return type;
}

/**
 * Get all sessions (for admin view)
 */
export function getAllSessions() {
    return Array.from(sessions.values());
}

/**
 * Clear old sessions (older than 24 hours)
 */
export function clearOldSessions() {
    const now = new Date();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
    
    let cleared = 0;
    sessions.forEach((session, key) => {
        if (new Date(session.createdAt) < oneDayAgo) {
            sessions.delete(key);
            cleared++;
        }
    });
    
    console.log(`Cleared ${cleared} old sessions`);
    return cleared;
}

// Clear old sessions every hour
setInterval(clearOldSessions, 60 * 60 * 1000);
