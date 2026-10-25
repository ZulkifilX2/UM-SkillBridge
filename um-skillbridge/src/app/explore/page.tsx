'use client';

import { useState, useMemo } from 'react';
import { useDemoStore } from '@/lib/store';
import { AppHeader } from '@/components/app-header';
import { BookingModal } from '@/components/booking-modal';
import { Footer } from '@/components/footer';
import {
  Search, X, Users, Calendar, Sparkles,
  BookOpen, ChevronRight
} from 'lucide-react';
import { SkillCategory } from '@/lib/types';

const categories: (SkillCategory | 'All')[] = [
  'All',
  'Programming',
  'AI & Data Science',
  'Graphic Design',
  'Business & Entrepreneurship',
  'Language Learning',
  'Public Speaking',
  'Mathematics',
  'Productivity Tools',
  'Creative Arts',
];

export default function ExplorePage() {
  const { skills, users, userSkills } = useDemoStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'All'>('All');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');

  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingMentorId, setBookingMentorId] = useState<string | undefined>();
  const [bookingSkillId, setBookingSkillId] = useState<string | undefined>();

  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      if (selectedCategory !== 'All' && skill.category !== selectedCategory) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = skill.title.toLowerCase().includes(q);
        const matchesDesc = skill.description.toLowerCase().includes(q);
        const matchesCat = skill.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }

      const mentorsForSkill = userSkills.filter(us => us.skillId === skill.id && us.relationship === 'teach');

      if (selectedFaculty !== 'All') {
        const hasFacultyMentor = mentorsForSkill.some(us => {
          const u = users.find(user => user.id === us.userId);
          return u?.faculty === selectedFaculty;
        });
        if (!hasFacultyMentor) return false;
      }

      if (selectedMode !== 'All') {
        const hasModeMentor = mentorsForSkill.some(us => us.preferredMode === selectedMode || us.preferredMode === 'Both');
        if (!hasModeMentor) return false;
      }

      return true;
    });
  }, [skills, searchQuery, selectedCategory, selectedFaculty, selectedMode, userSkills, users]);

  const activeSkill = skills.find(s => s.id === activeSkillId);
  const activeSkillMentors = useMemo(() => {
    if (!activeSkillId) return [];
    return userSkills
      .filter(us => us.skillId === activeSkillId && us.relationship === 'teach')
      .map(us => ({
        ...us,
        user: users.find(u => u.id === us.userId)!,
      }))
      .filter(m => m.user);
  }, [activeSkillId, userSkills, users]);

  const handleOpenBooking = (mentorId: string, skillId: string) => {
    setBookingMentorId(mentorId);
    setBookingSkillId(skillId);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6 pb-28 sm:pb-16">
        {/* Page Hero */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 border-b border-[var(--border-default)] pb-4 sm:pb-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-2">
              <Sparkles size={13} /> Peer Marketplace
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight break-words leading-tight">
              Explore UM Skills & Peer Mentors
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Discover verified student tutors across all 11 faculties. Book a 1-on-1 session using your SkillCredits.
            </p>
          </div>

          <div className="text-xs text-[var(--text-muted)] font-mono shrink-0">
            Showing {filteredSkills.length} of {skills.length} skills
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                id="search-skills-input"
                type="text"
                placeholder="Search by skill name, keyword (e.g. Python, Canva, Excel)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal)] min-h-[44px]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:flex gap-2">
              <select
                id="filter-faculty-select"
                aria-label="Filter by Faculty"
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full sm:w-auto px-2.5 sm:px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] text-xs font-medium min-h-[44px]"
              >
                <option value="All">All Faculties</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Creative Arts">Creative Arts</option>
                <option value="Business & Economics">Business & Econ</option>
                <option value="Engineering">Engineering</option>
                <option value="Languages & Linguistics">Languages</option>
              </select>

              <select
                id="filter-mode-select"
                aria-label="Filter by Session Mode"
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full sm:w-auto px-2.5 sm:px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] text-xs font-medium min-h-[44px]"
              >
                <option value="All">All Modes</option>
                <option value="Online">Online</option>
                <option value="In-Person">In-Person</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
            {categories.map(cat => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`cat-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border min-h-[36px] flex items-center shrink-0 ${
                    active
                      ? 'bg-[var(--teal)] text-white border-[var(--teal)] font-bold shadow-sm'
                      : 'border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills Grid */}
        {filteredSkills.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-center flex flex-col items-center gap-3">
            <BookOpen size={32} className="text-[var(--text-muted)]" />
            <h3 className="font-bold text-base">No skills found matching your filters</h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm">
              Try adjusting your search query or reset the filters to see all available peer subjects.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedFaculty('All');
                setSelectedMode('All');
              }}
              className="mt-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow min-h-[42px]"
              style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredSkills.map(skill => {
              const mentorsCount = userSkills.filter(us => us.skillId === skill.id && us.relationship === 'teach').length;

              return (
                <div
                  key={skill.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm hover:border-teal-500/40 hover:shadow-md transition-all flex flex-col justify-between gap-3.5"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                        {skill.category}
                      </span>
                      <span className="text-xs font-medium text-teal-600 dark:text-teal-400 flex items-center gap-1 shrink-0">
                        <Users size={12} /> {mentorsCount} {mentorsCount === 1 ? 'Mentor' : 'Mentors'}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-[var(--text-primary)] mb-1.5 leading-snug">
                      {skill.title}
                    </h3>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                      {skill.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-default)] flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold text-teal-600 dark:text-teal-400">
                      1.0 Cr / hr
                    </span>

                    <button
                      id={`btn-skill-mentors-${skill.id}`}
                      onClick={() => setActiveSkillId(skill.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow flex items-center gap-1 transition-transform hover:scale-105 active:scale-100 min-h-[38px]"
                      style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
                    >
                      <span>View Mentors</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mentors Drawer / Modal */}
        {activeSkill && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mentors-drawer-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
          >
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col text-[var(--text-primary)]">
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-[var(--border-default)] bg-[var(--bg-secondary)]/50 flex items-center justify-between">
                <div>
                  <div className="text-[10px] sm:text-[11px] uppercase font-bold text-teal-600 dark:text-teal-400 tracking-wider">
                    {activeSkill.category}
                  </div>
                  <h2 id="mentors-drawer-title" className="text-base sm:text-lg font-bold">
                    Peer Mentors for {activeSkill.title}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveSkillId(null)}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                  aria-label="Close mentors modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-3.5 sm:p-5 overflow-y-auto flex flex-col gap-3 flex-1">
                {activeSkillMentors.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[var(--text-secondary)]">
                    No active mentors currently teaching this skill. Be the first student to offer it!
                  </div>
                ) : (
                  activeSkillMentors.map(m => (
                    <div
                      key={m.userId}
                      className="p-3.5 sm:p-4 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-teal-500/40 transition-all"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0"
                          style={{ backgroundColor: m.user.avatarColor }}
                        >
                          {m.user.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-[var(--text-primary)] truncate">
                              {m.user.displayName}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 shrink-0">
                              {m.proficiency}
                            </span>
                          </div>
                          <div className="text-xs text-[var(--text-secondary)] truncate">
                            {m.user.faculty} • Year {m.user.yearOfStudy}
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                            {m.description || m.user.bio}
                          </p>
                        </div>
                      </div>

                      <button
                        id={`btn-book-with-mentor-${m.userId}`}
                        onClick={() => {
                          setActiveSkillId(null);
                          handleOpenBooking(m.userId, activeSkill.id);
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow shrink-0 flex items-center justify-center gap-1.5 transition-transform hover:scale-105 active:scale-100 min-h-[42px]"
                        style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
                      >
                        <Calendar size={13} /> Book Session
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
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
    </div>
  );
}
