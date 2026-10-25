'use client';

import { useState } from 'react';
import { useDemoStore } from '@/lib/store';
import { X, Star, CheckCircle2, MessageSquare, ThumbsUp } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
}

const AVAILABLE_TAGS = [
  'Patient & Kind',
  'Clear Explanations',
  'Practical Examples',
  'Well Structured',
  'Encouraging',
  'Resourceful',
  'Problem Solver',
  'Recommended Mentor',
];

export function FeedbackModal({ isOpen, onClose, sessionId }: FeedbackModalProps) {
  const { sessions, skills, users, submitFeedback } = useDemoStore();
  const session = sessions.find(s => s.id === sessionId);

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('Exceptional peer mentoring session! Very clear, patient, and practical.');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Patient & Kind', 'Clear Explanations']);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen || !session) return null;

  const mentor = users.find(u => u.id === session.mentorId);
  const skill = skills.find(s => s.id === session.skillId);

  const toggleTag = (tag: string) => {
    setSelectedTags(curr =>
      curr.includes(tag) ? curr.filter(t => t !== tag) : [...curr, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback(sessionId, rating, comment, selectedTags);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden text-[var(--text-primary)]">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)] bg-[var(--bg-secondary)]/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Star size={18} fill="currentColor" />
            </div>
            <div>
              <h2 id="feedback-modal-title" className="text-base font-bold">Review Peer Session</h2>
              <p className="text-xs text-[var(--text-secondary)]">{skill?.title} with {mentor?.displayName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close review modal"
            className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
          >
            <X size={16} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-lg font-bold">Review Submitted!</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Thank you for strengthening the UM peer learning community!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
            {/* Rating Stars */}
            <div className="flex flex-col items-center gap-1.5 py-1">
              <span className="text-xs font-semibold text-[var(--text-secondary)]">How was your peer experience?</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`${star} star rating`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      size={28}
                      className={
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Praise Tags */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Praise & Strengths
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TAGS.map(tag => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
                        active
                          ? 'bg-teal-500/15 border-teal-500 text-teal-700 dark:text-teal-300 font-semibold'
                          : 'border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="review-comment" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Feedback Comment
              </label>
              <textarea
                id="review-comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience learning with this peer mentor..."
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] text-xs resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl hover:bg-[var(--bg-tertiary)]"
              >
                Skip
              </button>
              <button
                type="submit"
                id="btn-submit-review"
                className="px-4 py-2 text-xs font-bold rounded-xl text-white shadow"
                style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
              >
                Submit Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
