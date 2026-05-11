import type { AuditResult } from '@/lib/types';

export async function generateAuditSummary(auditResult: AuditResult): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return getFallbackSummary(auditResult);
  }

  const prompt = `
    Act as a senior startup CFO. Summarize the following AI spend audit in ~100 words.
    
    Company: ${auditResult.companyName}
    Team Size: ${auditResult.teamSize}
    Current Annual Spend: $${auditResult.totalCurrentAnnual.toLocaleString()}
    Potential Annual Savings: $${auditResult.totalAnnualSavings.toLocaleString()} (${auditResult.savingsPercentage}% reduction)
    
    Top Recommendations:
    ${auditResult.recommendations
      .filter(r => r.type !== 'no-change')
      .slice(0, 3)
      .map(r => `- ${r.toolName}: ${r.reasoning}`)
      .join('\n')}
      
    Tone: Executive, concise, objective, and financially-literate.
    Focus on: Impact of savings and specific overlaps or inefficiencies.
    Avoid: Generic advice, over-the-top marketing language.
  `;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) throw new Error('AI API failure');

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return getFallbackSummary(auditResult);
  }
}

function getFallbackSummary(auditResult: AuditResult): string {
  const savings = auditResult.totalAnnualSavings;
  const tools = auditResult.inputTools.length;
  
  if (savings === 0) {
    return `Your AI stack of ${tools} tools appears well-optimized for your current team size. We didn't find any immediate overspending opportunities, but we recommend re-auditing as your team grows.`;
  }

  return `Our analysis identified a potential annual saving of $${savings.toLocaleString()} across your ${tools} tools. Key areas for optimization include plan downgrades and eliminating tool overlaps in your ${auditResult.inputTools[0]?.useCase || 'workflow'}. Implementing these changes could reduce your AI burn by ${auditResult.savingsPercentage}%.`;
}
