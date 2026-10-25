'use client';

import { useState } from 'react';
import { useDemoStore } from '@/lib/store';
import {
  X, Calendar, Clock, MapPin, Video, CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedMentorId?: string;
  preselectedSkillId?: string;
  onSuccess?: (sessionId: string) => void;
}

export function BookingModal({
  isOpen,
  onClose,
  preselectedMentorId,
  preselectedSkillId,
  onSuccess,
}: BookingModalProps) {
  const {
    currentUserId,
    users,
    skills,
    userSkills,
    availability,
    getUserBalance,
    bookSession,
  } = useDemoStore();

  const balance = currentUserId ? getUserBalance(currentUserId) : { available: 0, reserved: 0 };
  const availableMentors = users.filter(u => u.id !== currentUserId);

  const [mentorId, setMentorId] = useState<string>(preselectedMentorId || (availableMentors[0]?.id || ''));
  const [skillId, setSkillId] = useState<string>(preselectedSkillId || 'sk-canva');
  const [duration, setDuration] = useState<number>(60);
  const [mode, setMode] = useState<'Online' | 'In-Person'>('Online');
  const [location, setLocation] = useState<string>('UM Central Library, Level 3 Study Pods');
  const [scheduledDate, setScheduledDate] = useState<string>('2026-10-28');
  const [scheduledTime, setScheduledTime] = useState<string>('14:00');
  const [learningGoals, setLearningGoals] = useState<string>('Learn core fundamentals, hands-on practice, and practical project tips');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successResult, setSuccessResult] = useState<boolean>(false);

  if (!isOpen) return null;

  const cost = duration / 60;
  const hasEnoughCredit = balance.available >= cost;

  const mentorSkills = userSkills
    .filter(us => us.userId === mentorId && us.relationship === 'teach')
    .map(us => skills.find(s => s.id === us.skillId))
    .filter(Boolean);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!mentorId) {
      setErrorMsg('Please select a peer mentor.');
      return;
    }
    if (!skillId) {
      setErrorMsg('Please select a skill.');
      return;
    }
    if (!hasEnoughCredit) {
      setErrorMsg(`Insufficient SkillCredits. You need ${cost} Cr, but have ${balance.available} Cr available.`);
      return;
    }

    const isoDateTime = `${scheduledDate}T${scheduledTime}:00Z`;
    const loc = mode === 'Online' ? 'Google Meet (auto-generated link)' : location;

    const session = bookSession(
      mentorId,
      skillId,
      isoDateTime,
      duration,
      mode,
      learningGoals,
      loc
    );

    if (session) {
      setSuccessResult(true);
      if (onSuccess) onSuccess(session.id);
      setTimeout(() => {
        setSuccessResult(false);
        onClose();
      }, 1600);
    } else {
      setErrorMsg('Could not book session. You might have a scheduling conflict or insufficient balance.');
    }
  };

  const selectedMentor = users.find(u => u.id === mentorId);
  const selectedSkill = skills.find(s => s.id === skillId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto overflow-x-hidden text-[var(--text-primary)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[var(--border-default)] bg-[var(--bg-secondary)]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Calendar size={18} />
            </div>
            <div>
              <h2 id="booking-modal-title" className="text-base sm:text-lg font-bold">Book a Peer Session</h2>
              <p className="text-[11px] sm:text-xs text-[var(--text-secondary)]">100% Currency-Free • Powered by SkillCredits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close booking modal"
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {successResult ? (
          <div className="p-6 sm:p-8 text-center flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold">Session Requested!</h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-sm">
              Your request for <strong>{selectedSkill?.title}</strong> with <strong>{selectedMentor?.displayName}</strong> has been created.
              <span className="block mt-1 text-teal-600 dark:text-teal-400 font-semibold font-mono">
                {cost} SkillCredit reserved in escrow
              </span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleBook} className="p-4 sm:p-5 flex flex-col gap-3.5 sm:gap-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Mentor Selection */}
            <div>
              <label htmlFor="select-mentor" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Peer Mentor
              </label>
              <select
                id="select-mentor"
                value={mentorId}
                onChange={(e) => {
                  setMentorId(e.target.value);
                  const firstSkill = userSkills.find(us => us.userId === e.target.value && us.relationship === 'teach');
                  if (firstSkill) setSkillId(firstSkill.skillId);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal)] min-h-[42px]"
              >
                {availableMentors.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.displayName} — {m.faculty} (Year {m.yearOfStudy})
                  </option>
                ))}
              </select>
            </div>

            {/* Skill Selection */}
            <div>
              <label htmlFor="select-skill" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Skill to Learn
              </label>
              <select
                id="select-skill"
                value={skillId}
                onChange={(e) => setSkillId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal)] min-h-[42px]"
              >
                {mentorSkills.length > 0 ? (
                  mentorSkills.map(s => s && (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.category})
                    </option>
                  ))
                ) : (
                  skills.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.category})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Duration & Credit Cost */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Duration & Escrow Cost
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="duration-30min"
                  onClick={() => setDuration(30)}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all min-h-[44px] ${
                    duration === 30
                      ? 'border-[var(--teal)] bg-[var(--teal)]/10 font-bold'
                      : 'border-[var(--border-default)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span>30 Mins</span>
                    <Clock size={13} className="text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-teal-600 dark:text-teal-400 font-mono">0.5 Cr</div>
                </button>

                <button
                  type="button"
                  id="duration-60min"
                  onClick={() => setDuration(60)}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all min-h-[44px] ${
                    duration === 60
                      ? 'border-[var(--teal)] bg-[var(--teal)]/10 font-bold'
                      : 'border-[var(--border-default)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span>60 Mins</span>
                    <Clock size={13} className="text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-teal-600 dark:text-teal-400 font-mono">1.0 Cr</div>
                </button>
              </div>
            </div>

            {/* Mode & Location */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Meeting Mode
              </label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  type="button"
                  id="mode-online"
                  onClick={() => setMode('Online')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-medium transition-all min-h-[42px] ${
                    mode === 'Online'
                      ? 'border-[var(--teal)] bg-[var(--teal)]/10 text-teal-600 dark:text-teal-400 font-bold'
                      : 'border-[var(--border-default)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  <Video size={14} /> Online (Meet)
                </button>
                <button
                  type="button"
                  id="mode-inperson"
                  onClick={() => setMode('In-Person')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-medium transition-all min-h-[42px] ${
                    mode === 'In-Person'
                      ? 'border-[var(--teal)] bg-[var(--teal)]/10 text-teal-600 dark:text-teal-400 font-bold'
                      : 'border-[var(--border-default)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  <MapPin size={14} /> In-Person
                </button>
              </div>

              {mode === 'In-Person' && (
                <div>
                  <label htmlFor="select-location" className="block text-xs text-[var(--text-secondary)] mb-1">UM Campus Location</label>
                  <select
                    id="select-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs min-h-[40px]"
                  >
                    <option value="UM Central Library, Level 3 Study Pods">UM Central Library, Level 3 Study Pods</option>
                    <option value="FSIT Cube Collaborative Zone">FSIT Cube Collaborative Zone</option>
                    <option value="Perdanasiswa Complex Student Union Lounge">Perdanasiswa Complex Student Lounge</option>
                    <option value="Faculty of Creative Arts Studio 2">Creative Arts Studio 2</option>
                    <option value="KK12 Residential College Common Study Room">KK12 Study Room</option>
                  </select>
                </div>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label htmlFor="booking-date" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Date
                </label>
                <input
                  id="booking-date"
                  type="date"
                  value={scheduledDate}
                  min="2026-10-25"
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs sm:text-sm min-h-[42px]"
                />
              </div>
              <div>
                <label htmlFor="booking-time" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Start Time
                </label>
                <select
                  id="booking-time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs sm:text-sm min-h-[42px]"
                >
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                </select>
              </div>
            </div>

            {/* Learning Goals */}
            <div>
              <label htmlFor="learning-goals" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Learning Goals
              </label>
              <textarea
                id="learning-goals"
                rows={2}
                value={learningGoals}
                onChange={(e) => setLearningGoals(e.target.value)}
                placeholder="What topics do you want to cover?"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal)] resize-none"
              />
            </div>

            {/* Credit Ledger Preview */}
            <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs flex flex-col gap-1">
              <div className="flex justify-between items-center text-[var(--text-secondary)]">
                <span>Available Balance:</span>
                <span className="font-mono font-semibold">{balance.available.toFixed(1)} Cr</span>
              </div>
              <div className="flex justify-between items-center text-[var(--text-secondary)]">
                <span>Session Cost:</span>
                <span className="font-mono font-semibold text-rose-500">-{cost.toFixed(1)} Cr</span>
              </div>
              <div className="border-t border-[var(--border-default)] pt-1 flex justify-between items-center font-bold">
                <span>Remaining:</span>
                <span className={`font-mono ${hasEnoughCredit ? 'text-teal-600 dark:text-teal-400' : 'text-rose-500'}`}>
                  {(balance.available - cost).toFixed(1)} Cr
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors min-h-[42px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-booking-btn"
                disabled={!hasEnoughCredit}
                className="px-5 py-2.5 text-xs font-bold rounded-xl text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-h-[42px]"
                style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
              >
                Confirm & Reserve {cost} Cr
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
