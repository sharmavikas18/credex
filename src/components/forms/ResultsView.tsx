"use client";

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
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  MinusCircle,
  RotateCcw,
} from "lucide-react";
import type { Recommendation, RecommendationType } from "@/lib/types";

const TYPE_CONFIG: Record<
  RecommendationType,
  { label: string; color: string; icon: typeof TrendingDown }
> = {
  downgrade: { label: "Downgrade Plan", color: "bg-amber-100 text-amber-800", icon: ArrowDownRight },
  consolidate: { label: "Consolidate", color: "bg-blue-100 text-blue-800", icon: TrendingDown },
  "remove-overlap": { label: "Remove Overlap", color: "bg-red-100 text-red-800", icon: MinusCircle },
  "reduce-seats": { label: "Reduce Seats", color: "bg-orange-100 text-orange-800", icon: TrendingDown },
  "switch-tool": { label: "Switch Tool", color: "bg-purple-100 text-purple-800", icon: ArrowDownRight },
  "no-change": { label: "Looks Good", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
};

function formatCurrency(amount: number): string {
  return "$" + amount.toLocaleString("en-US");
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const config = TYPE_CONFIG[rec.type];
  const IconComponent = config.icon;
  const hasSavings = rec.monthlySavings > 0;

  return (
    <Card className={`transition-all ${hasSavings ? "border-l-4 border-l-primary" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <IconComponent className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base">{rec.toolName}</CardTitle>
              <CardDescription className="text-xs">
                {rec.currentPlan} plan
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className={`shrink-0 text-xs ${config.color}`}>
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
  );
}

export function ResultsView() {
  const { lastResult, resetForm } = useAuditStore();

  if (!lastResult) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-3xl text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-3">No audit results found</h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          It looks like you haven't run an audit yet, or your results have expired.
          Start a new audit to see your savings.
        </p>
        <Link href="/audit">
          <Button>Start New Audit</Button>
        </Link>
      </div>
    );
  }

  const r = lastResult;
  const actionableRecs = r.recommendations.filter((rec) => rec.type !== "no-change");
  const goodRecs = r.recommendations.filter((rec) => rec.type === "no-change");

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <Link
            href="/audit"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center mb-3 transition-colors"
          >
            <ArrowLeft className="mr-1 h-3 w-3" /> Back to Audit
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">
            {r.companyName ? `${r.companyName} — Audit Results` : "Audit Results"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {r.teamSize} team member{r.teamSize > 1 ? "s" : ""} · {r.inputTools.length} tool{r.inputTools.length > 1 ? "s" : ""} analyzed
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/audit">
            <Button variant="outline" size="sm" onClick={resetForm}>
              <RotateCcw className="mr-2 h-3 w-3" /> New Audit
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider opacity-80">
              Potential Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {formatCurrency(r.totalAnnualSavings)}
              <span className="text-base font-normal opacity-70">/yr</span>
            </p>
            {r.savingsPercentage > 0 && (
              <p className="text-sm opacity-80 mt-1">
                {r.savingsPercentage}% reduction
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Current Monthly
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {formatCurrency(r.totalCurrentMonthly)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatCurrency(r.totalCurrentAnnual)}/yr
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Optimized Monthly
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(r.totalOptimizedMonthly)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatCurrency(r.totalOptimizedAnnual)}/yr
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Monthly Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {formatCurrency(r.totalMonthlySavings)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {actionableRecs.length} recommendation{actionableRecs.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actionable recommendations */}
      {actionableRecs.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-1">Recommendations</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Actionable changes to reduce your AI spend.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actionableRecs.map((rec) => (
              <RecommendationCard key={rec.toolEntryId} rec={rec} />
            ))}
          </div>
        </div>
      )}

      {/* No-change tools */}
      {goodRecs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-1">Already Optimized</h2>
          <p className="text-sm text-muted-foreground mb-6">
            These tools are well-suited for your current usage.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goodRecs.map((rec) => (
              <RecommendationCard key={rec.toolEntryId} rec={rec} />
            ))}
          </div>
        </div>
      )}

      {/* No savings scenario */}
      {r.totalMonthlySavings === 0 && (
        <Card className="mt-8 border-green-200 bg-green-50/50">
          <CardContent className="flex flex-col items-center text-center py-12">
            <CheckCircle2 className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Your stack looks optimized!
            </h3>
            <p className="text-muted-foreground max-w-md">
              We couldn't find significant savings opportunities. Your tool
              selection and plans appear well-matched to your team size and usage.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
