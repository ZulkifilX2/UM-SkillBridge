import { User, Skill, UserSkill, Availability, Session, CreditTransaction, CreditBalance, Match } from './types';

// ============================================================
// Demo Skills
// ============================================================
export const demoSkills: Skill[] = [
  { id: 'sk-python', title: 'Python Programming', slug: 'python-programming', category: 'Programming', description: 'Learn Python from basics to advanced concepts including data structures, OOP, and automation scripts.', icon: 'Code2', moderationStatus: 'Approved' },
  { id: 'sk-java', title: 'Java Programming', slug: 'java-programming', category: 'Programming', description: 'Object-oriented programming with Java, covering fundamentals to design patterns.', icon: 'Code2', moderationStatus: 'Approved' },
  { id: 'sk-webdev', title: 'Web Development', slug: 'web-development', category: 'Programming', description: 'HTML, CSS, and JavaScript fundamentals for building responsive websites.', icon: 'Globe', moderationStatus: 'Approved' },
  { id: 'sk-canva', title: 'Canva Design', slug: 'canva-design', category: 'Graphic Design', description: 'Create stunning presentations, social media graphics, and marketing materials using Canva.', icon: 'Palette', moderationStatus: 'Approved' },
  { id: 'sk-figma', title: 'Figma UI Design', slug: 'figma-ui-design', category: 'Graphic Design', description: 'Design user interfaces and prototypes using Figma, from wireframes to polished mockups.', icon: 'Figma', moderationStatus: 'Approved' },
  { id: 'sk-speaking', title: 'Public Speaking', slug: 'public-speaking', category: 'Public Speaking', description: 'Build confidence in public speaking, learn persuasive presentation techniques.', icon: 'Mic', moderationStatus: 'Approved' },
  { id: 'sk-excel', title: 'Microsoft Excel', slug: 'microsoft-excel', category: 'Productivity Tools', description: 'Master Excel from formulas and pivot tables to data visualization and macros.', icon: 'Table', moderationStatus: 'Approved' },
  { id: 'sk-english', title: 'English Conversation', slug: 'english-conversation', category: 'Language Learning', description: 'Practice conversational English, improve fluency and pronunciation.', icon: 'Languages', moderationStatus: 'Approved' },
  { id: 'sk-mandarin', title: 'Mandarin Basics', slug: 'mandarin-basics', category: 'Language Learning', description: 'Learn basic Mandarin Chinese, including pronunciation, characters, and daily phrases.', icon: 'Languages', moderationStatus: 'Approved' },
  { id: 'sk-ml', title: 'Machine Learning', slug: 'machine-learning', category: 'AI & Data Science', description: 'Introduction to ML concepts, supervised/unsupervised learning, and practical projects.', icon: 'Brain', moderationStatus: 'Approved' },
  { id: 'sk-data', title: 'Data Analysis', slug: 'data-analysis', category: 'AI & Data Science', description: 'Analyze data using Python, pandas, and visualization tools to extract insights.', icon: 'BarChart3', moderationStatus: 'Approved' },
  { id: 'sk-math', title: 'Calculus', slug: 'calculus', category: 'Mathematics', description: 'Calculus fundamentals including limits, derivatives, integrals, and applications.', icon: 'Calculator', moderationStatus: 'Approved' },
  { id: 'sk-ppt', title: 'Presentation Design', slug: 'presentation-design', category: 'Graphic Design', description: 'Create compelling slide decks that communicate ideas effectively.', icon: 'Presentation', moderationStatus: 'Approved' },
  { id: 'sk-biz', title: 'Business Plan Writing', slug: 'business-plan-writing', category: 'Business & Entrepreneurship', description: 'Structure and write compelling business plans for startups and competitions.', icon: 'FileText', moderationStatus: 'Approved' },
  { id: 'sk-photo', title: 'Photography', slug: 'photography', category: 'Creative Arts', description: 'Learn composition, lighting, and editing techniques for stunning photographs.', icon: 'Camera', moderationStatus: 'Approved' },
  { id: 'sk-video', title: 'Video Editing', slug: 'video-editing', category: 'Creative Arts', description: 'Edit videos using professional tools, learn storytelling through visual media.', icon: 'Film', moderationStatus: 'Approved' },
];

