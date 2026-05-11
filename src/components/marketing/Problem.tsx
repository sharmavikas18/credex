import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Layers, Users, Zap } from "lucide-react";

const problems = [
  {
    title: "Overlapping Tools",
    description: "Paying for ChatGPT Plus, Claude Pro, and Gemini Advanced simultaneously across the team.",
    icon: Layers,
  },
  {
    title: "Ghost Seats",
    description: "Seats assigned to former employees or inactive contractors still billing every month.",
    icon: Users,
  },
  {
    title: "Wrong Plan Tiers",
    description: "Being on Enterprise plans when Pro or Team tiers would suffice for your current scale.",
    icon: Zap,
  },
  {
    title: "Inefficient Workflows",
    description: "Using high-cost tools for tasks that could be automated by lower-cost specialized APIs.",
    icon: AlertCircle,
  },
];

export function Problem() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The AI &quot;Shadow Spend&quot; Problem</h2>
          <p className="text-muted-foreground text-lg">
            As startups adopt AI faster than ever, costs are spiraling out of control. 
            Most founders don&apos;t realize how much they&apos;re leaking until they audit.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((item, index) => (
            <Card key={index} className="border-none shadow-sm bg-background">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
