'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Sparkles, Users, GraduationCap, Clock, DollarSign,
  Code2, Palette, Mic, Languages, BarChart3, Calculator, Brain,
  Target, Shield, Zap, Heart, ChevronRight, BookOpen, Lightbulb,
  HandshakeIcon, TrendingUp, Award
} from 'lucide-react';
import { PublicNavbar } from '@/components/public-navbar';
import { Footer } from '@/components/footer';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeUp}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
// HERO SECTION
// ============================================================
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-20 -right-32 w-[600px] h-[600px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, var(--bright-teal) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, var(--royal-blue) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, var(--warm-orange) 0%, transparent 60%)' }} />
        
        {/* Abstract bridge arc */}
        <svg className="absolute bottom-0 left-0 right-0 w-full h-40 opacity-[0.06]" viewBox="0 0 1440 160" preserveAspectRatio="none">
          <path d="M0 160 Q360 20, 720 80 Q1080 140, 1440 40 L1440 160 Z" fill="var(--teal)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{
                background: 'var(--soft-orange)',
                color: 'var(--orange-700)',
                border: '1px solid var(--orange-100)',
              }}
            >
              <Sparkles size={14} />
              Universiti Malaya Laureate Innovation Hackathon
            </motion.div>

            <motion.h1
              className="font-heading font-extrabold tracking-tight leading-[1.1] mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              The Skills You Need{' '}
              <span className="gradient-text">Are Already</span>{' '}
              Around You.
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8"
              style={{ color: 'var(--text-secondary)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Connect with students across Universiti Malaya. Teach what you know, learn what you love, and grow together — without spending a ringgit.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Link
                href="/login"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold rounded-xl text-white transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
              >
                Start Skill Swapping
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold rounded-xl transition-all duration-200 hover:shadow-md border hover:-translate-y-0.5 active:translate-y-0"
                style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
              >
                Explore Skills
              </Link>
            </motion.div>

            <motion.p
              className="mt-6 text-sm"
              style={{ color: 'var(--text-muted)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Link href="/#how-it-works" className="hover:text-[var(--teal)] transition-colors inline-flex items-center gap-1">
                See How It Works <ChevronRight size={14} />
              </Link>
            </motion.p>
          </div>

          {/* Right: Illustration area with floating cards */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Central illustration: Abstract bridge with connected nodes */}
            <div className="relative w-full aspect-square max-w-[520px] mx-auto">
              <svg viewBox="0 0 500 500" fill="none" className="w-full h-full">
                {/* Background circle */}
                <circle cx="250" cy="250" r="220" fill="var(--pale-sky)" opacity="0.3" />
                <circle cx="250" cy="250" r="180" fill="var(--teal-50)" opacity="0.3" />

                {/* Bridge arch */}
                <path d="M80 350 Q170 180, 250 200 Q330 220, 420 280" stroke="var(--teal)" strokeWidth="4" strokeLinecap="round" fill="none" className="bridge-line" />
                <path d="M100 360 Q180 220, 250 240 Q320 260, 400 300" stroke="var(--royal-blue)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3" />

                {/* Student nodes */}
                {/* Node 1: Programming */}
                <circle cx="120" cy="180" r="28" fill="var(--deep-navy)" opacity="0.1" />
                <circle cx="120" cy="180" r="22" fill="var(--royal-blue)" />
                <text x="120" y="185" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{'</>'}</text>

                {/* Node 2: Design */}
                <circle cx="380" cy="160" r="28" fill="var(--warm-orange)" opacity="0.1" />
                <circle cx="380" cy="160" r="22" fill="var(--warm-orange)" />
                <text x="380" y="165" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">🎨</text>

                {/* Node 3: Speaking */}
                <circle cx="250" cy="120" r="28" fill="var(--teal)" opacity="0.1" />
                <circle cx="250" cy="120" r="22" fill="var(--teal)" />
                <text x="250" y="125" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">🎙</text>

                {/* Node 4: Language */}
                <circle cx="160" cy="310" r="24" fill="var(--bright-teal)" opacity="0.1" />
                <circle cx="160" cy="310" r="18" fill="var(--bright-teal)" />
                <text x="160" y="315" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Aa</text>

                {/* Node 5: Data */}
                <circle cx="340" cy="330" r="24" fill="var(--deep-navy)" opacity="0.1" />
                <circle cx="340" cy="330" r="18" fill="var(--deep-navy)" />
                <text x="340" y="335" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">📊</text>

                {/* Connection lines */}
                <line x1="140" y1="190" x2="230" y2="130" stroke="var(--teal)" strokeWidth="1.5" opacity="0.3" strokeDasharray="4 4" />
                <line x1="270" y1="130" x2="360" y2="170" stroke="var(--teal)" strokeWidth="1.5" opacity="0.3" strokeDasharray="4 4" />
                <line x1="130" y1="200" x2="160" y2="295" stroke="var(--royal-blue)" strokeWidth="1" opacity="0.2" strokeDasharray="4 4" />
                <line x1="370" y1="180" x2="340" y2="315" stroke="var(--royal-blue)" strokeWidth="1" opacity="0.2" strokeDasharray="4 4" />
                <line x1="175" y1="310" x2="325" y2="330" stroke="var(--bright-teal)" strokeWidth="1" opacity="0.2" strokeDasharray="4 4" />

                {/* Center hub */}
                <circle cx="250" cy="250" r="36" fill="var(--deep-navy)" />
                <circle cx="250" cy="250" r="32" fill="var(--teal)" />
                <text x="250" y="244" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">Skill</text>
                <text x="250" y="260" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">Bridge</text>
              </svg>

              {/* Floating skill cards */}
              <motion.div
                className="absolute -top-2 right-8 glass rounded-xl px-4 py-3 shadow-lg"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--royal-blue)' }}>
                    <Code2 size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Python Mentoring</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Advanced · Online</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-24 -left-4 glass rounded-xl px-4 py-3 shadow-lg"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--warm-orange)' }}>
                    <Palette size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Canva Design</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Beginner · In-Person</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-16 -right-4 glass rounded-xl px-3 py-2 shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              >
                <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--warm-orange)' }}>
                  <Sparkles size={12} />
                  +1 SkillCredit
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-4 left-12 glass rounded-xl px-3 py-2 shadow-lg"
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'var(--teal)' }}>
                    <Users size={10} className="text-white" />
                  </div>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>New Skill Match!</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// IMPACT PREVIEW
