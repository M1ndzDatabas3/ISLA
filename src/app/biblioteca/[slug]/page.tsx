import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Book } from "schema-dts";

import { ArticleCard } from "@/components/editorial/article-card";
import { BookCard } from "@/components/editorial/book-card";
import { BookCover } from "@/components/editorial/book-cover";
import { CiteThis } from "@/components/editorial/cite-this";
import { WithConferir } from "@/components/editorial/conferir";
import { ShareButtons } from "@/components/editorial/share-buttons";
import { Section } from "@/components/layout/section";
import { Mdx } from "@/components/mdx/mdx-content";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Chip } from "@/components/ui/chip";
import { LevelBadge } from "@/components/ui/level-badge";
import {
  getArtigosComLivro,
  getAutoresBySlugs,
  getLivro,
  getLivros,
  getLivrosBySlugs,
} from "@/lib/content";
import { isConferir, known } from "@/lib/conferir";
import { joinNames, toArticleCard, toBookCard, toBookSummary } from "@/lib/content/summaries";
import { labelOf, type Nivel } from "@/lib/taxonomy";
import { siteConfig } from "@/site.config";

export function generateStaticParams() {
  return getLivros().map((livro) => ({ slug: livro.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const livro = getLivro(slug);
  if (!livro) return {};
  const autores = joinNames(getAutoresBySlugs(livro.autores).map((a) => a.nome));
  return {
    title: `${livro.tituloCapa ?? livro.titulo}, de ${autores}`,
    description: livro.sinopse,
    alternates: { canonical: `/biblioteca/${slug}` },
  };
}

/** Rótulos legíveis para os campos marcados para revisão. */
const camposConferir: Record<string, string> = {
  ano: "ano da primeira publicação",
  edicoes: "edições em português",
  tituloOriginal: "título original",
};

export default async function LivroPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const livro = getLivro(slug);
  if (!livro) notFound();

  const autores = getAutoresBySlugs(livro.autores);
  const nomes = autores.map((a) => a.nome);
  const lerAntes = getLivrosBySlugs(livro.lerAntes).map((l) => toBookCard(toBookSummary(l)));
  const lerDepois = getLivrosBySlugs(livro.lerDepois).map((l) => toBookCard(toBookSummary(l)));
  const artigos = getArtigosComLivro(slug);
  // Na referência só entram dados confirmados: a primeira edição com editora e ano conhecidos.
  const edicao = livro.edicoes.find(
    (e) => !isConferir(e.editora) && e.ano !== undefined && !isConferir(e.ano),
  );
  const tags = [
    ...livro.tradicoes.map((s) => ({
      label: labelOf("tradicao", s),
      href: `/biblioteca?tradicao=${s}`,
    })),
    ...livro.areas.map((s) => ({ label: labelOf("area", s), href: `/biblioteca?area=${s}` })),
    ...livro.regioes.map((s) => ({ label: labelOf("regiao", s), href: `/biblioteca?regiao=${s}` })),
  ];

  const jsonLd: Book = {
    "@type": "Book",
    name: livro.titulo,
    ...(known(livro.tituloOriginal) ? { alternateName: livro.tituloOriginal } : {}),
    author: autores.map((a) => ({
      "@type": "Person",
      name: a.nome,
      url: `${siteConfig.url}/autores/${a.slug}`,
    })),
    datePublished: String(livro.ano),
    description: livro.sinopse,
    inLanguage: "pt-BR",
    url: `${siteConfig.url}/biblioteca/${slug}`,
  };

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...jsonLd }} />
      <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Biblioteca", href: "/biblioteca" },
            { label: livro.tituloCapa ?? livro.titulo },
          ]}
          className="mb-12"
        />

        <div className="grid-page items-start gap-y-12">
          <div className="col-span-12 sm:col-span-6 sm:col-start-4 lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:col-span-4 lg:col-start-1">
            <BookCover
              titulo={livro.tituloCapa ?? livro.titulo}
              autor={joinNames(nomes)}
              ano={livro.ano}
              tradicao={livro.tradicoes[0] as Parameters<typeof BookCover>[0]["tradicao"]}
              seed={slug}
              className="mx-auto w-full max-w-sm"
            />
            <p className="mt-3 text-center text-meta text-muted-foreground">
              Capa ilustrativa gerada pelo Instituto.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="text-meta font-medium text-brand-text">
                {labelOf("tipoDeObra", livro.tipoDeObra)}
              </span>
              <LevelBadge nivel={livro.nivel as Nivel} />
            </div>
            <h1 className="mt-4 font-display text-h1">{livro.tituloCapa ?? livro.titulo}</h1>
            <p className="mt-5 text-lead">
              {autores.map((a, i) => (
                <span key={a.slug}>
                  {i > 0 ? (i === autores.length - 1 ? " e " : ", ") : null}
                  <Link href={`/autores/${a.slug}`} className="link-underline">
                    {a.nome}
                  </Link>
                </span>
              ))}
              <span className="text-muted-foreground">, {livro.ano}</span>
            </p>

            <p className="mt-8 max-w-[62ch] text-lead text-muted-foreground">{livro.sinopse}</p>

            <section aria-labelledby="por-que-ler" className="mt-14">
              <h2 id="por-que-ler" className="font-display text-h3">
                Por que ler
              </h2>
              <div className="prose-editorial mt-4">
                <Mdx code={livro.mdx} />
              </div>
            </section>

            <section aria-labelledby="ficha" className="mt-14">
              <h2 id="ficha" className="font-display text-h3">
                Ficha
              </h2>
              <dl className="mt-5 grid grid-cols-1 border-t border-hair sm:grid-cols-[12rem_1fr]">
                <FichaRow termo="Título completo">{livro.titulo}</FichaRow>
                {livro.tituloOriginal ? (
                  <FichaRow termo="Título original">
                    <span lang="und">
                      <WithConferir text={livro.tituloOriginal} />
                    </span>
                    {livro.idiomaOriginal ? (
                      <span className="text-muted-foreground">
                        {" "}
                        (<WithConferir text={livro.idiomaOriginal} />)
                      </span>
                    ) : null}
                  </FichaRow>
                ) : null}
                <FichaRow termo="Primeira publicação">{livro.ano}</FichaRow>
                <FichaRow termo="Disponibilidade">
                  {livro.disponibilidade.map((d) => labelOf("disponibilidade", d)).join(", ")}
                </FichaRow>
                <FichaRow termo="Edições em português">
                  {livro.edicoes.length ? (
                    <ul className="flex flex-col gap-2">
                      {livro.edicoes.map((e, i) => (
                        <li key={i}>
                          <WithConferir
                            text={[e.editora, e.cidade, e.ano].filter(Boolean).join(", ")}
                          />
                          {e.tradutor ? (
                            <span className="text-muted-foreground">
                              {e.tradutor.trim().startsWith("[CONFERIR") ? (
                                <>
                                  . Tradução: <WithConferir text={e.tradutor} />
                                </>
                              ) : (
                                <>
                                  . Tradução de <WithConferir text={e.tradutor} />
                                </>
                              )}
                            </span>
                          ) : null}
                          {e.isbn && !isConferir(e.isbn) ? (
                            <span className="text-muted-foreground">. ISBN {e.isbn}</span>
                          ) : null}
                          {e.observacao ? (
                            <span className="text-muted-foreground">
                              . <WithConferir text={e.observacao} />
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted-foreground">Ainda não catalogadas.</span>
                  )}
                </FichaRow>
              </dl>
              {livro.conferir.length ? (
                <p className="mt-4 border-l-2 border-brand pl-4 text-meta text-muted-foreground">
                  Em revisão editorial:{" "}
                  {livro.conferir.map((c) => camposConferir[c] ?? c).join(", ")}.
                </p>
              ) : null}
            </section>

            {lerAntes.length || lerDepois.length ? (
              <section aria-labelledby="percurso" className="mt-14">
                <h2 id="percurso" className="font-display text-h3">
                  Percurso de leitura
                </h2>
                <div className="mt-6 grid gap-10 sm:grid-cols-2">
                  {[
                    { titulo: "Ler antes", lista: lerAntes },
                    { titulo: "Ler depois", lista: lerDepois },
                  ].map(({ titulo, lista }) => (
                    <div key={titulo}>
                      <p className="mb-4 text-meta text-muted-foreground">{titulo}</p>
                      {lista.length ? (
                        <div className="grid grid-cols-2 gap-5">
                          {lista.map((book) => (
                            <BookCard key={book.slug} book={book} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Sem indicação por enquanto.</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section aria-labelledby="temas" className="mt-14">
              <h2 id="temas" className="font-display text-h3">
                Temas
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <li key={tag.href}>
                    <Chip asChild>
                      <Link href={tag.href}>{tag.label}</Link>
                    </Chip>
                  </li>
                ))}
              </ul>
            </section>

            {livro.linksExternos.length ? (
              <section aria-labelledby="onde" className="mt-14">
                <h2 id="onde" className="font-display text-h3">
                  Onde encontrar
                </h2>
                <ul className="mt-5 flex flex-col border-t border-hair">
                  {livro.linksExternos.map((link) => (
                    <li key={link.url} className="border-b border-hair">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-brand-text"
                      >
                        {link.rotulo}
                        <span className="text-meta text-muted-foreground">
                          {new URL(link.url).hostname.replace(/^www\./, "")}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-meta text-muted-foreground">
                  O Instituto não hospeda livros protegidos por direitos autorais.
                </p>
              </section>
            ) : null}

            <section aria-labelledby="citar" className="mt-14">
              <h2 id="citar" className="font-display text-h3">
                Como citar
              </h2>
              <div className="mt-5">
                <CiteThis
                  kind="book"
                  book={{
                    autores: nomes,
                    titulo: livro.titulo,
                    ano: livro.ano,
                    edicao: edicao
                      ? {
                          editora: edicao.editora,
                          cidade: known(edicao.cidade),
                          ano: edicao.ano,
                          tradutor: known(edicao.tradutor),
                        }
                      : undefined,
                  }}
                />
              </div>
            </section>

            <section aria-labelledby="compartilhar" className="mt-14">
              <h2 id="compartilhar" className="font-display text-h3">
                Compartilhar
              </h2>
              <ShareButtons
                title={`${livro.tituloCapa ?? livro.titulo}, de ${joinNames(nomes)}`}
                path={`/biblioteca/${slug}`}
                className="mt-5"
              />
            </section>
          </div>
        </div>
      </Section>

      {artigos.length ? (
        <Section tone="paper" divider>
          <h2 className="mb-section-head font-display text-h2">Artigos sobre este livro</h2>
          <div className="grid gap-x-[clamp(16px,2vw,32px)] md:grid-cols-3">
            {artigos.slice(0, 3).map((artigo) => (
              <ArticleCard key={artigo.slug} article={toArticleCard(artigo)} variant="compact" />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}

function FichaRow({ termo, children }: { termo: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="pt-4 text-meta text-muted-foreground sm:border-b sm:border-hair sm:pb-4">
        {termo}
      </dt>
      <dd className="border-b border-hair pt-1 pb-4 sm:pt-4">{children}</dd>
    </>
  );
}
