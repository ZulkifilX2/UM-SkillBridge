import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/database.types';
import { AvailabilitySlotSchema, AvailabilitySlotInput } from '@/lib/validators';

export type Availability = Database['public']['Tables']['availability']['Row'];

export interface AvailabilityOperationResult {
  success: boolean;
  availability?: Availability;
  error?: string;
}

/**
 * Retrieves the weekly availability schedule for a user.
 */
export async function getUserAvailability(userId: string): Promise<Availability[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('user_id', userId)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as Availability[];
}

/**
 * Adds an availability time slot for the authenticated student.
 */
export async function addAvailabilitySlot(input: AvailabilitySlotInput): Promise<AvailabilityOperationResult> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  const validation = AvailabilitySlotSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues.map(e => e.message).join(', '),
    };
  }

  const valid = validation.data;

  const { data, error } = await supabase
    .from('availability')
    .insert({
      user_id: user.id,
      day_of_week: valid.dayOfWeek,
      start_time: valid.startTime,
      end_time: valid.endTime,
      mode: valid.mode,
    })
    .select()
    .single();

  if (error || !data) {
    return { success: false, error: error?.message || 'Could not add availability slot.' };
  }

  return { success: true, availability: data as Availability };
}

/**
 * Removes an availability slot.
 */
export async function removeAvailabilitySlot(slotId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('availability')
    .delete()
    .eq('id', slotId)
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Replaces the authenticated student's entire weekly schedule with new slots.
 */
export async function setWeeklyAvailability(slots: AvailabilitySlotInput[]): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  // Validate all slots
  for (const slot of slots) {
    const val = AvailabilitySlotSchema.safeParse(slot);
    if (!val.success) {
      return { success: false, error: val.error.issues.map(e => e.message).join(', ') };
    }
  }

  // Delete existing
  const { error: delError } = await supabase
    .from('availability')
    .delete()
    .eq('user_id', user.id);

  if (delError) {
    return { success: false, error: delError.message };
  }

  if (slots.length === 0) {
    return { success: true };
  }

  // Insert new batch
  const { error: insError } = await supabase
    .from('availability')
    .insert(
      slots.map(s => ({
        user_id: user.id,
        day_of_week: s.dayOfWeek,
        start_time: s.startTime,
        end_time: s.endTime,
        mode: s.mode,
      }))
    );

  if (insError) {
    return { success: false, error: insError.message };
  }

  return { success: true };
}
