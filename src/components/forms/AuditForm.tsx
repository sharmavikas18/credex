"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";

export function AuditForm() {
  // Empty state for Day 1
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
          <CardDescription>Start by telling us a bit about your startup.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input id="company" placeholder="Acme Inc." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>AI Tools</CardTitle>
            <CardDescription>Add the AI tools your team is currently using.</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Tool
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mock entry for Day 1 UI shell */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg relative bg-muted/20">
            <div className="md:col-span-2 space-y-2">
              <Label>Tool</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select tool" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chatgpt">ChatGPT</SelectItem>
                  <SelectItem value="claude">Claude</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                  <SelectItem value="cursor">Cursor</SelectItem>
                  <SelectItem value="copilot">Copilot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Plan</Label>
              <Input placeholder="e.g. Plus, Pro, Team" />
            </div>
            <div className="space-y-2">
              <Label>Monthly Spend ($)</Label>
              <Input type="number" placeholder="20" />
            </div>
            <div className="space-y-2">
              <Label>Seats</Label>
              <Input type="number" placeholder="1" />
            </div>
            <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 bg-background border h-6 w-6 rounded-full">
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Data is stored locally until you submit for analysis.
          </p>
          <Button>Run Audit Analysis</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
