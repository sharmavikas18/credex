export type AITool = 'ChatGPT' | 'Claude' | 'Gemini' | 'Cursor' | 'Copilot' | 'Perplexity' | 'Midjourney' | 'Other';

export interface ToolEntry {
  id: string;
  tool: AITool;
  plan: string;
  monthlySpend: number;
  seats: number;
  useCase: string;
}

export interface AuditData {
  companyName: string;
  tools: ToolEntry[];
}

export interface SavingRecommendation {
  tool: AITool;
  currentSpend: number;
  recommendedPlan: string;
  potentialSavings: number;
  reasoning: string;
}

export interface AuditResult {
  id: string;
  originalData: AuditData;
  totalMonthlySpend: number;
  totalAnnualSpend: number;
  potentialMonthlySavings: number;
  potentialAnnualSavings: number;
  recommendations: SavingRecommendation[];
}
