'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { useDemoStore } from '@/lib/store';
import {
  Coins, Menu, X, ChevronDown, Sparkles,
  Calendar, Layers, ShieldCheck, Compass, HeartHandshake
} from 'lucide-react';

const appNavLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: Layers },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/matches', label: 'Matches', icon: Sparkles },
  { href: '/sessions', label: 'Sessions', icon: Calendar },
  { href: '/wallet', label: 'Wallet', icon: Coins },
  { href: '/community', label: 'Community', icon: HeartHandshake },
];

export function AppHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const {
    currentUserId,
    getCurrentUser,
    getUserBalance,
    users,
    switchDemoUser,
    logout,
  } = useDemoStore();

  const user = getCurrentUser();
  const balance = currentUserId ? getUserBalance(currentUserId) : { available: 0, reserved: 0 };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-default)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-4 lg:gap-6 min-w-0">
          <Logo size="sm" />

          {/* Desktop Nav links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="App Navigation">
            {appNavLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[var(--teal)]/15 text-teal-600 dark:text-teal-400 font-bold'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon size={16} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Balance Pill, Persona Switcher, Theme Toggle, Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* SkillCredits Pill */}
          <Link
            href="/wallet"
            id="nav-wallet-pill"
            className="group flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 transition-all text-xs font-medium"
            title="View SkillCredits Ledger"
          >
            <Coins size={14} className="text-teal-600 dark:text-teal-400 group-hover:rotate-12 transition-transform shrink-0" />
            <span className="font-mono font-bold text-xs sm:text-sm">{balance.available.toFixed(1)}</span>
            <span className="hidden sm:inline text-[11px] opacity-85">SkillCredits</span>
            <span className="sm:hidden text-[10px] font-bold opacity-80">Cr</span>
            {balance.reserved > 0 && (
              <span className="hidden md:inline-flex text-[10px] bg-teal-600/20 text-teal-800 dark:text-teal-200 px-1.5 py-0.2 rounded-full font-mono">
                {balance.reserved.toFixed(1)} res
              </span>
            )}
          </Link>

          <ThemeToggle />

          {/* User Persona Dropdown - hidden on small mobile to fit hamburger cleanly, accessible in mobile drawer */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors border border-transparent hover:border-[var(--border-default)]"
              aria-expanded={userDropdownOpen}
              aria-label="User Account Menu"
              id="user-account-menu-btn"
            >
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold text-white shadow-sm shrink-0"
                style={{ backgroundColor: user?.avatarColor || '#0C9D9A' }}
              >
                {user?.avatarInitials || 'UM'}
              </div>
              <div className="hidden md:block text-left">
                <span className="block text-xs font-bold leading-tight text-[var(--text-primary)]">
                  {user?.displayName || 'Student'}
                </span>
                <span className="block text-[10px] text-[var(--text-secondary)] leading-none">
                  {user?.faculty.split(' ')[0]}
                </span>
              </div>
              <ChevronDown size={12} className="text-[var(--text-muted)] hidden sm:block" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-2xl p-2 z-50 text-xs">
                <div className="p-2 border-b border-[var(--border-default)] mb-1">
                  <div className="font-bold text-[var(--text-primary)]">{user?.displayName}</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">{user?.email}</div>
                  <div className="mt-1 text-[10px] inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--bg-tertiary)] text-[var(--text-secondary)] font-medium">
                    <ShieldCheck size={11} className="text-teal-500" /> UM Siswa Verified
                  </div>
                </div>

                <div className="px-2 py-1 text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                  Switch Demo Persona
                </div>

                <div className="flex flex-col gap-0.5">
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchDemoUser(u.id);
                        setUserDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors ${
                        u.id === currentUserId
                          ? 'bg-[var(--teal)]/15 text-teal-600 dark:text-teal-400 font-semibold'
                          : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0"
                          style={{ backgroundColor: u.avatarColor }}
                        >
                          {u.avatarInitials}
                        </span>
                        <span className="font-medium">{u.displayName}</span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)]">{u.faculty.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-[var(--border-default)] mt-1.5 pt-1">
                  <Link
                    href="/login"
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full block px-2 py-1.5 rounded-lg text-left text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-medium"
                  >
                    Log Out / Switch Mode
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-3.5 flex flex-col gap-2 shadow-xl animate-fade-in">
          {/* Active User Summary on mobile menu */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] mb-1">
            <div className="flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0"
                style={{ backgroundColor: user?.avatarColor || '#0C9D9A' }}
              >
                {user?.avatarInitials}
              </span>
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)]">{user?.displayName}</div>
                <div className="text-[10px] text-[var(--text-secondary)]">{user?.faculty} (Yr {user?.yearOfStudy})</div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
              {balance.available.toFixed(1)} Cr
            </span>
          </div>

          {appNavLinks.map(link => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--teal)]/15 text-teal-600 dark:text-teal-400 font-bold'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
