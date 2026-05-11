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

## Features (as of Day 3)
- Landing page with hero, problem statement, how-it-works, and CTA
- Dynamic audit form — add/remove AI tools, select plans, enter spend & seats
- **Audit Engine V2** — Deterministic logic with priority scoring and confidence levels
- **AI Summary** — Anthropic Claude-3 Haiku generates executive summaries of findings
- **Lead Capture** — Animated conversion flow with email validation and honeypot protection
- **Supabase Backend** — Persistent storage for leads and audit snapshots
- **Transactional Emails** — Results delivered via Resend with consultation CTAs
- Local persistence — form data survives refresh
- Mobile-responsive layout with glassmorphism navbar
