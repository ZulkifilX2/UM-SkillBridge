import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/database.types';

export type SessionRow = Database['public']['Tables']['sessions']['Row'];
export type FeedbackRow = Database['public']['Tables']['feedbacks']['Row'];

export interface SessionWithDetails extends SessionRow {
  mentor: Database['public']['Tables']['profiles']['Row'];
  learner: Database['public']['Tables']['profiles']['Row'];
  skill: Database['public']['Tables']['skills']['Row'];
}

export interface CreateSessionInput {
  mentorId: string;
  skillId: string;
  durationMinutes: number;
  scheduledTime: string;
  mode: 'Online' | 'In-Person' | 'Both';
  learningGoals?: string;
  location?: string;
}

/**
 * Retrieves all sessions where the authenticated user is either mentor or learner.
 */
export async function getUserSessions(): Promise<SessionWithDetails[]> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      mentor:profiles!sessions_mentor_id_fkey(*),
      learner:profiles!sessions_learner_id_fkey(*),
      skill:skills(*)
    `)
    .or(`mentor_id.eq.${user.id},learner_id.eq.${user.id}`)
    .order('scheduled_time', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as unknown as SessionWithDetails[];
}

/**
 * Retrieves a single session by ID if the authenticated user is a participant.
 */
export async function getSessionById(sessionId: string): Promise<SessionWithDetails | null> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      mentor:profiles!sessions_mentor_id_fkey(*),
      learner:profiles!sessions_learner_id_fkey(*),
      skill:skills(*)
    `)
    .eq('id', sessionId)
    .single();

  if (error || !data) {
    return null;
  }

  const s = data as unknown as SessionWithDetails;
  if (s.mentor_id !== user.id && s.learner_id !== user.id) {
    return null;
  }

  return s;
}

/**
 * Creates a new peer session booking request in 'Requested' status.
 * Credit settlement is deferred to Phase 2, but session record is stored authoritatively.
 */
export async function createSessionRequest(input: CreateSessionInput): Promise<{ success: boolean; session?: SessionRow; error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Unauthorized: You must be logged in to book a session.' };
  }

  if (input.mentorId === user.id) {
    return { success: false, error: 'Cannot book a session with yourself.' };
  }

  const creditCost = input.durationMinutes / 60;

  const { data, error } = await supabase
    .from('sessions')
    .insert({
      learner_id: user.id,
      mentor_id: input.mentorId,
      skill_id: input.skillId,
      duration_minutes: input.durationMinutes,
      scheduled_time: input.scheduledTime,
      mode: input.mode,
      status: 'Requested',
      credit_cost: creditCost,
      learning_goals: input.learningGoals || 'Peer knowledge exchange session',
      location: input.location || (input.mode === 'Online' ? 'Google Meet link provided upon confirmation' : 'UM Central Library Level 3'),
      mentor_confirmed: false,
      learner_confirmed: true,
    })
    .select()
    .single();

  if (error || !data) {
    return { success: false, error: error?.message || 'Failed to book session.' };
  }

  return { success: true, session: data as SessionRow };
}

/**
 * Updates a session status (e.g. mentor accepts/declines, participant cancels).
 */
export async function updateSessionStatus(
  sessionId: string,
  newStatus: SessionRow['status']
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  const updatePayload: Partial<SessionRow> = {
    status: newStatus,
  };

  if (newStatus === 'Confirmed' || newStatus === 'Accepted') {
    updatePayload.mentor_confirmed = true;
  }

  if (newStatus === 'Completed') {
    updatePayload.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('sessions')
    .update(updatePayload)
    .eq('id', sessionId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Submits feedback for a completed peer session.
 */
export async function submitSessionFeedback(input: {
  sessionId: string;
  rating: number;
  comment?: string;
  tags?: string[];
  isPrivate?: boolean;
}): Promise<{ success: boolean; feedback?: FeedbackRow; error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('feedbacks')
    .insert({
      session_id: input.sessionId,
      author_id: user.id,
      rating: input.rating,
      comment: input.comment || '',
      tags: input.tags || [],
      is_private: input.isPrivate || false,
    })
    .select()
    .single();

  if (error || !data) {
    return { success: false, error: error?.message || 'Could not submit feedback.' };
  }

  return { success: true, feedback: data as FeedbackRow };
}
