# Automated Testing Infrastructure

## Overview
We use **Vitest** and **React Testing Library** for our testing suite. The focus is on the core business logic of the audit engine to ensure financial accuracy and consistent recommendation behavior.

## Running Tests
```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## Coverage
The current test suite covers:

### 1. Audit Engine Logic (`src/lib/audit-engine/__tests__/engine.test.ts`)
- **Pricing Calculations**: Ensures monthly and annual totals are computed correctly based on input spend and seats.
- **Ghost Seat Detection**: Verifies that when seats exceed team size, a `reduce-seats` recommendation is generated with accurate savings.
- **Enterprise Overkill**: Validates that small teams (<40 people) on Enterprise plans are flagged for downgrades.
- **Overlap Detection**: Ensures that multiple tools serving the same `UseCase` are flagged for consolidation, with a tie-breaker logic for equal prices.
- **Individual vs Team Tiers**: Checks if 1-2 users on a Team/Business plan are correctly advised to move to Individual/Pro tiers.
- **Optimized Stacks**: Confirms that already-optimized tool setups return no-change recommendations.

## Testing Philosophy
- **Deterministic Logic**: Since the audit engine is rule-based and deterministic, we prioritize unit tests over complex integration tests for the core logic.
- **Regression Testing**: Any time a new pricing rule is added to `rules.ts`, a corresponding test case should be added to `engine.test.ts`.
- **Mocking**: We mock browser-specific APIs like `matchMedia` in `src/tests/setup.ts` to allow components to render correctly in the JSDOM environment.
