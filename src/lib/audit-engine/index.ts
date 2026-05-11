/**
 * Audit Engine v2 — deterministic with enhanced scoring.
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

    let matched = false;
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
          priority: result.priority,
          category: result.category,
          confidence: result.confidence,
          currentPlan: entry.plan,
          currentMonthlyCost: entry.monthlySpend,
          suggestedPlan: result.suggestedPlan,
          suggestedMonthlyCost: result.suggestedMonthlyCost,
          monthlySavings: entry.monthlySpend - result.suggestedMonthlyCost,
          reasoning: result.reasoning,
        });
        matched = true;
        break;
      }
    }

    if (!matched) {
      recommendations.push({
        toolEntryId: entry.id,
        toolId: entry.toolId,
        toolName: tool.name,
        type: 'no-change',
        priority: 'low',
        category: 'efficiency',
        confidence: 1,
        currentPlan: entry.plan,
        currentMonthlyCost: entry.monthlySpend,
        suggestedPlan: entry.plan,
        suggestedMonthlyCost: entry.monthlySpend,
        monthlySavings: 0,
        reasoning: 'Your current plan for this tool is optimized for your team size and use case.',
      });
    }
  }

  // Sort recommendations by priority and savings
  recommendations.sort((a, b) => {
    const priorityMap = { high: 0, medium: 1, low: 2 };
    if (priorityMap[a.priority] !== priorityMap[b.priority]) {
      return priorityMap[a.priority] - priorityMap[b.priority];
    }
    return b.monthlySavings - a.monthlySavings;
  });

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
