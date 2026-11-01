import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/database.types';
import { UserSkillSchema, UserSkillInput } from '@/lib/validators';

export type Skill = Database['public']['Tables']['skills']['Row'];
export type UserSkill = Database['public']['Tables']['user_skills']['Row'];

export interface UserSkillWithSkill extends UserSkill {
  skill: Skill;
}

export interface SkillOperationResult {
  success: boolean;
  userSkill?: UserSkill;
  error?: string;
}

/**
 * Returns all approved skills from the master catalog.
 */
export async function getAllApprovedSkills(): Promise<Skill[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('moderation_status', 'Approved')
    .order('category', { ascending: true })
    .order('title', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as Skill[];
}

/**
 * Retrieves skills for a user (either teach, learn, or both).
 */
export async function getUserSkills(userId: string, relationship?: 'teach' | 'learn'): Promise<UserSkillWithSkill[]> {
  const supabase = await createClient();
  let query = supabase
    .from('user_skills')
    .select('*, skill:skills(*)')
    .eq('user_id', userId);

  if (relationship) {
    query = query.eq('relationship', relationship);
  }

  const { data, error } = await query;
  if (error || !data) {
    return [];
  }

  return (data as unknown as (UserSkill & { skill: Skill })[]).map(item => ({
    ...item,
    skill: item.skill,
  }));
}

/**
 * Associates a skill with the authenticated user (either teachable skill or learning goal).
 */
export async function addUserSkill(input: UserSkillInput): Promise<SkillOperationResult> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Unauthorized: You must be logged in to manage your skills.' };
  }

  const validation = UserSkillSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues.map(e => e.message).join(', '),
    };
  }

  const valid = validation.data;

  const { data, error } = await supabase
    .from('user_skills')
    .upsert({
      user_id: user.id,
      skill_id: valid.skillId,
      relationship: valid.relationship,
      proficiency: valid.proficiency,
      description: valid.description || '',
      preferred_mode: valid.preferredMode,
      language: valid.language || 'English',
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,skill_id,relationship',
    })
    .select()
    .single();

  if (error || !data) {
    return {
      success: false,
      error: error?.message || 'Failed to save skill preference.',
    };
  }

  return {
    success: true,
    userSkill: data as UserSkill,
  };
}

/**
 * Removes a teachable skill or learning goal from the authenticated user's profile.
 */
export async function removeUserSkill(userSkillId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('user_skills')
    .delete()
    .eq('id', userSkillId)
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Proposes a new custom peer skill for moderation approval.
 */
export async function suggestCustomSkill(
  title: string,
  category: string,
  description: string
): Promise<{ success: boolean; skill?: Skill; error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const { data, error } = await supabase
    .from('skills')
    .insert({
      title,
      slug,
      category,
      description,
      icon: 'BookOpen',
      moderation_status: 'Pending',
      created_by: user.id,
    })
    .select()
    .single();

  if (error || !data) {
    return { success: false, error: error?.message || 'Could not submit new skill.' };
  }

  return { success: true, skill: data as Skill };
}
