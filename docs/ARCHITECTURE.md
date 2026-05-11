# Architecture

## Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with Navbar + Footer
│   ├── page.tsx            # Landing page (marketing)
│   ├── audit/page.tsx      # Audit form page
│   ├── results/[id]/       # Results page (reads from store)
│   └── about/page.tsx      # About page
├── components/
│   ├── ui/                 # shadcn/ui primitives (Button, Card, Select, etc.)
│   ├── layout/             # Navbar, Footer, HydrationBoundary
│   ├── marketing/          # Hero, Problem, HowItWorks, CTA
│   └── forms/              # AuditForm, ToolEntryRow, ResultsView
├── lib/
│   ├── ai/
│   │   └── summary.ts      # Anthropic summary logic
│   ├── resend/
│   │   └── client.ts       # Email client
│   ├── supabase/
│   │   ├── client.ts       # DB client
│   │   └── schema.sql      # Database schema
│   ├── constants/
│   │   └── pricing.ts      # Centralized tool & pricing data
│   ├── types/
│   │   └── index.ts        # All TypeScript interfaces
│   ├── audit-engine/
│   │   ├── index.ts         # runAudit() — main entry point
│   │   └── rules.ts         # Individual audit rules
│   ├── store.ts             # Zustand store with persist
│   └── utils.ts             # cn() helper
└── styles/                  # (reserved for custom styles)
```

## State Management
- **Zustand** with `persist` middleware → localStorage
- Single store handles form data (`AuditFormData`) and last result (`AuditResult`)
- `HydrationBoundary` component wraps client-side consumers to prevent SSR mismatch

## Backend Integration
- **Supabase**: Used for storing leads and audit snapshots.
- **Resend**: Transactional email service for delivering results.
- **Anthropic**: Claude-3-Haiku generates executive summaries.

## Audit Engine Architecture (v2)
```
AuditFormData → runAudit() → AuditResult → AI Summary
                    │             │
                    ├── Rules V2  ├── leads API
                    │             └── emails
```

Rules are prioritized (High/Med/Low) and categorized (Cost/Overlap/Efficiency).
Findings include a confidence score to maintain transparency.

## Lead Flow
1. User views Audit Results.
2. AI Summary loads asynchronously.
3. User interacts with Lead Capture form.
4. API Route:
   - Validates (Honeypot).
   - Saves Lead to Supabase.
   - Saves Audit snapshot to Supabase.
   - Sends Transactional Email via Resend.

Rules are evaluated per-tool-entry in priority order. First matching rule wins.
Each rule produces a `Recommendation` with type, suggested plan, savings, and reasoning.

## Data Flow
1. User fills form → Zustand store (auto-persisted to localStorage)
2. User clicks "Run Audit" → `runAudit(formData)` executes rules
3. Result stored in Zustand → router navigates to `/results/[id]`
4. ResultsView reads `lastResult` from store and renders

## Future
- Supabase for persistent storage and shareable result URLs
- AI summary layer on top of deterministic engine
- PDF export of results
