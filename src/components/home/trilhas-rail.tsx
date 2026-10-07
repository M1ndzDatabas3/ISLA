import Link from "next/link";

import { SectionHeading } from "@/components/editorial/section-heading";
import { LevelBadge } from "@/components/ui/level-badge";
import { getTrilhas } from "@/lib/content";
import { sections } from "@/lib/navigation";
import type { Nivel } from "@/lib/taxonomy";

import { HorizontalRail } from "./horizontal-rail";

/** Trilhas de estudo em trilho horizontal; cada card mostra as primeiras etapas. */
export function TrilhasRail() {
  const trilhas = getTrilhas();
  if (!trilhas.length) return null;

  return (
    <section aria-labelledby="trilhas-titulo">
      <HorizontalRail
        className="py-section"
        header={
          <SectionHeading
            id="trilhas-titulo"
            title="Trilhas de estudo"
            description="Percursos com textos, livros e verbetes em ordem, tempo estimado e perguntas para cada etapa."
            action={{ label: "Todas as trilhas", href: sections.trilhas.href }}
          />
        }
      >
        {trilhas.map((trilha) => (
          <article
            key={trilha.slug}
            className="group relative flex w-[min(84vw,420px)] shrink-0 snap-start flex-col border-t-2 border-foreground pt-6 lg:w-[clamp(380px,34vw,500px)]"
          >
            <div className="flex items-center justify-between gap-4 text-meta text-muted-foreground">
              <span>
                {trilha.etapas.length} etapas, {trilha.duracao}
              </span>
              <LevelBadge nivel={trilha.nivel as Nivel} />
            </div>
            <h3 className="mt-5 font-display text-[clamp(1.625rem,1.3rem+1vw,2.125rem)]/[1.08] transition-colors group-hover:text-brand-text">
              <Link
                href={sections.trilhas.href}
                className="after:absolute after:inset-0 after:content-['']"
              >
                {trilha.titulo}
              </Link>
            </h3>
            {/* Altura fixa de 4 linhas: as listas dos cards começam na mesma linha */}
            <p className="mt-4 line-clamp-4 min-h-[5.5em] max-w-[46ch] font-text text-base leading-snug text-muted-foreground">
              {trilha.descricao}
            </p>
            <ol className="mt-8 flex flex-col border-t border-hair">
              {trilha.etapas.slice(0, 4).map((etapa, i) => (
                <li
                  key={etapa.titulo}
                  className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-2 border-b border-hair py-3 text-sm"
                >
                  <span className="text-muted-foreground tabular-nums">{i + 1}</span>
                  <span className="truncate">{etapa.titulo}</span>
                  <span className="text-meta text-muted-foreground">{etapa.tempo}</span>
                </li>
              ))}
            </ol>
            {trilha.etapas.length > 4 ? (
              <p className="mt-3 text-meta text-muted-foreground">
                e mais {trilha.etapas.length - 4}{" "}
                {trilha.etapas.length - 4 === 1 ? "etapa" : "etapas"}
              </p>
            ) : null}
          </article>
        ))}
      </HorizontalRail>
    </section>
  );
}
