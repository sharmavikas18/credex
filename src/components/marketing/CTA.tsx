import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CTA() {
  return (
    <section className="py-24 border-t">
      <div className="container mx-auto px-4 md:px-8">
        <div className="bg-foreground text-background rounded-3xl p-8 md:p-16 text-center max-w-5xl mx-auto overflow-hidden relative">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to find your savings?</h2>
            <p className="text-background/70 text-lg mb-10 max-w-2xl mx-auto">
              Join dozens of startups already using AI Spend Audit to keep their 
              burn low and their productivity high.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="h-12 bg-background/10 border-background/20 text-background placeholder:text-background/40"
              />
              <Button size="lg" className="h-12 bg-background text-foreground hover:bg-background/90">
                Get Early Access
              </Button>
            </div>
            <p className="mt-4 text-xs text-background/50">
              No credit card required. Free 5-minute audit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
