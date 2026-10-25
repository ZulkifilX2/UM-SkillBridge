'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDemoStore } from '@/lib/store';
import { AppHeader } from '@/components/app-header';
import { BookingModal } from '@/components/booking-modal';
import { FeedbackModal } from '@/components/feedback-modal';
import { Footer } from '@/components/footer';
import {
  Coins, Sparkles, Calendar, BookOpen, Clock, ArrowRight,
  CheckCircle2, ArrowRightLeft, ShieldCheck, Star,
  Award
} from 'lucide-react';

export default function DashboardPage() {
  const {
    currentUserId,
    getCurrentUser,
    getUserBalance,
    getUserSkills,
    getUserSessions,
    getUserMatches,
    skills,
    users,
    simulateSessionCompletion,
    acceptSession,
    cancelSession,
  } = useDemoStore();

  const user = getCurrentUser() || users[0];
  const balance = user ? getUserBalance(user.id) : { available: 0, reserved: 0, totalEarned: 0, totalSpent: 0 };
  const userTeachSkills = user ? getUserSkills(user.id, 'teach') : [];
  const userLearnSkills = user ? getUserSkills(user.id, 'learn') : [];
  const sessions = user ? getUserSessions(user.id) : [];
  const matches = user ? getUserMatches(user.id) : [];

  // Modals state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState<string | undefined>();
  const [selectedSkillId, setSelectedSkillId] = useState<string | undefined>();
  const [feedbackSessionId, setFeedbackSessionId] = useState<string | null>(null);

  const openBooking = (mentorId?: string, skillId?: string) => {
    setSelectedMentorId(mentorId);
    setSelectedSkillId(skillId);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8 pb-28 sm:pb-16">
        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--border-default)] p-5 sm:p-8 bg-gradient-to-br from-[#092C5B] via-[#0A2647] to-[#0C9D9A]/30 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-2xl font-black text-white shadow-lg shrink-0 border-2 border-white/20"
                style={{ backgroundColor: user?.avatarColor || '#0C9D9A' }}
              >
                {user?.avatarInitials}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight !text-white leading-tight">
                    Welcome back, {user?.displayName}!
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    <ShieldCheck size={11} /> UM Siswa
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
                  {user?.faculty} • Year {user?.yearOfStudy} • &ldquo;{user?.bio}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
              <button
                id="btn-dashboard-book-session"
                onClick={() => openBooking()}
                className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs text-white shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
              >
                <Calendar size={15} /> Book a Session
              </button>
              <Link
                href="/explore"
                id="btn-dashboard-explore"
                className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-semibold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors flex items-center justify-center gap-1.5"
              >
                <BookOpen size={15} /> Explore Skills
              </Link>
            </div>
          </div>
        </section>

        {/* SkillCredits Wallet Snapshot & Metrics */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Available Credits Card */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-[var(--text-secondary)] mb-1 sm:mb-2">
              <span>Available</span>
              <Coins size={15} className="text-teal-600 dark:text-teal-400 shrink-0" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-teal-600 dark:text-teal-400">
                {balance.available.toFixed(1)}
              </span>
              <span className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-medium">Credits</span>
            </div>
            <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-3 border-t border-[var(--border-default)] flex items-center justify-between text-[10px] sm:text-xs">
              <span className="text-[var(--text-muted)] truncate max-w-[90px] sm:max-w-none">
                {balance.reserved > 0 ? `${balance.reserved.toFixed(1)} res` : '0 in escrow'}
              </span>
              <Link href="/wallet" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline flex items-center gap-0.5 shrink-0">
                Ledger <ArrowRight size={11} />
              </Link>
            </div>
          </div>

          {/* Tutoring Hours Shared */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-[var(--text-secondary)] mb-1 sm:mb-2">
              <span>Earned</span>
              <Award size={15} className="text-amber-500 shrink-0" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text-primary)]">
                {balance.totalEarned.toFixed(1)}
              </span>
              <span className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-medium">Hours</span>
            </div>
            <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-3 border-t border-[var(--border-default)] text-[10px] sm:text-xs text-[var(--text-muted)] truncate">
              1 hr taught = 1 credit
            </div>
          </div>

          {/* Academic Safeguard Cap */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-[var(--text-secondary)] mb-1 sm:mb-2">
              <span>Weekly Cap</span>
              <Clock size={15} className="text-blue-500 shrink-0" />
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-lg sm:text-xl font-bold font-mono text-[var(--text-primary)]">
                  {user?.weeklyTutoringUsedHours || 0} / {user?.weeklyTutoringCapHours || 2}h
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Healthy</span>
              </div>
              <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-1.5 sm:h-2 overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full"
                  style={{ width: `${((user?.weeklyTutoringUsedHours || 0) / (user?.weeklyTutoringCapHours || 2)) * 100}%` }}
                />
              </div>
            </div>
            <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-3 border-t border-[var(--border-default)] text-[10px] sm:text-[11px] text-[var(--text-muted)] truncate">
              Protects GPA focus
            </div>
          </div>

          {/* Reciprocal Matches Count */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-[var(--text-secondary)] mb-1 sm:mb-2">
              <span>Matches</span>
              <Sparkles size={15} className="text-purple-500 shrink-0" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-600 dark:text-purple-400">
                {matches.length}
              </span>
              <span className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-medium">Peers</span>
            </div>
            <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-3 border-t border-[var(--border-default)] flex items-center justify-between text-[10px] sm:text-xs">
              <span className="text-[var(--text-muted)] truncate">
                {matches.filter(m => m.isReciprocal).length} reciprocal
              </span>
              <Link href="/matches" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline flex items-center gap-0.5 shrink-0">
                View <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </section>

        {/* Reciprocal Matches Spotlight */}
        <section className="flex flex-col gap-3.5 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <Sparkles size={18} className="text-teal-600 dark:text-teal-400 shrink-0" />
                Recommended Reciprocal Peer Matches
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Students who teach what you want to learn, and learn what you teach.
              </p>
            </div>
            <Link
              href="/matches"
              id="link-all-matches"
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              All Matches ({matches.length}) <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.slice(0, 3).map(match => {
              const mentor = users.find(u => u.id === match.mentorId);
              const skill = skills.find(s => s.id === match.skillId);
              const recSkill = match.reciprocalSkillId ? skills.find(s => s.id === match.reciprocalSkillId) : undefined;

              return (
                <div
                  key={match.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm hover:border-teal-500/40 hover:shadow-md transition-all flex flex-col justify-between gap-3.5"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm shrink-0"
                          style={{ backgroundColor: mentor?.avatarColor || '#0C9D9A' }}
                        >
                          {mentor?.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-[var(--text-primary)] truncate">
                            {mentor?.displayName}
                          </h3>
                          <div className="text-xs text-[var(--text-secondary)] truncate">
                            {mentor?.faculty}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {match.compatibilityScore}%
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] mt-0.5">Match</span>
                      </div>
                    </div>

                    <div className="p-2.5 sm:p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs flex flex-col gap-1.5 mb-2">
                      <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
                        <span className="text-teal-600 dark:text-teal-400 shrink-0">Teaches:</span>
                        <span className="truncate">{skill?.title}</span>
                      </div>
                      {match.isReciprocal && recSkill && (
                        <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium pt-1 border-t border-[var(--border-default)]">
                          <ArrowRightLeft size={13} className="shrink-0" />
                          <span className="truncate">Learns from you: {recSkill.title}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {match.explanation}
                    </p>
                  </div>

                  <button
                    id={`btn-match-book-${match.id}`}
                    onClick={() => openBooking(match.mentorId, match.skillId)}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-white shadow transition-all hover:shadow-md flex items-center justify-center gap-1.5 min-h-[42px]"
                    style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
                  >
                    <Calendar size={14} /> Book Session with {mentor?.displayName}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Sessions Section */}
        <section className="flex flex-col gap-3.5 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <Calendar size={18} className="text-teal-600 dark:text-teal-400 shrink-0" />
                My Peer Sessions
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Active bookings, requests, and verified session completions.
              </p>
            </div>
            <Link
              href="/sessions"
              id="link-all-sessions"
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              Session Manager ({sessions.length}) <ArrowRight size={14} />
            </Link>
          </div>

          {sessions.length === 0 ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-center flex flex-col items-center gap-2">
              <Calendar size={28} className="text-[var(--text-muted)]" />
              <div className="font-semibold text-sm">No sessions booked yet</div>
              <p className="text-xs text-[var(--text-secondary)] max-w-sm">
                Connect with peer mentors to learn Python, Canva, Excel, Mandarin, or public speaking.
              </p>
              <button
                onClick={() => openBooking()}
                className="mt-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow"
                style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
              >
                Book Your First Session
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessions.slice(0, 4).map(ses => {
                const isMentor = ses.mentorId === user?.id;
                const counterpart = users.find(u => u.id === (isMentor ? ses.learnerId : ses.mentorId));
                const skill = skills.find(s => s.id === ses.skillId);

                return (
                  <div
                    key={ses.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm flex flex-col justify-between gap-3.5"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          ses.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : ses.status === 'Requested'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        }`}>
                          {ses.status}
                        </span>

                        <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                          {ses.creditCost} SkillCredit
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-2.5 min-w-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-sm shrink-0"
                          style={{ backgroundColor: counterpart?.avatarColor || '#0C9D9A' }}
                        >
                          {counterpart?.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-[var(--text-primary)] truncate">
                            {skill?.title}
                          </div>
                          <div className="text-xs text-[var(--text-secondary)] truncate">
                            {isMentor ? `Teaching ${counterpart?.displayName}` : `Learning from ${counterpart?.displayName}`}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] p-2.5 rounded-xl border border-[var(--border-default)]">
                        <div>
                          <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">Mode</span>
                          <span className="truncate block">{ses.mode}</span>
                        </div>
                        <div>
                          <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">Duration</span>
                          <span>{ses.duration} mins</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">Location / Link</span>
                          <span className="truncate block">{ses.location || 'Google Meet'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-[var(--border-default)]">
                      {ses.status === 'Requested' && (
                        <>
                          {isMentor ? (
                            <button
                              id={`btn-accept-session-${ses.id}`}
                              onClick={() => acceptSession(ses.id)}
                              className="w-full sm:flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow min-h-[40px]"
                            >
                              Accept Request
                            </button>
                          ) : (
                            <button
                              id={`btn-cancel-session-${ses.id}`}
                              onClick={() => cancelSession(ses.id)}
                              className="w-full sm:w-auto px-3 py-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 text-xs font-semibold min-h-[40px]"
                            >
                              Cancel Booking
                            </button>
                          )}
                          <button
                            id={`btn-simulate-complete-${ses.id}`}
                            onClick={() => simulateSessionCompletion(ses.id)}
                            className="w-full sm:flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-xs font-bold shadow hover:shadow-md min-h-[40px]"
                          >
                            Simulate Completion
                          </button>
                        </>
                      )}

                      {['Accepted', 'Confirmed'].includes(ses.status) && (
                        <button
                          id={`btn-complete-session-${ses.id}`}
                          onClick={() => simulateSessionCompletion(ses.id)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-xs font-bold shadow flex items-center justify-center gap-1.5 min-h-[42px]"
                        >
                          <CheckCircle2 size={14} /> Complete Session & Settle Escrow
                        </button>
                      )}

                      {ses.status === 'Completed' && (
                        <button
                          id={`btn-review-session-${ses.id}`}
                          onClick={() => setFeedbackSessionId(ses.id)}
                          className="w-full py-2.5 rounded-xl border border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] text-xs font-semibold flex items-center justify-center gap-1.5 min-h-[42px]"
                        >
                          <Star size={14} className="text-amber-500 fill-amber-500" /> Leave / View Review
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* My Skills Profile Summary */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
              Skills I Can Teach (Mentoring)
            </h3>
            <div className="flex flex-wrap gap-2">
              {userTeachSkills.length > 0 ? (
                userTeachSkills.map(us => (
                  <span
                    key={us.skillId}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20"
                  >
                    {us.skill.title} • {us.proficiency}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[var(--text-muted)]">No teaching skills listed</span>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Skills I Am Learning
            </h3>
            <div className="flex flex-wrap gap-2">
              {userLearnSkills.length > 0 ? (
                userLearnSkills.map(us => (
                  <span
                    key={us.skillId}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                  >
                    {us.skill.title} • {us.proficiency}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[var(--text-muted)]">No learning goals listed</span>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        preselectedMentorId={selectedMentorId}
        preselectedSkillId={selectedSkillId}
      />

      {/* Feedback Modal */}
      {feedbackSessionId && (
        <FeedbackModal
          isOpen={true}
          onClose={() => setFeedbackSessionId(null)}
          sessionId={feedbackSessionId}
        />
      )}
    </div>
  );
}
