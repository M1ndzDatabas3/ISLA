import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CreativeWork } from "schema-dts";

import { ShareButtons } from "@/components/editorial/share-buttons";
import { WithConferir } from "@/components/editorial/conferir";
import { Section } from "@/components/layout/section";
import { Mdx } from "@/components/mdx/mdx-content";
import { ClassicCard, ClassicPoster } from "@/components/mural/blocks";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getAutoresBySlugs, getConceitosBySlugs } from "@/lib/content";
import { getClassico, getClassicos } from "@/lib/mural";
import { sections } from "@/lib/navigation";
import { labelOf } from "@/lib/taxonomy";
import { siteConfig } from "@/site.config";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getClassicos().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getClassico(slug);
  if (!c) return {};
  return {
    title: `${c.titulo}, de ${c.autoria}`,
    description: c.sinopse,
    alternates: { canonical: `/mural/classicos/${slug}` },
  };
}

export default async function ClassicoPage({ params }: Props) {
  const { slug } = await params;
  const c = getClassico(slug);
  if (!c) notFound();
  const conceitos = getConceitosBySlugs(c.conceitos);
  const autores = getAutoresBySlugs(c.autores);
  const outros = getClassicos()
    .filter((o) => o.slug !== slug)
    .slice(0, 4);

  const jsonLd: CreativeWork = {
    "@type": "CreativeWork",
    name: c.titulo,
    creator: { "@type": "Person", name: c.autoria },
    dateCreated: String(c.ano),
    genre: labelOf("linguagemClassica", c.linguagem),
    abstract: c.sinopse,
    url: `${siteConfig.url}/mural/classicos/${slug}`,
  };

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...jsonLd }} />
      <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Mural", href: sections.mural.href },
            { label: "Obras", href: `${sections.muralObras.href}#classicos` },
            { label: c.titulo },
          ]}
          className="mb-12"
        />
        <div className="grid-page items-start gap-y-12">
          <div className="col-span-8 col-start-3 sm:col-span-6 sm:col-start-4 lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:col-span-4 lg:col-start-1">
            {c.imagem ? (
              <figure className="m-0">
                <Image
                  src={c.imagem.src}
                  alt={c.imagem.alt}
                  width={c.imagem.largura}
                  height={c.imagem.altura}
                  placeholder="blur"
                  blurDataURL={c.imagem.blurDataURL}
                  sizes="(min-width: 1024px) 30vw, 60vw"
                  className="h-auto w-full"
                />
                <figcaption className="mt-3 text-meta text-muted-foreground">
                  {c.imagem.credito}. {c.imagem.licenca}.
                </figcaption>
              </figure>
            ) : (
              <>
                <ClassicPoster {...c} className="mx-auto w-full max-w-sm" />
                <p className="mt-3 text-center text-meta text-muted-foreground">
                  Capa ilustrativa gerada pelo Instituto.
                </p>
              </>
            )}
          </div>

          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <p className="text-meta font-medium text-brand-text">
              {labelOf("linguagemClassica", c.linguagem)}, {c.pais}
            </p>
            <h1 className="mt-4 font-display text-h1">{c.titulo}</h1>
            <p className="mt-4 text-lead">
              {c.autoria}
              <span className="text-muted-foreground">, {c.ano}</span>
            </p>
            <p className="mt-8 max-w-[62ch] text-lead text-muted-foreground">
              <WithConferir text={c.sinopse} />
            </p>

            {c.content.trim() ? (
              <section aria-labelledby="leitura" className="mt-14">
                <h2 id="leitura" className="font-display text-h3">
                  Leitura crítica
                </h2>
                <div className="prose-editorial mt-4">
                  <Mdx code={c.mdx} />
                </div>
              </section>
            ) : null}

            {c.ondeEncontrar.length ? (
              <section aria-labelledby="onde" className="mt-14">
                <h2 id="onde" className="font-display text-h3">
                  Onde assistir, ouvir ou ler
                </h2>
                <ul className="mt-5 flex flex-col border-t border-hair">
                  {c.ondeEncontrar.map((link) => (
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
              </section>
            ) : null}

            {conceitos.length || autores.length ? (
              <section
                aria-labelledby="relacionados"
                className="mt-14 grid gap-8 border-t border-hair pt-8 sm:grid-cols-2"
              >
                <h2 id="relacionados" className="sr-only">
                  Conceitos e autores relacionados
                </h2>
                {conceitos.length ? (
                  <div>
                    <p className="mb-3 text-meta text-muted-foreground">Conceitos</p>
                    <ul className="flex flex-col">
                      {conceitos.map((k) => (
                        <li key={k.slug}>
                          <Link href={`/glossario/${k.slug}`} className="link-underline">
                            {k.termo}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {autores.length ? (
                  <div>
                    <p className="mb-3 text-meta text-muted-foreground">Autores</p>
                    <ul className="flex flex-col">
                      {autores.map((a) => (
                        <li key={a.slug}>
                          <Link href={`/autores/${a.slug}`} className="link-underline">
                            {a.nome}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>
            ) : null}

            <section aria-labelledby="compartilhar" className="mt-14">
              <h2 id="compartilhar" className="text-meta text-muted-foreground">
                Compartilhar
              </h2>
              <ShareButtons
                title={`${c.titulo}, de ${c.autoria}`}
                path={`/mural/classicos/${slug}`}
                className="mt-4"
              />
            </section>
          </div>
        </div>
      </Section>

      {outros.length ? (
        <Section tone="paper" divider aria-labelledby="outros">
          <h2 id="outros" className="mb-section-head font-display text-h2">
            Outros clássicos
          </h2>
          <div className="grid grid-cols-2 gap-x-[clamp(16px,2vw,32px)] gap-y-12 lg:grid-cols-4">
            {outros.map((o) => (
              <ClassicCard key={o.slug} classico={o} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
