'use client';

import { useState } from 'react';
import { useDemoStore } from '@/lib/store';
import { AppHeader } from '@/components/app-header';
import { BookingModal } from '@/components/booking-modal';
import { NewMatchModal } from '@/components/new-match-modal';
import { Footer } from '@/components/footer';
import {
  Sparkles, ArrowRightLeft, Calendar, Plus, ChevronDown,
  ChevronUp, Info
} from 'lucide-react';

export default function MatchesPage() {
  const { currentUserId, getUserMatches, users, skills } = useDemoStore();
  const matches = currentUserId ? getUserMatches(currentUserId) : [];

  const [filterType, setFilterType] = useState<'all' | 'reciprocal' | 'direct'>('all');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingMentorId, setBookingMentorId] = useState<string | undefined>();
  const [bookingSkillId, setBookingSkillId] = useState<string | undefined>();
  const [newMatchOpen, setNewMatchOpen] = useState(false);

  const filteredMatches = matches.filter(m => {
    if (filterType === 'reciprocal') return m.isReciprocal;
    if (filterType === 'direct') return !m.isReciprocal;
    return true;
  });

  const toggleExpand = (matchId: string) => {
    setExpandedMatchId(curr => curr === matchId ? null : matchId);
  };

  const handleOpenBooking = (mentorId: string, skillId: string) => {
    setBookingMentorId(mentorId);
    setBookingSkillId(skillId);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6 pb-28 sm:pb-16">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 border-b border-[var(--border-default)] pb-4 sm:pb-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-2">
              <Sparkles size={13} /> Deterministic Compatibility Engine
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight break-words leading-tight">
              Smart Peer Matches & Reciprocal Swaps
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Multi-factor algorithmic scoring: skill relevance, schedule overlap, proficiency, and reciprocal bonuses.
            </p>
          </div>

          <button
            id="btn-open-new-match"
            onClick={() => setNewMatchOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow transition-all hover:shadow-md flex items-center justify-center gap-1.5 shrink-0 min-h-[42px]"
            style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
          >
            <Plus size={15} /> Create Demo Match
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
          <button
            id="match-filter-all"
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 min-h-[38px] ${
              filterType === 'all'
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
            }`}
          >
            All Compatible ({matches.length})
          </button>
          <button
            id="match-filter-reciprocal"
            onClick={() => setFilterType('reciprocal')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 shrink-0 min-h-[38px] ${
              filterType === 'reciprocal'
                ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                : 'border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
            }`}
          >
            <ArrowRightLeft size={13} />
            Two-Way Reciprocal ({matches.filter(m => m.isReciprocal).length})
          </button>
          <button
            id="match-filter-direct"
            onClick={() => setFilterType('direct')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 min-h-[38px] ${
              filterType === 'direct'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
            }`}
          >
            Direct 1-Way ({matches.filter(m => !m.isReciprocal).length})
          </button>
        </div>

        {/* Matches Grid */}
        {filteredMatches.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-center flex flex-col items-center gap-3">
            <Sparkles size={32} className="text-[var(--text-muted)]" />
            <h3 className="font-bold text-base">No matches in this category</h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm">
              Use the Create Demo Match button to dynamically generate new pairings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMatches.map(match => {
              const mentor = users.find(u => u.id === match.mentorId);
              const skill = skills.find(s => s.id === match.skillId);
              const recSkill = match.reciprocalSkillId ? skills.find(s => s.id === match.reciprocalSkillId) : undefined;
              const isExpanded = expandedMatchId === match.id;

              return (
                <div
                  key={match.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm hover:border-purple-500/40 transition-all flex flex-col justify-between gap-3.5"
                >
                  <div>
                    {/* Header: Mentor and Score */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0"
                          style={{ backgroundColor: mentor?.avatarColor || '#0C9D9A' }}
                        >
                          {mentor?.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] truncate">
                              {mentor?.displayName}
                            </h3>
                            {match.isReciprocal && (
                              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center gap-0.5 shrink-0">
                                <ArrowRightLeft size={9} /> Reciprocal
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[var(--text-secondary)] truncate">
                            {mentor?.faculty} • Year {mentor?.yearOfStudy}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base sm:text-lg font-extrabold font-mono text-purple-600 dark:text-purple-400">
                          {match.compatibilityScore}%
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] font-medium">Match</div>
                      </div>
                    </div>

                    {/* Skill Exchange Summary */}
                    <div className="p-2.5 sm:p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs flex flex-col gap-1.5 mb-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)] shrink-0">You learn:</span>
                        <span className="font-bold text-teal-600 dark:text-teal-400 truncate ml-2">{skill?.title}</span>
                      </div>
                      {match.isReciprocal && recSkill && (
                        <div className="flex items-center justify-between pt-1 border-t border-[var(--border-default)]">
                          <span className="text-[var(--text-secondary)] shrink-0">Peer learns:</span>
                          <span className="font-bold text-amber-600 dark:text-amber-400 truncate ml-2">{recSkill.title}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] mb-2.5 leading-relaxed">
                      {match.explanation}
                    </p>

                    {/* Breakdown accordion toggle */}
                    <button
                      id={`btn-breakdown-${match.id}`}
                      onClick={() => toggleExpand(match.id)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1.5 border-t border-[var(--border-default)] transition-colors min-h-[36px]"
                    >
                      <span className="flex items-center gap-1">
                        <Info size={13} className="text-purple-500 shrink-0" />
                        Scoring Algorithm Breakdown
                      </span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 p-3 rounded-xl bg-[var(--bg-tertiary)]/70 text-xs flex flex-col gap-1.5 animate-fade-in border border-[var(--border-default)]">
                        <div className="flex justify-between items-center text-[11px]">
                          <span>Skill Relevance:</span>
                          <span className="font-mono font-bold">{match.breakdown?.skillRelevance || 40} / 40</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span>Availability Overlap:</span>
                          <span className="font-mono font-bold">{match.breakdown?.availabilityOverlap || 20} / 25</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span>Level Compatibility:</span>
                          <span className="font-mono font-bold">{match.breakdown?.levelCompatibility || 12} / 15</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span>Session Mode:</span>
                          <span className="font-mono font-bold">{match.breakdown?.modeCompatibility || 10} / 10</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span>Language Compatibility:</span>
                          <span className="font-mono font-bold">{match.breakdown?.languageCompatibility || 10} / 10</span>
                        </div>
                        {match.isReciprocal && (
                          <div className="flex justify-between items-center text-teal-600 dark:text-teal-400 font-bold border-t border-[var(--border-default)] pt-1 text-[11px]">
                            <span>Reciprocal Synergy:</span>
                            <span className="font-mono">+{match.breakdown?.reciprocalBonus || 15} pts</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    id={`btn-match-book-${match.id}`}
                    onClick={() => handleOpenBooking(match.mentorId, match.skillId)}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-white shadow transition-all hover:shadow-md flex items-center justify-center gap-1.5 min-h-[42px]"
                    style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
                  >
                    <Calendar size={14} /> Book Session with {mentor?.displayName}
                  </button>
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
        preselectedMentorId={bookingMentorId}
        preselectedSkillId={bookingSkillId}
      />

      {/* New Match Modal */}
      <NewMatchModal
        isOpen={newMatchOpen}
        onClose={() => setNewMatchOpen(false)}
      />
    </div>
  );
}