// ============================================================
// Demo Users
// ============================================================
export const demoUsers: User[] = [
  {
    id: 'u-aisha', displayName: 'Aisha', email: 'aisha@siswa.um.edu.my',
    faculty: 'Computer Science', yearOfStudy: 3,
    bio: 'Passionate about Python and machine learning. Looking to improve my design skills for better project presentations.',
    avatarInitials: 'AI', avatarColor: '#0C9D9A',
    createdAt: '2026-09-01T08:00:00Z', accountStatus: 'Active',
    weeklyTutoringCapHours: 2, weeklyTutoringUsedHours: 0.5,
  },
  {
    id: 'u-daniel', displayName: 'Daniel', email: 'daniel@siswa.um.edu.my',
    faculty: 'Creative Arts', yearOfStudy: 2,
    bio: 'Graphic designer and Canva enthusiast. Want to learn programming to build creative tools.',
    avatarInitials: 'DA', avatarColor: '#FF943B',
    createdAt: '2026-09-02T10:00:00Z', accountStatus: 'Active',
    weeklyTutoringCapHours: 2, weeklyTutoringUsedHours: 1,
  },
  {
    id: 'u-mei', displayName: 'Mei', email: 'mei@siswa.um.edu.my',
    faculty: 'Business & Economics', yearOfStudy: 3,
    bio: 'Business student with a love for public speaking and debate. Eager to master Excel for data-driven decisions.',
    avatarInitials: 'ME', avatarColor: '#1769C2',
    createdAt: '2026-09-03T09:00:00Z', accountStatus: 'Active',
    weeklyTutoringCapHours: 2, weeklyTutoringUsedHours: 0,
  },
  {
    id: 'u-raj', displayName: 'Raj', email: 'raj@siswa.um.edu.my',
    faculty: 'Engineering', yearOfStudy: 4,
    bio: 'Engineering student strong in mathematics and MATLAB. Wants to learn web development.',
    avatarInitials: 'RA', avatarColor: '#087572',
    createdAt: '2026-09-05T11:00:00Z', accountStatus: 'Active',
    weeklyTutoringCapHours: 2, weeklyTutoringUsedHours: 0,
  },
  {
    id: 'u-sarah', displayName: 'Sarah', email: 'sarah@siswa.um.edu.my',
    faculty: 'Languages & Linguistics', yearOfStudy: 2,
    bio: 'Trilingual student passionate about languages and cultural exchange. Can teach English and Mandarin.',
    avatarInitials: 'SA', avatarColor: '#20C5BE',
    createdAt: '2026-09-06T08:30:00Z', accountStatus: 'Active',
    weeklyTutoringCapHours: 2, weeklyTutoringUsedHours: 1.5,
  },
];

