import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import type { AuditResult } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const auditResult: AuditResult = await request.json();

    // Sanitize data for public storage (optional but good practice)
    const sanitizedResult = {
      ...auditResult,
      // We keep companyName but we don't have emails here yet
    };

    const { data, error } = await supabase
      .from('audits')
      .insert([
        {
          total_spend: auditResult.totalCurrentAnnual,
          potential_savings: auditResult.totalAnnualSavings,
          result_data: sanitizedResult
        }
      ])
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ shareId: data.id });
  } catch (error) {
    console.error('Audit Save Error:', error);
    return NextResponse.json({ error: 'Failed to save audit' }, { status: 500 });
  }
}
