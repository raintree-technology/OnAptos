import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-xl text-muted-foreground">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          The page you are looking for does not exist or may have been moved.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/tools/portfolio">Portfolio</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/markets/tokens">Tokens</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/protocols/defi">DeFi</Link>
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Try navigating to one of the sections above, or go back to the home page.
      </p>
    </div>
  );
}

// This ensures the page is statically generated and cached
export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate once per day