// ============================================================
// Demo User-Skills
// ============================================================
export const demoUserSkills: UserSkill[] = [
  // Aisha: teaches Python, ML; wants Canva, PPT
  { userId: 'u-aisha', skillId: 'sk-python', relationship: 'teach', proficiency: 'Advanced', description: 'Can teach Python from basics to advanced data science workflows.', preferredMode: 'Both', language: 'English' },
  { userId: 'u-aisha', skillId: 'sk-ml', relationship: 'teach', proficiency: 'Intermediate', preferredMode: 'Online', language: 'English' },
  { userId: 'u-aisha', skillId: 'sk-canva', relationship: 'learn', proficiency: 'Beginner', language: 'English' },
  { userId: 'u-aisha', skillId: 'sk-ppt', relationship: 'learn', proficiency: 'Beginner', language: 'English' },
  // Daniel: teaches Canva, PPT; wants Python, WebDev
  { userId: 'u-daniel', skillId: 'sk-canva', relationship: 'teach', proficiency: 'Advanced', description: 'Expert in Canva — can teach design fundamentals and advanced techniques.', preferredMode: 'Both', language: 'English' },
  { userId: 'u-daniel', skillId: 'sk-ppt', relationship: 'teach', proficiency: 'Advanced', preferredMode: 'In-Person', language: 'English' },
  { userId: 'u-daniel', skillId: 'sk-python', relationship: 'learn', proficiency: 'Beginner', language: 'English' },
  { userId: 'u-daniel', skillId: 'sk-webdev', relationship: 'learn', proficiency: 'Beginner', language: 'English' },
  // Mei: teaches Speaking, Biz; wants Excel, Data
  { userId: 'u-mei', skillId: 'sk-speaking', relationship: 'teach', proficiency: 'Advanced', description: 'National debate champion. Can coach presentation skills and confidence.', preferredMode: 'In-Person', language: 'English' },
  { userId: 'u-mei', skillId: 'sk-biz', relationship: 'teach', proficiency: 'Intermediate', preferredMode: 'Both', language: 'English' },
  { userId: 'u-mei', skillId: 'sk-excel', relationship: 'learn', proficiency: 'Beginner', language: 'English' },
  { userId: 'u-mei', skillId: 'sk-data', relationship: 'learn', proficiency: 'Beginner', language: 'English' },
  // Raj: teaches Math, Excel; wants WebDev, Python
  { userId: 'u-raj', skillId: 'sk-math', relationship: 'teach', proficiency: 'Advanced', description: 'Strong in calculus and applied mathematics.', preferredMode: 'Both', language: 'English' },
  { userId: 'u-raj', skillId: 'sk-excel', relationship: 'teach', proficiency: 'Intermediate', preferredMode: 'Online', language: 'English' },
  { userId: 'u-raj', skillId: 'sk-webdev', relationship: 'learn', proficiency: 'Beginner', language: 'English' },
  { userId: 'u-raj', skillId: 'sk-python', relationship: 'learn', proficiency: 'Beginner', language: 'English' },
  // Sarah: teaches English, Mandarin; wants Figma, Photo
  { userId: 'u-sarah', skillId: 'sk-english', relationship: 'teach', proficiency: 'Advanced', description: 'Native-level English. Patient conversational practice partner.', preferredMode: 'Both', language: 'English' },
  { userId: 'u-sarah', skillId: 'sk-mandarin', relationship: 'teach', proficiency: 'Intermediate', preferredMode: 'Both', language: 'English' },
  { userId: 'u-sarah', skillId: 'sk-figma', relationship: 'learn', proficiency: 'Beginner', language: 'English' },
  { userId: 'u-sarah', skillId: 'sk-photo', relationship: 'learn', proficiency: 'Beginner', language: 'English' },
];

// ============================================================
// Demo Availability
// ============================================================
export const demoAvailability: Availability[] = [
  { id: 'av-1', userId: 'u-aisha', dayOfWeek: 'Monday', startTime: '14:00', endTime: '16:00', mode: 'Both' },
  { id: 'av-2', userId: 'u-aisha', dayOfWeek: 'Wednesday', startTime: '10:00', endTime: '12:00', mode: 'Online' },
  { id: 'av-3', userId: 'u-aisha', dayOfWeek: 'Friday', startTime: '14:00', endTime: '17:00', mode: 'Both' },
  { id: 'av-4', userId: 'u-daniel', dayOfWeek: 'Monday', startTime: '10:00', endTime: '12:00', mode: 'Both' },
  { id: 'av-5', userId: 'u-daniel', dayOfWeek: 'Wednesday', startTime: '14:00', endTime: '16:00', mode: 'In-Person' },
  { id: 'av-6', userId: 'u-daniel', dayOfWeek: 'Friday', startTime: '10:00', endTime: '13:00', mode: 'Both' },
  { id: 'av-7', userId: 'u-mei', dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '11:00', mode: 'In-Person' },
  { id: 'av-8', userId: 'u-mei', dayOfWeek: 'Thursday', startTime: '14:00', endTime: '16:00', mode: 'Both' },
  { id: 'av-9', userId: 'u-raj', dayOfWeek: 'Monday', startTime: '16:00', endTime: '18:00', mode: 'Online' },
  { id: 'av-10', userId: 'u-raj', dayOfWeek: 'Thursday', startTime: '10:00', endTime: '12:00', mode: 'Both' },
  { id: 'av-11', userId: 'u-sarah', dayOfWeek: 'Tuesday', startTime: '14:00', endTime: '16:00', mode: 'Both' },
  { id: 'av-12', userId: 'u-sarah', dayOfWeek: 'Saturday', startTime: '10:00', endTime: '13:00', mode: 'Online' },
];

