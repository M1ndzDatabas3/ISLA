import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { DefinedTerm } from "schema-dts";

import { ArticleCard } from "@/components/editorial/article-card";
import { ShareButtons } from "@/components/editorial/share-buttons";
import { Section } from "@/components/layout/section";
import { Mdx } from "@/components/mdx/mdx-content";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Chip } from "@/components/ui/chip";
import {
  getArtigosComConceito,
  getAutoresBySlugs,
  getConceito,
  getConceitos,
  getConceitosBySlugs,
} from "@/lib/content";
import { toArticleCard } from "@/lib/content/summaries";
import { formatLifespan } from "@/lib/format";
import { labelOf } from "@/lib/taxonomy";
import { siteConfig } from "@/site.config";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getConceitos().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const conceito = getConceito(slug);
  if (!conceito) return {};
  return {
    title: `${conceito.termo}: o que é`,
    description: conceito.definicaoCurta,
    alternates: { canonical: `/glossario/${slug}` },
  };
}

export default async function VerbetePage({ params }: Props) {
  const { slug } = await params;
  const conceito = getConceito(slug);
  if (!conceito) notFound();

  const autores = getAutoresBySlugs(conceito.autores);
  const relacionados = getConceitosBySlugs(conceito.relacionados);
  const artigos = getArtigosComConceito(slug);

  const jsonLd: DefinedTerm = {
    "@type": "DefinedTerm",
    name: conceito.termo,
    description: conceito.definicaoCurta,
    url: `${siteConfig.url}/glossario/${slug}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: `Glossário do ${siteConfig.name}`,
      url: `${siteConfig.url}/glossario`,
    },
  };

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...jsonLd }} />
      <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Glossário", href: "/glossario" },
            { label: conceito.termo },
          ]}
          className="mb-12"
        />
        <div className="grid-page items-start gap-y-10">
          <div className="col-span-12 lg:col-span-8">
            <p className="text-meta text-muted-foreground">Verbete</p>
            <h1 className="mt-3 font-display text-h1">
              {conceito.termo}
              <i aria-hidden className="title-mark" />
            </h1>
            <p className="mt-6 max-w-[56ch] border-l-2 border-brand pl-5 text-lead">
              {conceito.definicaoCurta}
            </p>
            <div className="prose-editorial mt-10">
              <Mdx code={conceito.mdx} />
            </div>
            <div className="mt-12 border-t border-hair pt-8">
              <p className="mb-4 text-meta text-muted-foreground">Compartilhar verbete</p>
              <ShareButtons
                title={`${conceito.termo}: ${conceito.definicaoCurta}`}
                path={`/glossario/${slug}`}
              />
            </div>
          </div>

          <aside className="col-span-12 flex flex-col gap-10 lg:col-span-3 lg:col-start-10">
            {autores.length ? (
              <section aria-labelledby="autores">
                <h2 id="autores" className="mb-3 text-meta text-muted-foreground">
                  Autores associados
                </h2>
                <ul className="flex flex-col border-t border-hair">
                  {autores.map((a) => (
                    <li key={a.slug} className="border-b border-hair">
                      <Link href={`/autores/${a.slug}`} className="group flex flex-col py-3">
                        <span className="font-medium transition-colors group-hover:text-brand-text">
                          {a.nome}
                        </span>
                        <span className="text-meta text-muted-foreground tabular-nums">
                          {formatLifespan(a.nascimento, a.morte)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {relacionados.length ? (
              <section aria-labelledby="relacionados">
                <h2 id="relacionados" className="mb-3 text-meta text-muted-foreground">
                  Conceitos relacionados
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {relacionados.map((c) => (
                    <li key={c.slug}>
                      <Chip asChild>
                        <Link href={`/glossario/${c.slug}`}>{c.termo}</Link>
                      </Chip>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {conceito.tradicoes.length || conceito.areas.length ? (
              <section aria-labelledby="tradicoes">
                <h2 id="tradicoes" className="mb-3 text-meta text-muted-foreground">
                  Tradições e áreas
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {conceito.tradicoes.map((t) => (
                    <li key={t}>
                      <Chip asChild>
                        <Link href={`/biblioteca?tradicao=${t}`}>{labelOf("tradicao", t)}</Link>
                      </Chip>
                    </li>
                  ))}
                  {conceito.areas.map((a) => (
                    <li key={a}>
                      <Chip asChild>
                        <Link href={`/biblioteca?area=${a}`}>{labelOf("area", a)}</Link>
                      </Chip>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </div>
      </Section>

      {artigos.length ? (
        <Section tone="paper" divider>
          <h2 className="mb-section-head font-display text-h2">Onde o conceito aparece</h2>
          <div className="grid gap-x-[clamp(16px,2vw,32px)] md:grid-cols-3">
            {artigos.slice(0, 3).map((a) => (
              <ArticleCard key={a.slug} article={toArticleCard(a)} variant="compact" />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
