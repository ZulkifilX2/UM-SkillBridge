'use client';

import { useState } from 'react';
import { useDemoStore } from '@/lib/store';
import { AppHeader } from '@/components/app-header';
import { Footer } from '@/components/footer';
import {
  Users, Sparkles, HeartHandshake, Award, Star,
  TrendingUp, GraduationCap, ArrowRight, MessageSquare, ShieldCheck
} from 'lucide-react';

const facultyExchanges = [
  {
    from: 'Computer Science',
    to: 'Creative Arts',
    give: 'Python & Web Development',
    receive: 'Canva & UI Mockups',
    impact: '142 Sessions Completed',
  },
  {
    from: 'Creative Arts',
    to: 'Business & Economics',
    give: 'Presentation Design & Infographics',
    receive: 'Pitch Deck & Business Models',
    impact: '98 Sessions Completed',
  },
  {
    from: 'Languages & Linguistics',
    to: 'Engineering',
    give: 'Technical English & Mandarin',
    receive: 'Calculus & MATLAB Basics',
    impact: '116 Sessions Completed',
  },
  {
    from: 'Business & Economics',
    to: 'Science',
    give: 'Public Speaking & Debate',
    receive: 'Data Analysis & Statistics',
    impact: '85 Sessions Completed',
  },
];

export default function CommunityPage() {
  const { users, feedbacks, skills } = useDemoStore();
  const [selectedFaculty, setSelectedFaculty] = useState<string>('All');

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-2">
            <HeartHandshake size={14} /> Universiti Malaya Campus Community
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Our Greatest Resource Is Each Other
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)]">
            Explore the web of inter-faculty peer mentoring across Universiti Malaya. Students learning together, breaking silos, and building lasting academic bonds.
          </p>
        </div>

        {/* Campus Impact Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-teal-600 dark:text-teal-400">
              840+
            </div>
            <div className="text-xs font-semibold text-[var(--text-primary)] mt-1">Hours Upskilled</div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Peer-to-peer knowledge transfer</div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-500">
              RM 42,000
            </div>
            <div className="text-xs font-semibold text-[var(--text-primary)] mt-1">Student Savings</div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Zero commercial tuition cost</div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-blue-500">
              11
            </div>
            <div className="text-xs font-semibold text-[var(--text-primary)] mt-1">UM Faculties Active</div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Cross-disciplinary connection</div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-500">
              4.9 / 5
            </div>
            <div className="text-xs font-semibold text-[var(--text-primary)] mt-1">Peer Satisfaction</div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Verified peer ratings</div>
          </div>
        </div>

        {/* Cross-Faculty Exchange Network */}
        <section className="p-6 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles size={18} className="text-teal-600 dark:text-teal-400" />
                Inter-Faculty Exchange Matrix
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                See how different faculties exchange skills without money.
              </p>
            </div>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Live Campus Visualizer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            {facultyExchanges.map((ex, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] flex flex-col justify-between gap-3 hover:border-teal-500/40 transition-all"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-300">
                    {ex.from}
                  </span>
                  <span className="text-[var(--text-muted)]">⇄</span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">
                    {ex.to}
                  </span>
                </div>

                <div className="text-xs flex flex-col gap-1.5 py-1">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Sharing:</span>
                    <span className="font-semibold text-[var(--text-primary)]">{ex.give}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Receiving:</span>
                    <span className="font-semibold text-[var(--text-primary)]">{ex.receive}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border-default)] flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono">
                  <span>{ex.impact}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% Free</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Peer Mentors Leaderboard */}
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              Top Peer Mentors
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Dedicated student mentors recognized for patience, clarity, and community contributions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((u, idx) => (
              <div
                key={u.id}
                className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm flex items-start gap-3.5"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0"
                  style={{ backgroundColor: u.avatarColor }}
                >
                  {u.avatarInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[var(--text-primary)] truncate">
                      {u.displayName}
                    </h3>
                    <span className="text-xs font-mono font-bold text-amber-500 flex items-center gap-0.5">
                      <Star size={12} fill="currentColor" /> 5.0
                    </span>
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {u.faculty} • Year {u.yearOfStudy}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2 italic">
                    &ldquo;{u.bio}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Verified Student Feedback Wall */}
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <MessageSquare size={18} className="text-teal-600 dark:text-teal-400" />
              Peer Experience Stories & Reviews
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Direct feedback from students after completing 1-on-1 peer sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map(fb => {
              const author = users.find(u => u.id === fb.authorId);
              return (
                <div
                  key={fb.id}
                  className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs"
                          style={{ backgroundColor: author?.avatarColor || '#0C9D9A' }}
                        >
                          {author?.avatarInitials || 'UM'}
                        </div>
                        <span className="font-bold text-xs text-[var(--text-primary)]">
                          {author?.displayName} ({author?.faculty.split(' ')[0]})
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(fb.rating)].map((_, i) => (
                          <Star key={i} size={13} fill="currentColor" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic">
                      &ldquo;{fb.comment}&rdquo;
                    </p>
                  </div>

                  {fb.tags && fb.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border-default)]">
                      {fb.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
