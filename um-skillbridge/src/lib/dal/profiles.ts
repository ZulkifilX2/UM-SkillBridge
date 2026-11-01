import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/database.types';
import { ProfileUpdateSchema, ProfileUpdateInput } from '@/lib/validators';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export interface ProfileOperationResult {
  success: boolean;
  profile?: Profile;
  error?: string;
}

/**
 * Retrieves the currently authenticated user's profile from Supabase.
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    return null;
  }

  return profile as Profile;
}

/**
 * Retrieves a public student profile by ID.
 * Returns only active student profiles.
 */
export async function getPublicProfileById(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .eq('account_status', 'Active')
    .single();

  if (error || !profile) {
    return null;
  }

  return profile as Profile;
}

/**
 * Lists public profiles for the explore and matching directories.
 */
export async function listPublicProfiles(facultyFilter?: string): Promise<Profile[]> {
  const supabase = await createClient();
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('account_status', 'Active')
    .order('created_at', { ascending: false });

  if (facultyFilter && facultyFilter !== 'All') {
    query = query.eq('faculty', facultyFilter);
  }

  const { data, error } = await query;
  if (error || !data) {
    return [];
  }

  return data as Profile[];
}

/**
 * Updates the authenticated student's profile with strict backend authorization.
 * Rejects tampering with role, account_status, email, or other users' profiles.
 * Records an audit log entry.
 */
export async function updateOwnProfile(input: ProfileUpdateInput): Promise<ProfileOperationResult> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Unauthorized: You must be logged in to update your profile.' };
  }

  // 1. Zod input validation
  const parseResult = ProfileUpdateSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues.map(e => e.message).join(', '),
    };
  }

  const validData = parseResult.data;

  // 2. Fetch existing profile to capture before-state for audit log
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 3. Perform update (sanitized fields only)
  const { data: updatedProfile, error: updateError } = await supabase
    .from('profiles')
    .update({
      display_name: validData.displayName,
      faculty: validData.faculty,
      year_of_study: validData.yearOfStudy,
      bio: validData.bio,
      weekly_tutoring_cap_hours: validData.weeklyTutoringCapHours,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single();

  if (updateError || !updatedProfile) {
    return {
      success: false,
      error: updateError?.message || 'Failed to update profile.',
    };
  }

  // 4. Record audit log
  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'PROFILE_UPDATED',
    entity_type: 'profiles',
    entity_id: user.id,
    old_data: existingProfile as unknown as Record<string, unknown>,
    new_data: updatedProfile as unknown as Record<string, unknown>,
  });

  return {
    success: true,
    profile: updatedProfile as Profile,
  };
}
