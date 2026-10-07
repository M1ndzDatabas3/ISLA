import Image from "next/image";
import Link from "next/link";

import { HalftonePhoto } from "@/components/graphics/halftone-photo";
import { LevelBadge } from "@/components/ui/level-badge";
import { formatDate, formatReadingTime } from "@/lib/format";
import type { Nivel } from "@/lib/taxonomy";
import { cn, hashString } from "@/lib/utils";

export interface ArticleCardData {
  href: string;
  titulo: string;
  linhaFina?: string;
  autor: string;
  /** Data ISO (AAAA-MM-DD). */
  data: string;
  leituraMin: number;
  nivel: Nivel;
  /** Rótulo do formato (Ensaio, Resenha…). */
  tipo: string;
  /** Tema principal, que leva ao filtro correspondente. */
  tema: { label: string; href: string };
  imagem?: { src: string; alt: string } | null;
}

interface ArticleCardProps {
  article: ArticleCardData;
  variant?: "feature" | "default" | "compact";
  className?: string;
  /** Nível do título para manter a hierarquia da página. */
  headingLevel?: "h2" | "h3";
}

/**
 * Card de artigo. O card inteiro é clicável (link estendido no título);
 * o tema fica acima da camada do link e leva ao filtro.
 */
export function ArticleCard({
  article,
  variant = "default",
  className,
  headingLevel = "h3",
}: ArticleCardProps) {
  const Heading = headingLevel;
  const isFeature = variant === "feature";

  const titleLink = (
    <Link href={article.href} className="after:absolute after:inset-0 after:content-['']">
      {article.titulo}
    </Link>
  );

  const tema = (
    <Link
      href={article.tema.href}
      className="relative z-10 font-sans text-meta font-medium text-brand-text hover:underline hover:underline-offset-4"
    >
      {article.tema.label}
    </Link>
  );

  if (variant === "compact") {
    return (
      <article
        className={cn("group relative flex flex-col gap-2 border-t border-hair py-5", className)}
      >
        {tema}
        <Heading className="font-display text-[1.375rem] leading-[1.18] tracking-[-0.012em] transition-colors group-hover:text-brand-text">
          {titleLink}
        </Heading>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-meta text-muted-foreground">
          <span>
            {article.tipo}, {formatReadingTime(article.leituraMin)}
          </span>
          <LevelBadge nivel={article.nivel} />
        </div>
      </article>
    );
  }

  return (
    <article className={cn("group relative flex flex-col gap-3", className)}>
      <div
        className={cn(
          "relative mb-2 overflow-hidden bg-muted",
          isFeature ? "aspect-[16/10]" : "aspect-[3/2]",
        )}
      >
        <div className="absolute inset-0 transition-transform duration-700 ease-poster group-hover:scale-[1.02]">
          {article.imagem ? (
            <div className="duotone absolute inset-0">
              <Image
                src={article.imagem.src}
                alt={article.imagem.alt}
                fill
                sizes={
                  isFeature ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"
                }
                className="object-cover"
              />
            </div>
          ) : (
            <HalftonePhoto seed={hashString(article.href + article.titulo)} horizon={0.5} />
          )}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-4">
        {tema}
        <span className="text-meta text-muted-foreground">
          {formatReadingTime(article.leituraMin)}
        </span>
      </div>

      <Heading
        className={cn(
          "font-display leading-[1.1] transition-colors group-hover:text-brand-text",
          isFeature ? "text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)]/[1.1]" : "text-[1.5rem]/[1.16]",
        )}
      >
        {titleLink}
      </Heading>

      {article.linhaFina ? (
        <p
          className={cn(
            "max-w-[52ch] font-text text-muted-foreground",
            isFeature ? "text-lead" : "text-base leading-snug",
          )}
        >
          {article.linhaFina}
        </p>
      ) : null}

      <p className="text-meta text-muted-foreground">
        {article.autor}, <time dateTime={article.data}>{formatDate(article.data)}</time>
      </p>
    </article>
  );
}
