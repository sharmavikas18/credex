"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { TOOL_CONFIGS, USE_CASE_LABELS, getPlansForTool } from "@/lib/constants/pricing";
import type { UseCase } from "@/lib/constants/pricing";
import type { ToolEntry } from "@/lib/types";

interface ToolEntryRowProps {
  entry: ToolEntry;
  onUpdate: (updates: Partial<ToolEntry>) => void;
  onRemove: () => void;
}

export function ToolEntryRow({ entry, onUpdate, onRemove }: ToolEntryRowProps) {
  const availablePlans = entry.toolId ? getPlansForTool(entry.toolId) : [];

  const handleToolChange = (toolId: string | null) => {
    if (!toolId) return;
    // Reset plan when tool changes
    onUpdate({ toolId, plan: "", monthlySpend: 0 });
  };

  const handlePlanChange = (planName: string | null) => {
    if (!planName) return;
    const plan = availablePlans.find((p) => p.name === planName);
    if (plan) {
      // Auto-fill the expected price
      onUpdate({
        plan: planName,
        monthlySpend: plan.monthlyPricePerSeat * (entry.seats || 1),
      });
    }
  };

  const handleSeatsChange = (seats: number) => {
    const plan = availablePlans.find((p) => p.name === entry.plan);
    onUpdate({
      seats,
      // Recalculate spend when seats change if we have a known plan price
      ...(plan ? { monthlySpend: plan.monthlyPricePerSeat * seats } : {}),
    });
  };

  const isIncomplete = !entry.toolId || !entry.plan;

  return (
    <div
      className={`relative rounded-lg border p-4 transition-colors ${
        isIncomplete ? "border-dashed bg-muted/10" : "bg-card"
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Tool selector */}
        <div className="sm:col-span-1 lg:col-span-2 space-y-2">
          <Label htmlFor={`tool-select-${entry.id}`} className="text-xs font-medium text-muted-foreground">
            Tool
          </Label>
          <Select value={entry.toolId} onValueChange={handleToolChange}>
            <SelectTrigger id={`tool-select-${entry.id}`}>
              <SelectValue placeholder="Select tool" />
            </SelectTrigger>
            <SelectContent>
              {TOOL_CONFIGS.map((tool) => (
                <SelectItem key={tool.id} value={tool.id}>
                  {tool.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Plan selector */}
        <div className="space-y-2">
          <Label htmlFor={`plan-select-${entry.id}`} className="text-xs font-medium text-muted-foreground">
            Plan
          </Label>
          <Select
            value={entry.plan}
            onValueChange={handlePlanChange}
            disabled={!entry.toolId}
          >
            <SelectTrigger id={`plan-select-${entry.id}`}>
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              {availablePlans.map((plan) => (
                <SelectItem key={plan.name} value={plan.name}>
                  {plan.name}
                  {plan.monthlyPricePerSeat > 0 && (
                    <span className="text-muted-foreground ml-1">
                      (${plan.monthlyPricePerSeat}/mo)
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Monthly spend */}
        <div className="space-y-2">
          <Label htmlFor={`spend-input-${entry.id}`} className="text-xs font-medium text-muted-foreground">
            Spend ($/mo)
          </Label>
          <Input
            id={`spend-input-${entry.id}`}
            type="number"
            min={0}
            placeholder="0"
            value={entry.monthlySpend || ""}
            onChange={(e) =>
              onUpdate({ monthlySpend: Number(e.target.value) || 0 })
            }
          />
        </div>

        {/* Seats */}
        <div className="space-y-2">
          <Label htmlFor={`seats-input-${entry.id}`} className="text-xs font-medium text-muted-foreground">
            Seats
          </Label>
          <Input
            id={`seats-input-${entry.id}`}
            type="number"
            min={1}
            placeholder="1"
            value={entry.seats || ""}
            onChange={(e) => handleSeatsChange(Number(e.target.value) || 1)}
          />
        </div>

        {/* Use case */}
        <div className="sm:col-span-2 lg:col-span-1 space-y-2 flex flex-col">
          <Label htmlFor={`usecase-select-${entry.id}`} className="text-xs font-medium text-muted-foreground">
            Use Case
          </Label>
          <div className="flex gap-2 items-end flex-1">
            <Select
              value={entry.useCase}
              onValueChange={(v) => { if (v) onUpdate({ useCase: v as UseCase }); }}
            >
              <SelectTrigger id={`usecase-select-${entry.id}`} className="flex-1">
                <SelectValue placeholder="Use case" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(USE_CASE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="shrink-0 text-muted-foreground hover:text-destructive"
              aria-label="Remove tool"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
