import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Article } from "schema-dts";

import { ReadingProgress } from "@/components/article/reading-progress";
import { TableOfContents, TableOfContentsMobile } from "@/components/article/table-of-contents";
import { ArticleCard } from "@/components/editorial/article-card";
import { BookCard } from "@/components/editorial/book-card";
import { CiteThis } from "@/components/editorial/cite-this";
import { ShareButtons } from "@/components/editorial/share-buttons";
import { Section } from "@/components/layout/section";
import { FootnotePopovers } from "@/components/mdx/footnotes";
import { Mdx } from "@/components/mdx/mdx-content";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Chip } from "@/components/ui/chip";
import { LevelBadge } from "@/components/ui/level-badge";
import {
  getArtigo,
  getArtigos,
  getArtigosRelacionados,
  getConceitosBySlugs,
  getLivrosBySlugs,
  getTrilha,
  temaDoArtigo,
} from "@/lib/content";
import { toArticleCard, toBookCard, toBookSummary } from "@/lib/content/summaries";
import { formatLongDate, formatReadingTime } from "@/lib/format";
import { labelOf, type Nivel } from "@/lib/taxonomy";
import { siteConfig } from "@/site.config";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getArtigos().map((artigo) => ({ slug: artigo.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artigo = getArtigo(slug);
  if (!artigo) return {};
  return {
    title: artigo.titulo,
    description: artigo.linhaFina,
    alternates: { canonical: `/artigos/${slug}` },
    openGraph: { type: "article", publishedTime: artigo.data, authors: [artigo.assinatura] },
  };
}

export default async function ArtigoPage({ params }: Props) {
  const { slug } = await params;
  const artigo = getArtigo(slug);
  if (!artigo) notFound();

  const tema = temaDoArtigo(artigo);
  const conceitos = getConceitosBySlugs(artigo.conceitos);
  const livros = getLivrosBySlugs(artigo.livros).map((l) => toBookCard(toBookSummary(l)));
  const relacionados = getArtigosRelacionados(artigo);
  const trilha = artigo.trilha ? getTrilha(artigo.trilha) : undefined;

  const jsonLd: Article = {
    "@type": "Article",
    headline: artigo.titulo,
    description: artigo.linhaFina,
    datePublished: artigo.data,
    inLanguage: "pt-BR",
    author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    mainEntityOfPage: `${siteConfig.url}/artigos/${slug}`,
    about: conceitos.map((c) => ({ "@type": "DefinedTerm", name: c.termo })),
  };

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...jsonLd }} />
      <ReadingProgress targetId="corpo-do-artigo" />

      <Section tone="paper" className="pt-[clamp(32px,5vw,64px)] pb-0">
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Artigos", href: "/artigos" },
            { label: artigo.titulo },
          ]}
          className="mb-12"
        />
        <header className="grid-page gap-y-6">
          <div className="col-span-12 flex flex-wrap items-center gap-x-5 gap-y-2 lg:col-span-9 lg:col-start-4">
            <Link
              href={tema.href}
              className="text-meta font-medium text-brand-text hover:underline hover:underline-offset-4"
            >
              {tema.label}
            </Link>
            <span className="text-meta text-muted-foreground">
              {labelOf("tipoDeArtigo", artigo.tipo)}
            </span>
            <LevelBadge nivel={artigo.nivel as Nivel} />
          </div>
          <h1 className="col-span-12 font-display text-h1 lg:col-span-9 lg:col-start-4">
            {artigo.titulo}
          </h1>
          <p className="col-span-12 max-w-[56ch] text-lead text-muted-foreground lg:col-span-8 lg:col-start-4">
            {artigo.linhaFina}
          </p>
          <dl className="col-span-12 mt-2 flex flex-wrap gap-x-8 gap-y-3 border-t border-hair pt-5 text-sm lg:col-span-9 lg:col-start-4">
            <div>
              <dt className="text-meta text-muted-foreground">Autoria</dt>
              <dd>{artigo.assinatura}</dd>
            </div>
            <div>
              <dt className="text-meta text-muted-foreground">Publicado em</dt>
              <dd>
                <time dateTime={artigo.data}>{formatLongDate(artigo.data)}</time>
              </dd>
            </div>
            <div>
              <dt className="text-meta text-muted-foreground">Leitura</dt>
              <dd>{formatReadingTime(artigo.leituraMin)}</dd>
            </div>
          </dl>
        </header>
      </Section>

      <Section tone="paper" className="pt-12">
        <div className="grid-page items-start gap-y-8">
          <aside className="hidden lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:col-span-3 lg:block">
            <TableOfContents items={artigo.toc} />
          </aside>
          <div className="col-span-12 min-w-0 lg:col-span-8 lg:col-start-4 xl:col-span-7 xl:col-start-4">
            <div className="mb-10 lg:hidden">
              <TableOfContentsMobile items={artigo.toc} />
            </div>
            <article id="corpo-do-artigo">
              <FootnotePopovers>
                <div className="prose-editorial">
                  <Mdx code={artigo.mdx} />
                </div>
              </FootnotePopovers>
            </article>

            {conceitos.length ? (
              <section aria-labelledby="conceitos" className="mt-16 border-t border-hair pt-8">
                <h2 id="conceitos" className="text-meta text-muted-foreground">
                  Conceitos deste texto
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {conceitos.map((c) => (
                    <li key={c.slug}>
                      <Chip asChild>
                        <Link href={`/glossario/${c.slug}`}>{c.termo}</Link>
                      </Chip>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section aria-labelledby="citar" className="mt-12 border-t border-hair pt-8">
              <h2 id="citar" className="font-display text-h3">
                Como citar este artigo
              </h2>
              <div className="mt-5">
                <CiteThis
                  kind="article"
                  article={{
                    titulo: artigo.titulo,
                    site: siteConfig.name,
                    data: artigo.data,
                    path: `/artigos/${slug}`,
                  }}
                />
              </div>
            </section>

            <section aria-labelledby="compartilhar" className="mt-12 border-t border-hair pt-8">
              <h2 id="compartilhar" className="font-display text-h3">
                Compartilhar
              </h2>
              <ShareButtons title={artigo.titulo} path={`/artigos/${slug}`} className="mt-5" />
            </section>

            {trilha ? (
              <section
                aria-labelledby="proximo-passo"
                className="mt-12 border-l-2 border-brand pl-6"
              >
                <h2 id="proximo-passo" className="text-meta text-muted-foreground">
                  Próximo passo
                </h2>
                <p className="mt-2 font-display text-h3">{trilha.titulo}</p>
                <p className="mt-2 max-w-[52ch] text-muted-foreground">{trilha.descricao}</p>
                <Link
                  href={`/trilhas#${trilha.slug}`}
                  className="link-underline mt-4 inline-block text-sm font-medium"
                >
                  Seguir a trilha
                </Link>
              </section>
            ) : null}
          </div>
        </div>
      </Section>

      {livros.length ? (
        <Section tone="paper" divider>
          <h2 className="mb-section-head font-display text-h2">Para ler a seguir</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
            {livros.map((book) => (
              <BookCard key={book.slug} book={book} />
            ))}
          </div>
        </Section>
      ) : null}

      {relacionados.length ? (
        <Section tone="paper" divider>
          <h2 className="mb-section-head font-display text-h2">Artigos relacionados</h2>
          <div className="grid gap-x-[clamp(16px,2vw,32px)] md:grid-cols-3">
            {relacionados.map((r) => (
              <ArticleCard key={r.slug} article={toArticleCard(r)} variant="compact" />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
