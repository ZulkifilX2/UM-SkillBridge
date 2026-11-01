-- ==============================================================================
-- UM SkillBridge — Migration 00002: Row Level Security (RLS) Policies
-- Description: Enables RLS on all tables and defines granular access policies.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Helper function: check if authenticated user is admin/moderator
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin_or_moderator(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_uuid AND role IN ('moderator', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 2. Profiles RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view active public student profiles for peer discovery
CREATE POLICY "profiles_select_public"
  ON public.profiles FOR SELECT
  USING (
    account_status = 'Active' 
    OR id = auth.uid() 
    OR public.is_admin_or_moderator(auth.uid())
  );

-- Only user themselves can insert profile (if not done by trigger)
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update only their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    -- Students cannot arbitrarily elevate role or override verified student status
    AND (
      role = (SELECT role FROM public.profiles WHERE id = auth.uid())
      OR public.is_admin_or_moderator(auth.uid())
    )
  );

-- Admins can update any profile (moderation/suspension)
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  USING (public.is_admin_or_moderator(auth.uid()));

-- ------------------------------------------------------------------------------
-- 3. Skills Catalog RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved skills; creators can see their own pending submissions
CREATE POLICY "skills_select_approved"
  ON public.skills FOR SELECT
  USING (
    moderation_status = 'Approved'
    OR created_by = auth.uid()
    OR public.is_admin_or_moderator(auth.uid())
  );

-- Authenticated students can suggest new skills (must be Pending)
CREATE POLICY "skills_insert_student"
  ON public.skills FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by
    AND moderation_status = 'Pending'
  );

-- Only moderators/admins can edit or approve skills
CREATE POLICY "skills_all_admin"
  ON public.skills FOR ALL
  USING (public.is_admin_or_moderator(auth.uid()));

-- ------------------------------------------------------------------------------
-- 4. User Skills RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;

-- Anyone can browse active user skills to match with peer mentors
CREATE POLICY "user_skills_select"
  ON public.user_skills FOR SELECT
  USING (true);

-- Users manage their own skills
CREATE POLICY "user_skills_insert_own"
  ON public.user_skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_skills_update_own"
  ON public.user_skills FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_skills_delete_own"
  ON public.user_skills FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5. Availability RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view availability to book sessions
CREATE POLICY "availability_select"
  ON public.availability FOR SELECT
  USING (true);

-- Users manage their own availability slots
CREATE POLICY "availability_insert_own"
  ON public.availability FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "availability_update_own"
  ON public.availability FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "availability_delete_own"
  ON public.availability FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 6. Sessions RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Only parties to the session or admins can view it
CREATE POLICY "sessions_select_participants"
  ON public.sessions FOR SELECT
  TO authenticated
  USING (
    auth.uid() = mentor_id 
    OR auth.uid() = learner_id 
    OR public.is_admin_or_moderator(auth.uid())
  );

-- Learners can request sessions
CREATE POLICY "sessions_insert_learner"
  ON public.sessions FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = learner_id 
    AND mentor_id <> learner_id
    AND status = 'Requested'
  );

-- Participants can update status (e.g. mentor accepts, party cancels)
CREATE POLICY "sessions_update_participants"
  ON public.sessions FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = mentor_id 
    OR auth.uid() = learner_id
    OR public.is_admin_or_moderator(auth.uid())
  );

-- Direct deletion is blocked; sessions must be cancelled
CREATE POLICY "sessions_delete_admin"
  ON public.sessions FOR DELETE
  USING (public.is_admin_or_moderator(auth.uid()));

-- ------------------------------------------------------------------------------
-- 7. Credit Accounts RLS
-- STRICT: Clients can only READ their own balance.
-- All modifications must go through database functions / service role.
-- ------------------------------------------------------------------------------
ALTER TABLE public.credit_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "credit_accounts_select_own"
  ON public.credit_accounts FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR public.is_admin_or_moderator(auth.uid())
  );

-- Disallow client direct INSERT/UPDATE/DELETE
-- (Only postgres / security definer triggers or service role can modify credit accounts)

-- ------------------------------------------------------------------------------
-- 8. Credit Transactions RLS
-- STRICT: Append-only ledger. Clients can only READ their own transactions.
-- ------------------------------------------------------------------------------
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "credit_transactions_select_own"
  ON public.credit_transactions FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR public.is_admin_or_moderator(auth.uid())
  );

-- Disallow client direct INSERT/UPDATE/DELETE
-- (Only backend triggers / settlement engine can insert transactions)

-- ------------------------------------------------------------------------------
-- 9. Feedbacks RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Public feedback is visible to all; private feedback only to parties and admins
CREATE POLICY "feedbacks_select"
  ON public.feedbacks FOR SELECT
  USING (
    is_private = false
    OR auth.uid() = author_id
    OR auth.uid() IN (SELECT mentor_id FROM public.sessions WHERE id = feedbacks.session_id)
    OR public.is_admin_or_moderator(auth.uid())
  );

-- Only session participants can leave feedback for a completed session
CREATE POLICY "feedbacks_insert_participant"
  ON public.feedbacks FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (
      SELECT 1 FROM public.sessions
      WHERE id = feedbacks.session_id
        AND (mentor_id = auth.uid() OR learner_id = auth.uid())
        AND status = 'Completed'
    )
  );

-- ------------------------------------------------------------------------------
-- 10. Reports RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Reporter can view their own reports; admins can view all
CREATE POLICY "reports_select"
  ON public.reports FOR SELECT
  TO authenticated
  USING (
    reporter_id = auth.uid()
    OR public.is_admin_or_moderator(auth.uid())
  );

-- Authenticated users can file reports
CREATE POLICY "reports_insert"
  ON public.reports FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id = auth.uid());

-- Only admins/moderators can update report status
CREATE POLICY "reports_update_admin"
  ON public.reports FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_moderator(auth.uid()));

-- ------------------------------------------------------------------------------
-- 11. Audit Logs RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can inspect their own security audit history; admins see all
CREATE POLICY "audit_logs_select"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_admin_or_moderator(auth.uid())
  );

-- Inserts are restricted to security functions and service role
