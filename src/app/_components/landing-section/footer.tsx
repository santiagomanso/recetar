import Link from "next/link";
import { FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Recetar</span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/#features" className="transition-colors hover:text-foreground">
              Funcionalidades
            </Link>
            <Link href="/#pricing" className="transition-colors hover:text-foreground">
              Precios
            </Link>
            <Link href="/login" className="transition-colors hover:text-foreground">
              Login
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>2026 Recetar.</p>
        </div>
      </div>
    </footer>
  );
}
