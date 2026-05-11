# Development Log

## Day 1: May 7, 2026 - Project Foundation

### Completed
- **Project Initialization**: Next.js 16 (canary) with Tailwind 4 and TypeScript.
- **Design System**: shadcn/ui integrated with custom configuration for a premium SaaS feel.
- **Folder Structure**: Established a scalable directory layout (`/src/components/[layout,marketing,forms,ui]`, `/src/lib/[constants,types,utils]`).
- **Landing Page**: Built a responsive hero, problem statement, how-it-works, and CTA sections.
- **Routing**: Setup base routes for `/`, `/audit`, `/results`, and `/about`.
- **Form UI Shell**: Created the initial UI for the tool audit form without logic.
- **Documentation**: Initialized `README`, `ARCHITECTURE`, `PRICING_DATA`, and `PROMPTS`.

### Key Decisions
- Used **Tailwind 4** for future-proofing and performance.
- Opted for **shadcn/ui** for high-quality, accessible components.
- Implementation follows a **mobile-first** approach.

## Day 2: May 10, 2026 - Core Product Logic

### Completed
- **Pricing Data System** (`lib/constants/pricing.ts`): Centralized config for 8 AI tools with typed plans, pricing, use-case compatibility, and overlap mapping. Single source of truth for the audit engine.
- **Type Evolution**: Replaced Day 1 types with richer interfaces — `AuditFormData`, `Recommendation`, `RecommendationType` (downgrade, consolidate, remove-overlap, reduce-seats, switch-tool, no-change).
- **Audit Engine v1** (`lib/audit-engine/`): Deterministic rule-based engine with 6 rules evaluated in priority order: ghost seats, enterprise overkill, team-plan-few-seats, LLM overlap detection, overpaying vs. list price, and cheaper coding alternatives.
- **Real Working Form**: Dynamic form wired to Zustand — add/remove tools, tool-aware plan dropdowns, auto-fill pricing, seat-based cost recalculation, validation.
- **Results Page**: Full results view with 4-metric summary cards, actionable recommendations with savings breakdowns, and "already optimized" section.
- **Zustand Store Upgrade**: Now tracks `AuditFormData` (with `teamSize`) and persists `AuditResult`. Added `HydrationBoundary` component to prevent SSR mismatches.
- **Component Extraction**: `ToolEntryRow` extracted as a reusable row component from the form.

### Key Decisions
- **No react-hook-form**: Zustand already manages the form state with persistence. Adding RHF would create dual state management. Zod validation will be wired in later if needed.
- **Rule-based over AI**: The audit engine is deterministic and explainable. Each recommendation has a reasoning string. AI summaries can layer on top later without replacing the core logic.
- **First-match-wins rule evaluation**: Each tool entry gets at most one recommendation. This keeps results clean and avoids overwhelming users with multiple flags per tool.
- **Auto-fill pricing**: When a user selects a plan, the expected cost auto-fills based on seat count. Users can override if their actual spend differs (which itself triggers the "overpaying" rule).

### Tradeoffs
- **No form-level validation yet**: Individual fields validate via HTML constraints. Zod schema validation will come when we add submission confirmation flow.
- **Results not shareable**: Results live in Zustand/localStorage. Deep-linking the `/results/[id]` route doesn't work for external sharing yet — that needs Supabase.
- **Simplified overlap detection**: Currently only flags overlaps within the same use-case. Cross-use-case overlap detection would need more nuanced logic.

### Problems Encountered
- **base-ui API differences**: shadcn/ui v4 uses base-ui instead of Radix. `asChild` → `render` prop, `onValueChange` receives `string | null` instead of `string`. Required type fixes across all Select and Sheet components.
