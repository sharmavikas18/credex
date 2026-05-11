"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, Mail, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AuditResult } from "@/lib/types";

interface LeadCaptureProps {
  auditResult: AuditResult;
}

export function LeadCapture({ auditResult }: LeadCaptureProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role,
          auditResult,
          honeypot, // Spam protection
        }),
      });

      if (!response.ok) throw new Error("Failed to submit");
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <Card className="overflow-hidden border-2 border-primary/20 bg-primary/5">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Audit Sent!</h3>
            <p className="text-muted-foreground mb-6">
              Check your inbox at <strong>{email}</strong> for the full report and next steps.
            </p>
            <Button variant="outline" onClick={() => setStatus("idle")}>
              Send to another email
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CardHeader className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 text-primary font-semibold mb-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Save your results</span>
              </div>
              <CardTitle className="text-2xl md:text-3xl">Get the full report in your inbox</CardTitle>
              <CardDescription>
                We&apos;ll send you the personalized summary, detailed breakdown, and a checklist to start saving.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field (hidden from users) */}
                <div className="hidden">
                  <input
                    type="text"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        className="pl-10"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Your Role (Optional)</Label>
                    <Input
                      id="role"
                      placeholder="e.g. Founder, CFO, CTO"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20" 
                  size="lg"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Email Me My Full Report"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="bg-muted/30 py-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                <span>No spam, just data</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <span>Unsubscribe anytime</span>
            </CardFooter>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
