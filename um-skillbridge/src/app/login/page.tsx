'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoStore } from '@/lib/store';
import { PublicNavbar } from '@/components/public-navbar';
import { Footer } from '@/components/footer';
import { signUpAction, signInAction, resetPasswordAction } from '@/app/auth/actions';
import { isSiswaEmail, UM_FACULTIES, Faculty } from '@/lib/validators';
import {
  ArrowRight, ShieldCheck, CheckCircle2,
  Coins, Mail, Lock, AlertCircle, Info, Sparkles, KeyRound
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { users, switchDemoUser } = useDemoStore();

  // Primary mode: 'account' (production Supabase Auth) vs 'persona' (hackathon demo personas)
  const [activeTab, setActiveTab] = useState<'account' | 'persona'>('account');
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');

  // Production Auth form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [faculty, setFaculty] = useState<Faculty>('Computer Science');
  const [yearOfStudy, setYearOfStudy] = useState(2);
  const [bio, setBio] = useState('Passionate UM student excited to share and exchange skills!');

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [emailVerificationPending, setEmailVerificationPending] = useState(false);

  // Quick helper for demo personas
  const handleSelectPersona = (userId: string) => {
    switchDemoUser(userId);
    router.push('/dashboard');
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccessMessage('');

    // Strict validation for Siswa email
    if (!isSiswaEmail(email)) {
      setFormError('Please enter a valid Universiti Malaya student email ending with @siswa.um.edu.my');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('email', email);

    if (authMode === 'forgot') {
      const res = await resetPasswordAction(formData);
      setLoading(false);
      if (!res.success) {
        setFormError(res.error || 'Could not send recovery link.');
      } else {
        setFormSuccessMessage(res.message || 'Recovery link sent.');
      }
      return;
    }

    formData.append('password', password);

    if (authMode === 'signin') {
      const res = await signInAction(formData);
      setLoading(false);
      if (!res.success) {
        if (res.requiresEmailConfirmation) {
          setEmailVerificationPending(true);
        }
        setFormError(res.error || 'Failed to sign in.');
      } else {
        router.push('/dashboard');
      }
      return;
    }

    if (authMode === 'signup') {
      if (!displayName.trim()) {
        setLoading(false);
        setFormError('Please enter your full name.');
        return;
      }
      if (password.length < 8) {
        setLoading(false);
        setFormError('Password must be at least 8 characters.');
        return;
      }

      formData.append('displayName', displayName);
      formData.append('faculty', faculty);
      formData.append('yearOfStudy', yearOfStudy.toString());
      formData.append('bio', bio);

      const res = await signUpAction(formData);
      setLoading(false);
      if (!res.success) {
        setFormError(res.error || 'Registration failed.');
      } else {
        if (res.requiresEmailConfirmation) {
          setEmailVerificationPending(true);
          setFormSuccessMessage(res.message || 'Please check your student webmail for verification.');
        } else {
          router.push('/dashboard');
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-28 pb-16 flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 mb-3">
            <ShieldCheck size={14} /> UM Student Identity & Peer Verification
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Enter UM SkillBridge
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Sign in with your verified UM Siswa email or explore the interactive demo personas.
          </p>
        </div>

        {/* Tab switch between Production Account and Demo Rig */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] mb-8 w-full max-w-md gap-1">
          <button
            onClick={() => { setActiveTab('account'); setFormError(''); }}
            id="tab-account"
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all min-h-[40px] flex items-center justify-center gap-1.5 ${
              activeTab === 'account'
                ? 'bg-[var(--bg-elevated)] shadow-sm text-teal-600 dark:text-teal-400 font-extrabold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <ShieldCheck size={14} /> Student Account
          </button>
          <button
            onClick={() => { setActiveTab('persona'); setFormError(''); }}
            id="tab-persona"
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all min-h-[40px] flex items-center justify-center gap-1.5 ${
              activeTab === 'persona'
                ? 'bg-[var(--bg-elevated)] shadow-sm text-teal-600 dark:text-teal-400 font-extrabold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Sparkles size={14} /> 1-Click Demo Personas
          </button>
        </div>

        {activeTab === 'account' ? (
          /* ========================================================== */
          /* Production Student Auth Card */
          /* ========================================================== */
          <div className="w-full max-w-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
            {/* Disclaimer & Transparency Note */}
            <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-200 flex items-start gap-2.5 leading-relaxed">
              <Info size={16} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Student Domain Verification: </span>
                Registration requires a valid <span className="font-mono font-semibold">@siswa.um.edu.my</span> webmail address.
                <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
                  Note: UM SkillBridge is an independent student peer initiative and is not an official UM administration system or SSO service. Verification is completed via webmail confirmation link.
                </p>
              </div>
            </div>

            {/* Sub-modes: Sign In, Register, Forgot Password */}
            <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3 text-xs">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setFormError(''); setFormSuccessMessage(''); }}
                  className={`font-bold transition-colors pb-1 border-b-2 ${
                    authMode === 'signin'
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setFormError(''); setFormSuccessMessage(''); }}
                  className={`font-bold transition-colors pb-1 border-b-2 ${
                    authMode === 'signup'
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Register
                </button>
              </div>

              {authMode !== 'forgot' && (
                <button
                  type="button"
                  onClick={() => { setAuthMode('forgot'); setFormError(''); setFormSuccessMessage(''); }}
                  className="text-[11px] text-[var(--text-muted)] hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Forgot password?
                </button>
              )}
            </div>

            {/* Error & Success Alerts */}
            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccessMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{formSuccessMessage}</div>
              </div>
            )}

            {emailVerificationPending ? (
              <div className="py-6 text-center flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Mail size={30} />
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">Check Your Siswa Webmail</h3>
                <p className="text-xs text-[var(--text-secondary)] max-w-sm">
                  We sent a confirmation link to <span className="font-mono font-semibold text-teal-600 dark:text-teal-400">{email}</span>. Please click the link in your email to verify your student identity and unlock your 1.0 Welcome SkillCredit.
                </p>
                <button
                  type="button"
                  onClick={() => { setEmailVerificationPending(false); setAuthMode('signin'); }}
                  className="mt-2 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleAccountSubmit} className="flex flex-col gap-4">
                {authMode === 'signup' && (
                  <div>
                    <label htmlFor="input-name" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      Full Name
                    </label>
                    <input
                      id="input-name"
                      type="text"
                      placeholder="e.g. Nur Farhana"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-sm"
                      required
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="input-email" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    UM Siswa Email (@siswa.um.edu.my)
                  </label>
                  <div className="relative">
                    <input
                      id="input-email"
                      type="email"
                      placeholder="username@siswa.um.edu.my"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-sm"
                      required
                    />
                    <Mail size={16} className="absolute left-3 top-2.5 text-[var(--text-muted)]" />
                  </div>
                  {email && !isSiswaEmail(email) && (
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 block">
                      Must end in @siswa.um.edu.my
                    </span>
                  )}
                </div>

                {authMode !== 'forgot' && (
                  <div>
                    <label htmlFor="input-password" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      Password {authMode === 'signup' ? '(min 8 characters)' : ''}
                    </label>
                    <div className="relative">
                      <input
                        id="input-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-sm"
                        required
                      />
                      <Lock size={16} className="absolute left-3 top-2.5 text-[var(--text-muted)]" />
                    </div>
                  </div>
                )}

                {authMode === 'signup' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="input-faculty" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                          Faculty
                        </label>
                        <select
                          id="input-faculty"
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
                        <label htmlFor="input-year" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                          Year of Study
                        </label>
                        <select
                          id="input-year"
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
                      <label htmlFor="input-bio" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                        Student Bio
                      </label>
                      <textarea
                        id="input-bio"
                        rows={2}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Brief bio or academic interests..."
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs flex flex-col gap-1.5">
                      <div className="font-semibold text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
                        <Coins size={14} /> 1.0 Welcome SkillCredit Grant
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        Upon confirming your email, 1.0 introductory credit is deposited into your wallet for your first peer learning session.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[11px] text-[var(--text-secondary)]">
                      <span className="font-semibold text-[var(--text-primary)]">UM Peer Community Pledge: </span>
                      By registering, you commit to punctuality, mutual respect, no commercial solicitations, and strict academic integrity.
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  id="btn-submit-account"
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-white shadow transition-all disabled:opacity-50 mt-1 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
                >
                  {loading ? (
                    'Processing...'
                  ) : authMode === 'signup' ? (
                    'Register with UM Siswa'
                  ) : authMode === 'signin' ? (
                    'Sign In to SkillBridge'
                  ) : (
                    'Send Password Reset Link'
                  )}
                  {!loading && authMode === 'forgot' && <KeyRound size={14} />}
                  {!loading && authMode !== 'forgot' && <ArrowRight size={14} />}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* ========================================================== */
          /* Demo Persona Grid (Preserved for Hackathon Offline Evaluation) */
          /* ========================================================== */
          <div className="w-full max-w-2xl flex flex-col gap-3">
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2 mb-2 leading-relaxed">
              <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Offline Hackathon Evaluation Mode: </span>
                Select any verified student persona below to test reciprocal matching, credit transfers, and session booking without needing an active UM email:
              </div>
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
                      Demo Persona
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
        )}
      </main>

      <Footer />
    </div>
  );
}
