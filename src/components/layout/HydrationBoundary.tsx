"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Prevents hydration mismatches from Zustand's persist middleware.
 * Components using persisted state should be wrapped in this.
 */
export function HydrationBoundary({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
