/**
 * Rule-based audit engine rules.
 * Each rule inspects a single ToolEntry and returns a Recommendation if applicable.
 * Rules are evaluated in order — the first matching rule wins for each tool.
 */

import type { ToolEntry, Recommendation, RecommendationType } from '@/lib/types';
import { TOOL_MAP, getCheapestAlternativePlan } from '@/lib/constants/pricing';

interface RuleContext {
  entry: ToolEntry;
  allEntries: ToolEntry[];
  teamSize: number;
}

interface RuleResult {
  type: RecommendationType;
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

  // Flag enterprise plans when team is small
  const isEnterprise = entry.plan.toLowerCase().includes('enterprise');
  if (!isEnterprise || teamSize >= 40) return null;

  const alternative = getCheapestAlternativePlan(entry.toolId, entry.plan, entry.seats);
  if (!alternative) return null;

  const suggestedCost = alternative.monthlyPricePerSeat * entry.seats;
  return {
    type: 'downgrade',
    suggestedPlan: alternative.name,
    suggestedMonthlyCost: suggestedCost,
    reasoning: `Enterprise plan is overkill for a ${teamSize}-person team. The ${alternative.name} plan covers your needs at a lower cost.`,
  };
};

// ─── Rule: Team plan with only 1–2 seats ───────────────────

const teamPlanFewSeatsRule: AuditRule = ({ entry }) => {
  const tool = TOOL_MAP.get(entry.toolId);
  if (!tool) return null;

  const isTeamPlan = entry.plan.toLowerCase().includes('team');
  if (!isTeamPlan || entry.seats > 2) return null;

  // Find an individual-tier plan
  const individualPlans = tool.plans.filter(
    (p) =>
      !p.name.toLowerCase().includes('team') &&
      !p.name.toLowerCase().includes('enterprise') &&
      !p.name.toLowerCase().includes('business') &&
      p.monthlyPricePerSeat > 0
  );

  const best = individualPlans.sort(
    (a, b) => b.monthlyPricePerSeat - a.monthlyPricePerSeat
  )[0];

  if (!best) return null;
  const suggestedCost = best.monthlyPricePerSeat * entry.seats;
  if (suggestedCost >= entry.monthlySpend) return null;

  return {
    type: 'downgrade',
    suggestedPlan: best.name,
    suggestedMonthlyCost: suggestedCost,
    reasoning: `Team/Business plan with only ${entry.seats} seat${entry.seats > 1 ? 's' : ''} — individual ${best.name} plan would be cheaper.`,
  };
};

// ─── Rule: Overlapping LLM tools ───────────────────────────

const overlapRule: AuditRule = ({ entry, allEntries }) => {
  const tool = TOOL_MAP.get(entry.toolId);
  if (!tool || tool.overlaps.length === 0) return null;

  // Find other entries that overlap with this tool
  const overlapping = allEntries.filter(
    (other) =>
      other.id !== entry.id &&
      tool.overlaps.includes(other.toolId) &&
      other.useCase === entry.useCase
  );

  if (overlapping.length === 0) return null;

  // Only flag the MORE expensive one
  const cheaperOverlap = overlapping.find((o) => o.monthlySpend < entry.monthlySpend);
  if (!cheaperOverlap) return null;

  const cheaperTool = TOOL_MAP.get(cheaperOverlap.toolId);
  if (!cheaperTool) return null;

  return {
    type: 'remove-overlap',
    suggestedPlan: 'Remove (use ' + cheaperTool.name + ' instead)',
    suggestedMonthlyCost: 0,
    reasoning: `Overlaps with ${cheaperTool.name} for ${entry.useCase}. Consider consolidating to avoid paying for two tools that serve the same purpose.`,
  };
};

// ─── Rule: Overpaying vs. market rate ──────────────────────

const overpayingRule: AuditRule = ({ entry }) => {
  const tool = TOOL_MAP.get(entry.toolId);
  if (!tool) return null;

  const currentPlan = tool.plans.find((p) => p.name === entry.plan);
  if (!currentPlan) return null;

  // Check if the user is paying more than the listed price per seat
  const expectedCost = currentPlan.monthlyPricePerSeat * entry.seats;
  const overpayThreshold = expectedCost * 1.15; // 15% tolerance

  if (entry.monthlySpend <= overpayThreshold || expectedCost === 0) return null;

  return {
    type: 'downgrade',
    suggestedPlan: entry.plan + ' (at list price)',
    suggestedMonthlyCost: expectedCost,
    reasoning: `You're paying $${entry.monthlySpend}/mo but the list price for ${entry.seats} seat${entry.seats > 1 ? 's' : ''} on ${entry.plan} is $${expectedCost}/mo. You may be overpaying.`,
  };
};

// ─── Rule: Suggest cheaper coding alternatives ─────────────

const cheaperCodingAlternativeRule: AuditRule = ({ entry }) => {
  const tool = TOOL_MAP.get(entry.toolId);
  if (!tool || tool.category !== 'coding') return null;

  // If using Cursor Business, Copilot is cheaper
  if (entry.toolId === 'cursor' && entry.plan === 'Business') {
    const copilotBizPrice = 19;
    const suggestedCost = copilotBizPrice * entry.seats;
    if (suggestedCost < entry.monthlySpend) {
      return {
        type: 'switch-tool',
        suggestedPlan: 'GitHub Copilot Business',
        suggestedMonthlyCost: suggestedCost,
        reasoning: `Cursor Business ($40/seat) is significantly more expensive than GitHub Copilot Business ($19/seat) for similar coding assistance.`,
      };
    }
  }

  return null;
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
    suggestedPlan: entry.plan,
    suggestedMonthlyCost: suggestedCost,
    reasoning: `${entry.seats} seats but team size is only ${teamSize}. You're likely paying for inactive or former employee seats.`,
  };
};

// ─── Ordered rule set ──────────────────────────────────────

export const AUDIT_RULES: AuditRule[] = [
  ghostSeatsRule,
  enterpriseOverkillRule,
  teamPlanFewSeatsRule,
  overlapRule,
  overpayingRule,
  cheaperCodingAlternativeRule,
];
