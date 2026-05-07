import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 md:px-8 text-center">
        <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium mb-6">
          <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
          <span>Trusted by 50+ startups</span>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
          Audit your AI spend. <br />
          <span className="text-primary">Save thousands.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          The average startup overspends 30% on AI tools. Our audit tool identifies 
          overlaps, plan optimization, and seat waste in minutes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/audit">
            <Button size="lg" className="h-12 px-8 text-base">
              Start Free Audit <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              See How It Works
            </Button>
          </Link>
        </div>
        
        {/* Mock visual placeholder */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <div className="rounded-xl border bg-card shadow-2xl overflow-hidden max-w-4xl mx-auto border-border/50">
             <div className="h-10 bg-muted flex items-center px-4 gap-2 border-b">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
             </div>
             <div className="p-8 bg-card/50 min-h-[300px] flex items-center justify-center text-muted-foreground italic">
                [Audit Visualization Preview]
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
