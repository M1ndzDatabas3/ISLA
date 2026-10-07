import type { Metadata } from "next";
import { Suspense } from "react";

import { ArticlesExplorer, type ArticleListItem } from "@/components/article/articles-explorer";
import { Section } from "@/components/layout/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getArtigos } from "@/lib/content";
import { toArticleCard } from "@/lib/content/summaries";
import { sections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: sections.artigos.label,
  description: sections.artigos.description,
  alternates: { canonical: sections.artigos.href },
};

export default function ArtigosPage() {
  const articles: ArticleListItem[] = getArtigos().map((a) => ({
    ...toArticleCard(a),
    slug: a.slug,
    tradicoes: a.tradicoes,
    areas: a.areas,
    regioes: a.regioes,
    tipoSlug: a.tipo,
    nivelSlug: a.nivel,
  }));

  return (
    <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
      <Breadcrumb
        items={[{ label: "Início", href: "/" }, { label: "Artigos" }]}
        className="mb-10"
      />
      <div className="mb-12 grid-page items-end gap-y-4 lg:mb-16">
        <h1 className="col-span-12 font-display text-h1 lg:col-span-7">
          Artigos
          <i aria-hidden className="title-mark" />
        </h1>
        <p className="col-span-12 max-w-[52ch] text-lead text-muted-foreground lg:col-span-5">
          Ensaios, resenhas, verbetes, traduções e entrevistas, com filtros por área, tradição,
          região, formato e nível.
        </p>
      </div>
      <Suspense fallback={<p className="text-muted-foreground">Carregando os artigos…</p>}>
        <ArticlesExplorer articles={articles} />
      </Suspense>
    </Section>
  );
}
