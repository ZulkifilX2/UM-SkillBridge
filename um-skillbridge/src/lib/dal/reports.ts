import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/database.types';

export type ReportRow = Database['public']['Tables']['reports']['Row'];

export interface CreateReportInput {
  reportedUserId?: string;
  reportedSessionId?: string;
  reason: string;
  details?: string;
}

/**
 * Submits a safety or academic integrity moderation report.
 */
export async function createReport(input: CreateReportInput): Promise<{ success: boolean; report?: ReportRow; error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!input.reason.trim()) {
    return { success: false, error: 'Reason for report is required.' };
  }

  const { data, error } = await supabase
    .from('reports')
    .insert({
      reporter_id: user.id,
      reported_user_id: input.reportedUserId || null,
      reported_session_id: input.reportedSessionId || null,
      reason: input.reason,
      details: input.details || '',
      status: 'Open',
    })
    .select()
    .single();

  if (error || !data) {
    return { success: false, error: error?.message || 'Failed to file report.' };
  }

  return { success: true, report: data as ReportRow };
}
