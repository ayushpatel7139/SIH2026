"use client";

import { useEffect } from "react";
import ErrorState from "@/components/common/ErrorState";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center p-6">
      <ErrorState 
        title="Something went wrong"
        description="We couldn't load this information right now. Please try again."
        onRetry={() => reset()}
      />
    </div>
  );
}
