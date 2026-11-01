import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/database.types';

export type CreditAccount = Database['public']['Tables']['credit_accounts']['Row'];
export type CreditTransaction = Database['public']['Tables']['credit_transactions']['Row'];

/**
 * Retrieves the authoritative SkillCredits account balance for the current user.
 * Browser storage is NEVER used as the source of truth for balances.
 */
export async function getCurrentUserCreditAccount(): Promise<CreditAccount | null> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from('credit_accounts')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as CreditAccount;
}

/**
 * Retrieves the transaction history for the authenticated user.
 */
export async function getUserCreditTransactions(): Promise<CreditTransaction[]> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as CreditTransaction[];
}
