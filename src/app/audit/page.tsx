import { AuditForm } from "@/components/forms/AuditForm";

export default function AuditPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Start Your Audit</h1>
        <p className="text-muted-foreground text-lg">
          Fill in your current AI tool stack to identify saving opportunities.
        </p>
      </div>
      <AuditForm />
    </div>
  );
}
