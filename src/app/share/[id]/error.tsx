"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-32 text-center max-w-md">
      <div className="h-20 w-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertTriangle size={40} />
      </div>
      <h2 className="text-2xl font-bold mb-3">Unable to load audit</h2>
      <p className="text-muted-foreground mb-8">
        The audit might have been deleted, or there was a temporary connection issue with our database.
      </p>
      <div className="flex flex-col gap-3">
        <Button onClick={() => reset()}>Try Again</Button>
        <Button variant="outline" render={<Link href="/" />}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}
