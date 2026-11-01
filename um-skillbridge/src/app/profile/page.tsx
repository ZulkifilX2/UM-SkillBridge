'use client';

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { Footer } from '@/components/footer';
import { useDemoStore } from '@/lib/store';
import {
  fetchProfilePageData,
  updateProfileServerAction,
  addUserSkillServerAction,
  removeUserSkillServerAction,
  addAvailabilityServerAction,
  removeAvailabilityServerAction,
} from './actions';
import type { Skill, UserSkillWithSkill, Availability } from '@/lib/dal';
import { UM_FACULTIES, Faculty } from '@/lib/validators';
import {
  ShieldCheck, User, Sparkles, Calendar, BookOpen,
  Plus, Trash2, CheckCircle2, AlertCircle, Clock,
  Save, GraduationCap
} from 'lucide-react';

export default function ProfilePage() {
  const {
    currentUserId,
    getCurrentUser,
    users,
    skills: demoSkills,
    getUserSkills: getDemoUserSkills,
    getUserAvailability: getDemoAvailability
  } = useDemoStore();

  const demoUser = getCurrentUser() || users[0];

  // Active section tab
  const [activeTab, setActiveTab] = useState<'profile' | 'teach' | 'learn' | 'availability'>('profile');

  // State
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [displayName, setDisplayName] = useState(demoUser?.displayName || '');
  const [email, setEmail] = useState(demoUser?.email || '');
  const [faculty, setFaculty] = useState<Faculty>((demoUser?.faculty as Faculty) || 'Computer Science');
  const [yearOfStudy, setYearOfStudy] = useState<number>(demoUser?.yearOfStudy || 2);
  const [bio, setBio] = useState(demoUser?.bio || '');
  const [weeklyCap, setWeeklyCap] = useState<number>(demoUser?.weeklyTutoringCapHours || 2);
  const [isVerified, setIsVerified] = useState(false);

  // Skills & Availability state
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [teachSkills, setTeachSkills] = useState<UserSkillWithSkill[]>([]);
  const [learnSkills, setLearnSkills] = useState<UserSkillWithSkill[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<Availability[]>([]);

  // Add Skill Modal/Form state
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [proficiency, setProficiency] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [skillMode, setSkillMode] = useState<'Online' | 'In-Person' | 'Both'>('Both');
  const [skillDescription, setSkillDescription] = useState('');

  // Add Availability state
  const [dayOfWeek, setDayOfWeek] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>('Monday');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');
  const [availMode, setAvailMode] = useState<'Online' | 'In-Person' | 'Both'>('Both');

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const liveData = await fetchProfilePageData();
        if (liveData.profile) {
          setIsLiveMode(true);
          setDisplayName(liveData.profile.display_name);
          setEmail(liveData.profile.email);
          setFaculty(liveData.profile.faculty as Faculty);
          setYearOfStudy(liveData.profile.year_of_study);
          setBio(liveData.profile.bio || '');
          setWeeklyCap(liveData.profile.weekly_tutoring_cap_hours);
          setIsVerified(liveData.profile.is_verified_student);

          setAvailableSkills(liveData.catalog);
          setTeachSkills(liveData.teachSkills);
          setLearnSkills(liveData.learnSkills);
          setAvailabilitySlots(liveData.availabilitySlots);
          if (liveData.catalog.length > 0) setSelectedSkillId(liveData.catalog[0].id);
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to local demo data
      }

      // Fallback to local demo data
      setIsLiveMode(false);
      setDisplayName(demoUser?.displayName || '');
      setEmail(demoUser?.email || '');
      setFaculty((demoUser?.faculty as Faculty) || 'Computer Science');
      setYearOfStudy(demoUser?.yearOfStudy || 2);
      setBio(demoUser?.bio || '');
      setWeeklyCap(demoUser?.weeklyTutoringCapHours || 2);
      setIsVerified(true);

      const dTeach = getDemoUserSkills(demoUser.id, 'teach');
      const dLearn = getDemoUserSkills(demoUser.id, 'learn');
      const dAvail = getDemoAvailability(demoUser.id);

      setTeachSkills(dTeach.map(s => ({
        id: `usk-${s.skillId}`,
        user_id: demoUser.id,
        skill_id: s.skillId,
        relationship: 'teach',
        proficiency: s.proficiency,
        description: s.description || '',
        preferred_mode: s.preferredMode || 'Both',
        language: s.language || 'English',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        skill: s.skill as unknown as Skill,
      })));

      setLearnSkills(dLearn.map(s => ({
        id: `usk-${s.skillId}`,
        user_id: demoUser.id,
        skill_id: s.skillId,
        relationship: 'learn',
        proficiency: s.proficiency,
        description: s.description || '',
        preferred_mode: s.preferredMode || 'Both',
        language: s.language || 'English',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        skill: s.skill as unknown as Skill,
      })));

      setAvailabilitySlots(dAvail.map(a => ({
        id: a.id,
        user_id: a.userId,
        day_of_week: a.dayOfWeek,
        start_time: a.startTime,
        end_time: a.endTime,
        mode: a.mode,
        created_at: new Date().toISOString(),
      })));

      setAvailableSkills(demoSkills as unknown as Skill[]);
      if (demoSkills.length > 0) setSelectedSkillId(demoSkills[0].id);
      setLoading(false);
    }

    loadData();
  }, [currentUserId, demoUser, getDemoAvailability, getDemoUserSkills, demoSkills]);

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (isLiveMode) {
      const res = await updateProfileServerAction({
        displayName,
        faculty,
        yearOfStudy,
        bio,
        weeklyTutoringCapHours: weeklyCap,
      });

      setSaving(false);
      if (res.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully.' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to update profile.' });
      }
    } else {
      // Local demo mode update
      setSaving(false);
      setMessage({ type: 'success', text: 'Demo profile changes saved in local session.' });
    }
  };

  // Add Teachable Skill
  const handleAddTeachSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) return;

    if (isLiveMode) {
      const res = await addUserSkillServerAction({
        skillId: selectedSkillId,
        relationship: 'teach',
        proficiency,
        description: skillDescription,
        preferredMode: skillMode,
        language: 'English',
      });
      if (res.success && res.userSkill) {
        const fullSkill = availableSkills.find(s => s.id === selectedSkillId);
        if (fullSkill) {
          setTeachSkills([...teachSkills, { ...res.userSkill, skill: fullSkill }]);
        }
        setMessage({ type: 'success', text: 'Teachable skill added!' });
        setSkillDescription('');
      } else {
        setMessage({ type: 'error', text: res.error || 'Could not add skill.' });
      }
    } else {
      const fullSkill = availableSkills.find(s => s.id === selectedSkillId);
      if (fullSkill) {
        const newEntry: UserSkillWithSkill = {
          id: `usk-${Date.now()}`,
          user_id: demoUser.id,
          skill_id: selectedSkillId,
          relationship: 'teach',
          proficiency,
          description: skillDescription,
          preferred_mode: skillMode,
          language: 'English',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          skill: fullSkill,
        };
        setTeachSkills([...teachSkills, newEntry]);
        setMessage({ type: 'success', text: 'Teachable skill added to demo session.' });
        setSkillDescription('');
      }
    }
  };

  // Remove Teachable Skill
  const handleRemoveTeachSkill = async (id: string) => {
    if (isLiveMode) {
      await removeUserSkillServerAction(id);
    }
    setTeachSkills(teachSkills.filter(s => s.id !== id));
  };

  // Add Learning Goal
  const handleAddLearnSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) return;

    if (isLiveMode) {
      const res = await addUserSkillServerAction({
        skillId: selectedSkillId,
        relationship: 'learn',
        proficiency,
        description: skillDescription,
        preferredMode: skillMode,
        language: 'English',
      });
      if (res.success && res.userSkill) {
        const fullSkill = availableSkills.find(s => s.id === selectedSkillId);
        if (fullSkill) {
          setLearnSkills([...learnSkills, { ...res.userSkill, skill: fullSkill }]);
        }
        setMessage({ type: 'success', text: 'Learning goal added!' });
        setSkillDescription('');
      } else {
        setMessage({ type: 'error', text: res.error || 'Could not add learning goal.' });
      }
    } else {
      const fullSkill = availableSkills.find(s => s.id === selectedSkillId);
      if (fullSkill) {
        const newEntry: UserSkillWithSkill = {
          id: `usk-${Date.now()}`,
          user_id: demoUser.id,
          skill_id: selectedSkillId,
          relationship: 'learn',
          proficiency,
          description: skillDescription,
          preferred_mode: skillMode,
          language: 'English',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          skill: fullSkill,
        };
        setLearnSkills([...learnSkills, newEntry]);
        setMessage({ type: 'success', text: 'Learning goal added to demo session.' });
        setSkillDescription('');
      }
    }
  };

  // Remove Learning Goal
  const handleRemoveLearnSkill = async (id: string) => {
    if (isLiveMode) {
      await removeUserSkillServerAction(id);
    }
    setLearnSkills(learnSkills.filter(s => s.id !== id));
  };

  // Add Availability Slot
  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (endTime <= startTime) {
      setMessage({ type: 'error', text: 'End time must be later than start time.' });
      return;
    }

    if (isLiveMode) {
      const res = await addAvailabilityServerAction({
        dayOfWeek,
        startTime,
        endTime,
        mode: availMode,
      });
      if (res.success && res.availability) {
        setAvailabilitySlots([...availabilitySlots, res.availability]);
        setMessage({ type: 'success', text: 'Availability slot added!' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Could not add availability.' });
      }
    } else {
      const newSlot: Availability = {
        id: `avail-${Date.now()}`,
        user_id: demoUser.id,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        mode: availMode,
        created_at: new Date().toISOString(),
      };
      setAvailabilitySlots([...availabilitySlots, newSlot]);
      setMessage({ type: 'success', text: 'Availability slot added to demo session.' });
    }
  };

  // Remove Availability Slot
  const handleRemoveAvailability = async (id: string) => {
    if (isLiveMode) {
      await removeAvailabilityServerAction(id);
    }
    setAvailabilitySlots(availabilitySlots.filter(s => s.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <AppHeader />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-20 flex items-center justify-center">
          <div className="text-sm text-[var(--text-secondary)] font-medium animate-pulse">
            Loading mentorship profile...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <AppHeader />

      <main className="flex-1 max-w-5xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Page Title & Account Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-default)]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Student Profile & Mentorship Settings
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Manage your academic profile, skills to teach, learning goals, and weekly peer availability.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isLiveMode ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                <ShieldCheck size={14} /> {isVerified ? 'Verified Siswa Student' : 'Email Verification Pending'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                <Sparkles size={14} /> Demo Persona Mode
              </span>
            )}
          </div>
        </div>

        {/* Status Alerts */}
        {message && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${
              message.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={16} className="shrink-0" /> : <AlertCircle size={16} className="shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] overflow-x-auto">
          <button
            onClick={() => { setActiveTab('profile'); setMessage(null); }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-[var(--bg-elevated)] text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <User size={14} /> Basic Profile
          </button>
          <button
            onClick={() => { setActiveTab('teach'); setMessage(null); }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              activeTab === 'teach'
                ? 'bg-[var(--bg-elevated)] text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <BookOpen size={14} /> Teachable Skills ({teachSkills.length})
          </button>
          <button
            onClick={() => { setActiveTab('learn'); setMessage(null); }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              activeTab === 'learn'
                ? 'bg-[var(--bg-elevated)] text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <GraduationCap size={14} /> Learning Goals ({learnSkills.length})
          </button>
          <button
            onClick={() => { setActiveTab('availability'); setMessage(null); }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              activeTab === 'availability'
                ? 'bg-[var(--bg-elevated)] text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Clock size={14} /> Availability ({availabilitySlots.length})
          </button>
        </div>

        {/* Tab 1: Profile Information */}
        {activeTab === 'profile' && (
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User size={18} className="text-teal-600 dark:text-teal-400" />
              Academic Profile Details
            </h2>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 max-w-xl">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  UM Siswa Email (Authoritative identifier)
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] text-sm opacity-70 cursor-not-allowed"
                />
                <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                  Student email cannot be modified directly once verified.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Faculty
                  </label>
                  <select
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value as Faculty)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs"
                  >
                    {UM_FACULTIES.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Year of Study
                  </label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs"
                  >
                    <option value={1}>Year 1</option>
                    <option value={2}>Year 2</option>
                    <option value={3}>Year 3</option>
                    <option value={4}>Year 4</option>
                    <option value={5}>Postgraduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Student Bio / Interests
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short bio or topics you love exploring..."
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Weekly Tutoring Cap (Hours per week)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0.5}
                    max={6.0}
                    step={0.5}
                    value={weeklyCap}
                    onChange={(e) => setWeeklyCap(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]">
                    {weeklyCap.toFixed(1)} hrs/week
                  </span>
                </div>
                <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                  Protects your study schedule and prevents peer tutoring burnout.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow transition-all disabled:opacity-50 flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
                >
                  <Save size={14} />
                  {saving ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Teachable Skills */}
        {activeTab === 'teach' && (
          <div className="flex flex-col gap-6">
            {/* Current Teachable Skills */}
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold mb-3 flex items-center gap-2">
                <BookOpen size={17} className="text-teal-600 dark:text-teal-400" />
                Your Teachable Skills
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mb-4">
                These skills represent what other UM students can request to learn from you in exchange for SkillCredits.
              </p>

              {teachSkills.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs text-[var(--text-secondary)]">
                  No teachable skills added yet. Use the form below to list a skill you can share.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {teachSkills.map(item => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-sm text-[var(--text-primary)]">
                          {item.skill?.title || 'Skill'}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                          {item.skill?.category} • <span className="font-semibold text-teal-600 dark:text-teal-400">{item.proficiency}</span>
                        </div>
                        {item.description && (
                          <p className="text-[11px] text-[var(--text-muted)] mt-1.5 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <div className="mt-2 text-[10px] text-[var(--text-secondary)]">
                          Mode: {item.preferred_mode}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveTeachSkill(item.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Remove skill"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Teachable Skill Form */}
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Plus size={16} className="text-teal-600 dark:text-teal-400" />
                Add a Skill You Can Mentor
              </h3>

              <form onSubmit={handleAddTeachSkill} className="flex flex-col gap-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Select Skill from Catalog
                  </label>
                  <select
                    value={selectedSkillId}
                    onChange={(e) => setSelectedSkillId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-sm"
                  >
                    {availableSkills.map(s => (
                      <option key={s.id} value={s.id}>{s.title} ({s.category})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      Proficiency Level
                    </label>
                    <select
                      value={proficiency}
                      onChange={(e) => setProficiency(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs"
                    >
                      <option value="Beginner">Beginner (Foundations)</option>
                      <option value="Intermediate">Intermediate (Project experience)</option>
                      <option value="Advanced">Advanced (Extensive / Exam ready)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      Preferred Mode
                    </label>
                    <select
                      value={skillMode}
                      onChange={(e) => setSkillMode(e.target.value as 'Online' | 'In-Person' | 'Both')}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs"
                    >
                      <option value="Both">Both (Online or In-Person)</option>
                      <option value="Online">Online Only (Google Meet)</option>
                      <option value="In-Person">In-Person Only (UM Campus)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Mentorship Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={skillDescription}
                    onChange={(e) => setSkillDescription(e.target.value)}
                    placeholder="e.g. Can guide Python syntax, OOP, or assignment debugging"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-fit px-4 py-2 rounded-xl font-bold text-xs text-white shadow transition-all flex items-center gap-1.5"
                  style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
                >
                  <Plus size={14} /> Add Teachable Skill
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 3: Learning Goals */}
        {activeTab === 'learn' && (
          <div className="flex flex-col gap-6">
            {/* Current Learning Goals */}
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold mb-3 flex items-center gap-2">
                <GraduationCap size={17} className="text-teal-600 dark:text-teal-400" />
                Your Learning Goals
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mb-4">
                Skills you want to acquire or improve. Our matching engine will automatically suggest reciprocal peer exchanges!
              </p>

              {learnSkills.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs text-[var(--text-secondary)]">
                  No learning goals added yet. Add a skill you want to learn to receive match recommendations.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {learnSkills.map(item => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-sm text-[var(--text-primary)]">
                          {item.skill?.title || 'Skill'}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                          {item.skill?.category} • Target Level: <span className="font-semibold text-teal-600 dark:text-teal-400">{item.proficiency}</span>
                        </div>
                        {item.description && (
                          <p className="text-[11px] text-[var(--text-muted)] mt-1.5 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleRemoveLearnSkill(item.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Remove goal"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Learning Goal Form */}
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Plus size={16} className="text-teal-600 dark:text-teal-400" />
                Add a Skill to Learn
              </h3>

              <form onSubmit={handleAddLearnSkill} className="flex flex-col gap-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Select Skill from Catalog
                  </label>
                  <select
                    value={selectedSkillId}
                    onChange={(e) => setSelectedSkillId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-sm"
                  >
                    {availableSkills.map(s => (
                      <option key={s.id} value={s.id}>{s.title} ({s.category})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Your Current Starting Level
                  </label>
                  <select
                    value={proficiency}
                    onChange={(e) => setProficiency(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs"
                  >
                    <option value="Beginner">Beginner (Starting from scratch)</option>
                    <option value="Intermediate">Intermediate (Looking for advanced tricks)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Specific Learning Outcome (Optional)
                  </label>
                  <input
                    type="text"
                    value={skillDescription}
                    onChange={(e) => setSkillDescription(e.target.value)}
                    placeholder="e.g. Want to build a presentation slide deck for final year project"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-fit px-4 py-2 rounded-xl font-bold text-xs text-white shadow transition-all flex items-center gap-1.5"
                  style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
                >
                  <Plus size={14} /> Save Learning Goal
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 4: Weekly Availability */}
        {activeTab === 'availability' && (
          <div className="flex flex-col gap-6">
            {/* Current Availability Schedule */}
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold mb-3 flex items-center gap-2">
                <Calendar size={17} className="text-teal-600 dark:text-teal-400" />
                Your Weekly Tutoring Availability
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mb-4">
                Peers can only request sessions during your active availability slots.
              </p>

              {availabilitySlots.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs text-[var(--text-secondary)]">
                  No availability slots configured. Add your free campus hours below so peers can book sessions with you.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {availabilitySlots.map(slot => (
                    <div
                      key={slot.id}
                      className="p-3.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-[var(--text-primary)]">
                          {slot.day_of_week}
                        </div>
                        <div className="text-xs font-mono text-teal-600 dark:text-teal-400 mt-0.5">
                          {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] mt-1">
                          {slot.mode}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveAvailability(slot.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Remove time slot"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Availability Form */}
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Plus size={16} className="text-teal-600 dark:text-teal-400" />
                Add Weekly Available Slot
              </h3>

              <form onSubmit={handleAddAvailability} className="flex flex-col gap-4 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      Day of Week
                    </label>
                    <select
                      value={dayOfWeek}
                      onChange={(e) => setDayOfWeek(e.target.value as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs"
                    >
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Session Mode
                  </label>
                  <select
                    value={availMode}
                    onChange={(e) => setAvailMode(e.target.value as 'Online' | 'In-Person' | 'Both')}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs max-w-xs"
                  >
                    <option value="Both">Both (Online or In-Person)</option>
                    <option value="Online">Online Only (Google Meet)</option>
                    <option value="In-Person">In-Person Only (UM Campus)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-fit px-4 py-2 rounded-xl font-bold text-xs text-white shadow transition-all flex items-center gap-1.5"
                  style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
                >
                  <Plus size={14} /> Add Slot
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
