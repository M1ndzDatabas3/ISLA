import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Person } from "schema-dts";

import { ArticleCard } from "@/components/editorial/article-card";
import { AuthorPortrait } from "@/components/editorial/author-card";
import { BookCard } from "@/components/editorial/book-card";
import { QuoteBlock } from "@/components/editorial/quote-block";
import { ShareButtons } from "@/components/editorial/share-buttons";
import { Section } from "@/components/layout/section";
import { Mdx } from "@/components/mdx/mdx-content";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Chip } from "@/components/ui/chip";
import {
  getArtigosComAutor,
  getAutor,
  getAutores,
  getAutoresBySlugs,
  getCitacoesDoAutor,
  getInfluenciados,
  getLivrosDoAutor,
} from "@/lib/content";
import { toArticleCard, toBookCard, toBookSummary } from "@/lib/content/summaries";
import { formatLifespan } from "@/lib/format";
import { labelOf } from "@/lib/taxonomy";
import { siteConfig } from "@/site.config";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAutores().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const autor = getAutor(slug);
  if (!autor) return {};
  return {
    title: autor.nome,
    description: autor.bioCurta,
    alternates: { canonical: `/autores/${slug}` },
  };
}

export default async function AutorPage({ params }: Props) {
  const { slug } = await params;
  const autor = getAutor(slug);
  if (!autor) notFound();

  const livros = getLivrosDoAutor(slug).map((l) => toBookCard(toBookSummary(l)));
  const citacoes = getCitacoesDoAutor(slug);
  const influenciadoPor = getAutoresBySlugs(autor.influenciadoPor);
  const influenciou = getInfluenciados(slug);
  const artigos = getArtigosComAutor(slug);

  const jsonLd: Person = {
    "@type": "Person",
    name: autor.nomeCompleto ?? autor.nome,
    ...(autor.nascimento ? { birthDate: String(autor.nascimento) } : {}),
    ...(autor.morte ? { deathDate: String(autor.morte) } : {}),
    nationality: autor.nacionalidade,
    description: autor.bioCurta,
    url: `${siteConfig.url}/autores/${slug}`,
  };

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...jsonLd }} />
      <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Autores", href: "/autores" },
            { label: autor.nome },
          ]}
          className="mb-12"
        />
        <div className="grid-page items-start gap-y-10">
          <div className="col-span-12 sm:col-span-6 lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:col-span-4">
            <AuthorPortrait
              nome={autor.nome}
              retrato={autor.retrato}
              sizes="(min-width: 1024px) 30vw, 90vw"
            />
            {autor.retrato ? (
              <p className="mt-3 text-meta text-muted-foreground">
                {autor.retrato.credito}. {autor.retrato.licenca}.
                {autor.retrato.fonte ? (
                  <>
                    {" "}
                    <a
                      href={autor.retrato.fonte}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2"
                    >
                      Fonte
                    </a>
                  </>
                ) : null}
              </p>
            ) : null}
          </div>

          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <p className="text-meta text-muted-foreground tabular-nums">
              {formatLifespan(autor.nascimento, autor.morte)}, {autor.nacionalidade}
            </p>
            <h1 className="mt-3 font-display text-h1">{autor.nome}</h1>
            <p className="mt-6 max-w-[56ch] text-lead">{autor.bioCurta}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {autor.tradicoes.map((t) => (
                <li key={t}>
                  <Chip asChild>
                    <Link href={`/biblioteca?tradicao=${t}`}>{labelOf("tradicao", t)}</Link>
                  </Chip>
                </li>
              ))}
            </ul>

            <div className="prose-editorial mt-12">
              <Mdx code={autor.mdx} />
            </div>

            {influenciadoPor.length || influenciou.length ? (
              <section
                aria-labelledby="influencias"
                className="mt-14 grid gap-8 border-t border-hair pt-8 sm:grid-cols-2"
              >
                <h2 id="influencias" className="sr-only">
                  Influências
                </h2>
                {[
                  { titulo: "Leu e foi influenciado por", lista: influenciadoPor },
                  { titulo: "Influenciou", lista: influenciou },
                ].map(({ titulo, lista }) =>
                  lista.length ? (
                    <div key={titulo}>
                      <p className="mb-3 text-meta text-muted-foreground">{titulo}</p>
                      <ul className="flex flex-col">
                        {lista.map((a) => (
                          <li key={a.slug}>
                            <Link
                              href={`/autores/${a.slug}`}
                              className="group flex items-baseline justify-between gap-4 border-b border-hair py-2.5"
                            >
                              <span className="transition-colors group-hover:text-brand-text">
                                {a.nome}
                              </span>
                              <span className="text-meta text-muted-foreground tabular-nums">
                                {formatLifespan(a.nascimento, a.morte)}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null,
                )}
              </section>
            ) : null}

            {citacoes.length ? (
              <section aria-labelledby="citacoes" className="mt-14 border-t border-hair pt-8">
                <h2 id="citacoes" className="mb-8 font-display text-h3">
                  Citações
                </h2>
                <div className="flex flex-col gap-10">
                  {citacoes.map((c) => (
                    <QuoteBlock
                      key={c.slug}
                      text={c.texto}
                      autor={autor.nome}
                      fonte={c.fonte}
                      nota={c.conferir}
                      compact
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <section aria-labelledby="compartilhar" className="mt-14 border-t border-hair pt-8">
              <h2 id="compartilhar" className="mb-4 text-meta text-muted-foreground">
                Compartilhar
              </h2>
              <ShareButtons title={autor.nome} path={`/autores/${slug}`} />
            </section>
          </div>
        </div>
      </Section>

      {livros.length ? (
        <Section tone="paper" className="border-t border-hair">
          <h2 className="mb-10 font-display text-h2">Na biblioteca</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
            {livros.map((book) => (
              <BookCard key={book.slug} book={book} />
            ))}
          </div>
        </Section>
      ) : null}

      {artigos.length ? (
        <Section tone="paper" className="border-t border-hair">
          <h2 className="mb-10 font-display text-h2">Artigos sobre {autor.nome}</h2>
          <div className="grid gap-12 md:grid-cols-3">
            {artigos.slice(0, 3).map((a) => (
              <ArticleCard key={a.slug} article={toArticleCard(a)} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
