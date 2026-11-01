import { describe, it, expect } from 'vitest';
import {
  isSiswaEmail,
  isValidFaculty,
  UM_FACULTIES,
  ProfileUpdateSchema,
  UserSkillSchema,
  AvailabilitySlotSchema,
} from '../src/lib/validators';

describe('UM Siswa Email Validation', () => {
  it('accepts valid @siswa.um.edu.my student emails', () => {
    expect(isSiswaEmail('farhana@siswa.um.edu.my')).toBe(true);
    expect(isSiswaEmail('ahmad.razak@siswa.um.edu.my')).toBe(true);
    expect(isSiswaEmail('u2001234@siswa.um.edu.my')).toBe(true);
    expect(isSiswaEmail('student@dept.siswa.um.edu.my')).toBe(true);
  });

  it('accepts uppercase and mixed-case Siswa emails', () => {
    expect(isSiswaEmail('FARHANA@SISWA.UM.EDU.MY')).toBe(true);
    expect(isSiswaEmail('Ahmad.Razak@Siswa.UM.Edu.My')).toBe(true);
  });

  it('rejects external consumer emails', () => {
    expect(isSiswaEmail('student@gmail.com')).toBe(false);
    expect(isSiswaEmail('student@yahoo.com')).toBe(false);
    expect(isSiswaEmail('student@outlook.com')).toBe(false);
  });

  it('rejects general non-student UM staff domains or other university domains', () => {
    expect(isSiswaEmail('lecturer@um.edu.my')).toBe(false);
    expect(isSiswaEmail('student@siswa.ukm.edu.my')).toBe(false);
    expect(isSiswaEmail('student@siswa.utm.my')).toBe(false);
  });

  it('rejects spoofing and prefix/suffix attacks', () => {
    expect(isSiswaEmail('hacker@siswa.um.edu.my.attacker.com')).toBe(false);
    expect(isSiswaEmail('siswa.um.edu.my@gmail.com')).toBe(false);
    expect(isSiswaEmail('attacker@evil-siswa.um.edu.my')).toBe(false);
    expect(isSiswaEmail('')).toBe(false);
    expect(isSiswaEmail('   ')).toBe(false);
  });
});

describe('UM Faculty Validation', () => {
  it('recognizes all 11 official UM faculties', () => {
    expect(UM_FACULTIES).toHaveLength(11);
    expect(isValidFaculty('Computer Science')).toBe(true);
    expect(isValidFaculty('Engineering')).toBe(true);
    expect(isValidFaculty('Business & Economics')).toBe(true);
    expect(isValidFaculty('Medicine')).toBe(true);
    expect(isValidFaculty('Languages & Linguistics')).toBe(true);
  });

  it('rejects unlisted or misspelled faculties', () => {
    expect(isValidFaculty('Hogwarts School')).toBe(false);
    expect(isValidFaculty('CompSci')).toBe(false);
    expect(isValidFaculty('')).toBe(false);
  });
});

describe('ProfileUpdateSchema Validation & Tampering Prevention', () => {
  it('accepts valid student profile updates', () => {
    const validData = {
      displayName: 'Nur Farhana',
      faculty: 'Computer Science',
      yearOfStudy: 3,
      bio: 'Enthusiastic Python peer tutor.',
      weeklyTutoringCapHours: 2.0,
    };
    const result = ProfileUpdateSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects out-of-range year of study', () => {
    const invalidYear = {
      displayName: 'Nur Farhana',
      faculty: 'Computer Science',
      yearOfStudy: 0,
      weeklyTutoringCapHours: 2.0,
    };
    const result = ProfileUpdateSchema.safeParse(invalidYear);
    expect(result.success).toBe(false);

    const tooHighYear = {
      displayName: 'Nur Farhana',
      faculty: 'Computer Science',
      yearOfStudy: 8,
      weeklyTutoringCapHours: 2.0,
    };
    expect(ProfileUpdateSchema.safeParse(tooHighYear).success).toBe(false);
  });

  it('rejects excessive or invalid tutoring cap', () => {
    const excessiveCap = {
      displayName: 'Nur Farhana',
      faculty: 'Computer Science',
      yearOfStudy: 2,
      weeklyTutoringCapHours: 25.0, // beyond limit
    };
    expect(ProfileUpdateSchema.safeParse(excessiveCap).success).toBe(false);

    const negativeCap = {
      displayName: 'Nur Farhana',
      faculty: 'Computer Science',
      yearOfStudy: 2,
      weeklyTutoringCapHours: -1,
    };
    expect(ProfileUpdateSchema.safeParse(negativeCap).success).toBe(false);
  });

  it('ignores attempts to tamper with protected fields (role, account_status, email, balances)', () => {
    const maliciousPayload = {
      displayName: 'Nur Farhana',
      faculty: 'Engineering',
      yearOfStudy: 2,
      bio: 'Peer mentor',
      weeklyTutoringCapHours: 2.0,
      // Attempted escalation:
      role: 'admin',
      account_status: 'Active',
      email: 'hacked@siswa.um.edu.my',
      available_balance: 9999,
    };
    const result = ProfileUpdateSchema.parse(maliciousPayload);
    // Schema should only parse recognized fields
    expect('role' in result).toBe(false);
    expect('account_status' in result).toBe(false);
    expect('email' in result).toBe(false);
    expect('available_balance' in result).toBe(false);
  });
});

describe('UserSkillSchema Validation', () => {
  it('accepts valid teach and learn skill configurations', () => {
    const validTeach = {
      skillId: 'c0000001-0000-0000-0000-000000000001',
      relationship: 'teach' as const,
      proficiency: 'Advanced' as const,
      preferredMode: 'Both' as const,
      description: 'Can guide assignment structure',
    };
    expect(UserSkillSchema.safeParse(validTeach).success).toBe(true);

    const validLearn = {
      skillId: 'c0000001-0000-0000-0000-000000000004',
      relationship: 'learn' as const,
      proficiency: 'Beginner' as const,
    };
    expect(UserSkillSchema.safeParse(validLearn).success).toBe(true);
  });

  it('rejects empty skill IDs or invalid relationships', () => {
    const emptySkillId = {
      skillId: '',
      relationship: 'teach',
      proficiency: 'Beginner',
    };
    expect(UserSkillSchema.safeParse(emptySkillId).success).toBe(false);

    const invalidRelationship = {
      skillId: 'c0000001-0000-0000-0000-000000000001',
      relationship: 'trade', // only 'teach' | 'learn'
      proficiency: 'Beginner',
    };
    expect(UserSkillSchema.safeParse(invalidRelationship).success).toBe(false);
  });
});

describe('AvailabilitySlotSchema Validation', () => {
  it('accepts valid availability intervals', () => {
    const validSlot = {
      dayOfWeek: 'Tuesday' as const,
      startTime: '10:00',
      endTime: '12:00',
      mode: 'Both' as const,
    };
    expect(AvailabilitySlotSchema.safeParse(validSlot).success).toBe(true);
  });

  it('rejects slots where end time is before or equal to start time', () => {
    const invertedTime = {
      dayOfWeek: 'Tuesday' as const,
      startTime: '14:00',
      endTime: '10:00', // earlier than start
      mode: 'Both' as const,
    };
    expect(AvailabilitySlotSchema.safeParse(invertedTime).success).toBe(false);

    const equalTime = {
      dayOfWeek: 'Tuesday' as const,
      startTime: '14:00',
      endTime: '14:00', // same
      mode: 'Both' as const,
    };
    expect(AvailabilitySlotSchema.safeParse(equalTime).success).toBe(false);
  });
});
