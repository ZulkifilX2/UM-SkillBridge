import { z } from 'zod';

export const UM_FACULTIES = [
  'Computer Science',
  'Creative Arts',
  'Business & Economics',
  'Engineering',
  'Science',
  'Arts & Social Sciences',
  'Education',
  'Law',
  'Medicine',
  'Languages & Linguistics',
  'Built Environment',
] as const;

export type Faculty = typeof UM_FACULTIES[number];

/**
 * Validates whether an email belongs to the Universiti Malaya student domain (@siswa.um.edu.my).
 * Accepts root domain and valid subdomains (e.g. user@siswa.um.edu.my or user@sub.siswa.um.edu.my).
 * Rejects general consumer emails and unauthorized domains.
 */
export function isSiswaEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  
  // Must have local part and domain part
  const parts = trimmed.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return false;

  const domain = parts[1];
  return domain === 'siswa.um.edu.my' || domain.endsWith('.siswa.um.edu.my');
}

/**
 * Checks if a faculty name is a recognized UM faculty.
 */
export function isValidFaculty(faculty: string): faculty is Faculty {
  return UM_FACULTIES.includes(faculty as Faculty);
}

/**
 * Validation schema for student profile updates.
 * Prevents tampering with sensitive fields (email, role, account_status, balances).
 */
export const ProfileUpdateSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name must be under 80 characters'),
  faculty: z.enum(UM_FACULTIES, { message: 'Please select a valid UM faculty' }),
  yearOfStudy: z.number().int().min(1, 'Year must be between 1 and 6').max(6, 'Year must be between 1 and 6'),
  bio: z.string().max(500, 'Bio must be under 500 characters').default(''),
  weeklyTutoringCapHours: z.number().min(0.5).max(10, 'Tutoring cap must be between 0.5 and 10 hours per week').default(2.0),
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;

/**
 * Validation schema for managing user skills (teachable skills and learning goals).
 */
export const UserSkillSchema = z.object({
  skillId: z.string().min(1, 'Invalid skill identifier'),
  relationship: z.enum(['teach', 'learn']),
  proficiency: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  description: z.string().max(300).optional().default(''),
  preferredMode: z.enum(['Online', 'In-Person', 'Both']).default('Both'),
  language: z.string().max(50).default('English'),
});

export type UserSkillInput = z.infer<typeof UserSkillSchema>;

/**
 * Validation schema for setting availability time slots.
 */
export const AvailabilitySlotSchema = z.object({
  dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in HH:MM format'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:MM format'),
  mode: z.enum(['Online', 'In-Person', 'Both']).default('Both'),
}).refine(data => data.endTime > data.startTime, {
  message: 'End time must be later than start time',
  path: ['endTime'],
});

export type AvailabilitySlotInput = z.infer<typeof AvailabilitySlotSchema>;
