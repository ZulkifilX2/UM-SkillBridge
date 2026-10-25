'use client';

import { create } from 'zustand';
import {
  User, Skill, UserSkill, Availability, Session,
  CreditTransaction, CreditBalance, Match, SessionStatus, Feedback
} from './types';
import {
  demoUsers, demoSkills, demoUserSkills, demoAvailability,
  demoSessions, demoTransactions, demoBalances, demoMatches
} from './demo-data';

export interface FeedbackEntry extends Feedback {
  tags?: string[];
}

interface DemoStore {
  // State
  isDemoMode: boolean;
  currentUserId: string | null;
  isAuthenticated: boolean;
  users: User[];
  skills: Skill[];
  userSkills: UserSkill[];
  availability: Availability[];
  sessions: Session[];
  transactions: CreditTransaction[];
  balances: CreditBalance[];
  matches: Match[];
  feedbacks: FeedbackEntry[];

  // Getters
  getCurrentUser: () => User | undefined;
  getUserById: (id: string) => User | undefined;
  getSkillById: (id: string) => Skill | undefined;
  getUserSkills: (userId: string, relationship?: 'teach' | 'learn') => (UserSkill & { skill: Skill })[];
  getUserAvailability: (userId: string) => Availability[];
  getUserBalance: (userId: string) => CreditBalance;
  getUserTransactions: (userId: string) => CreditTransaction[];
  getUserSessions: (userId: string) => Session[];
  getUserMatches: (userId: string) => Match[];
  getSessionById: (id: string) => Session | undefined;

  // Actions
  login: (userId: string) => void;
  logout: () => void;
  switchDemoUser: (userId: string) => void;
  registerUser: (userData: Omit<User, 'id' | 'createdAt' | 'accountStatus' | 'weeklyTutoringCapHours' | 'weeklyTutoringUsedHours'>, teachSkills: { skillId: string; proficiency: 'Beginner' | 'Intermediate' | 'Advanced' }[], learnSkills: { skillId: string; proficiency: 'Beginner' | 'Intermediate' | 'Advanced' }[]) => User;
  bookSession: (mentorId: string, skillId: string, scheduledTime: string, duration: number, mode: 'Online' | 'In-Person' | 'Both', learningGoals?: string, location?: string) => Session | null;
  updateSessionStatus: (sessionId: string, status: SessionStatus) => void;
  acceptSession: (sessionId: string) => void;
  cancelSession: (sessionId: string) => void;
  simulateSessionCompletion: (sessionId: string) => void;
  createDemoMatch: (learnerId: string, mentorId: string, skillId: string, isReciprocal?: boolean, reciprocalSkillId?: string) => Match;
  submitFeedback: (sessionId: string, rating: number, comment?: string, tags?: string[]) => void;
  addBonusCredit: (userId: string, amount: number, reason: string) => void;
  resetDemo: () => void;
}

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const STORAGE_KEY = 'um_skillbridge_store_v1';

function loadPersistedState(): Partial<DemoStore> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored demo state', e);
    return null;
  }
}

