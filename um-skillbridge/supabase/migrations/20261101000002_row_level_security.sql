-- ==============================================================================
-- UM SkillBridge — Migration 00002: Row Level Security (RLS) Policies
-- Description: Enables RLS on all tables and defines granular access policies.
--              All SELECT policies require authenticated role.
--              SECURITY DEFINER functions use SET search_path = ''.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Helper function: check if authenticated user is admin/moderator
--    SECURITY DEFINER with pinned search_path to prevent path-poisoning.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin_or_moderator(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_uuid AND role IN ('moderator', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

-- Restrict EXECUTE: only authenticated users may call this function
REVOKE ALL ON FUNCTION public.is_admin_or_moderator(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin_or_moderator(UUID) TO authenticated;

-- ------------------------------------------------------------------------------
-- 2. Role-elevation prevention trigger
--    Prevents students from changing their own role or verified status.
--    Replaces the fragile self-referencing subquery in the UPDATE policy.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_role_self_elevation()
RETURNS TRIGGER AS $$
BEGIN
  -- Only admin/moderator can change role or verification status
  IF (NEW.role <> OLD.role OR NEW.is_verified_student <> OLD.is_verified_student)
     AND NOT public.is_admin_or_moderator(OLD.id) THEN
    RAISE EXCEPTION 'Students cannot change their own role or verification status';
  END IF;
  -- Prevent students from modifying account_status
  IF NEW.account_status <> OLD.account_status
     AND NOT public.is_admin_or_moderator(OLD.id) THEN
    RAISE EXCEPTION 'Students cannot change their own account status';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

CREATE TRIGGER trg_prevent_role_elevation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_self_elevation();

-- ------------------------------------------------------------------------------
-- 3. Session immutable-field protection trigger
--    Prevents modification of core session identity fields after creation.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_session_immutable_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.mentor_id <> OLD.mentor_id THEN
    RAISE EXCEPTION 'Cannot modify session mentor after creation';
  END IF;
  IF NEW.learner_id <> OLD.learner_id THEN
    RAISE EXCEPTION 'Cannot modify session learner after creation';
  END IF;
  IF NEW.skill_id <> OLD.skill_id THEN
    RAISE EXCEPTION 'Cannot modify session skill after creation';
  END IF;
  IF NEW.credit_cost <> OLD.credit_cost THEN
    RAISE EXCEPTION 'Cannot modify session credit cost after creation';
  END IF;
  IF NEW.duration_minutes <> OLD.duration_minutes THEN
    RAISE EXCEPTION 'Cannot modify session duration after creation';
  END IF;
  IF NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'Cannot modify session creation timestamp';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

CREATE TRIGGER trg_protect_session_fields
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_session_immutable_fields();

-- ------------------------------------------------------------------------------
-- 4. Session status state-machine trigger
--    Enforces valid lifecycle transitions. Only admins can bypass.
--    Valid transitions:
--      Requested → Accepted | Declined | Cancelled
--      Accepted  → Confirmed | Cancelled
--      Confirmed → Completed | Cancelled | Disputed
--      Declined  → (terminal)
--      Completed → (terminal)
--      Cancelled → (terminal)
--      Disputed  → Resolved (admin only, mapped to Completed or Cancelled)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_session_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  -- No change = no-op
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;

  -- Admins can perform any transition
  IF public.is_admin_or_moderator(auth.uid()) THEN
    RETURN NEW;
  END IF;

  -- Enforce state machine for non-admin users
  IF OLD.status = 'Requested' AND NEW.status IN ('Accepted', 'Declined', 'Cancelled') THEN
    RETURN NEW;
  ELSIF OLD.status = 'Accepted' AND NEW.status IN ('Confirmed', 'Cancelled') THEN
    RETURN NEW;
  ELSIF OLD.status = 'Confirmed' AND NEW.status IN ('Completed', 'Cancelled', 'Disputed') THEN
    RETURN NEW;
  ELSE
    RAISE EXCEPTION 'Invalid session status transition from "%" to "%"', OLD.status, NEW.status;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

CREATE TRIGGER trg_enforce_session_status
  BEFORE UPDATE OF status ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_session_status_transition();

-- Restrict EXECUTE on security-critical trigger functions
REVOKE ALL ON FUNCTION public.prevent_role_self_elevation() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.protect_session_immutable_fields() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enforce_session_status_transition() FROM PUBLIC;

-- ==============================================================================
-- RLS POLICIES
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 5. Profiles RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view active profiles, their own profile, or all (if admin)
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    account_status = 'Active'
    OR id = auth.uid()
    OR public.is_admin_or_moderator(auth.uid())
  );

-- Only user themselves can insert profile (if not done by trigger)
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update only their own profile (role/status guarded by trigger)
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile (moderation/suspension)
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  USING (public.is_admin_or_moderator(auth.uid()));

-- ------------------------------------------------------------------------------
-- 6. Skills Catalog RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read approved skills; creators see own pending submissions
CREATE POLICY "skills_select_approved"
  ON public.skills FOR SELECT
  TO authenticated
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

-- Moderators/admins can update or delete skills
CREATE POLICY "skills_update_admin"
  ON public.skills FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_moderator(auth.uid()));

CREATE POLICY "skills_delete_admin"
  ON public.skills FOR DELETE
  TO authenticated
  USING (public.is_admin_or_moderator(auth.uid()));

-- ------------------------------------------------------------------------------
-- 7. User Skills RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;

-- Authenticated users can browse all user skills for peer matching
CREATE POLICY "user_skills_select"
  ON public.user_skills FOR SELECT
  TO authenticated
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
-- 8. Availability RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view availability for booking
CREATE POLICY "availability_select"
  ON public.availability FOR SELECT
  TO authenticated
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
-- 9. Sessions RLS
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

-- Learners can request sessions (must start as 'Requested')
CREATE POLICY "sessions_insert_learner"
  ON public.sessions FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = learner_id
    AND mentor_id <> learner_id
    AND status = 'Requested'
  );

-- Participants can update session (immutable fields + status guarded by triggers)
CREATE POLICY "sessions_update_participants"
  ON public.sessions FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = mentor_id
    OR auth.uid() = learner_id
    OR public.is_admin_or_moderator(auth.uid())
  )
  WITH CHECK (
    auth.uid() = mentor_id
    OR auth.uid() = learner_id
    OR public.is_admin_or_moderator(auth.uid())
  );

-- Direct deletion is blocked; sessions must be cancelled
CREATE POLICY "sessions_delete_admin"
  ON public.sessions FOR DELETE
  USING (public.is_admin_or_moderator(auth.uid()));

-- ------------------------------------------------------------------------------
-- 10. Credit Accounts RLS
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
-- 11. Credit Transactions RLS
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
-- 12. Feedbacks RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Public feedback visible to authenticated users; private feedback to parties and admins
CREATE POLICY "feedbacks_select"
  ON public.feedbacks FOR SELECT
  TO authenticated
  USING (
    is_private = false
    OR auth.uid() = author_id
    OR auth.uid() IN (SELECT mentor_id FROM public.sessions WHERE id = feedbacks.session_id)
    OR auth.uid() IN (SELECT learner_id FROM public.sessions WHERE id = feedbacks.session_id)
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
-- 13. Reports RLS
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
-- 14. Audit Logs RLS
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
