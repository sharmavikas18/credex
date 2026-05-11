"use client";

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
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import type { AuditResult } from "@/lib/types";
import { SavingsCharts } from "./SavingsCharts";

function formatCurrency(amount: number): string {
  return "$" + amount.toLocaleString("en-US");
}

export function PublicResultView({ result }: { result: AuditResult }) {
  const r = result;
  const actionableRecs = r.recommendations.filter((rec) => rec.type !== "no-change");

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Public AI Spend Audit</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
            Potential Savings: <span className="text-primary">{formatCurrency(r.totalAnnualSavings)}/yr</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Analysis for {r.companyName || 'Anonymous Company'} · {r.teamSize} members · {r.inputTools.length} tools
          </p>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
           <Card className="bg-primary text-primary-foreground shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-80">
                Annual Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-black">{formatCurrency(r.totalAnnualSavings)}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-background/50 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Efficiency Gain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{r.savingsPercentage}%</p>
            </CardContent>
          </Card>

          <Card className="bg-background/50 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Monthly Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatCurrency(r.totalMonthlySavings)}</p>
            </CardContent>
          </Card>

          <Card className="bg-background/50 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Optimized Spend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatCurrency(r.totalOptimizedMonthly)}/mo</p>
            </CardContent>
          </Card>
        </div>

        <SavingsCharts result={r} />

        {r.aiSummary && (
          <div className="mb-12">
            <Card className="bg-muted/30 border-none relative overflow-hidden p-6">
              <div className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-tighter mb-4">
                <Sparkles className="h-4 w-4" />
                <span>Executive Summary</span>
              </div>
              <p className="text-xl leading-relaxed text-foreground/80 italic">
                &quot;{r.aiSummary}&quot;
              </p>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {actionableRecs.map((rec, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{rec.toolName}</CardTitle>
                  <Badge variant="secondary">{rec.type}</Badge>
                </div>
                <CardDescription>Current: {rec.currentPlan}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{rec.reasoning}</p>
                <div className="text-sm font-bold text-primary">
                  Potential Savings: {formatCurrency(rec.monthlySavings)}/mo
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-primary text-primary-foreground p-12 text-center overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Get your own AI Spend Audit</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
              Analyze your tool stack in 60 seconds and find hidden savings with our deterministic audit engine.
            </p>
            <Button size="lg" variant="secondary" render={<Link href="/" />}>
              Run Free Audit Now
            </Button>
          </div>
          <Zap className="absolute -bottom-12 -right-12 h-64 w-64 opacity-10 rotate-12" />
        </Card>
      </motion.div>
    </div>
  );
}
