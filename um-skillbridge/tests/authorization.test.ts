import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { ProfileUpdateSchema, isSiswaEmail } from '../src/lib/validators';

describe('Production Authorization & Access Rules', () => {
  it('strictly restricts student identity to Siswa domain without claiming official UM SSO', () => {
    // Valid student addresses
    expect(isSiswaEmail('u2100111@siswa.um.edu.my')).toBe(true);
    expect(isSiswaEmail('student.council@siswa.um.edu.my')).toBe(true);

    // Non-student addresses must be rejected
    expect(isSiswaEmail('admin@um.edu.my')).toBe(false);
    expect(isSiswaEmail('public@gmail.com')).toBe(false);
    expect(isSiswaEmail('guest@yahoo.com')).toBe(false);
  });

  it('guarantees profile update schema drops unauthorized fields', () => {
    const inputWithPrivileges = {
      displayName: 'Aisha CS',
      faculty: 'Computer Science' as const,
      yearOfStudy: 3,
      bio: 'Python and ML mentor',
      weeklyTutoringCapHours: 3.0,
      // Attempt to tamper with administrative/financial fields:
      role: 'admin',
      is_verified_student: true,
      account_status: 'Active',
      weekly_tutoring_used_hours: 0,
      available_balance: 1000.0,
      id: 'attacker-id',
      email: 'hijacked@siswa.um.edu.my',
    };

    const sanitized = ProfileUpdateSchema.parse(inputWithPrivileges);

    // Only authorized fields are preserved
    expect(Object.keys(sanitized)).toEqual([
      'displayName',
      'faculty',
      'yearOfStudy',
      'bio',
      'weeklyTutoringCapHours',
    ]);
    expect('role' in sanitized).toBe(false);
    expect('available_balance' in sanitized).toBe(false);
    expect('id' in sanitized).toBe(false);
    expect('email' in sanitized).toBe(false);
  });
});

describe('Database Migration & RLS Policy Integrity', () => {
  const migrationsDir = path.resolve(__dirname, '../supabase/migrations');

  it('contains all 4 version-controlled migration files', () => {
    const files = fs.readdirSync(migrationsDir);
    expect(files.some(f => f.includes('00001_initial_schema'))).toBe(true);
    expect(files.some(f => f.includes('00002_row_level_security'))).toBe(true);
    expect(files.some(f => f.includes('00003_seed_skills'))).toBe(true);
    expect(files.some(f => f.includes('00004_helper_functions'))).toBe(true);
  });

  it('enforces Row Level Security (RLS) on all 10 core tables', () => {
    const rlsSql = fs.readFileSync(
      path.join(migrationsDir, '20261101000002_row_level_security.sql'),
      'utf8'
    );

    const requiredTables = [
      'profiles',
      'skills',
      'user_skills',
      'availability',
      'sessions',
      'credit_accounts',
      'credit_transactions',
      'feedbacks',
      'reports',
      'audit_logs',
    ];

    for (const table of requiredTables) {
      const rlsStatement = `ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`;
      expect(rlsSql).toContain(rlsStatement);
    }
  });

  it('restricts credit accounts and transactions from client-side mutations', () => {
    const rlsSql = fs.readFileSync(
      path.join(migrationsDir, '20261101000002_row_level_security.sql'),
      'utf8'
    );

    // Should only have SELECT policies for users on credit accounts and transactions
    expect(rlsSql).toContain('CREATE POLICY "credit_accounts_select_own"');
    expect(rlsSql).toContain('CREATE POLICY "credit_transactions_select_own"');

    // Must NOT have client INSERT or UPDATE policies on credit accounts
    expect(rlsSql).not.toContain('CREATE POLICY "credit_accounts_insert_own"');
    expect(rlsSql).not.toContain('CREATE POLICY "credit_accounts_update_own"');
    expect(rlsSql).not.toContain('CREATE POLICY "credit_transactions_insert_own"');
  });

  it('contains initial seed for skills catalog', () => {
    const seedSql = fs.readFileSync(
      path.join(migrationsDir, '20261101000003_seed_skills.sql'),
      'utf8'
    );

    expect(seedSql).toContain('python-programming');
    expect(seedSql).toContain('canva-design');
    expect(seedSql).toContain('public-speaking');
    expect(seedSql).toContain('machine-learning');
  });

  it('contains email verification and automatic welcome credit triggers', () => {
    const helpersSql = fs.readFileSync(
      path.join(migrationsDir, '20261101000004_helper_functions.sql'),
      'utf8'
    );

    expect(helpersSql).toContain('is_valid_siswa_email');
    expect(helpersSql).toContain('handle_new_user');
    expect(helpersSql).toContain('handle_user_email_confirmed');
    expect(helpersSql).toContain('Welcome grant: 1.0 Introductory SkillCredit');
  });
});
