# AI Prompt Documentation

## Executive Summary Prompt (Day 3)

### The Prompt
```
Act as a senior startup CFO. Summarize the following AI spend audit in ~100 words.

Company: {companyName}
Team Size: {teamSize}
Current Annual Spend: {totalCurrentAnnual}
Potential Annual Savings: {totalAnnualSavings} ({savingsPercentage}% reduction)

Top Recommendations:
{top3Recommendations}

Tone: Executive, concise, objective, and financially-literate.
Focus on: Impact of savings and specific overlaps or inefficiencies.
Avoid: Generic advice, over-the-top marketing language.
```

### Why this structure?
1. **Persona Assignment**: "Senior startup CFO" ensures the tone is professional and focused on the bottom line, rather than generic AI chatter.
2. **Deterministic Data Infusion**: By passing the raw audit numbers and the specific reasoning from our TypeScript engine, we prevent the AI from "calculating" (which it often fails at) and instead use it for what it's good at: **narrative synthesis**.
3. **Strict Constraints**: "~100 words" and "Focus on impact" keep the output readable on a dashboard and relevant to the user.

### Hallucination Prevention
- We do **not** ask the AI to find savings. We find the savings in the deterministic `runAudit()` function and pass the *results* to the AI.
- The AI's only job is to turn our list of findings into a cohesive paragraph.
- If the AI API fails, we use a template-based fallback that fills in the same variables, ensuring the UX never breaks.

### Attempted & Failed
- **Attempt 1**: Asking the AI to categorize the findings. 
  - *Result*: Inconsistent categorization compared to our internal logic.
  - *Fix*: Categorize in the TypeScript engine, pass the categories to the AI.
- **Attempt 2**: Long-form 500-word reports.
  - *Result*: Too much "fluff" and generic advice (e.g., "you should monitor your subscriptions").
  - *Fix*: Shortened to 100 words and restricted to the actual findings.
