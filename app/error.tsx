"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4">
      <h1 className="text-4xl font-bold">Error</h1>
      <h2 className="text-xl text-muted-foreground">Something went wrong</h2>
      <p className="text-muted-foreground text-center max-w-md">
        An unexpected error occurred. Please try again or return to the home page.
      </p>
      {error.digest && <p className="text-xs text-muted-foreground">Reference: {error.digest}</p>}
      <div className="flex gap-4 mt-4">
        <Button onClick={reset}>Try Again</Button>
        <Button variant="outline" asChild>
          <a href="/">Home</a>
        </Button>
      </div>
    </div>
  );
}
