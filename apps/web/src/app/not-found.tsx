import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-semibold text-foreground">Page not found</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          The page you are looking for could not be located. Check the URL or head back to the directory.
        </p>
        <Link
          href="/"
          prefetch={false}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm font-medium text-secondary hover:border-secondary hover:text-secondary/80"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Return home
        </Link>
      </div>
    </div>
  );
}
