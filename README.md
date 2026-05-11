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

## Features (as of Day 2)
- Landing page with hero, problem statement, how-it-works, and CTA
- Dynamic audit form — add/remove AI tools, select plans, enter spend & seats
- Rule-based audit engine that detects overspending patterns
- Results page with savings summary and per-tool recommendations
- Local persistence — form data survives refresh
- Mobile-responsive layout with glassmorphism navbar
