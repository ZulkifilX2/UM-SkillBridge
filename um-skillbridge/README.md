# UM SkillBridge — Peer Knowledge & Skill Exchange Platform

> **"Learn One. Teach One. Grow Together."**
> A proposed student-powered peer learning network connecting Universiti Malaya students to exchange academic and practical skills using time-based SkillCredits.

---

## Overview

UM SkillBridge evolves from a hackathon prototype into a multi-user web platform.

### Core Principles
- **Reciprocal Peer Learning**: Every student is both a teacher and a learner.
- **Time Banking**: 1 hour of mentoring earns 1.0 SkillCredit; 1 hour of learning uses 1.0 SkillCredit.
- **Academic & Practical Exchange**: From Python, Calculus, and Data Analysis to Figma UI Design and Public Speaking.
- **Independent Student Initiative**: Verified via official Universiti Malaya student webmail (`@siswa.um.edu.my`), without claiming official administrative affiliation or university SSO integration.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, SSR)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, CSS variables design system with full Light/Dark mode
- **Animations**: Framer Motion
- **Authentication & Database**: Supabase (PostgreSQL, Row Level Security, `@supabase/ssr`)
- **State Management**:
  - Supabase SSR for authoritative user sessions, profiles, skills, availability, and credit ledgers
  - Zustand for ephemeral client UI state and offline demo rig simulation
- **Testing**: Vitest with 100% passing authorization and schema validation tests

---

## Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ZulkifilX2/UM-SkillBridge.git
cd um-skillbridge
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Database Migrations
In your Supabase project SQL Editor or via Supabase CLI, run the migrations in sequential order:
1. `supabase/migrations/20261101000001_initial_schema.sql`
2. `supabase/migrations/20261101000002_row_level_security.sql`
3. `supabase/migrations/20261101000003_seed_skills.sql`
4. `supabase/migrations/20261101000004_helper_functions.sql`

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing & Quality Assurance

Run unit tests and security validation suite:
```bash
npm test
```

Run linter:
```bash
npm run lint
```

Build production bundle:
```bash
npm run build
```

---

## Modes of Operation

1. **Production Student Account**:
   - Register or sign in with your `@siswa.um.edu.my` student email.
   - Click the confirmation link sent to your student webmail.
   - Claim your initial 1.0 Welcome SkillCredit grant.
   - Manage your teachable skills, learning goals, and weekly availability at `/profile`.

2. **Offline Hackathon Demo Rig**:
   - For evaluators, recruiters, and judges without an active UM student email.
   - Available on `/login` under "1-Click Demo Personas" (Aisha, Daniel, Mei, Raj, Sarah).
   - Test reciprocal matchmaking, session booking, and credit simulation instantly.

---

## Security & Authorization

- **Row Level Security (RLS)** is enabled on all 10 database tables.
- **Credit Balances & Transactions**: Blocked from client modification; balances are maintained strictly through backend database procedures.
- **Domain Verification**: Enforced at the client input, server action, and database constraint levels.
