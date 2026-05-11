"use client";

import { useEffect, useState } from "react";
import { useAuditStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowDownRight,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  MinusCircle,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Recommendation, RecommendationType, RecommendationPriority } from "@/lib/types";
import { LeadCapture } from "./LeadCapture";

const TYPE_CONFIG: Record<
  RecommendationType,
  { label: string; color: string; icon: any }
> = {
  downgrade: { label: "Downgrade", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", icon: ArrowDownRight },
  consolidate: { label: "Consolidate", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: TrendingDown },
  "remove-overlap": { label: "Overlap", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: MinusCircle },
  "reduce-seats": { label: "Reduce Seats", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400", icon: TrendingDown },
  "switch-tool": { label: "Switch Tool", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", icon: ArrowDownRight },
  "optimize-api": { label: "Optimize API", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400", icon: Zap },
  "no-change": { label: "Optimized", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
};

function formatCurrency(amount: number): string {
  return "$" + amount.toLocaleString("en-US");
}

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  const config = TYPE_CONFIG[rec.type];
  const IconComponent = config.icon;
  const hasSavings = rec.monthlySavings > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`h-full transition-all hover:shadow-md ${hasSavings ? "border-l-4 border-l-primary" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <CardTitle className="text-base truncate">{rec.toolName}</CardTitle>
                  {rec.priority === 'high' && (
                    <Badge variant="outline" className="text-[10px] uppercase px-1 h-4 border-red-200 text-red-600 bg-red-50">High Impact</Badge>
                  )}
                </div>
                <CardDescription className="text-xs">
                  {rec.currentPlan} plan
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className={`shrink-0 text-[10px] uppercase font-bold tracking-wider ${config.color}`}>
              {config.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {rec.reasoning}
          </p>

          {hasSavings && (
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div className="text-sm">
                <span className="text-muted-foreground line-through mr-2">
                  {formatCurrency(rec.currentMonthlyCost)}/mo
                </span>
                <span className="font-semibold">
                  {formatCurrency(rec.suggestedMonthlyCost)}/mo
                </span>
              </div>
              <div className="text-sm font-bold text-primary">
                Save {formatCurrency(rec.monthlySavings)}/mo
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ResultsView() {
  const { lastResult, setResult, resetForm } = useAuditStore();
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    async function fetchSummary() {
      if (lastResult && !lastResult.aiSummary && !summaryLoading) {
        setSummaryLoading(true);
        try {
          const response = await fetch("/api/audit/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lastResult),
          });
          if (response.ok) {
            const data = await response.json();
            setResult({ ...lastResult, aiSummary: data.summary });
          }
        } catch (error) {
          console.error("Failed to fetch summary:", error);
        } finally {
          setSummaryLoading(false);
        }
      }
    }
    fetchSummary();
  }, [lastResult, setResult, summaryLoading]);

  if (!lastResult) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-3">No audit results found</h1>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            It looks like you haven't run an audit yet. Start a new audit to see your potential savings.
          </p>
          <Link href="/audit">
            <Button size="lg">Start New Audit</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const r = lastResult;
  const actionableRecs = r.recommendations.filter((rec) => rec.type !== "no-change");
  const goodRecs = r.recommendations.filter((rec) => rec.type === "no-change");

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <Link
              href="/audit"
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center mb-3 transition-colors"
            >
              <ArrowLeft className="mr-1 h-3 w-3" /> Back to Audit
            </Link>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              {r.companyName ? `${r.companyName} Audit` : "Your Audit Results"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Analysis for {r.teamSize} members · {r.inputTools.length} tools analyzed
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={resetForm}
              render={<Link href="/audit" />}
            >
              <RotateCcw className="mr-2 h-3 w-3" /> New Audit
            </Button>
          </div>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-primary text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden group">
            <motion.div 
              className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
            >
              <TrendingDown size={120} />
            </motion.div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-80">
                Annual Potential Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-black">
                {formatCurrency(r.totalAnnualSavings)}
              </p>
              {r.savingsPercentage > 0 && (
                <div className="flex items-center gap-1.5 mt-2">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-none text-[10px]">
                    {r.savingsPercentage}% REDUCTION
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-background/50 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Monthly Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {formatCurrency(r.totalMonthlySavings)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {actionableRecs.length} issues identified
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background/50 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Current Burn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {formatCurrency(r.totalCurrentMonthly)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ${r.totalCurrentAnnual.toLocaleString()}/yr
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background/50 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Optimized Burn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(r.totalOptimizedMonthly)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ${r.totalOptimizedAnnual.toLocaleString()}/yr
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Summary Section */}
        <div className="mb-12">
          <Card className="bg-muted/30 border-none relative overflow-hidden">
            <div className="absolute top-4 right-4 text-primary/20">
              <Sparkles className="h-12 w-12" />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-tighter">
                <Sparkles className="h-4 w-4" />
                <span>Executive Summary</span>
              </div>
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted-foreground/10 animate-pulse rounded" />
                  <div className="h-4 w-[90%] bg-muted-foreground/10 animate-pulse rounded" />
                  <div className="h-4 w-[95%] bg-muted-foreground/10 animate-pulse rounded" />
                </div>
              ) : (
                <p className="text-lg leading-relaxed text-foreground/80 italic">
                  "{r.aiSummary || 'Analysis complete. Calculating strategic insights...'}"
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Recommendations */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Strategic Recommendations</h2>
                <Badge variant="outline">{actionableRecs.length} Optimization{actionableRecs.length !== 1 ? 's' : ''}</Badge>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {actionableRecs.length > 0 ? (
                  actionableRecs.map((rec, i) => (
                    <RecommendationCard key={rec.toolEntryId} rec={rec} index={i} />
                  ))
                ) : (
                  <div className="p-8 border border-dashed rounded-lg text-center bg-green-50/20 border-green-200">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-green-500 mb-3" />
                    <h3 className="font-bold">Stack Perfectly Optimized</h3>
                    <p className="text-sm text-muted-foreground">We didn't find any overspending for your currently listed tools.</p>
                  </div>
                )}
              </div>
            </div>

            {goodRecs.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-6 text-muted-foreground">Properly Configured</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {goodRecs.map((rec, i) => (
                    <RecommendationCard key={rec.toolEntryId} rec={rec} index={i + actionableRecs.length} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side Lead Capture */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <LeadCapture auditResult={r} />
              
              <Card className="mt-6 border-none bg-muted/50">
                <CardContent className="pt-6">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>Expert Implementation</span>
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Implementing these changes manually can be tedious. Credex members get automated plan management and consolidated billing.
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary text-sm font-bold"
                    render={<Link href="https://credex.ai" />}
                  >
                    Learn about Credex Membership →
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
