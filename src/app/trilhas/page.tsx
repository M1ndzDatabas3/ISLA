import type { Metadata } from "next";
import Link from "next/link";
import type { ItemList } from "schema-dts";

import { Section } from "@/components/layout/section";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { LevelBadge } from "@/components/ui/level-badge";
import { getTrilhas, resolveEtapa } from "@/lib/content";
import { sections } from "@/lib/navigation";
import type { Nivel } from "@/lib/taxonomy";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: sections.trilhas.label,
  description:
    "Percursos de estudo com textos, livros e verbetes em ordem, tempo estimado e perguntas para cada etapa.",
  alternates: { canonical: sections.trilhas.href },
};

export default function TrilhasPage() {
  const trilhas = getTrilhas();

  const jsonLd: ItemList = {
    "@type": "ItemList",
    name: sections.trilhas.label,
    itemListElement: trilhas.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.titulo,
      url: `${siteConfig.url}${sections.trilhas.href}#${t.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...jsonLd }} />
      <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
        <Breadcrumb
          items={[{ label: "Início", href: "/" }, { label: sections.trilhas.label }]}
          className="mb-12"
        />
        <div className="grid-page items-end gap-y-6">
          <h1 className="col-span-12 font-display text-h1 lg:col-span-7">
            Trilhas de estudo
            <i aria-hidden className="title-mark" />
          </h1>
          <p className="col-span-12 max-w-[48ch] text-lead text-muted-foreground lg:col-span-5 lg:col-start-8">
            Cada trilha indica o que ler e em que ordem, quanto tempo reservar e que perguntas levar
            para cada etapa. Comece pela primeira se nunca estudou o tema.
          </p>
        </div>

        <nav aria-label="Trilhas desta página" className="mt-stack flex flex-wrap gap-x-6 gap-y-2">
          {trilhas.map((t) => (
            <a key={t.slug} href={`#${t.slug}`} className="link-underline text-sm font-medium">
              {t.titulo}
            </a>
          ))}
        </nav>
      </Section>

      {trilhas.map((trilha) => (
        <Section
          key={trilha.slug}
          tone="paper"
          divider
          id={trilha.slug}
          aria-labelledby={`${trilha.slug}-titulo`}
          className="scroll-mt-[var(--header-h)]"
        >
          <div className="grid-page items-start gap-y-stack">
            <header className="col-span-12 lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:col-span-4">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-meta text-muted-foreground">
                <span>
                  {trilha.etapas.length} etapas, {trilha.duracao}
                </span>
                <LevelBadge nivel={trilha.nivel as Nivel} />
              </div>
              <h2 id={`${trilha.slug}-titulo`} className="mt-4 font-display text-h2">
                {trilha.titulo}
              </h2>
              <p className="mt-4 max-w-[44ch] text-muted-foreground">{trilha.descricao}</p>
            </header>

            <ol className="col-span-12 border-t border-foreground lg:col-span-7 lg:col-start-6">
              {trilha.etapas.map((etapa, i) => {
                const { tipo, href } = resolveEtapa(etapa);
                return (
                  <li
                    key={`${etapa.titulo}-${i}`}
                    className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-b border-hair py-6 sm:grid-cols-[3rem_1fr]"
                  >
                    <span
                      aria-hidden
                      className="font-display text-[1.5rem] leading-none text-muted-foreground tabular-nums"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-meta text-muted-foreground">
                        {tipo}, {etapa.tempo}
                      </p>
                      <h3 className="mt-1.5 font-display text-[1.375rem]/[1.15]">
                        {href ? (
                          <Link href={href} className="transition-colors hover:text-brand-text">
                            {etapa.titulo}
                          </Link>
                        ) : (
                          etapa.titulo
                        )}
                      </h3>
                      {etapa.perguntas.length ? (
                        <div className="mt-4">
                          <p className="text-meta text-muted-foreground">Para pensar</p>
                          <ul className="mt-2 flex flex-col gap-1.5">
                            {etapa.perguntas.map((pergunta) => (
                              <li
                                key={pergunta}
                                className="relative pl-4 text-[0.9375rem] leading-snug before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:bg-red before:content-['']"
                              >
                                {pergunta}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </Section>
      ))}
    </>
  );
}
