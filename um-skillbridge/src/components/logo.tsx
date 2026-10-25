import Link from 'next/link';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 36, text: 'text-xl' },
    lg: { icon: 44, text: 'text-2xl' },
  };
  const s = sizes[size];

  return (
    <Link href="/" className="flex items-center gap-2 group" aria-label="UM SkillBridge Home">
      <div className="relative" style={{ width: s.icon, height: s.icon }}>
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Bridge arch */}
          <path
            d="M4 36 C4 20, 24 8, 44 20"
            stroke="var(--teal)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            className="group-hover:stroke-[var(--bright-teal)] transition-colors"
          />
          <path
            d="M4 36 C4 28, 24 16, 44 28"
            stroke="var(--royal-blue)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
          {/* Left pillar */}
          <rect x="6" y="30" width="4" height="12" rx="2" fill="var(--deep-navy)" />
          {/* Right pillar */}
          <rect x="38" y="24" width="4" height="18" rx="2" fill="var(--deep-navy)" />
          {/* Connection dots */}
          <circle cx="14" cy="26" r="3" fill="var(--teal)" />
          <circle cx="24" cy="18" r="3" fill="var(--warm-orange)" />
          <circle cx="34" cy="22" r="3" fill="var(--bright-teal)" />
          {/* Connection lines */}
          <line x1="14" y1="26" x2="24" y2="18" stroke="var(--teal)" strokeWidth="1" opacity="0.4" />
          <line x1="24" y1="18" x2="34" y2="22" stroke="var(--teal)" strokeWidth="1" opacity="0.4" />
        </svg>
      </div>
      <div className={`font-heading font-bold ${s.text} tracking-tight`}>
        <span style={{ color: 'var(--deep-navy)' }} className="dark:text-white">UM</span>
        <span className="gradient-text ml-0.5">SkillBridge</span>
      </div>
    </Link>
  );
}
