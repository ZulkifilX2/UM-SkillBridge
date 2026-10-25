'use client';

import { useState } from 'react';
import { useDemoStore } from '@/lib/store';
import { AppHeader } from '@/components/app-header';
import { BookingModal } from '@/components/booking-modal';
import { FeedbackModal } from '@/components/feedback-modal';
import { Footer } from '@/components/footer';
import {
  Calendar, MapPin, Video, CheckCircle2,
  Star, Plus
} from 'lucide-react';

export default function SessionsPage() {
  const {
    currentUserId,
    getUserSessions,
    users,
    skills,
    simulateSessionCompletion,
    acceptSession,
    cancelSession,
  } = useDemoStore();

  const sessions = currentUserId ? getUserSessions(currentUserId) : [];

  const [activeTab, setActiveTab] = useState<'All' | 'Requested' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');

  const [bookingOpen, setBookingOpen] = useState(false);
  const [feedbackSessionId, setFeedbackSessionId] = useState<string | null>(null);

  const filteredSessions = sessions.filter(s => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Confirmed') return ['Confirmed', 'Accepted'].includes(s.status);
    return s.status === activeTab;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6 pb-28 sm:pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 border-b border-[var(--border-default)] pb-4 sm:pb-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-2">
              <Calendar size={13} /> Peer Session Lifecycle
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight break-words leading-tight">
              Manage Upskilling Sessions
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Track requests, coordinate schedules, and simulate verified session completion for SkillCredits escrow settlement.
            </p>
          </div>

          <button
            id="btn-book-new-session"
            onClick={() => setBookingOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow transition-all hover:shadow-md flex items-center justify-center gap-1.5 shrink-0 min-h-[42px]"
            style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
          >
            <Plus size={15} /> Book New Session
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
          {(['All', 'Requested', 'Confirmed', 'Completed', 'Cancelled'] as const).map(tab => {
            const count = sessions.filter(s => {
              if (tab === 'All') return true;
              if (tab === 'Confirmed') return ['Confirmed', 'Accepted'].includes(s.status);
              return s.status === tab;
            }).length;

            return (
              <button
                key={tab}
                id={`tab-session-${tab.toLowerCase()}`}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 min-h-[36px] flex items-center ${
                  activeTab === tab
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : 'border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-center flex flex-col items-center gap-3">
            <Calendar size={32} className="text-[var(--text-muted)]" />
            <h3 className="font-bold text-base">No {activeTab.toLowerCase()} sessions</h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm">
              Book a new peer mentoring session or switch filters to view completed exchanges.
            </p>
            <button
              onClick={() => setBookingOpen(true)}
              className="mt-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow min-h-[42px]"
              style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
            >
              Book a Session Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSessions.map(ses => {
              const isMentor = ses.mentorId === currentUserId;
              const counterpart = users.find(u => u.id === (isMentor ? ses.learnerId : ses.mentorId));
              const skill = skills.find(s => s.id === ses.skillId);

              const formattedDate = new Date(ses.scheduledTime).toLocaleDateString('en-MY', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });
              const formattedTime = new Date(ses.scheduledTime).toLocaleTimeString('en-MY', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={ses.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm hover:border-teal-500/40 transition-all flex flex-col justify-between gap-3.5"
                >
                  <div>
                    {/* Status & Credit Cost */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        ses.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : ses.status === 'Requested'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : ses.status === 'Cancelled'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                      }`}>
                        {ses.status}
                      </span>

                      <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                        {ses.creditCost} SkillCredit ({ses.duration} mins)
                      </span>
                    </div>

                    {/* Counterpart info */}
                    <div className="flex items-center gap-3 mb-2.5 min-w-0">
                      <div
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0"
                        style={{ backgroundColor: counterpart?.avatarColor || '#0C9D9A' }}
                      >
                        {counterpart?.avatarInitials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm sm:text-base text-[var(--text-primary)] truncate">
                          {skill?.title}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] truncate">
                          {isMentor ? `Teaching ${counterpart?.displayName}` : `Learning from ${counterpart?.displayName}`} • {counterpart?.faculty}
                        </div>
                      </div>
                    </div>

                    {/* Details Box */}
                    <div className="p-2.5 sm:p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs flex flex-col gap-2 mb-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[var(--text-secondary)] shrink-0">
                          <Calendar size={13} className="text-teal-600 dark:text-teal-400" /> Date & Time:
                        </span>
                        <span className="font-semibold truncate ml-2">{formattedDate} at {formattedTime}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[var(--text-secondary)] shrink-0">
                          {ses.mode === 'Online' ? <Video size={13} className="text-blue-500" /> : <MapPin size={13} className="text-amber-500" />} Mode & Location:
                        </span>
                        <span className="font-semibold truncate max-w-[180px] sm:max-w-[220px] ml-2">{ses.location || ses.mode}</span>
                      </div>

                      {ses.learningGoals && (
                        <div className="pt-1.5 border-t border-[var(--border-default)]">
                          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-0.5">Goals</span>
                          <span className="text-[var(--text-secondary)] italic line-clamp-2">{ses.learningGoals}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-[var(--border-default)]">
                    {ses.status === 'Requested' && (
                      <>
                        {isMentor ? (
                          <button
                            id={`btn-session-accept-${ses.id}`}
                            onClick={() => acceptSession(ses.id)}
                            className="w-full sm:flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow min-h-[42px]"
                          >
                            Accept Session Request
                          </button>
                        ) : (
                          <button
                            id={`btn-session-cancel-${ses.id}`}
                            onClick={() => cancelSession(ses.id)}
                            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 text-xs font-semibold min-h-[42px]"
                          >
                            Cancel & Refund Escrow
                          </button>
                        )}
                        <button
                          id={`btn-session-simulate-${ses.id}`}
                          onClick={() => simulateSessionCompletion(ses.id)}
                          className="w-full sm:flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-xs font-bold shadow hover:shadow-md min-h-[42px]"
                        >
                          Simulate Completion
                        </button>
                      </>
                    )}

                    {['Accepted', 'Confirmed'].includes(ses.status) && (
                      <>
                        <button
                          id={`btn-session-cancel-confirmed-${ses.id}`}
                          onClick={() => cancelSession(ses.id)}
                          className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 text-xs font-semibold min-h-[42px]"
                        >
                          Cancel
                        </button>
                        <button
                          id={`btn-session-complete-confirmed-${ses.id}`}
                          onClick={() => simulateSessionCompletion(ses.id)}
                          className="w-full sm:flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-xs font-bold shadow flex items-center justify-center gap-1.5 min-h-[42px]"
                        >
                          <CheckCircle2 size={14} /> Complete Session & Settle Escrow
                        </button>
                      </>
                    )}

                    {ses.status === 'Completed' && (
                      <button
                        id={`btn-session-feedback-${ses.id}`}
                        onClick={() => setFeedbackSessionId(ses.id)}
                        className="w-full py-2.5 rounded-xl border border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] text-xs font-semibold flex items-center justify-center gap-1.5 min-h-[42px]"
                      >
                        <Star size={14} className="text-amber-500 fill-amber-500" /> Leave / View Feedback Review
                      </button>
                    )}

                    {ses.status === 'Cancelled' && (
                      <div className="w-full text-center text-xs text-rose-500 font-medium py-1">
                        Session was cancelled • Credits refunded to learner
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
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
