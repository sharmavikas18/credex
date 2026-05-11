"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, BarChart3, RotateCcw } from "lucide-react";
import { useAuditStore } from "@/lib/store";
import { runAudit } from "@/lib/audit-engine";
import { ToolEntryRow } from "@/components/forms/ToolEntryRow";
import type { ToolEntry } from "@/lib/types";

function generateEntryId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function AuditForm() {
  const router = useRouter();
  const {
    formData,
    setCompanyName,
    setTeamSize,
    addTool,
    removeTool,
    updateTool,
    resetForm,
    setResult,
  } = useAuditStore();

  const handleAddTool = useCallback(() => {
    const newTool: ToolEntry = {
      id: generateEntryId(),
      toolId: "",
      plan: "",
      monthlySpend: 0,
      seats: 1,
      useCase: "general",
    };
    addTool(newTool);
  }, [addTool]);

  const handleRunAudit = useCallback(() => {
    if (formData.tools.length === 0) return;

    // Validate: all tools must have toolId, plan, and spend > 0
    const isValid = formData.tools.every(
      (t) => t.toolId && t.plan && t.monthlySpend > 0
    );
    if (!isValid) return;

    const result = runAudit(formData);
    setResult(result);
    router.push(`/results/${result.id}`);
  }, [formData, setResult, router]);

  const totalMonthly = useMemo(() => 
    formData.tools.reduce((s, t) => s + t.monthlySpend, 0),
    [formData.tools]
  );

  const isFormValid = useMemo(() => 
    formData.companyName.trim() !== "" &&
    formData.teamSize > 0 &&
    formData.tools.length > 0 &&
    formData.tools.every((t) => t.toolId && t.plan && t.monthlySpend > 0),
    [formData]
  );

  return (
    <div className="space-y-8">
      {/* Company details */}
      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
          <CardDescription>
            Start by telling us about your startup.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                placeholder="Acme Inc."
                value={formData.companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-size">Team Size</Label>
              <Input
                id="team-size"
                type="number"
                min={1}
                placeholder="10"
                value={formData.teamSize || ""}
                onChange={(e) => setTeamSize(Number(e.target.value) || 0)}
                aria-describedby="team-size-desc"
              />
              <p id="team-size-desc" className="text-xs text-muted-foreground">
                Total people on your team (helps detect ghost seats).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tool entries */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>AI Tools</CardTitle>
            <CardDescription>
              Add each AI tool your team is currently paying for.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddTool}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Tool
          </Button>
        </CardHeader>

        <CardContent className="space-y-4" aria-live="polite">
          {formData.tools.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg bg-muted/10">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <PlusCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">No tools added yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs mb-4">
                  Click &quot;Add Tool&quot; to start entering the AI tools your team uses.
                </p>
                <Button variant="outline" size="sm" onClick={handleAddTool}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First Tool
                </Button>
              </div>
            ) : (
              formData.tools.map((entry) => (
                <ToolEntryRow
                  key={entry.id}
                  entry={entry}
                  onUpdate={(updates: Partial<ToolEntry>) => updateTool(entry.id, updates)}
                  onRemove={() => removeTool(entry.id)}
                />
              ))
            )}
        </CardContent>

        {formData.tools.length > 0 && (
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 border-t pt-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                {formData.tools.length} tool{formData.tools.length > 1 ? "s" : ""} · ${"$" + totalMonthly.toLocaleString()}/mo · ${"$" + (totalMonthly * 12).toLocaleString()}/yr
              </p>
              <p className="text-xs text-muted-foreground">
                Data is stored locally in your browser.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
                className="text-muted-foreground"
              >
                <RotateCcw className="mr-2 h-3 w-3" />
                Reset
              </Button>
              <Button
                onClick={handleRunAudit}
                disabled={!isFormValid}
                size="sm"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Run Audit Analysis
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
