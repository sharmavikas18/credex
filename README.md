# AI Spend Audit

A polished SaaS tool for startups to audit their AI tool spending and find savings.

## Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State**: Zustand with localStorage persistence
- **Validation**: Zod (planned for form schemas)
- **Database**: Supabase (planned)

## Getting Started
```bash
npm install
npm run dev
```

## Features (as of Day 4)
- Landing page with hero, problem statement, how-it-works, and CTA
- Dynamic audit form — add/remove AI tools, select plans, enter spend & seats
- **Audit Engine V2** — Deterministic logic with priority scoring, confidence levels, and tie-breaker handling
- **AI Summary** — Anthropic Claude-3 Haiku generates executive summaries of findings
- **Public Share URLs** — Unique, SEO-optimized public pages for sharing results
- **Dynamic OG Previews** — Auto-generated social cards showing potential savings
- **Visual Analytics** — Interactive Recharts visualizations for spend distribution
- **Testing Suite** — Vitest infrastructure with automated audit engine unit tests
- **CI/CD Pipeline** — GitHub Actions for automated linting, typechecking, and testing
- **Accessibility & UX** — ARIA-compliant forms with skeleton loaders and error boundaries
- **Supabase Backend** — Persistent storage for leads and audit snapshots
- **Transactional Emails** — Results delivered via Resend with consultation CTAs
- Local persistence — form data survives refresh
- Mobile-responsive layout with glassmorphism navbar
