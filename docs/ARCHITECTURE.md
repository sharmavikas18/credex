# Architecture

## Directory Structure
- `src/app/`: Next.js App Router pages and layouts.
- `src/components/ui/`: Atomic components (shadcn).
- `src/components/layout/`: Shared layout components like Navbar and Footer.
- `src/components/marketing/`: Components specific to the landing page.
- `src/components/forms/`: Form-related components for the audit engine.
- `src/lib/`: Shared utilities, constants, and types.
- `src/styles/`: Global styles and Tailwind configuration extensions.

## State Management
- **Zustand**: Planned for managing the multi-step audit form state and results.
- **React Context**: Used for simple UI state (e.g., mobile menu).

## Data Flow
1. User inputs AI tools and spending.
2. Local state (Zustand) stores input.
3. Audit Engine (planned) processes data against `PRICING_DATA.md`.
4. Results are displayed and can be saved to Supabase (future).
