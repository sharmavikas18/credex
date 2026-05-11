import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { resend, FROM_EMAIL } from '@/lib/resend/client';
import type { Recommendation } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { email, companyName, role, auditResult, honeypot } = await request.json();

    // Lightweight abuse protection: Honeypot
    if (honeypot) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Basic validation
    if (!email || !auditResult) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Save to Supabase (Leads Table)
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert([
        { 
          email, 
          company_name: companyName || auditResult.companyName, 
          role,
          metadata: { teamSize: auditResult.teamSize }
        }
      ])
      .select()
      .single();

    if (leadError) throw leadError;

    // 2. Save to Supabase (Audits Table)
    const { error: auditError } = await supabase
      .from('audits')
      .insert([
        { 
          lead_id: lead.id,
          total_spend: auditResult.totalCurrentAnnual,
          potential_savings: auditResult.totalAnnualSavings,
          result_data: auditResult
        }
      ]);

    if (auditError) throw auditError;

    // 3. Send Transactional Email via Resend
    if (resend) {
      await resend.emails.send({
        from: `AI Spend Audit <${FROM_EMAIL}>`,
        to: email,
        subject: `Your AI Spend Audit: $${auditResult.totalAnnualSavings.toLocaleString()} in potential savings`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h1 style="color: #000;">Your AI Spend Audit is Ready</h1>
            <p>Hi there,</p>
            <p>We've completed the audit for <strong>${auditResult.companyName || 'your company'}</strong>.</p>
            
            <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #666;">Estimated Annual Savings</p>
              <h2 style="margin: 5px 0 0; font-size: 32px; color: #000;">$${auditResult.totalAnnualSavings.toLocaleString()}</h2>
            </div>

            ${auditResult.aiSummary ? `<p><strong>Executive Summary:</strong><br/>${auditResult.aiSummary}</p>` : ''}

            <p>Our analysis identified ${auditResult.recommendations.filter((r: Recommendation) => r.type !== 'no-change').length} optimization opportunities.</p>
            
            <p>Interested in a deeper dive or help implementing these savings? Reply to this email or <a href="https://credex.ai/consult">book a free consultation with Credex</a>.</p>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 12px; color: #999;">Sent by AI Spend Audit by Credex</p>
          </div>
        `
      });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const error = e as Error;
    console.error('Lead Capture Error:', error.message);
    return NextResponse.json({ error: 'Failed to process lead' }, { status: 500 });
  }
}
