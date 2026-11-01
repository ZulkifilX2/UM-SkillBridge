'use server';

import { revalidatePath } from 'next/cache';
import {
  getCurrentUserProfile,
  updateOwnProfile,
  getAllApprovedSkills,
  getUserSkills,
  addUserSkill,
  removeUserSkill,
  getUserAvailability,
  addAvailabilitySlot,
  removeAvailabilitySlot,
  Profile,
  Skill,
  UserSkillWithSkill,
  Availability
} from '@/lib/dal';
import { ProfileUpdateInput, UserSkillInput, AvailabilitySlotInput } from '@/lib/validators';

export interface ProfilePageData {
  profile: Profile | null;
  catalog: Skill[];
  teachSkills: UserSkillWithSkill[];
  learnSkills: UserSkillWithSkill[];
  availabilitySlots: Availability[];
}

/**
 * Server Action: Fetches all profile, skills, and availability data for the authenticated student.
 */
export async function fetchProfilePageData(): Promise<ProfilePageData> {
  const profile = await getCurrentUserProfile();
  if (!profile) {
    return {
      profile: null,
      catalog: await getAllApprovedSkills(),
      teachSkills: [],
      learnSkills: [],
      availabilitySlots: [],
    };
  }

  const [catalog, teach, learn, slots] = await Promise.all([
    getAllApprovedSkills(),
    getUserSkills(profile.id, 'teach'),
    getUserSkills(profile.id, 'learn'),
    getUserAvailability(profile.id),
  ]);

  return {
    profile,
    catalog,
    teachSkills: teach,
    learnSkills: learn,
    availabilitySlots: slots,
  };
}

/**
 * Server Action: Updates the student's own profile with backend authorization and validation.
 */
export async function updateProfileServerAction(input: ProfileUpdateInput) {
  const result = await updateOwnProfile(input);
  if (result.success) {
    revalidatePath('/profile');
    revalidatePath('/dashboard');
  }
  return result;
}

/**
 * Server Action: Adds a teachable skill or learning goal.
 */
export async function addUserSkillServerAction(input: UserSkillInput) {
  const result = await addUserSkill(input);
  if (result.success) {
    revalidatePath('/profile');
    revalidatePath('/explore');
  }
  return result;
}

/**
 * Server Action: Removes a user skill.
 */
export async function removeUserSkillServerAction(userSkillId: string) {
  const result = await removeUserSkill(userSkillId);
  if (result.success) {
    revalidatePath('/profile');
  }
  return result;
}

/**
 * Server Action: Adds an availability slot.
 */
export async function addAvailabilityServerAction(input: AvailabilitySlotInput) {
  const result = await addAvailabilitySlot(input);
  if (result.success) {
    revalidatePath('/profile');
  }
  return result;
}

/**
 * Server Action: Removes an availability slot.
 */
export async function removeAvailabilityServerAction(slotId: string) {
  const result = await removeAvailabilitySlot(slotId);
  if (result.success) {
    revalidatePath('/profile');
  }
  return result;
}
