/**
 * Centralized pricing data for all supported AI tools.
 * This is the single source of truth for the audit engine.
 * Prices are monthly per-seat unless noted.
 */

export type ToolCategory = 'llm' | 'coding' | 'api' | 'search';

export type UseCase =
  | 'coding'
  | 'writing'
  | 'research'
  | 'data-analysis'
  | 'design'
  | 'customer-support'
  | 'general';

export interface PlanInfo {
  name: string;
  monthlyPricePerSeat: number;
  /** Minimum seats required for this plan, if any */
  minSeats?: number;
  features: string[];
}

export interface ToolConfig {
  id: string;
  name: string;
  category: ToolCategory;
  plans: PlanInfo[];
  useCases: UseCase[];
  /** Tools that serve similar purposes — used for overlap detection */
  overlaps: string[];
}

export const USE_CASE_LABELS: Record<UseCase, string> = {
  coding: 'Software Development',
  writing: 'Content & Writing',
  research: 'Research & Analysis',
  'data-analysis': 'Data Analysis',
  design: 'Design & Creative',
  'customer-support': 'Customer Support',
  general: 'General Productivity',
};

export const TOOL_CONFIGS: ToolConfig[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'llm',
    plans: [
      { name: 'Free', monthlyPricePerSeat: 0, features: ['GPT-4o mini', 'Limited usage'] },
      { name: 'Plus', monthlyPricePerSeat: 20, features: ['GPT-4o', 'DALL-E', 'Advanced Data Analysis'] },
      { name: 'Team', monthlyPricePerSeat: 25, minSeats: 2, features: ['Higher limits', 'Workspace', 'Admin console'] },
      { name: 'Enterprise', monthlyPricePerSeat: 60, minSeats: 50, features: ['SSO', 'Unlimited usage', 'Custom models'] },
    ],
    useCases: ['writing', 'research', 'coding', 'data-analysis', 'customer-support', 'general'],
    overlaps: ['claude', 'gemini'],
  },
  {
    id: 'claude',
    name: 'Claude',
    category: 'llm',
    plans: [
      { name: 'Free', monthlyPricePerSeat: 0, features: ['Claude Sonnet', 'Limited usage'] },
      { name: 'Pro', monthlyPricePerSeat: 20, features: ['Claude Opus', 'Priority access', 'More usage'] },
      { name: 'Team', monthlyPricePerSeat: 25, minSeats: 5, features: ['Higher limits', 'Central billing', 'Admin'] },
      { name: 'Enterprise', monthlyPricePerSeat: 60, minSeats: 50, features: ['SSO', 'SCIM', 'Custom retention'] },
    ],
    useCases: ['writing', 'research', 'coding', 'data-analysis', 'general'],
    overlaps: ['chatgpt', 'gemini'],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    category: 'llm',
    plans: [
      { name: 'Free', monthlyPricePerSeat: 0, features: ['Gemini Flash', 'Basic features'] },
      { name: 'Advanced', monthlyPricePerSeat: 20, features: ['Gemini Ultra', '2TB storage', 'Google One AI'] },
      { name: 'Business', monthlyPricePerSeat: 20, minSeats: 1, features: ['Workspace integration', 'Enterprise security'] },
      { name: 'Enterprise', monthlyPricePerSeat: 30, minSeats: 10, features: ['Advanced security', 'Custom models', 'DLP'] },
    ],
    useCases: ['writing', 'research', 'data-analysis', 'general'],
    overlaps: ['chatgpt', 'claude'],
  },
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'coding',
    plans: [
      { name: 'Hobby', monthlyPricePerSeat: 0, features: ['2000 completions', 'Limited slow requests'] },
      { name: 'Pro', monthlyPricePerSeat: 20, features: ['Unlimited completions', '500 fast requests', 'Claude & GPT-4'] },
      { name: 'Business', monthlyPricePerSeat: 40, minSeats: 1, features: ['Central billing', 'Admin dashboard', 'SAML SSO'] },
    ],
    useCases: ['coding'],
    overlaps: ['copilot', 'windsurf'],
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    category: 'coding',
    plans: [
      { name: 'Free', monthlyPricePerSeat: 0, features: ['Limited completions', 'Basic chat'] },
      { name: 'Individual', monthlyPricePerSeat: 10, features: ['Unlimited completions', 'Chat', 'CLI'] },
      { name: 'Business', monthlyPricePerSeat: 19, minSeats: 1, features: ['Org management', 'Policy controls', 'Audit logs'] },
      { name: 'Enterprise', monthlyPricePerSeat: 39, minSeats: 50, features: ['Fine-tuned models', 'Knowledge bases', 'SSO'] },
    ],
    useCases: ['coding'],
    overlaps: ['cursor', 'windsurf'],
  },
  {
    id: 'openai-api',
    name: 'OpenAI API',
    category: 'api',
    plans: [
      { name: 'Pay-as-you-go', monthlyPricePerSeat: 0, features: ['Usage-based pricing', 'All models'] },
      { name: 'Tier 1 (~$100/mo)', monthlyPricePerSeat: 100, features: ['Higher rate limits', 'GPT-4o access'] },
      { name: 'Tier 2 (~$250/mo)', monthlyPricePerSeat: 250, features: ['Batch API', 'Higher throughput'] },
      { name: 'Tier 3 (~$500/mo)', monthlyPricePerSeat: 500, features: ['Fine-tuning', 'Dedicated capacity'] },
    ],
    useCases: ['coding', 'writing', 'customer-support', 'data-analysis', 'general'],
    overlaps: ['anthropic-api'],
  },
  {
    id: 'anthropic-api',
    name: 'Anthropic API',
    category: 'api',
    plans: [
      { name: 'Pay-as-you-go', monthlyPricePerSeat: 0, features: ['Usage-based pricing', 'Claude models'] },
      { name: 'Build (~$100/mo)', monthlyPricePerSeat: 100, features: ['Higher rate limits', 'Priority'] },
      { name: 'Scale (~$250/mo)', monthlyPricePerSeat: 250, features: ['Custom limits', 'SLA'] },
    ],
    useCases: ['coding', 'writing', 'customer-support', 'data-analysis', 'general'],
    overlaps: ['openai-api'],
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    category: 'coding',
    plans: [
      { name: 'Free', monthlyPricePerSeat: 0, features: ['Basic completions', 'Limited flows'] },
      { name: 'Pro', monthlyPricePerSeat: 15, features: ['Unlimited flows', 'Priority models'] },
      { name: 'Team', monthlyPricePerSeat: 30, minSeats: 2, features: ['Central billing', 'Admin', 'Priority support'] },
    ],
    useCases: ['coding'],
    overlaps: ['cursor', 'copilot'],
  },
];

/** Quick lookup map */
export const TOOL_MAP = new Map<string, ToolConfig>(
  TOOL_CONFIGS.map((t) => [t.id, t])
);

/** Get plan details for a specific tool */
export function getPlansForTool(toolId: string): PlanInfo[] {
  return TOOL_MAP.get(toolId)?.plans ?? [];
}

/** Get the cheapest plan that covers the same use case */
export function getCheapestAlternativePlan(
  toolId: string,
  currentPlanName: string,
  seats: number
): PlanInfo | null {
  const tool = TOOL_MAP.get(toolId);
  if (!tool) return null;

  const currentPlan = tool.plans.find((p) => p.name === currentPlanName);
  if (!currentPlan) return null;

  // Find cheaper plans that can accommodate the seat count
  const cheaper = tool.plans
    .filter((p) => {
      const meetsSeats = !p.minSeats || seats >= p.minSeats;
      const isCheaper = p.monthlyPricePerSeat < currentPlan.monthlyPricePerSeat;
      return meetsSeats && isCheaper;
    })
    .sort((a, b) => b.monthlyPricePerSeat - a.monthlyPricePerSeat); // highest of the cheaper ones

  return cheaper[0] ?? null;
}
