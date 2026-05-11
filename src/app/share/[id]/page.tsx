import { Metadata } from "next";
import { supabase } from "@/lib/supabase/client";
import { PublicResultView } from "@/components/forms/PublicResultView";
import { notFound } from "next/navigation";
import type { AuditResult } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

async function getAudit(id: string): Promise<AuditResult | null> {
  const { data, error } = await supabase
    .from("audits")
    .select("result_data")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data.result_data as AuditResult;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) return { title: "Audit Not Found | Credex" };

  const savings = audit.totalAnnualSavings.toLocaleString();
  const title = `AI Spend Audit: $${savings}/yr in Potential Savings`;
  const description = `Check out this AI spend audit for ${audit.companyName || 'this company'}. Total savings identified: $${savings}/year across ${audit.inputTools.length} tools.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: `/api/og?savings=${audit.totalAnnualSavings}&tools=${audit.inputTools.length}`,
          width: 1200,
          height: 630,
          alt: "Audit Results Preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og?savings=${audit.totalAnnualSavings}&tools=${audit.inputTools.length}`],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    notFound();
  }

  return <PublicResultView result={audit} />;
}