// ============================================================
function ImpactPreview() {
  const metrics = [
    { value: '20', label: 'Pilot Signup Target', icon: Target, note: 'Goal' },
    { value: '5', label: 'Planned Peer Sessions', icon: Users, note: 'Goal' },
    { value: 'RM0', label: 'Proposed New Budget', icon: DollarSign, note: 'Target' },
    { value: '∞', label: 'Possibilities', icon: Sparkles, note: '' },
  ];

  return (
    <section className="py-8 border-y" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                className="text-center"
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2" style={{ background: 'var(--teal-50)' }}>
                  <m.icon size={18} style={{ color: 'var(--teal)' }} />
                </div>
                <div className="text-2xl md:text-3xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                  {m.value}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{m.label}</div>
                {m.note && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full" style={{ background: 'var(--soft-orange)', color: 'var(--orange-700)' }}>
                    {m.note}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ============================================================
// CAMPUS DILEMMA
// ============================================================
function CampusDilemma() {
  const problems = [
    {
      icon: DollarSign,
      title: 'The Cost Barrier',
      description: 'Commercial classes, bootcamps, and private tutoring can be expensive — especially for students already managing tuition and living costs.',
      color: 'var(--warm-orange)',
      bgColor: 'var(--soft-orange)',
    },
    {
      icon: Users,
      title: 'The Faculty Divide',
      description: 'Students often have limited opportunities to share skills or collaborate meaningfully outside their own departments and disciplines.',
      color: 'var(--royal-blue)',
      bgColor: 'var(--pale-sky)',
    },
    {
      icon: Target,
      title: 'The Skill Gap',
      description: 'The modern world demands abilities beyond any single academic specialty — from coding to design, communication to data literacy.',
      color: 'var(--teal)',
      bgColor: 'var(--teal-50)',
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: 'var(--soft-orange)', color: 'var(--orange-700)' }}>
            The Challenge
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            The Campus Dilemma
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Talented students are everywhere — but connecting the right skills with the right people isn&apos;t always easy.
          </p>
        </AnimatedSection>

        <motion.div
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {problems.map((p) => (
            <motion.div
              key={p.title}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="group relative rounded-2xl p-8 transition-all duration-300 border hover:shadow-lg hover:-translate-y-1"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{ background: p.bgColor }}>
                <p.icon size={24} style={{ color: p.color }} />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// SOLUTION SECTION
// ============================================================
function SolutionSection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <svg width="100%" height="100%" viewBox="0 0 1440 600" preserveAspectRatio="none">
          <path d="M0 300 Q360 100, 720 250 Q1080 400, 1440 200" stroke="var(--teal)" strokeWidth="3" fill="none" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: 'var(--teal-50)', color: 'var(--teal-700)' }}>
            <Lightbulb size={12} /> The Solution
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            One Campus. Thousands of Skills.{' '}
            <span className="gradient-text">Endless Possibilities.</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            SkillBridge makes existing student knowledge easier to discover and exchange through time-based SkillCredits.
          </p>
        </AnimatedSection>

        {/* Matching Example */}
        <AnimatedSection delay={0.2}>
          <div className="max-w-3xl mx-auto rounded-2xl p-8 md:p-10 border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}>
            <h3 className="text-center text-lg font-heading font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
              See How a Match Works
            </h3>
            <div className="grid md:grid-cols-3 gap-6 items-center">
              {/* Student A */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-lg font-bold" style={{ background: 'var(--teal)' }}>AI</div>
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>Aisha</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Computer Science</div>
                <div className="mt-3 space-y-1">
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--teal-50)', color: 'var(--teal-700)' }}>Teaches: Python</div>
                  <div className="block" />
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--soft-orange)', color: 'var(--orange-700)' }}>Wants: Canva</div>
                </div>
              </div>

              {/* Connection */}
              <div className="flex flex-col items-center gap-2">
                <svg className="w-full h-16 hidden md:block" viewBox="0 0 200 60">
                  <path d="M10 30 Q100 0, 190 30" stroke="var(--teal)" strokeWidth="2" fill="none" strokeDasharray="6 4" />
                  <path d="M190 30 Q100 60, 10 30" stroke="var(--warm-orange)" strokeWidth="2" fill="none" strokeDasharray="6 4" />
                  <circle cx="100" cy="15" r="8" fill="var(--teal)" />
                  <circle cx="100" cy="45" r="8" fill="var(--warm-orange)" />
                </svg>
                <div className="px-4 py-2 rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}>
                  ✨ Reciprocal Match!
                </div>
                <p className="text-[11px] text-center max-w-[180px]" style={{ color: 'var(--text-muted)' }}>
                  Direct reciprocity is a bonus — SkillCredits enable exchange across the whole network
                </p>
              </div>

              {/* Student B */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-lg font-bold" style={{ background: 'var(--warm-orange)' }}>DA</div>
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>Daniel</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Creative Arts</div>
                <div className="mt-3 space-y-1">
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--soft-orange)', color: 'var(--orange-700)' }}>Teaches: Canva</div>
                  <div className="block" />
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--teal-50)', color: 'var(--teal-700)' }}>Wants: Python</div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ============================================================
// HOW IT WORKS
// ============================================================
function HowItWorks() {
  const steps = [
    { step: 1, title: 'Join the Community', description: 'Register and identify skills you can teach and want to learn.', icon: GraduationCap, color: 'var(--royal-blue)' },
    { step: 2, title: 'Discover Your Match', description: 'Browse compatible students and receive smart recommendations.', icon: Users, color: 'var(--teal)' },
    { step: 3, title: 'Meet and Learn', description: 'Arrange safe online sessions or meetings in suitable campus spaces.', icon: BookOpen, color: 'var(--bright-teal)' },
    { step: 4, title: 'Earn and Exchange', description: 'Earn SkillCredits through teaching and spend them on learning.', icon: Award, color: 'var(--warm-orange)' },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: 'var(--teal-50)', color: 'var(--teal-700)' }}>
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            Four Steps to{' '}
            <span className="gradient-text">Shared Growth</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Getting started is simple. Your skills have value — start sharing them today.
          </p>
        </AnimatedSection>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="relative group"
            >
              {/* Connector line (between cards) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 -right-3 w-6 border-t-2 border-dashed" style={{ borderColor: 'var(--border-default)' }} />
              )}

              <div className="rounded-2xl p-7 h-full border transition-all duration-300 hover:shadow-lg hover:-translate-y-1" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: s.color }}>
                    {String(s.step).padStart(2, '0')}
                  </div>
                  <s.icon size={22} style={{ color: s.color }} />
                </div>
                <h3 className="text-lg font-heading font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// POPULAR SKILLS
// ============================================================
function PopularSkills() {
  const categories = [
    { name: 'Programming', icon: Code2, color: '#1769C2', count: 4 },
    { name: 'AI & Data Science', icon: Brain, color: '#7C3AED', count: 2 },
    { name: 'Graphic Design', icon: Palette, color: '#EC4899', count: 3 },
    { name: 'Business', icon: TrendingUp, color: '#F59E0B', count: 2 },
    { name: 'Languages', icon: Languages, color: '#10B981', count: 2 },
    { name: 'Public Speaking', icon: Mic, color: '#FF943B', count: 1 },
    { name: 'Mathematics', icon: Calculator, color: '#6366F1', count: 1 },
    { name: 'Productivity', icon: BarChart3, color: '#0C9D9A', count: 1 },
  ];

  return (
    <section className="py-20 md:py-28" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: 'var(--pale-sky)', color: 'var(--royal-blue)' }}>
            Skill Categories
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            Discover What Students{' '}
            <span className="gradient-text">Are Sharing</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            From programming to public speaking, explore skills across every faculty.
          </p>
        </AnimatedSection>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {categories.map((cat) => (
            <motion.div key={cat.name} variants={scaleIn} transition={{ duration: 0.4 }}>
              <Link
                href="/explore"
                className="group block rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-center"
                style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}
              >
                <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${cat.color}15` }}>
                  <cat.icon size={24} style={{ color: cat.color }} />
                </div>
                <h3 className="text-sm font-heading font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{cat.name}</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{cat.count} skills available</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <AnimatedSection className="text-center mt-10" delay={0.3}>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-md border hover:-translate-y-0.5"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
          >
            Browse All Skills <ArrowRight size={16} />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ============================================================
// WHY DIFFERENT
// ============================================================
function WhyDifferent() {
  const values = [
    { icon: DollarSign, title: 'No Money Required', description: 'Exchange skills using time-based SkillCredits. Your expertise is the only currency.', color: 'var(--warm-orange)' },
    { icon: Users, title: 'Cross-Faculty Collaboration', description: 'Connect with students from different disciplines and discover new perspectives.', color: 'var(--royal-blue)' },
    { icon: Clock, title: 'Flexible Peer Learning', description: 'Choose when, where, and how you learn. Online or in-person, at your own pace.', color: 'var(--teal)' },
    { icon: Shield, title: 'Safe & Accessible', description: 'Built with safety, privacy, academic integrity, and inclusion at its foundation.', color: 'var(--deep-navy)' },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            Why SkillBridge Is{' '}
            <span className="gradient-text">Different</span>
          </h2>
        </AnimatedSection>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {values.map((v) => (
            <motion.div
              key={v.title}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-7 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${v.color}15` }}>
                <v.icon size={22} style={{ color: v.color }} />
              </div>
              <h3 className="text-base font-heading font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{v.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{v.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// ACADEMIC FOUNDATIONS
// ============================================================
function AcademicFoundations() {
  const foundations = [
    {
      title: 'Time Banking',
      description: 'A reciprocal service-sharing model where time spent helping others creates a balance that can be used to receive help.',
      icon: Clock,
      color: 'var(--warm-orange)',
    },
    {
      title: "Vygotsky's Zone of Proximal Development",
      description: 'Students learn more effectively through scaffolded assistance from peers who already understand a topic.',
      icon: Lightbulb,
      color: 'var(--teal)',
    },
    {
      title: 'Social Exchange Theory',
      description: 'Social relationships are strengthened by reciprocity, cooperation, trust, and mutual benefit.',
      icon: HandshakeIcon,
      color: 'var(--royal-blue)',
    },
  ];

  return (
    <section className="py-20 md:py-28" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: 'var(--pale-sky)', color: 'var(--royal-blue)' }}>
            <GraduationCap size={12} /> Academic Foundations
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            Grounded in{' '}
            <span className="gradient-text">Research</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            SkillBridge is built on established educational and social theories.
          </p>
        </AnimatedSection>

        <motion.div
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {foundations.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-8 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `${f.color}15` }}>
                <f.icon size={22} style={{ color: f.color }} />
              </div>
              <h3 className="text-lg font-heading font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// CTA SECTION
// ============================================================
function CTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, var(--deep-navy), var(--midnight-navy))' }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, var(--teal) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, var(--warm-orange) 0%, transparent 70%)' }} />
        {/* Subtle bridge arc */}
        <svg className="absolute bottom-0 left-0 right-0 w-full h-24 opacity-10" viewBox="0 0 1440 96" preserveAspectRatio="none">
          <path d="M0 96 Q360 0, 720 48 Q1080 96, 1440 24" stroke="var(--bright-teal)" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 text-white leading-tight">
            Your Next Mentor Might Be{' '}
            <span style={{ color: 'var(--bright-teal)' }}>Sitting Right Beside You.</span>
          </h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Start with one skill. Build a connection that lasts.
          </p>
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-xl text-white transition-all duration-200 hover:shadow-2xl hover:-translate-y-1"
            style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
          >
            Join UM SkillBridge
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="mt-8 text-sm font-medium" style={{ color: 'var(--bright-teal)' }}>
            Our greatest resource is each other.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ============================================================
// HOMEPAGE
// ============================================================
export default function HomePage() {
  return (
    <>
      <PublicNavbar />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <ImpactPreview />
        <CampusDilemma />
        <SolutionSection />
        <HowItWorks />
        <PopularSkills />
        <WhyDifferent />
        <AcademicFoundations />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
