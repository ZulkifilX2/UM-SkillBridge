'use client';

import { useState, useMemo } from 'react';
import { useDemoStore } from '@/lib/store';
import { AppHeader } from '@/components/app-header';
import { BookingModal } from '@/components/booking-modal';
import { Footer } from '@/components/footer';
import {
  Coins, ArrowUpRight, ArrowDownLeft, ShieldCheck,
  Search, X, Plus, Calendar, Lock, CheckCircle2
} from 'lucide-react';

export default function WalletPage() {
  const {
    currentUserId,
    getUserBalance,
    getUserTransactions,
    addBonusCredit,
  } = useDemoStore();

  const balance = currentUserId ? getUserBalance(currentUserId) : {
    available: 0, reserved: 0, totalEarned: 0, totalSpent: 0, promotionalReceived: 0
  };
  const transactions = currentUserId ? getUserTransactions(currentUserId) : [];

  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookingOpen, setBookingOpen] = useState<boolean>(false);
  const [bonusSuccess, setBonusSuccess] = useState<boolean>(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (filterType !== 'All' && tx.transactionType !== filterType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesDesc = tx.description.toLowerCase().includes(q);
        const matchesId = tx.id.toLowerCase().includes(q);
        const matchesType = tx.transactionType.toLowerCase().includes(q);
        if (!matchesDesc && !matchesId && !matchesType) return false;
      }
      return true;
    });
  }, [transactions, filterType, searchQuery]);

  const handleAddTestCredit = () => {
    if (!currentUserId) return;
    addBonusCredit(currentUserId, 1.0, 'UM Hackathon Audit Test Credit Grant');
    setBonusSuccess(true);
    setTimeout(() => setBonusSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6 pb-28 sm:pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 border-b border-[var(--border-default)] pb-4 sm:pb-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-2">
              <Coins size={13} /> Currency-Free Time Ledger
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight break-words leading-tight">
              SkillCredits Wallet & Ledger
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              An unalterable, time-based accounting system where 1 hour of mentoring equals exactly 1 SkillCredit.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              id="btn-add-test-credit"
              onClick={handleAddTestCredit}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 border border-[var(--border-default)] text-[var(--text-primary)] transition-all flex items-center justify-center gap-1.5 min-h-[42px]"
              title="Add 1.0 test credit to verify ledger recording"
            >
              <Plus size={14} className="text-teal-500" /> Test Credit Grant
            </button>
            <button
              id="btn-wallet-book-session"
              onClick={() => setBookingOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow transition-all hover:shadow-md flex items-center justify-center gap-1.5 min-h-[42px]"
              style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
            >
              <Calendar size={14} /> Spend Credits
            </button>
          </div>
        </div>

        {bonusSuccess && (
          <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={16} />
            <span>Success: 1.0 SkillCredit granted and recorded in ledger!</span>
          </div>
        )}

        {/* Balance Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Available */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-[var(--text-secondary)] mb-1">
              <span>Available</span>
              <Coins size={15} className="text-teal-600 dark:text-teal-400 shrink-0" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-teal-600 dark:text-teal-400">
                {balance.available.toFixed(1)}
              </span>
              <span className="text-[11px] sm:text-xs text-[var(--text-secondary)]">Credits</span>
            </div>
            <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-3 border-t border-[var(--border-default)] text-[10px] sm:text-[11px] text-[var(--text-muted)] truncate">
              Ready to book sessions
            </div>
          </div>

          {/* Reserved in Escrow */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-[var(--text-secondary)] mb-1">
              <span>In Escrow</span>
              <Lock size={15} className="text-amber-500 shrink-0" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-500">
                {balance.reserved.toFixed(1)}
              </span>
              <span className="text-[11px] sm:text-xs text-[var(--text-secondary)]">Credits</span>
            </div>
            <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-3 border-t border-[var(--border-default)] text-[10px] sm:text-[11px] text-[var(--text-muted)] truncate">
              Held for pending sessions
            </div>
          </div>

          {/* Lifetime Earned */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-[var(--text-secondary)] mb-1">
              <span>Earned</span>
              <ArrowDownLeft size={15} className="text-emerald-500 shrink-0" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                +{balance.totalEarned.toFixed(1)}
              </span>
              <span className="text-[11px] sm:text-xs text-[var(--text-secondary)]">Hours</span>
            </div>
            <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-3 border-t border-[var(--border-default)] text-[10px] sm:text-[11px] text-[var(--text-muted)] truncate">
              Teaching peer students
            </div>
          </div>

          {/* Lifetime Spent */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-[var(--text-secondary)] mb-1">
              <span>Spent</span>
              <ArrowUpRight size={15} className="text-blue-500 shrink-0" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
                {balance.totalSpent.toFixed(1)}
              </span>
              <span className="text-[11px] sm:text-xs text-[var(--text-secondary)]">Hours</span>
            </div>
            <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-3 border-t border-[var(--border-default)] text-[10px] sm:text-[11px] text-[var(--text-muted)] truncate">
              Learning new skills
            </div>
          </div>
        </div>

        {/* Ledger Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between pt-1">
          {/* Type filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
            {['All', 'Earned', 'Spent', 'Reserved', 'Released', 'Promotional'].map(type => {
              const active = filterType === type;
              return (
                <button
                  key={type}
                  id={`filter-tx-${type.toLowerCase()}`}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border shrink-0 min-h-[36px] ${
                    active
                      ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-sm'
                      : 'border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              id="search-transactions-input"
              type="text"
              placeholder="Search ledger..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--teal)] min-h-[40px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Responsive Ledger: Mobile Cards View on small screens */}
        <div className="sm:hidden flex flex-col gap-2.5">
          {filteredTransactions.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)] rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)]">
              No ledger transactions found matching criteria.
            </div>
          ) : (
            filteredTransactions.map(tx => {
              const isPositive = tx.amount > 0;
              const dateFormatted = new Date(tx.createdAt).toLocaleDateString('en-MY', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] flex flex-col gap-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      tx.transactionType === 'Earned'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : tx.transactionType === 'Spent'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        : tx.transactionType === 'Reserved'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        : tx.transactionType === 'Released'
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                        : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                    }`}>
                      {tx.transactionType}
                    </span>

                    <span className={`font-mono font-bold text-sm ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                      {isPositive ? `+${tx.amount.toFixed(1)}` : `${tx.amount.toFixed(1)}`} Cr
                    </span>
                  </div>

                  <div className="font-semibold text-xs text-[var(--text-primary)]">
                    {tx.description}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-default)]">
                    <span className="font-mono">{tx.id}</span>
                    <span>{dateFormatted}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Ledger Table (Tablet & Desktop) */}
        <div className="hidden sm:block rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse" aria-label="SkillCredits Transaction Ledger">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--bg-secondary)]/50 text-[var(--text-secondary)] uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)]">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-[var(--text-muted)]">
                      No ledger transactions found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map(tx => {
                    const isPositive = tx.amount > 0;
                    const dateFormatted = new Date(tx.createdAt).toLocaleDateString('en-MY', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <tr key={tx.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] text-[var(--text-muted)]">
                          {tx.id}
                        </td>
                        <td className="py-3 px-4 text-[var(--text-secondary)] whitespace-nowrap">
                          {dateFormatted}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.transactionType === 'Earned'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : tx.transactionType === 'Spent'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                              : tx.transactionType === 'Reserved'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : tx.transactionType === 'Released'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                              : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                          }`}>
                            {tx.transactionType}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-[var(--text-primary)]">
                          {tx.description}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold whitespace-nowrap">
                          <span className={isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}>
                            {isPositive ? `+${tx.amount.toFixed(1)}` : `${tx.amount.toFixed(1)}`} Cr
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                            tx.status === 'Completed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'
                          }`}>
                            <CheckCircle2 size={11} /> {tx.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Educational Rules Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs flex flex-col gap-3 shadow-sm">
          <div className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
            <ShieldCheck size={16} className="text-teal-600 dark:text-teal-400" />
            SkillCredits Economic & Safety Policies
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)]">
              <div className="font-semibold text-teal-600 dark:text-teal-400 mb-1">100% Currency-Free</div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                SkillCredits have zero cash equivalent. They cannot be sold, converted, or cashed out, preventing commercial exploitation.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)]">
              <div className="font-semibold text-teal-600 dark:text-teal-400 mb-1">Escrow Safety Verification</div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Credits are held in temporary escrow upon booking and only released to the mentor after both parties confirm the session.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)]">
              <div className="font-semibold text-teal-600 dark:text-teal-400 mb-1">Academic Workload Cap</div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Mentoring is capped at 2 hours per week per student to safeguard academic focus and prevent student burnout.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}
