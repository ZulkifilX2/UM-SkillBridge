-- ==============================================================================
-- UM SkillBridge — Migration 00001: Initial Core Schema
-- Description: Creates core tables for profiles, skills, user_skills, availability,
--              sessions, credit_accounts, credit_transactions, feedbacks, reports,
--              and audit_logs.
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Helper updated_at trigger function
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

-- ------------------------------------------------------------------------------
-- 2. Profiles (Extends auth.users)
-- Note: Email is validated against student domain @siswa.um.edu.my.
-- UM SkillBridge is an independent peer initiative and does NOT claim official UM SSO.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  faculty TEXT NOT NULL,
  year_of_study SMALLINT NOT NULL DEFAULT 1 CHECK (year_of_study BETWEEN 1 AND 6),
  bio TEXT DEFAULT '',
  avatar_initials TEXT NOT NULL DEFAULT 'UM',
  avatar_color TEXT NOT NULL DEFAULT '#0C9D9A',
  account_status TEXT NOT NULL DEFAULT 'Active' CHECK (account_status IN ('Active', 'Suspended', 'Deactivated')),
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'moderator', 'admin')),
  weekly_tutoring_cap_hours NUMERIC(4, 1) NOT NULL DEFAULT 2.0 CHECK (weekly_tutoring_cap_hours >= 0),
  weekly_tutoring_used_hours NUMERIC(4, 1) NOT NULL DEFAULT 0.0 CHECK (weekly_tutoring_used_hours >= 0),
  is_verified_student BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Strict student domain restriction (anchored regex prevents subdomain spoofing)
  CONSTRAINT email_siswa_domain_check CHECK (
    email ~* '^[^@]+@siswa\.um\.edu\.my$'
    OR email ~* '^[^@]+@[^@]+\.siswa\.um\.edu\.my$'
  )
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_faculty ON public.profiles(faculty);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------------------------
-- 3. Skills Catalog
-- Master list of academic and practical peer skills.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'Code2',
  moderation_status TEXT NOT NULL DEFAULT 'Approved' CHECK (moderation_status IN ('Pending', 'Approved', 'Rejected')),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_slug ON public.skills(slug);

CREATE TRIGGER trg_skills_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------------------------
-- 4. User Skills (Teachable & Learning Goals)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL CHECK (relationship IN ('teach', 'learn')),
  proficiency TEXT NOT NULL CHECK (proficiency IN ('Beginner', 'Intermediate', 'Advanced')),
  description TEXT DEFAULT '',
  preferred_mode TEXT NOT NULL DEFAULT 'Both' CHECK (preferred_mode IN ('Online', 'In-Person', 'Both')),
  language TEXT NOT NULL DEFAULT 'English',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_user_skill_relationship UNIQUE (user_id, skill_id, relationship)
);

CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON public.user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON public.user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_rel ON public.user_skills(relationship);

CREATE TRIGGER trg_user_skills_updated_at
  BEFORE UPDATE ON public.user_skills
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------------------------
-- 5. Availability (Mentorship Time Slots)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  mode TEXT NOT NULL DEFAULT 'Both' CHECK (mode IN ('Online', 'In-Person', 'Both')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_availability_time_order CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_availability_user_id ON public.availability(user_id);
CREATE INDEX IF NOT EXISTS idx_availability_day ON public.availability(day_of_week);

-- ------------------------------------------------------------------------------
-- 6. Peer Sessions
-- Represents booking requests, active sessions, and completed knowledge exchanges.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.profiles(id),
  learner_id UUID NOT NULL REFERENCES public.profiles(id),
  skill_id UUID NOT NULL REFERENCES public.skills(id),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes IN (30, 60, 90, 120)),
  scheduled_time TIMESTAMPTZ NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('Online', 'In-Person', 'Both')),
  status TEXT NOT NULL DEFAULT 'Requested' CHECK (status IN ('Requested', 'Accepted', 'Declined', 'Confirmed', 'Completed', 'Cancelled', 'Disputed')),
  credit_cost NUMERIC(6, 2) NOT NULL DEFAULT 1.00 CHECK (credit_cost >= 0),
  location TEXT,
  meeting_link TEXT,
  learning_goals TEXT,
  mentor_confirmed BOOLEAN NOT NULL DEFAULT false,
  learner_confirmed BOOLEAN NOT NULL DEFAULT true,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_sessions_distinct_parties CHECK (mentor_id <> learner_id)
);

CREATE INDEX IF NOT EXISTS idx_sessions_mentor_id ON public.sessions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_learner_id ON public.sessions(learner_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled_time ON public.sessions(scheduled_time);

-- ------------------------------------------------------------------------------
-- 7. Credit Accounts (Authoritative SkillCredits Ledger)
-- Browser storage must NOT be authoritative for balances.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.credit_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  available_balance NUMERIC(8, 2) NOT NULL DEFAULT 0.00 CHECK (available_balance >= 0),
  reserved_balance NUMERIC(8, 2) NOT NULL DEFAULT 0.00 CHECK (reserved_balance >= 0),
  total_earned NUMERIC(8, 2) NOT NULL DEFAULT 0.00 CHECK (total_earned >= 0),
  total_spent NUMERIC(8, 2) NOT NULL DEFAULT 0.00 CHECK (total_spent >= 0),
  promotional_received NUMERIC(8, 2) NOT NULL DEFAULT 0.00 CHECK (promotional_received >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_accounts_user_id ON public.credit_accounts(user_id);

CREATE TRIGGER trg_credit_accounts_updated_at
  BEFORE UPDATE ON public.credit_accounts
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------------------------
-- 8. Credit Transactions (Append-Only Audit Ledger)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.credit_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('Earned', 'Spent', 'Reserved', 'Released', 'Promotional', 'Refunded')),
  amount NUMERIC(8, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Completed' CHECK (status IN ('Pending', 'Completed', 'Reversed')),
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_account_id ON public.credit_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON public.credit_transactions(created_at DESC);

-- ------------------------------------------------------------------------------
-- 9. Feedbacks & Ratings
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_private BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedbacks_session_id ON public.feedbacks(session_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_author_id ON public.feedbacks(author_id);

-- ------------------------------------------------------------------------------
-- 10. Reports & Safety Moderation
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reported_session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Investigating', 'Resolved', 'Dismissed')),
  resolution_notes TEXT,
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON public.reports(reporter_id);

-- ------------------------------------------------------------------------------
-- 11. Audit Logs (Security & Compliance Tracking)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
