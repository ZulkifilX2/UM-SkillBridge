'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { useDemoStore } from '@/lib/store';

const navLinks = [
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/explore', label: 'Explore Skills' },
  { href: '/community', label: 'Community' },
  { href: '/about', label: 'Our Mission' },
];

export function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useDemoStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass shadow-md py-2'
            : 'py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between" aria-label="Main navigation">
          <Logo />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-[var(--bg-tertiary)] focus-visible:outline-2 focus-visible:outline-[var(--teal)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 text-sm font-semibold rounded-[var(--radius-md)] text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium rounded-[var(--radius-md)] transition-colors hover:bg-[var(--bg-tertiary)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Log In
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-sm font-semibold rounded-[var(--radius-md)] text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="md:hidden glass border-t"
              style={{ borderColor: 'var(--border-default)' }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-base font-medium rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-2" style={{ borderColor: 'var(--border-default)' }} />
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-center font-semibold rounded-[var(--radius-md)] text-white"
                    style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 text-center font-medium rounded-[var(--radius-md)] transition-colors hover:bg-[var(--bg-tertiary)]"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 text-center font-semibold rounded-[var(--radius-md)] text-white"
                      style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
