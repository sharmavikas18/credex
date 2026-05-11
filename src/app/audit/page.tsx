import { AuditForm } from "@/components/forms/AuditForm";
import { HydrationBoundary } from "@/components/layout/HydrationBoundary";

export default function AuditPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Start Your Audit</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Add each AI tool your team is paying for. We&apos;ll analyze your stack and
          identify savings opportunities.
        </p>
      </div>
      <HydrationBoundary>
        <AuditForm />
      </HydrationBoundary>
    </div>
  );
}
