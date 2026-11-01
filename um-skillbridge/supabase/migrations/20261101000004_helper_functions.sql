-- ==============================================================================
-- UM SkillBridge — Migration 00004: Helper Functions & Triggers
-- Description: Sets up auth.users lifecycle triggers, student verification logic,
--              initial wallet grant provisioning, and audit triggers.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Siswa email validator function
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_valid_siswa_email(email_addr TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  IF email_addr IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Case-insensitive check for @siswa.um.edu.my or subdomains
  RETURN (
    email_addr ILIKE '%@siswa.um.edu.my' OR
    email_addr ILIKE '%@%.siswa.um.edu.my'
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ------------------------------------------------------------------------------
-- 2. Auth Trigger: Provision Profile & Welcome Credit Account on Signup
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_display_name TEXT;
  v_faculty TEXT;
  v_year SMALLINT;
  v_bio TEXT;
  v_initials TEXT;
  v_color TEXT;
  v_account_id UUID;
  v_is_siswa BOOLEAN;
BEGIN
  -- Verify domain
  v_is_siswa := public.is_valid_siswa_email(NEW.email);
  IF NOT v_is_siswa THEN
    RAISE EXCEPTION 'Registration restricted to verified UM Siswa email addresses (@siswa.um.edu.my).';
  END IF;

  -- Extract metadata or defaults
  v_display_name := COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1));
  v_faculty := COALESCE(NEW.raw_user_meta_data->>'faculty', 'Computer Science');
  v_year := COALESCE((NEW.raw_user_meta_data->>'year_of_study')::SMALLINT, 1);
  v_bio := COALESCE(NEW.raw_user_meta_data->>'bio', 'Passionate UM student excited to share and exchange skills!');
  v_initials := COALESCE(NEW.raw_user_meta_data->>'avatar_initials', UPPER(SUBSTRING(v_display_name FROM 1 FOR 2)));
  v_color := COALESCE(NEW.raw_user_meta_data->>'avatar_color', '#0C9D9A');

  -- 1. Create Profile
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    faculty,
    year_of_study,
    bio,
    avatar_initials,
    avatar_color,
    account_status,
    role,
    weekly_tutoring_cap_hours,
    weekly_tutoring_used_hours,
    is_verified_student,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    v_display_name,
    v_faculty,
    v_year,
    v_bio,
    v_initials,
    v_color,
    'Active',
    'student',
    2.0,
    0.0,
    (NEW.email_confirmed_at IS NOT NULL),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        display_name = EXCLUDED.display_name,
        faculty = EXCLUDED.faculty,
        year_of_study = EXCLUDED.year_of_study,
        is_verified_student = (NEW.email_confirmed_at IS NOT NULL);

  -- 2. Create Authoritative Credit Account with 1.0 Welcome SkillCredit
  INSERT INTO public.credit_accounts (
    user_id,
    available_balance,
    reserved_balance,
    total_earned,
    total_spent,
    promotional_received
  ) VALUES (
    NEW.id,
    1.00,
    0.00,
    0.00,
    0.00,
    1.00
  )
  ON CONFLICT (user_id) DO NOTHING
  RETURNING id INTO v_account_id;

  -- 3. If credit account was created, record promotional transaction
  IF v_account_id IS NOT NULL THEN
    INSERT INTO public.credit_transactions (
      account_id,
      user_id,
      transaction_type,
      amount,
      status,
      description
    ) VALUES (
      v_account_id,
      NEW.id,
      'Promotional',
      1.00,
      'Completed',
      'Welcome grant: 1.0 Introductory SkillCredit for peer learning'
    );
  END IF;

  -- 4. Record Audit Log
  INSERT INTO public.audit_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    new_data
  ) VALUES (
    NEW.id,
    'USER_REGISTERED',
    'profiles',
    NEW.id::TEXT,
    jsonb_build_object(
      'email', NEW.email,
      'faculty', v_faculty,
      'display_name', v_display_name
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users (executed automatically on Supabase user creation)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 3. Email Confirmation Sync Trigger
-- Updates is_verified_student when the user clicks the confirmation link in email.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_user_email_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    UPDATE public.profiles
    SET is_verified_student = true,
        updated_at = NOW()
    WHERE id = NEW.id;

    INSERT INTO public.audit_logs (
      user_id,
      action,
      entity_type,
      entity_id,
      new_data
    ) VALUES (
      NEW.id,
      'EMAIL_VERIFIED',
      'profiles',
      NEW.id::TEXT,
      jsonb_build_object('confirmed_at', NEW.email_confirmed_at)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_email_confirmed();
