import { NextResponse } from 'next/server';
import { generateAuditSummary } from '@/lib/ai/summary';
import type { AuditResult } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const auditResult: AuditResult = await request.json();
    const summary = await generateAuditSummary(auditResult);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
