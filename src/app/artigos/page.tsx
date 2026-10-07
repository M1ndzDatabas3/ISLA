import type { Metadata } from "next";
import { Suspense } from "react";

import { ArticlesExplorer, type ArticleListItem } from "@/components/article/articles-explorer";
import { ArticleCard } from "@/components/editorial/article-card";
import { SectionHeading } from "@/components/editorial/section-heading";
import { CategoryDirectory, HubHeader } from "@/components/hub/hub";
import { Section } from "@/components/layout/section";
import { StaticArticles } from "@/components/library/static-lists";
import { getArtigos, getArtigosDestaque } from "@/lib/content";
import { categoriasDeArtigos } from "@/lib/content/facets";
import { toArticleCard } from "@/lib/content/summaries";
import { sections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: sections.artigos.label,
  description:
    "Ensaios, resenhas e verbetes da redação, com fontes verificáveis. Navegue por área, tradição, região, formato e nível.",
  alternates: { canonical: sections.artigos.href },
};

/** Página-mestre de Artigos: números, destaque, temas e a lista completa com filtros. */
export default function ArtigosPage() {
  const todos = getArtigos();
  const articles: ArticleListItem[] = todos.map((a) => ({
    ...toArticleCard(a),
    slug: a.slug,
    tradicoes: a.tradicoes,
    areas: a.areas,
    regioes: a.regioes,
    tipoSlug: a.tipo,
    nivelSlug: a.nivel,
  }));
  const [principal, ...outros] = getArtigosDestaque();
  const categorias = categoriasDeArtigos();
  const total = (key: string) => categorias.find((g) => g.key === key)?.items.length ?? 0;

  return (
    <>
      <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
        <HubHeader
          title="Artigos"
          lead="Ensaios, resenhas e verbetes da redação, com fontes verificáveis e indicações de leitura. Navegue por tema ou vá direto à lista completa."
          stats={[
            { valor: todos.length, rotulo: "artigos publicados", href: "#todos" },
            { valor: total("area"), rotulo: "áreas de estudo", href: "#temas" },
            { valor: total("tradicao"), rotulo: "tradições do pensamento", href: "#temas" },
            {
              valor: todos.reduce((soma, a) => soma + a.leituraMin, 0),
              rotulo: "minutos de leitura",
            },
          ]}
        />
      </Section>

      {principal ? (
        <Section tone="paper" divider aria-labelledby="destaque">
          <SectionHeading id="destaque" title="Em destaque" />
          <div className="grid-page gap-y-12">
            <div className="col-span-12 lg:col-span-7">
              <ArticleCard article={toArticleCard(principal)} variant="feature" />
            </div>
            <div className="col-span-12 lg:col-span-4 lg:col-start-9">
              {outros.slice(0, 3).map((a) => (
                <ArticleCard key={a.slug} article={toArticleCard(a)} variant="compact" />
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <Section
        tone="paper"
        divider
        id="temas"
        aria-labelledby="temas-titulo"
        className="scroll-mt-[var(--header-h)]"
      >
        <SectionHeading
          id="temas-titulo"
          title="Explore por tema"
          description="Cada categoria abre a lista de artigos já filtrada. Os números mostram quantos textos há em cada uma."
        />
        <CategoryDirectory groups={categorias} unidade={["artigo", "artigos"]} />
      </Section>

      <Section
        tone="paper"
        divider
        id="todos"
        aria-labelledby="todos-titulo"
        className="scroll-mt-[var(--header-h)]"
      >
        <SectionHeading
          id="todos-titulo"
          title="Todos os artigos"
          description="Combine filtros por área, tradição, região, formato e nível. A seleção fica no endereço da página e pode ser compartilhada."
        />
        <Suspense fallback={<StaticArticles articles={articles} />}>
          <ArticlesExplorer articles={articles} />
        </Suspense>
      </Section>
    </>
  );
}
