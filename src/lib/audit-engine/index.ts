/**
 * Audit Engine v1 — deterministic, rule-based.
 * Takes form data and produces a scored audit result.
 */

import type { AuditFormData, AuditResult, Recommendation } from '@/lib/types';
import { TOOL_MAP } from '@/lib/constants/pricing';
import { AUDIT_RULES } from './rules';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function runAudit(data: AuditFormData): AuditResult {
  const recommendations: Recommendation[] = [];

  for (const entry of data.tools) {
    const tool = TOOL_MAP.get(entry.toolId);
    if (!tool) continue;

    // Run each rule in priority order — first match wins
    for (const rule of AUDIT_RULES) {
      const result = rule({
        entry,
        allEntries: data.tools,
        teamSize: data.teamSize,
      });

      if (result) {
        recommendations.push({
          toolEntryId: entry.id,
          toolId: entry.toolId,
          toolName: tool.name,
          type: result.type,
          currentPlan: entry.plan,
          currentMonthlyCost: entry.monthlySpend,
          suggestedPlan: result.suggestedPlan,
          suggestedMonthlyCost: result.suggestedMonthlyCost,
          monthlySavings: entry.monthlySpend - result.suggestedMonthlyCost,
          reasoning: result.reasoning,
        });
        break; // Only one recommendation per tool entry
      }
    }

    // If no rule matched, add a no-change entry
    if (!recommendations.find((r) => r.toolEntryId === entry.id)) {
      recommendations.push({
        toolEntryId: entry.id,
        toolId: entry.toolId,
        toolName: tool.name,
        type: 'no-change',
        currentPlan: entry.plan,
        currentMonthlyCost: entry.monthlySpend,
        suggestedPlan: entry.plan,
        suggestedMonthlyCost: entry.monthlySpend,
        monthlySavings: 0,
        reasoning: 'Current plan appears well-suited for your usage.',
      });
    }
  }

  const totalCurrentMonthly = data.tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.monthlySavings, 0);
  const totalOptimizedMonthly = totalCurrentMonthly - totalMonthlySavings;

  return {
    id: generateId(),
    createdAt: new Date().toISOString(),
    companyName: data.companyName,
    teamSize: data.teamSize,
    inputTools: data.tools,
    totalCurrentMonthly,
    totalCurrentAnnual: totalCurrentMonthly * 12,
    totalOptimizedMonthly,
    totalOptimizedAnnual: totalOptimizedMonthly * 12,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    savingsPercentage:
      totalCurrentMonthly > 0
        ? Math.round((totalMonthlySavings / totalCurrentMonthly) * 100)
        : 0,
    recommendations,
  };
}
