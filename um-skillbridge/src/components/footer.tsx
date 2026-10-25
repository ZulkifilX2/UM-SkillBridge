import Link from 'next/link';
import { Logo } from './logo';
import { Heart } from 'lucide-react';

const footerLinks = {
  Platform: [
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/explore', label: 'Explore Skills' },
    { href: '/community', label: 'Community' },
  ],
  About: [
    { href: '/about', label: 'Our Mission' },
    { href: '/about#team', label: 'Team' },
    { href: '/about#academic', label: 'Academic Foundations' },
  ],
  Safety: [
    { href: '/safety', label: 'Code of Conduct' },
    { href: '/safety#privacy', label: 'Privacy' },
    { href: '/safety#integrity', label: 'Academic Integrity' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo size="sm" />
            <p className="mt-4 text-sm leading-relaxed max-w-sm" style={{ color: 'var(--text-secondary)' }}>
              A proposed student-powered skill exchange platform connecting Universiti Malaya students through free, collaborative peer learning.
            </p>
            <p className="mt-3 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              Learn One. Teach One. Grow Together.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-[var(--teal)]"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderColor: 'var(--border-default)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © 2026 UM SkillBridge — Universiti Malaya Laureate Innovation Hackathon Project
          </p>
          <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            Made with <Heart size={12} className="text-[var(--warm-orange)]" fill="var(--warm-orange)" /> by UM students
          </p>
        </div>
      </div>
    </footer>
  );
}
