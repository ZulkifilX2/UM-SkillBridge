'use client';

import Link from 'next/link';
import { PublicNavbar } from '@/components/public-navbar';
import { Footer } from '@/components/footer';
import {
  GraduationCap, Sparkles, BookOpen, Clock, ShieldCheck,
  HeartHandshake, Award, ArrowRight, Lightbulb, Users
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <PublicNavbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex flex-col gap-12">
        {/* Mission Hero */}
        <section className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-4 border border-teal-500/20">
            <GraduationCap size={14} /> Universiti Malaya Laureate Innovation Hackathon
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Learn One. Teach One. <br />
            <span className="text-teal-600 dark:text-teal-400">Grow Together.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            UM SkillBridge is a student-powered, currency-free peer learning initiative created to prove our most transformative thesis:
            <span className="block mt-2 font-bold text-[var(--text-primary)]">
              &ldquo;Our greatest resource is each other.&rdquo;
            </span>
          </p>
        </section>

        {/* The Campus Dilemma */}
        <section className="p-8 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm flex flex-col gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">The Problem We Saw</span>
            <h2 className="text-2xl font-bold mt-1">Why Peer Exchange Was Broken at UM</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)]">
              <div className="text-rose-500 font-bold text-sm mb-1">Financial Barriers</div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Commercial coding bootcamps and design tutoring cost RM 50 to RM 150/hour — out of reach for students already budgeting tight PTPTN allowances.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)]">
              <div className="text-rose-500 font-bold text-sm mb-1">Inter-Faculty Silos</div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                FCSIT programmers struggle with pitch design. Creative Arts designers struggle with basic code. Both study 500 meters apart, yet have no bridge to connect.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)]">
              <div className="text-rose-500 font-bold text-sm mb-1">Commercial Exploitation</div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Tutoring gigs often turn into transactional side-hustles that detract from academic focus, rather than reciprocal campus camaraderie.
              </p>
            </div>
          </div>
        </section>

        {/* Academic Foundations */}
        <section className="p-8 rounded-3xl bg-gradient-to-br from-[var(--deep-navy)] to-[#0A2647] text-white shadow-xl flex flex-col gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Academic & Economic Foundations</span>
            <h2 className="text-2xl font-bold mt-1">Grounded in Proven Pedagogy & Time Economics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-teal-300">
                <Lightbulb size={16} /> Edgar Cahn’s Time Banking (Co-Production)
              </div>
              <p>
                In standard market economics, price equates to scarcity. In SkillBridge, human time is inherently equal: 1 hour spent teaching calculus carries the exact same value as 1 hour spent coaching conversational Mandarin or slide design. Everyone has something of genuine value to teach.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-teal-300">
                <Users size={16} /> Vygotsky’s Zone of Proximal Development (ZPD)
              </div>
              <p>
                Educational psychology demonstrates that near-peer tutors (students 1–2 years ahead) often explain complex stumbling blocks more intuitively than professors because they recently overcame the exact same cognitive hurdles.
              </p>
            </div>
          </div>
        </section>

        {/* The 4 Core Principles */}
        <section className="flex flex-col gap-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold">Our Non-Negotiable Core Principles</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Engineered specifically for student welfare and academic excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold mb-3">
                1
              </div>
              <h3 className="font-bold text-sm mb-1">Strictly Currency-Free</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Zero cash conversions. No subscriptions, ads, or monetization. Pure student reciprocity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold mb-3">
                2
              </div>
              <h3 className="font-bold text-sm mb-1">2-Hour Weekly Cap</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Tutoring is capped at 2 hours/week to safeguard students from burnout and prioritize coursework.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold mb-3">
                3
              </div>
              <h3 className="font-bold text-sm mb-1">Siswa Verification</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Exclusive to verified Universiti Malaya students with official `@siswa.um.edu.my` accounts.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold mb-3">
                4
              </div>
              <h3 className="font-bold text-sm mb-1">Escrow Integrity</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                SkillCredits are safely reserved during booking and only settled after both peers confirm.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-center flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold">Ready to Start Learning & Mentoring?</h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg">
            Join hundreds of UM peers who are trading skills, building friendships, and unlocking new capabilities together.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <Link
              href="/login"
              id="btn-about-join"
              className="px-6 py-3 rounded-xl font-bold text-xs text-white shadow-md transition-all hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--teal), var(--bright-teal))' }}
            >
              Get Started with 1.0 Free Credit
            </Link>
            <Link
              href="/explore"
              id="btn-about-explore"
              className="px-5 py-3 rounded-xl font-semibold text-xs border border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              Browse Skills Directory
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
