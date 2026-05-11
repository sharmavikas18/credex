/**
 * Rule-based audit engine rules V2.
 */

import type { 
  ToolEntry, 
  RecommendationType, 
  RecommendationPriority, 
  FindingCategory 
} from '@/lib/types';
import { TOOL_MAP, getCheapestAlternativePlan } from '@/lib/constants/pricing';

interface RuleContext {
  entry: ToolEntry;
  allEntries: ToolEntry[];
  teamSize: number;
}

export interface RuleResult {
  type: RecommendationType;
  priority: RecommendationPriority;
  category: FindingCategory;
  confidence: number;
  suggestedPlan: string;
  suggestedMonthlyCost: number;
  reasoning: string;
}

type AuditRule = (ctx: RuleContext) => RuleResult | null;

// ─── Rule: Enterprise plan for small teams ─────────────────
const enterpriseOverkillRule: AuditRule = ({ entry, teamSize }) => {
  const tool = TOOL_MAP.get(entry.toolId);
  if (!tool) return null;

  const currentPlan = tool.plans.find((p) => p.name === entry.plan);
  if (!currentPlan) return null;

  const isEnterprise = entry.plan.toLowerCase().includes('enterprise');
  if (!isEnterprise || teamSize >= 40) return null;

  const alternative = getCheapestAlternativePlan(entry.toolId, entry.plan, entry.seats);
  if (!alternative) return null;

  const suggestedCost = alternative.monthlyPricePerSeat * entry.seats;
  return {
    type: 'downgrade',
    priority: teamSize < 10 ? 'high' : 'medium',
    category: 'cost',
    confidence: 0.95,
    suggestedPlan: alternative.name,
    suggestedMonthlyCost: suggestedCost,
    reasoning: `Enterprise plan is excessive for a ${teamSize}-person team. Downgrading to ${alternative.name} provides the same core features for significantly less.`,
  };
};

// ─── Rule: Team plan with only 1–2 seats ───────────────────
const teamPlanFewSeatsRule: AuditRule = ({ entry }) => {
  const tool = TOOL_MAP.get(entry.toolId);
  if (!tool) return null;

  const isTeamPlan = entry.plan.toLowerCase().includes('team') || entry.plan.toLowerCase().includes('business');
  if (!isTeamPlan || entry.seats > 2) return null;

  const individualPlans = tool.plans.filter(
    (p) =>
      !p.name.toLowerCase().includes('team') &&
      !p.name.toLowerCase().includes('enterprise') &&
      !p.name.toLowerCase().includes('business') &&
      p.monthlyPricePerSeat > 0
  );

  const best = individualPlans.sort((a, b) => b.monthlyPricePerSeat - a.monthlyPricePerSeat)[0];

  if (!best) return null;
  const suggestedCost = best.monthlyPricePerSeat * entry.seats;
  if (suggestedCost >= entry.monthlySpend) return null;

  return {
    type: 'downgrade',
    priority: 'medium',
    category: 'efficiency',
    confidence: 0.9,
    suggestedPlan: best.name,
    suggestedMonthlyCost: suggestedCost,
    reasoning: `Paying for a multi-user ${entry.plan} plan for only ${entry.seats} seat${entry.seats > 1 ? 's' : ''} is inefficient. Individual ${best.name} tier is more cost-effective.`,
  };
};

// ─── Rule: Overlapping LLM tools ───────────────────────────
const overlapRule: AuditRule = ({ entry, allEntries }) => {
  const tool = TOOL_MAP.get(entry.toolId);
  if (!tool || tool.overlaps.length === 0) return null;

  const overlapping = allEntries.filter(
    (other) =>
      other.id !== entry.id &&
      tool.overlaps.includes(other.toolId) &&
      other.useCase === entry.useCase
  );

  if (overlapping.length === 0) return null;

  // Find a tool to consolidate into. If prices are equal, use ID as a tie-breaker to avoid flagging both.
  const cheaperOverlap = overlapping.find((o) => 
    o.monthlySpend < entry.monthlySpend || 
    (o.monthlySpend === entry.monthlySpend && o.id < entry.id)
  );
  if (!cheaperOverlap) return null;

  const cheaperTool = TOOL_MAP.get(cheaperOverlap.toolId);
  if (!cheaperTool) return null;

  return {
    type: 'remove-overlap',
    priority: 'high',
    category: 'overlap',
    confidence: 0.85,
    suggestedPlan: `Remove (Consolidate to ${cheaperTool.name})`,
    suggestedMonthlyCost: 0,
    reasoning: `You are paying for both ${tool.name} and ${cheaperTool.name} for ${entry.useCase}. Consolidating to ${cheaperTool.name} eliminates redundant costs.`,
  };
};

// ─── Rule: Ghost seats (seats > team size) ─────────────────
const ghostSeatsRule: AuditRule = ({ entry, teamSize }) => {
  if (entry.seats <= teamSize || teamSize === 0) return null;

  const tool = TOOL_MAP.get(entry.toolId);
  if (!tool) return null;

  const currentPlan = tool.plans.find((p) => p.name === entry.plan);
  if (!currentPlan || currentPlan.monthlyPricePerSeat === 0) return null;

  const suggestedCost = currentPlan.monthlyPricePerSeat * teamSize;
  return {
    type: 'reduce-seats',
    priority: 'high',
    category: 'redundancy',
    confidence: 0.98,
    suggestedPlan: entry.plan,
    suggestedMonthlyCost: suggestedCost,
    reasoning: `Your ${entry.seats} ${tool.name} seats exceed your team size of ${teamSize}. Reducing to match your headcount saves $${(entry.monthlySpend - suggestedCost).toFixed(0)}/mo.`,
  };
};

// ─── Rule: Inefficient API Spending ──────────────────────
const apiEfficiencyRule: AuditRule = ({ entry }) => {
  if (entry.toolId !== 'openai-api' && entry.toolId !== 'anthropic-api') return null;

  // If spending more than $500 on API but not on a tier that gives discounts/better limits
  if (entry.monthlySpend > 500 && !entry.plan.includes('Tier')) {
    return {
      type: 'optimize-api',
      priority: 'medium',
      category: 'efficiency',
      confidence: 0.8,
      suggestedPlan: 'Prepaid/Tiered Access',
      suggestedMonthlyCost: entry.monthlySpend * 0.9, // Estimate 10% optimization
      reasoning: `High API spend detected. Moving to tiered usage or optimizing token usage could reduce costs by at least 10%.`,
    };
  }
  return null;
};

export const AUDIT_RULES: AuditRule[] = [
  ghostSeatsRule,
  enterpriseOverkillRule,
  teamPlanFewSeatsRule,
  overlapRule,
  apiEfficiencyRule,
];
