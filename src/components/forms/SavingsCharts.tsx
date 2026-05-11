"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditResult } from "@/lib/types";

interface SavingsChartsProps {
  result: AuditResult;
}

export function SavingsCharts({ result }: SavingsChartsProps) {
  const comparisonData = [
    {
      name: "Current",
      amount: result.totalCurrentMonthly,
      fill: "hsl(var(--muted-foreground))",
    },
    {
      name: "Optimized",
      amount: result.totalOptimizedMonthly,
      fill: "hsl(var(--primary))",
    },
  ];

  const distributionData = result.recommendations.map((rec) => ({
    name: rec.toolName,
    value: rec.currentMonthlyCost,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <Card className="bg-background/50 border-dashed">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Monthly Spend Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-xl text-xs font-bold">
                        ${payload[0].value?.toLocaleString()}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={60}>
                {comparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-background/50 border-dashed">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Spend Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-xl text-xs font-bold">
                        {payload[0].name}: ${payload[0].value?.toLocaleString()}
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