// ============================================================
// Demo Balances
// ============================================================
export const demoBalances: CreditBalance[] = [
  { userId: 'u-aisha', available: 2.0, reserved: 0, totalEarned: 1.0, totalSpent: 0, promotionalReceived: 1.0 },
  { userId: 'u-daniel', available: 1.5, reserved: 0, totalEarned: 0.5, totalSpent: 0, promotionalReceived: 1.0 },
  { userId: 'u-mei', available: 1.0, reserved: 0, totalEarned: 0, totalSpent: 0, promotionalReceived: 1.0 },
  { userId: 'u-raj', available: 1.0, reserved: 0, totalEarned: 0, totalSpent: 0, promotionalReceived: 1.0 },
  { userId: 'u-sarah', available: 0.5, reserved: 0, totalEarned: 1.0, totalSpent: 0.5, promotionalReceived: 1.0 },
];

// ============================================================
// Demo Transactions
// ============================================================
export const demoTransactions: CreditTransaction[] = [
  { id: 'tx-1', accountId: 'u-aisha', transactionType: 'Promotional', amount: 1.0, status: 'Completed', description: 'Introductory learning credit', createdAt: '2026-09-01T08:00:00Z' },
  { id: 'tx-2', accountId: 'u-aisha', sessionId: 'ses-prev-1', transactionType: 'Earned', amount: 1.0, status: 'Completed', description: 'Python mentoring session with Raj', createdAt: '2026-09-15T16:00:00Z' },
  { id: 'tx-3', accountId: 'u-daniel', transactionType: 'Promotional', amount: 1.0, status: 'Completed', description: 'Introductory learning credit', createdAt: '2026-09-02T10:00:00Z' },
  { id: 'tx-4', accountId: 'u-daniel', sessionId: 'ses-prev-2', transactionType: 'Earned', amount: 0.5, status: 'Completed', description: 'Canva design session with Sarah', createdAt: '2026-09-20T14:00:00Z' },
  { id: 'tx-5', accountId: 'u-mei', transactionType: 'Promotional', amount: 1.0, status: 'Completed', description: 'Introductory learning credit', createdAt: '2026-09-03T09:00:00Z' },
  { id: 'tx-6', accountId: 'u-raj', transactionType: 'Promotional', amount: 1.0, status: 'Completed', description: 'Introductory learning credit', createdAt: '2026-09-05T11:00:00Z' },
  { id: 'tx-7', accountId: 'u-sarah', transactionType: 'Promotional', amount: 1.0, status: 'Completed', description: 'Introductory learning credit', createdAt: '2026-09-06T08:30:00Z' },
  { id: 'tx-8', accountId: 'u-sarah', sessionId: 'ses-prev-3', transactionType: 'Earned', amount: 1.0, status: 'Completed', description: 'English conversation practice with Mei', createdAt: '2026-09-18T14:00:00Z' },
  { id: 'tx-9', accountId: 'u-sarah', sessionId: 'ses-prev-2', transactionType: 'Spent', amount: -0.5, status: 'Completed', description: 'Canva learning session with Daniel', createdAt: '2026-09-20T14:00:00Z' },
];

