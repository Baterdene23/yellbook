"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCcw } from "lucide-react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global error captured", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-5 text-center">
        <h1 className="text-3xl font-semibold text-foreground">Something went wrong</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          An unexpected error occurred while loading the page. You can try again or return to the home screen.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm font-medium text-foreground hover:border-secondary hover:text-secondary"
          >
            <RefreshCcw className="h-4 w-4" aria-hidden />
            Try again
          </button>
          <Link
            href="/"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm font-medium text-secondary hover:border-secondary hover:text-secondary/80"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Return home
          </Link>
        </div>
        {error.digest ? (
          <code className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">Error ID: {error.digest}</code>
        ) : null}
      </div>
    </div>
  );
}
