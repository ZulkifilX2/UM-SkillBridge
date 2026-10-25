'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoStore } from '@/lib/store';
import { PublicNavbar } from '@/components/public-navbar';
import { Footer } from '@/components/footer';
import {
  Users, Sparkles, ArrowRight, ShieldCheck,
  CheckCircle2, BookOpen, GraduationCap, Coins, Mail, User as UserIcon
} from 'lucide-react';

const faculties = [
  'Computer Science',
  'Creative Arts',
  'Business & Economics',
  'Engineering',
  'Science',
  'Arts & Social Sciences',
  'Education',
  'Law',
  'Medicine',
  'Languages & Linguistics',
  'Built Environment',
] as const;

export default function LoginPage() {
  const router = useRouter();
  const { users, switchDemoUser, registerUser, skills } = useDemoStore();
  const [activeTab, setActiveTab] = useState<'persona' | 'register'>('persona');

  // Registration wizard state
  const [step, setStep] = useState<number>(1);
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [faculty, setFaculty] = useState<string>('Computer Science');
  const [yearOfStudy, setYearOfStudy] = useState<number>(2);
  const [bio, setBio] = useState<string>('Passionate UM student excited to share and exchange skills!');

  const [teachSkillId, setTeachSkillId] = useState<string>('sk-python');
  const [teachProficiency, setTeachProficiency] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Advanced');

  const [learnSkillId, setLearnSkillId] = useState<string>('sk-canva');
  const [learnProficiency, setLearnProficiency] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');

  const [formError, setFormError] = useState<string>('');
  const [successNewUser, setSuccessNewUser] = useState<boolean>(false);

  const handleSelectPersona = (userId: string) => {
    switchDemoUser(userId);
    router.push('/dashboard');
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (step === 1) {
      if (!displayName.trim()) {
        setFormError('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setFormError('Please provide a valid UM Siswa email (e.g. name@siswa.um.edu.my).');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      // Final submission
      const initials = displayName
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'UM';

      const user = registerUser(
        {
          displayName,
          email,
          faculty: faculty as any,
          yearOfStudy,
          bio,
          avatarInitials: initials,
          avatarColor: '#1769C2',
        },
        [{ skillId: teachSkillId, proficiency: teachProficiency }],
        [{ skillId: learnSkillId, proficiency: learnProficiency }]
      );

      setSuccessNewUser(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-28 pb-16 flex flex-col items-center">
        {/* Title & subtitle */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 mb-3">
            <ShieldCheck size={14} /> UM Siswa Identity Verification
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Enter UM SkillBridge
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Explore peer upskilling as a demo persona or create your own student profile.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] mb-8 w-full max-w-md gap-1">
          <button
            onClick={() => setActiveTab('persona')}
            id="tab-persona"
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all min-h-[40px] flex items-center justify-center ${
              activeTab === 'persona'
                ? 'bg-[var(--bg-elevated)] shadow-sm text-teal-600 dark:text-teal-400 font-extrabold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            1-Click Demo Personas
          </button>
          <button
            onClick={() => setActiveTab('register')}
            id="tab-register"
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all min-h-[40px] flex items-center justify-center ${
              activeTab === 'register'
                ? 'bg-[var(--bg-elevated)] shadow-sm text-teal-600 dark:text-teal-400 font-extrabold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Register Student Wizard
          </button>
        </div>

        {activeTab === 'persona' ? (
          /* Demo Persona Grid */
          <div className="w-full max-w-2xl flex flex-col gap-3">
            <div className="text-xs text-[var(--text-secondary)] text-center mb-1">
              Select any student persona to test real reciprocal matches, credit ledgers, and booking:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {users.map(u => (
                <button
                  key={u.id}
                  id={`login-user-${u.id}`}
                  onClick={() => handleSelectPersona(u.id)}
                  className="group p-4 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-elevated)] hover:border-teal-500/50 hover:shadow-md transition-all text-left flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
                        style={{ backgroundColor: u.avatarColor }}
                      >
                        {u.avatarInitials}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[var(--text-primary)] group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {u.displayName}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">
                          {u.faculty} • Year {u.yearOfStudy}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      Active
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                    {u.bio}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--border-default)] text-xs text-teal-600 dark:text-teal-400 font-semibold">
                    <span>Sign in as {u.displayName}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Student Registration Wizard */
          <div className="w-full max-w-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-2xl p-6 shadow-xl">
            {/* Step indicator */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-default)] text-xs font-semibold">
              <span className={step >= 1 ? 'text-teal-600 dark:text-teal-400' : 'text-[var(--text-muted)]'}>1. Identity</span>
              <span className={step >= 2 ? 'text-teal-600 dark:text-teal-400' : 'text-[var(--text-muted)]'}>2. Teach</span>
              <span className={step >= 3 ? 'text-teal-600 dark:text-teal-400' : 'text-[var(--text-muted)]'}>3. Learn</span>
              <span className={step >= 4 ? 'text-teal-600 dark:text-teal-400' : 'text-[var(--text-muted)]'}>4. Community</span>
            </div>

            {successNewUser ? (
              <div className="py-8 text-center flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-bounce">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold">Welcome to UM SkillBridge!</h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  1.0 Introductory SkillCredit has been deposited in your wallet.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNextStep} className="flex flex-col gap-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
                    {formError}
                  </div>
                )}

                {step === 1 && (
                  <>
                    <div>
                      <label htmlFor="reg-name" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                        Full Name
                      </label>
                      <input
                        id="reg-name"
                        type="text"
                        placeholder="e.g. Nur Farhana"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="reg-email" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                        UM Siswa Email
                      </label>
                      <input
                        id="reg-email"
                        type="email"
                        placeholder="e.g. farhana@siswa.um.edu.my"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-sm"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="reg-faculty" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                          Faculty
                        </label>
                        <select
                          id="reg-faculty"
                          value={faculty}
                          onChange={(e) => setFaculty(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs"
                        >
                          {faculties.map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="reg-year" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                          Year of Study
                        </label>
                        <select
                          id="reg-year"
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
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="text-xs text-[var(--text-secondary)]">
                      What skill can you mentor or share with fellow UM students?
                    </div>

                    <div>
                      <label htmlFor="reg-teach-skill" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                        Primary Skill to Teach
                      </label>
                      <select
                        id="reg-teach-skill"
                        value={teachSkillId}
                        onChange={(e) => setTeachSkillId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-sm"
                      >
                        {skills.map(s => (
                          <option key={s.id} value={s.id}>{s.title} ({s.category})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="reg-teach-prof" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                        Your Proficiency
                      </label>
                      <select
                        id="reg-teach-prof"
                        value={teachProficiency}
                        onChange={(e) => setTeachProficiency(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs"
                      >
                        <option value="Intermediate">Intermediate (Can guide beginners)</option>
                        <option value="Advanced">Advanced (Extensive project/exam experience)</option>
                      </select>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="text-xs text-[var(--text-secondary)]">
                      What skill do you want to learn from another UM student?
                    </div>

                    <div>
                      <label htmlFor="reg-learn-skill" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                        Skill to Learn
                      </label>
                      <select
                        id="reg-learn-skill"
                        value={learnSkillId}
                        onChange={(e) => setLearnSkillId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-sm"
                      >
                        {skills.map(s => (
                          <option key={s.id} value={s.id}>{s.title} ({s.category})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="reg-learn-prof" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                        Current Starting Level
                      </label>
                      <select
                        id="reg-learn-prof"
                        value={learnProficiency}
                        onChange={(e) => setLearnProficiency(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs"
                      >
                        <option value="Beginner">Beginner (Starting from scratch)</option>
                        <option value="Intermediate">Intermediate (Looking for advanced tricks)</option>
                      </select>
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 flex flex-col gap-2">
                      <div className="flex items-center gap-2 font-bold text-teal-700 dark:text-teal-300 text-sm">
                        <Coins size={16} /> 1.0 Welcome SkillCredit Grant
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Every verified UM student receives 1 introductory credit to book their first 60-minute peer learning session immediately.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs flex flex-col gap-2">
                      <div className="font-semibold text-[var(--text-primary)]">UM Peer Community Pledge:</div>
                      <ul className="list-disc pl-4 space-y-1 text-[var(--text-secondary)]">
                        <li>I will arrive on time and respect fellow students' learning time.</li>
                        <li>No monetary transactions or commercial solicitations.</li>
                        <li>Maintain academic integrity (no ghostwriting or cheating).</li>
                      </ul>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between pt-2">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-4 py-2 text-xs font-semibold rounded-xl hover:bg-[var(--bg-tertiary)]"
                    >
                      Back
                    </button>
                  ) : <div></div>}

                  <button
                    type="submit"
                    id="btn-register-next"
                    className="px-5 py-2.5 text-xs font-bold rounded-xl text-white shadow"
                    style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
                  >
                    {step === 4 ? 'Complete Registration & Claim 1.0 Cr' : 'Continue'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