// ============================================================
// Demo Sessions
// ============================================================
export const demoSessions: Session[] = [
  {
    id: 'ses-prev-1', mentorId: 'u-aisha', learnerId: 'u-raj', skillId: 'sk-python',
    duration: 60, scheduledTime: '2026-09-15T14:00:00Z', mode: 'Online',
    status: 'Completed', creditCost: 1.0, mentorConfirmed: true, learnerConfirmed: true,
    createdAt: '2026-09-14T10:00:00Z', completedAt: '2026-09-15T15:00:00Z',
    learningGoals: 'Learn Python basics and write first scripts',
  },
  {
    id: 'ses-prev-2', mentorId: 'u-daniel', learnerId: 'u-sarah', skillId: 'sk-canva',
    duration: 30, scheduledTime: '2026-09-20T14:00:00Z', mode: 'In-Person',
    status: 'Completed', creditCost: 0.5, mentorConfirmed: true, learnerConfirmed: true,
    createdAt: '2026-09-19T09:00:00Z', completedAt: '2026-09-20T14:30:00Z',
    learningGoals: 'Create a social media template in Canva',
    location: 'UM Central Library, Level 3',
  },
];

// ============================================================
// Demo Matches (pre-computed)
// ============================================================
export const demoMatches: Match[] = [
  {
    id: 'm-1', learnerId: 'u-aisha', mentorId: 'u-daniel', skillId: 'sk-canva',
    compatibilityScore: 95, isReciprocal: true, reciprocalSkillId: 'sk-python',
    explanation: 'Strong reciprocal match! Daniel teaches Canva (which you want to learn), and you teach Python (which Daniel wants to learn).',
    breakdown: { skillRelevance: 40, availabilityOverlap: 22, levelCompatibility: 13, modeCompatibility: 10, languageCompatibility: 10, reciprocalBonus: 15 },
  },
  {
    id: 'm-2', learnerId: 'u-aisha', mentorId: 'u-daniel', skillId: 'sk-ppt',
    compatibilityScore: 82, isReciprocal: true, reciprocalSkillId: 'sk-python',
    explanation: 'Daniel can teach Presentation Design and you can teach Python in return.',
    breakdown: { skillRelevance: 40, availabilityOverlap: 18, levelCompatibility: 12, modeCompatibility: 7, languageCompatibility: 10, reciprocalBonus: 15 },
  },
  {
    id: 'm-3', learnerId: 'u-daniel', mentorId: 'u-aisha', skillId: 'sk-python',
    compatibilityScore: 95, isReciprocal: true, reciprocalSkillId: 'sk-canva',
    explanation: 'Aisha teaches Python (which you want to learn), and you teach Canva (which Aisha wants to learn). A perfect reciprocal match!',
    breakdown: { skillRelevance: 40, availabilityOverlap: 22, levelCompatibility: 13, modeCompatibility: 10, languageCompatibility: 10, reciprocalBonus: 15 },
  },
  {
    id: 'm-4', learnerId: 'u-mei', mentorId: 'u-raj', skillId: 'sk-excel',
    compatibilityScore: 78, isReciprocal: false,
    explanation: 'Raj teaches Excel at an intermediate level, matching your learning goal.',
    breakdown: { skillRelevance: 40, availabilityOverlap: 15, levelCompatibility: 13, modeCompatibility: 10, languageCompatibility: 10, reciprocalBonus: 0 },
  },
  {
    id: 'm-5', learnerId: 'u-raj', mentorId: 'u-aisha', skillId: 'sk-python',
    compatibilityScore: 72, isReciprocal: false,
    explanation: 'Aisha is an advanced Python tutor with overlapping availability.',
    breakdown: { skillRelevance: 40, availabilityOverlap: 12, levelCompatibility: 10, modeCompatibility: 10, languageCompatibility: 10, reciprocalBonus: 0 },
  },
];

// Category colors for UI
export const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'Programming': { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
  'AI & Data Science': { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  'Graphic Design': { bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800' },
  'Business & Entrepreneurship': { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
  'Language Learning': { bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-800' },
  'Public Speaking': { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
  'Mathematics': { bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
  'Productivity Tools': { bg: 'bg-teal-50 dark:bg-teal-950/30', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800' },
  'Creative Arts': { bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800' },
  'Engineering': { bg: 'bg-slate-50 dark:bg-slate-950/30', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-800' },
  'Music': { bg: 'bg-violet-50 dark:bg-violet-950/30', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-800' },
  'Writing': { bg: 'bg-cyan-50 dark:bg-cyan-950/30', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800' },
};
