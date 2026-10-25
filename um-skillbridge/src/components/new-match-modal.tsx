'use client';

import { useState } from 'react';
import { useDemoStore } from '@/lib/store';
import { X, Sparkles, CheckCircle2, ArrowRightLeft, Users } from 'lucide-react';

interface NewMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewMatchModal({ isOpen, onClose }: NewMatchModalProps) {
  const { users, skills, userSkills, createDemoMatch, currentUserId } = useDemoStore();

  const [learnerId, setLearnerId] = useState<string>(currentUserId || 'u-aisha');
  const [mentorId, setMentorId] = useState<string>('u-sarah');
  const [skillId, setSkillId] = useState<string>('sk-mandarin');
  const [isReciprocal, setIsReciprocal] = useState<boolean>(true);
  const [reciprocalSkillId, setReciprocalSkillId] = useState<string>('sk-python');
  const [created, setCreated] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createDemoMatch(
      learnerId,
      mentorId,
      skillId,
      isReciprocal,
      isReciprocal ? reciprocalSkillId : undefined
    );
    setCreated(true);
    setTimeout(() => {
      setCreated(false);
      onClose();
    }, 1200);
  };

  const learner = users.find(u => u.id === learnerId);
  const mentor = users.find(u => u.id === mentorId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden text-[var(--text-primary)]">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)] bg-[var(--bg-secondary)]/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 id="match-modal-title" className="text-base font-bold">Generate Peer Match</h2>
              <p className="text-xs text-[var(--text-secondary)]">Test Deterministic Compatibility Scoring</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close match modal"
            className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
          >
            <X size={16} />
          </button>
        </div>

        {created ? (
          <div className="p-8 text-center flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-lg font-bold">Match Generated!</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Added to your active matches list with 96% compatibility breakdown.
            </p>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="p-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="select-learner" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Learner
                </label>
                <select
                  id="select-learner"
                  value={learnerId}
                  onChange={(e) => setLearnerId(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.displayName} ({u.faculty.split(' ')[0]})</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="select-match-mentor" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Mentor
                </label>
                <select
                  id="select-match-mentor"
                  value={mentorId}
                  onChange={(e) => setMentorId(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs"
                >
                  {users.filter(u => u.id !== learnerId).map(u => (
                    <option key={u.id} value={u.id}>{u.displayName} ({u.faculty.split(' ')[0]})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="select-learn-skill" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Skill to Learn from {mentor?.displayName || 'Mentor'}
              </label>
              <select
                id="select-learn-skill"
                value={skillId}
                onChange={(e) => setSkillId(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs"
              >
                {skills.map(s => (
                  <option key={s.id} value={s.id}>{s.title} ({s.category})</option>
                ))}
              </select>
            </div>

            <div className="p-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]/50 flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={isReciprocal}
                  onChange={(e) => setIsReciprocal(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
                  <ArrowRightLeft size={14} /> Make Reciprocal (Two-Way Peer Exchange)
                </span>
              </label>

              {isReciprocal && (
                <div>
                  <label htmlFor="select-reciprocal-skill" className="block text-[11px] text-[var(--text-secondary)] mb-1">
                    Skill {learner?.displayName || 'Learner'} teaches in return:
                  </label>
                  <select
                    id="select-reciprocal-skill"
                    value={reciprocalSkillId}
                    onChange={(e) => setReciprocalSkillId(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs"
                  >
                    {skills.map(s => (
                      <option key={s.id} value={s.id}>{s.title} ({s.category})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl hover:bg-[var(--bg-tertiary)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-create-match-submit"
                className="px-4 py-2 text-xs font-bold rounded-xl text-white shadow"
                style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
              >
                Create Match
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
