// UM SkillBridge — Type Definitions

export type Faculty =
  | 'Computer Science'
  | 'Creative Arts'
  | 'Business & Economics'
  | 'Engineering'
  | 'Science'
  | 'Arts & Social Sciences'
  | 'Education'
  | 'Law'
  | 'Medicine'
  | 'Languages & Linguistics'
  | 'Built Environment';

export type SkillCategory =
  | 'Programming'
  | 'AI & Data Science'
  | 'Graphic Design'
  | 'Business & Entrepreneurship'
  | 'Language Learning'
  | 'Public Speaking'
  | 'Mathematics'
  | 'Productivity Tools'
  | 'Creative Arts'
  | 'Engineering'
  | 'Music'
  | 'Writing';

export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type SessionMode = 'Online' | 'In-Person' | 'Both';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type SessionStatus = 'Requested' | 'Accepted' | 'Declined' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Disputed';
export type TransactionType = 'Earned' | 'Spent' | 'Reserved' | 'Released' | 'Promotional' | 'Refunded';
export type TransactionStatus = 'Pending' | 'Completed' | 'Reversed';
export type ModerationStatus = 'Pending' | 'Approved' | 'Rejected';
export type AccountStatus = 'Active' | 'Suspended' | 'Deactivated';
export type ReportStatus = 'Open' | 'Investigating' | 'Resolved' | 'Dismissed';

export interface User {
  id: string;
  displayName: string;
  email: string;
  faculty: Faculty;
  yearOfStudy?: number;
  bio: string;
  avatarInitials: string;
  avatarColor: string;
  createdAt: string;
  accountStatus: AccountStatus;
  weeklyTutoringCapHours: number;
  weeklyTutoringUsedHours: number;
}

export interface Skill {
  id: string;
  title: string;
  slug: string;
  category: SkillCategory;
  description: string;
  icon: string;
  moderationStatus: ModerationStatus;
}

export interface UserSkill {
  userId: string;
  skillId: string;
  relationship: 'teach' | 'learn';
  proficiency: ProficiencyLevel;
  description?: string;
  preferredMode?: SessionMode;
  language?: string;
}

export interface Availability {
  id: string;
  userId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  mode: SessionMode;
}

export interface Match {
  id: string;
  learnerId: string;
  mentorId: string;
  skillId: string;
  compatibilityScore: number;
  explanation: string;
  isReciprocal: boolean;
  reciprocalSkillId?: string;
  breakdown: {
    skillRelevance: number;
    availabilityOverlap: number;
    levelCompatibility: number;
    modeCompatibility: number;
    languageCompatibility: number;
    reciprocalBonus: number;
  };
}

export interface Session {
  id: string;
  mentorId: string;
  learnerId: string;
  skillId: string;
  duration: number;
  scheduledTime: string;
  mode: SessionMode;
  status: SessionStatus;
  creditCost: number;
  location?: string;
  meetingLink?: string;
  learningGoals?: string;
  mentorConfirmed: boolean;
  learnerConfirmed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface CreditTransaction {
  id: string;
  accountId: string;
  sessionId?: string;
  transactionType: TransactionType;
  amount: number;
  status: TransactionStatus;
  description: string;
  createdAt: string;
}

export interface CreditBalance {
  userId: string;
  available: number;
  reserved: number;
  totalEarned: number;
  totalSpent: number;
  promotionalReceived: number;
}

export interface Feedback {
  id: string;
  sessionId: string;
  authorId: string;
  rating: number;
  comment?: string;
  isPrivate: boolean;
  createdAt: string;
}