function persistState(state: DemoStore) {
  if (typeof window === 'undefined') return;
  try {
    const toSave = {
      isDemoMode: state.isDemoMode,
      currentUserId: state.currentUserId,
      isAuthenticated: state.isAuthenticated,
      users: state.users,
      skills: state.skills,
      userSkills: state.userSkills,
      availability: state.availability,
      sessions: state.sessions,
      transactions: state.transactions,
      balances: state.balances,
      matches: state.matches,
      feedbacks: state.feedbacks,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save demo state', e);
  }
}

export const useDemoStore = create<DemoStore>((set, get) => {
  // Initial default state
  const initialData = {
    isDemoMode: true,
    currentUserId: 'u-aisha', // default to Aisha (CS student) for immediate interactivity
    isAuthenticated: true,
    users: [...demoUsers],
    skills: [...demoSkills],
    userSkills: [...demoUserSkills],
    availability: [...demoAvailability],
    sessions: [...demoSessions],
    transactions: [...demoTransactions],
    balances: [...demoBalances],
    matches: [...demoMatches],
    feedbacks: [
      {
        id: 'fb-1',
        sessionId: 'ses-prev-1',
        authorId: 'u-raj',
        rating: 5,
        comment: 'Aisha was incredible at explaining Python syntax and debugging logic!',
        isPrivate: false,
        createdAt: '2026-09-15T15:30:00Z',
        tags: ['Patient', 'Great Explanations', 'Well Structured'],
      },
      {
        id: 'fb-2',
        sessionId: 'ses-prev-2',
        authorId: 'u-sarah',
        rating: 5,
        comment: 'Daniel showed me shortcut tips in Canva that saved me hours on my linguistic posters.',
        isPrivate: false,
        createdAt: '2026-09-20T15:00:00Z',
        tags: ['Design Pro', 'Visual Thinker', 'Supportive'],
      },
    ],
  };

  return {
    ...initialData,

    getCurrentUser: () => {
      const { currentUserId, users } = get();
      return users.find(u => u.id === currentUserId);
    },

    getUserById: (id) => get().users.find(u => u.id === id),
    getSkillById: (id) => get().skills.find(s => s.id === id),

    getUserSkills: (userId, relationship) => {
      const { userSkills, skills } = get();
      return userSkills
        .filter(us => us.userId === userId && (!relationship || us.relationship === relationship))
        .map(us => ({ ...us, skill: skills.find(s => s.id === us.skillId)! }))
        .filter(us => us.skill);
    },

    getUserAvailability: (userId) => get().availability.filter(a => a.userId === userId),

    getUserBalance: (userId) => {
      const bal = get().balances.find(b => b.userId === userId);
      return bal || { userId, available: 0, reserved: 0, totalEarned: 0, totalSpent: 0, promotionalReceived: 0 };
    },

    getUserTransactions: (userId) =>
      get().transactions
        .filter(t => t.accountId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

    getUserSessions: (userId) =>
      get().sessions
        .filter(s => s.mentorId === userId || s.learnerId === userId)
        .sort((a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime()),

    getUserMatches: (userId) =>
      get().matches
        .filter(m => m.learnerId === userId && m.mentorId !== userId)
        .sort((a, b) => b.compatibilityScore - a.compatibilityScore),

    getSessionById: (id) => get().sessions.find(s => s.id === id),

    login: (userId) => {
      set({ currentUserId: userId, isAuthenticated: true });
      persistState(get());
    },

    logout: () => {
      set({ currentUserId: null, isAuthenticated: false });
      persistState(get());
    },

    switchDemoUser: (userId) => {
      set({ currentUserId: userId, isAuthenticated: true });
      persistState(get());
    },

    registerUser: (userData, teachSkills, learnSkills) => {
      const id = generateId('u');
      const now = new Date().toISOString();
      const newUser: User = {
        ...userData,
        id,
        createdAt: now,
        accountStatus: 'Active',
        weeklyTutoringCapHours: 2,
        weeklyTutoringUsedHours: 0,
      };

      const newUserSkills: UserSkill[] = [
        ...teachSkills.map(s => ({
          userId: id,
          skillId: s.skillId,
          relationship: 'teach' as const,
          proficiency: s.proficiency,
          preferredMode: 'Both' as const,
          language: 'English',
        })),
        ...learnSkills.map(s => ({
          userId: id,
          skillId: s.skillId,
          relationship: 'learn' as const,
          proficiency: s.proficiency,
          language: 'English',
        })),
      ];

      // New users receive 1.0 promotional SkillCredit grant
      const promoTx: CreditTransaction = {
        id: generateId('tx'),
        accountId: id,
        transactionType: 'Promotional',
        amount: 1.0,
        status: 'Completed',
        description: 'Welcome grant: 1.0 Introductory SkillCredit',
        createdAt: now,
      };

      const newBalance: CreditBalance = {
        userId: id,
        available: 1.0,
        reserved: 0,
        totalEarned: 0,
        totalSpent: 0,
        promotionalReceived: 1.0,
      };

      // Auto-generate reciprocal matches with existing users
      const newMatches: Match[] = [];
      const currentUsers = get().users;
      for (const otherUser of currentUsers) {
        for (const lSkill of learnSkills) {
          const matchTeach = get().userSkills.find(us => us.userId === otherUser.id && us.skillId === lSkill.skillId && us.relationship === 'teach');
          if (matchTeach) {
            // Check if other user wants something this new user teaches
            const reciprocalSkill = teachSkills.find(ts =>
              get().userSkills.some(us => us.userId === otherUser.id && us.skillId === ts.skillId && us.relationship === 'learn')
            );
            newMatches.push({
              id: generateId('m'),
              learnerId: id,
              mentorId: otherUser.id,
              skillId: lSkill.skillId,
              compatibilityScore: reciprocalSkill ? 94 : 80,
              isReciprocal: !!reciprocalSkill,
              reciprocalSkillId: reciprocalSkill?.skillId,
              explanation: reciprocalSkill
                ? `Reciprocal match! ${otherUser.displayName} teaches what you want to learn, and wants to learn what you teach!`
                : `${otherUser.displayName} is an experienced peer mentor in ${get().skills.find(s => s.id === lSkill.skillId)?.title}.`,
              breakdown: {
                skillRelevance: 40,
                availabilityOverlap: 20,
                levelCompatibility: 12,
                modeCompatibility: 10,
                languageCompatibility: 10,
                reciprocalBonus: reciprocalSkill ? 15 : 0,
              },
            });
          }
        }
      }

      set(state => ({
        users: [...state.users, newUser],
        userSkills: [...state.userSkills, ...newUserSkills],
        balances: [...state.balances, newBalance],
        transactions: [...state.transactions, promoTx],
        matches: [...state.matches, ...newMatches],
        currentUserId: id,
        isAuthenticated: true,
      }));

      persistState(get());
      return newUser;
    },

    bookSession: (mentorId, skillId, scheduledTime, duration, mode, learningGoals, location) => {
      const state = get();
      const learnerId = state.currentUserId;
      if (!learnerId) return null;
      if (learnerId === mentorId) return null;

      const creditCost = duration / 60;
      const learnerBalance = state.balances.find(b => b.userId === learnerId);
      if (!learnerBalance || learnerBalance.available < creditCost) return null;

      const sessionId = generateId('ses');
      const now = new Date().toISOString();

      const newSession: Session = {
        id: sessionId,
        mentorId,
        learnerId,
        skillId,
        duration,
        scheduledTime,
        mode,
        status: 'Requested',
        creditCost,
        learningGoals: learningGoals || 'Peer knowledge sharing session',
        location: location || (mode === 'Online' ? 'Google Meet (link provided upon confirmation)' : 'UM Central Library Level 3'),
        mentorConfirmed: false,
        learnerConfirmed: true,
        createdAt: now,
      };

      // Reserve credits from learner balance
      const reserveTx: CreditTransaction = {
        id: generateId('tx'),
        accountId: learnerId,
        sessionId,
        transactionType: 'Reserved',
        amount: -creditCost,
        status: 'Pending',
        description: `Reserved for ${state.skills.find(s => s.id === skillId)?.title || 'session'} with ${state.users.find(u => u.id === mentorId)?.displayName}`,
        createdAt: now,
      };

      set(curr => ({
        sessions: [newSession, ...curr.sessions],
        transactions: [reserveTx, ...curr.transactions],
        balances: curr.balances.map(b =>
          b.userId === learnerId
            ? { ...b, available: +(b.available - creditCost).toFixed(2), reserved: +(b.reserved + creditCost).toFixed(2) }
            : b
        ),
      }));

      persistState(get());
      return newSession;
    },

    updateSessionStatus: (sessionId, status) => {
      set(state => ({
        sessions: state.sessions.map(s =>
          s.id === sessionId ? { ...s, status } : s
        ),
      }));
      persistState(get());
    },

    acceptSession: (sessionId) => {
      set(state => ({
        sessions: state.sessions.map(s =>
          s.id === sessionId ? { ...s, status: 'Confirmed' as SessionStatus, mentorConfirmed: true } : s
        ),
      }));
      persistState(get());
    },

    cancelSession: (sessionId) => {
      const state = get();
      const session = state.sessions.find(s => s.id === sessionId);
      if (!session || ['Completed', 'Cancelled'].includes(session.status)) return;

      const creditCost = session.creditCost;
      const now = new Date().toISOString();

      // Release reserved credits back to learner
      const releaseTx: CreditTransaction = {
        id: generateId('tx'),
        accountId: session.learnerId,
        sessionId,
        transactionType: 'Released',
        amount: creditCost,
        status: 'Completed',
        description: `Refund: Cancelled session in ${state.skills.find(s => s.id === session.skillId)?.title || 'Skill'}`,
        createdAt: now,
      };

      set(curr => ({
        sessions: curr.sessions.map(s =>
          s.id === sessionId ? { ...s, status: 'Cancelled' as SessionStatus } : s
        ),
        transactions: [releaseTx, ...curr.transactions],
        balances: curr.balances.map(b =>
          b.userId === session.learnerId
            ? { ...b, available: +(b.available + creditCost).toFixed(2), reserved: +(Math.max(0, b.reserved - creditCost)).toFixed(2) }
            : b
        ),
      }));

      persistState(get());
    },

    simulateSessionCompletion: (sessionId) => {
      const state = get();
      const session = state.sessions.find(s => s.id === sessionId);
      if (!session || session.status === 'Completed') return;

      const now = new Date().toISOString();
      const creditAmount = session.creditCost;
      const skillName = state.skills.find(s => s.id === session.skillId)?.title || 'Skill';
      const mentorName = state.users.find(u => u.id === session.mentorId)?.displayName || 'Mentor';
      const learnerName = state.users.find(u => u.id === session.learnerId)?.displayName || 'Learner';

      // 1. Mentor Earns credit (+1 or +0.5)
      const earnTx: CreditTransaction = {
        id: generateId('tx'),
        accountId: session.mentorId,
        sessionId,
        transactionType: 'Earned',
        amount: creditAmount,
        status: 'Completed',
        description: `Mentored ${learnerName} in ${skillName}`,
        createdAt: now,
      };

      // 2. Learner Spends credit (-1 or -0.5, moving from Reserved to Spent)
      const spendTx: CreditTransaction = {
        id: generateId('tx'),
        accountId: session.learnerId,
        sessionId,
        transactionType: 'Spent',
        amount: -creditAmount,
        status: 'Completed',
        description: `Learned ${skillName} from ${mentorName}`,
        createdAt: now,
      };

      set(curr => ({
        sessions: curr.sessions.map(s =>
          s.id === sessionId
            ? {
                ...s,
                status: 'Completed' as SessionStatus,
                mentorConfirmed: true,
                learnerConfirmed: true,
                completedAt: now,
              }
            : s
        ),
        transactions: [earnTx, spendTx, ...curr.transactions],
        balances: curr.balances.map(b => {
          if (b.userId === session.mentorId) {
            return {
              ...b,
              totalEarned: +(b.totalEarned + creditAmount).toFixed(2),
              available: +(b.available + creditAmount).toFixed(2),
            };
          }
          if (b.userId === session.learnerId) {
            return {
              ...b,
              totalSpent: +(b.totalSpent + creditAmount).toFixed(2),
              reserved: +(Math.max(0, b.reserved - creditAmount)).toFixed(2),
            };
          }
          return b;
        }),
      }));

      persistState(get());
    },

    createDemoMatch: (learnerId, mentorId, skillId, isReciprocal = true, reciprocalSkillId) => {
      const state = get();
      const existing = state.matches.find(m => m.learnerId === learnerId && m.mentorId === mentorId && m.skillId === skillId);
      if (existing) return existing;

      const skill = state.skills.find(s => s.id === skillId);
      const mentor = state.users.find(u => u.id === mentorId);
      const recSkill = reciprocalSkillId ? state.skills.find(s => s.id === reciprocalSkillId) : undefined;

      const newMatch: Match = {
        id: generateId('m'),
        learnerId,
        mentorId,
        skillId,
        compatibilityScore: isReciprocal ? 96 : 85,
        isReciprocal,
        reciprocalSkillId,
        explanation: isReciprocal && recSkill
          ? `High-priority reciprocal exchange: You teach ${recSkill.title} to ${mentor?.displayName}, and they teach ${skill?.title} to you!`
          : `High compatibility peer match: ${mentor?.displayName} has proven proficiency in ${skill?.title}.`,
        breakdown: {
          skillRelevance: 40,
          availabilityOverlap: 23,
          levelCompatibility: 14,
          modeCompatibility: 10,
          languageCompatibility: 10,
          reciprocalBonus: isReciprocal ? 15 : 0,
        },
      };

      set(curr => ({
        matches: [newMatch, ...curr.matches],
      }));

      persistState(get());
      return newMatch;
    },

    submitFeedback: (sessionId, rating, comment, tags) => {
      const state = get();
      const session = state.sessions.find(s => s.id === sessionId);
      if (!session) return;

      const authorId = state.currentUserId || session.learnerId;
      const newFeedback: FeedbackEntry = {
        id: generateId('fb'),
        sessionId,
        authorId,
        rating,
        comment: comment || 'Productive and enjoyable peer learning session.',
        isPrivate: false,
        createdAt: new Date().toISOString(),
        tags: tags || ['Helpful', 'Clear', 'Recommended'],
      };

      set(curr => ({
        feedbacks: [newFeedback, ...curr.feedbacks],
      }));

      persistState(get());
    },

    addBonusCredit: (userId, amount, reason) => {
      const now = new Date().toISOString();
      const bonusTx: CreditTransaction = {
        id: generateId('tx'),
        accountId: userId,
        transactionType: 'Promotional',
        amount,
        status: 'Completed',
        description: reason || 'Peer Community Bonus Grant',
        createdAt: now,
      };

      set(curr => ({
        transactions: [bonusTx, ...curr.transactions],
        balances: curr.balances.map(b =>
          b.userId === userId
            ? { ...b, available: +(b.available + amount).toFixed(2), promotionalReceived: +(b.promotionalReceived + amount).toFixed(2) }
            : b
        ),
      }));

      persistState(get());
    },

    resetDemo: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
      set(initialData);
    },
  };
});
