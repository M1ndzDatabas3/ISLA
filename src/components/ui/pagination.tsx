import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Monta o link de cada página (preserva os filtros da URL). */
  hrefFor: (page: number) => string;
  className?: string;
}

/** Lista de páginas com reticências: 1 … 4 5 6 … 12 */
export function pageWindow(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && p - prev > 1) result.push("…");
    result.push(p);
  });
  return result;
}

const cell =
  "inline-flex h-11 min-w-11 items-center justify-center px-2 font-sans text-sm tabular-nums transition-colors";

export function Pagination({ page, totalPages, hrefFor, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <nav aria-label="Paginação" className={cn("flex flex-wrap items-center gap-1", className)}>
      {prevDisabled ? (
        <span className={cn(cell, "gap-1 pr-3 text-muted-foreground opacity-50")} aria-disabled>
          <ChevronLeft className="size-4" aria-hidden /> Anterior
        </span>
      ) : (
        <Link
          href={hrefFor(page - 1)}
          rel="prev"
          className={cn(cell, "gap-1 pr-3 hover:text-brand-text")}
        >
          <ChevronLeft className="size-4" aria-hidden /> Anterior
        </Link>
      )}
      <ol className="flex flex-wrap items-center gap-1">
        {pageWindow(page, totalPages).map((p, i) =>
          p === "…" ? (
            <li key={`gap-${i}`} aria-hidden className="px-1 text-muted-foreground">
              …
            </li>
          ) : (
            <li key={p}>
              <Link
                href={hrefFor(p)}
                aria-current={p === page ? "page" : undefined}
                aria-label={`Página ${p}`}
                className={cn(
                  cell,
                  p === page
                    ? "relative text-foreground after:absolute after:inset-x-3 after:bottom-2 after:h-px after:bg-brand"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {p}
              </Link>
            </li>
          ),
        )}
      </ol>
      {nextDisabled ? (
        <span className={cn(cell, "gap-1 pl-3 text-muted-foreground opacity-50")} aria-disabled>
          Próxima <ChevronRight className="size-4" aria-hidden />
        </span>
      ) : (
        <Link
          href={hrefFor(page + 1)}
          rel="next"
          className={cn(cell, "gap-1 pl-3 hover:text-brand-text")}
        >
          Próxima <ChevronRight className="size-4" aria-hidden />
        </Link>
      )}
    </nav>
  );
}
