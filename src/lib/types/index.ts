import type { UseCase } from '@/lib/constants/pricing';

// ─── Form & Input Types ────────────────────────────────────

export interface ToolEntry {
  id: string;
  toolId: string;
  plan: string;
  monthlySpend: number;
  seats: number;
  useCase: UseCase;
}

export interface AuditFormData {
  companyName: string;
  teamSize: number;
  tools: ToolEntry[];
}

// ─── Audit Engine Output Types ─────────────────────────────

export type RecommendationType =
  | 'downgrade'
  | 'consolidate'
  | 'remove-overlap'
  | 'reduce-seats'
  | 'switch-tool'
  | 'optimize-api'
  | 'no-change';

export type RecommendationPriority = 'high' | 'medium' | 'low';
export type FindingCategory = 'cost' | 'overlap' | 'redundancy' | 'efficiency';

export interface Recommendation {
  toolEntryId: string;
  toolId: string;
  toolName: string;
  type: RecommendationType;
  priority: RecommendationPriority;
  category: FindingCategory;
  confidence: number; // 0 to 1
  currentPlan: string;
  currentMonthlyCost: number;
  suggestedPlan: string;
  suggestedMonthlyCost: number;
  monthlySavings: number;
  reasoning: string;
}

export interface AuditResult {
  id: string;
  createdAt: string;
  companyName: string;
  teamSize: number;
  inputTools: ToolEntry[];
  totalCurrentMonthly: number;
  totalCurrentAnnual: number;
  totalOptimizedMonthly: number;
  totalOptimizedAnnual: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsPercentage: number;
  recommendations: Recommendation[];
  aiSummary?: string; // For Day 3
}
