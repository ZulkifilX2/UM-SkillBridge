'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSiswaEmail } from '@/lib/validators';

export interface AuthActionResult {
  success: boolean;
  message?: string;
  error?: string;
  requiresEmailConfirmation?: boolean;
}

/**
 * Validates Siswa email and registers a new student with Supabase Auth.
 * Includes clear disclaimer that UM SkillBridge is an independent student platform.
 */
export async function signUpAction(formData: FormData): Promise<AuthActionResult> {
  const email = (formData.get('email') as string || '').trim().toLowerCase();
  const password = formData.get('password') as string || '';
  const displayName = (formData.get('displayName') as string || '').trim();
  const faculty = (formData.get('faculty') as string || 'Computer Science').trim();
  const yearOfStudy = parseInt(formData.get('yearOfStudy') as string || '1', 10);
  const bio = (formData.get('bio') as string || '').trim();

  // 1. Validation
  if (!displayName) {
    return { success: false, error: 'Full name is required.' };
  }

  if (!email || !isSiswaEmail(email)) {
    return {
      success: false,
      error: 'Registration is restricted to valid Universiti Malaya student email addresses (@siswa.um.edu.my).',
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: 'Password must be at least 8 characters long.',
    };
  }

  // Generate initials & color
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'UM';

  const avatarColors = ['#0C9D9A', '#1769C2', '#FF943B', '#20C5BE', '#087572'];
  const avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const emailRedirectTo = `${siteUrl}/auth/callback?next=/dashboard`;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        faculty,
        year_of_study: yearOfStudy,
        bio: bio || 'Passionate UM student excited to share and exchange skills!',
        avatar_initials: initials,
        avatar_color: avatarColor,
      },
      emailRedirectTo,
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message || 'Registration failed. Please check your details and try again.',
    };
  }

  // Check if confirmation email was sent
  if (data.user && !data.session) {
    return {
      success: true,
      requiresEmailConfirmation: true,
      message: `A verification link has been sent to ${email}. Please check your UM Siswa webmail to verify your account and claim your 1.0 Welcome SkillCredit.`,
    };
  }

  revalidatePath('/', 'layout');
  return {
    success: true,
    message: 'Account created and verified successfully.',
  };
}

/**
 * Authenticates an existing student.
 */
export async function signInAction(formData: FormData): Promise<AuthActionResult> {
  const email = (formData.get('email') as string || '').trim().toLowerCase();
  const password = formData.get('password') as string || '';

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return {
        success: false,
        requiresEmailConfirmation: true,
        error: 'Your email address has not been verified yet. Please check your UM Siswa webmail for the confirmation link.',
      };
    }
    return {
      success: false,
      error: error.message || 'Invalid email or password.',
    };
  }

  revalidatePath('/', 'layout');
  return {
    success: true,
    message: 'Signed in successfully.',
  };
}

/**
 * Ends the authenticated session and clears cookies.
 */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

/**
 * Sends a password recovery email to a Siswa address.
 */
export async function resetPasswordAction(formData: FormData): Promise<AuthActionResult> {
  const email = (formData.get('email') as string || '').trim().toLowerCase();

  if (!email || !isSiswaEmail(email)) {
    return {
      success: false,
      error: 'Please enter a valid @siswa.um.edu.my email address.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectTo = `${siteUrl}/auth/callback?next=/update-password`;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return {
      success: false,
      error: error.message || 'Could not send recovery link. Please try again.',
    };
  }

  return {
    success: true,
    message: `If an account exists for ${email}, a password reset link has been dispatched to your student webmail.`,
  };
}

/**
 * Sets a new password for the currently verified recovery session.
 */
export async function updatePasswordAction(formData: FormData): Promise<AuthActionResult> {
  const newPassword = formData.get('password') as string || '';

  if (newPassword.length < 8) {
    return {
      success: false,
      error: 'Password must be at least 8 characters long.',
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return {
      success: false,
      error: error.message || 'Password update failed.',
    };
  }

  return {
    success: true,
    message: 'Your password has been successfully updated.',
  };
}
