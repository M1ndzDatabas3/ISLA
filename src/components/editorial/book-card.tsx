import Link from "next/link";

import { LevelBadge } from "@/components/ui/level-badge";
import type { Nivel, Tradicao } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

import { BookCover } from "./book-cover";

export interface BookCardData {
  slug: string;
  href: string;
  titulo: string;
  /** Título curto para a capa gerada. */
  tituloCapa?: string;
  autor: string;
  ano: number;
  tradicao: Tradicao;
  nivel: Nivel;
  tipoDeObra: string;
  sinopse?: string;
  /** Tema principal, que leva ao filtro correspondente. */
  tema: { label: string; href: string };
}

interface BookCardProps {
  book: BookCardData;
  variant?: "grid" | "list";
  className?: string;
}

/** Card de livro: grade de capas (a capa sobe e inclina de leve no hover) ou lista detalhada. */
export function BookCard({ book, variant = "grid", className }: BookCardProps) {
  const cover = (
    <BookCover
      titulo={book.tituloCapa ?? book.titulo}
      autor={book.autor}
      ano={book.ano}
      tradicao={book.tradicao}
      seed={book.slug}
      className="transition-transform duration-500 ease-poster group-focus-within:-translate-y-1.5 group-hover:-translate-y-1.5 group-hover:-rotate-1"
    />
  );

  const title = (
    <Link href={book.href} className="after:absolute after:inset-0 after:content-['']">
      {book.titulo}
    </Link>
  );

  if (variant === "list") {
    return (
      <article
        className={cn(
          "group relative grid grid-cols-[88px_1fr] gap-6 border-t border-hair py-7 sm:grid-cols-[112px_1fr]",
          className,
        )}
      >
        {cover}
        <div className="flex min-w-0 flex-col gap-2">
          <h3 className="font-display text-[1.375rem] leading-tight transition-colors group-hover:text-brand-text">
            {title}
          </h3>
          <p className="text-meta text-muted-foreground">
            {book.autor}, {book.ano}. {book.tipoDeObra}.
          </p>
          {book.sinopse ? (
            <p className="mt-1 line-clamp-3 max-w-[64ch] font-text text-base leading-snug">
              {book.sinopse}
            </p>
          ) : null}
          <div className="relative z-10 mt-2 flex flex-wrap items-center gap-x-5 gap-y-2">
            <LevelBadge nivel={book.nivel} />
            <Link
              href={book.tema.href}
              className="text-meta font-medium text-brand-text hover:underline hover:underline-offset-4"
            >
              {book.tema.label}
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={cn("group relative flex flex-col gap-2", className)}>
      {cover}
      <h3 className="mt-3 font-display text-[1.0625rem] leading-snug tracking-[-0.005em] transition-colors group-hover:text-brand-text">
        {title}
      </h3>
      <p className="text-meta text-muted-foreground">
        {book.autor}, {book.ano}
      </p>
    </article>
  );
}
