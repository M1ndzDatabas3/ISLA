import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Person } from "schema-dts";

import { ShareImageButton } from "@/components/editorial/share-image-button";
import { Section } from "@/components/layout/section";
import { Mdx } from "@/components/mdx/mdx-content";
import { ArtworkGallery } from "@/components/mural/lightbox";
import { RelatedTexts } from "@/components/mural/related-texts";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { ExampleBadge } from "@/components/ui/example-badge";
import {
  getArtista,
  getArtistas,
  getObrasDoArtista,
  localDoArtista,
  textosRelacionados,
} from "@/lib/mural";
import { toLightboxItem } from "@/lib/mural/summaries";
import { sections } from "@/lib/navigation";
import { labelOf } from "@/lib/taxonomy";
import { siteConfig } from "@/site.config";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getArtistas().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artista = getArtista(slug);
  if (!artista) return {};
  const og = `/og/mural/artista/${slug}`;
  return {
    title: `${artista.nome}, artista do Mural`,
    description: artista.bioCurta,
    alternates: { canonical: `/mural/artistas/${slug}` },
    openGraph: { images: [{ url: og, width: 1200, height: 630, alt: artista.nome }] },
    twitter: { card: "summary_large_image", images: [og] },
  };
}

const rotulosDeLink: Record<string, string> = {
  site: "Conheça o trabalho",
  loja: "Loja",
  encomendas: "Encomendas",
  behance: "Behance",
  bandcamp: "Bandcamp",
  youtube: "YouTube",
};

export default async function ArtistaPage({ params }: Props) {
  const { slug } = await params;
  const artista = getArtista(slug);
  if (!artista) notFound();

  const obras = getObrasDoArtista(slug);
  const principal = obras[0];
  const linguagens = artista.linguagens.map((l) => labelOf("linguagem", l));
  const relacionados = textosRelacionados(
    artista.temas,
    obras.flatMap((o) => o.textosRelacionados),
    4,
  );
  const links = Object.entries(artista.links).filter(([key, url]) => url && key !== "instagram");

  const jsonLd: Person = {
    "@type": "Person",
    name: artista.nome,
    ...(artista.nomeCivil ? { alternateName: artista.nomeCivil } : {}),
    description: artista.bioCurta,
    url: `${siteConfig.url}/mural/artistas/${slug}`,
    homeLocation: { "@type": "Place", name: localDoArtista(artista) },
    knowsAbout: linguagens,
    sameAs: Object.values(artista.links).filter((u): u is string =>
      Boolean(u && u.startsWith("http")),
    ),
  };

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...jsonLd }} />
      <section aria-labelledby="artista-nome" className="tone-ink">
        <div className="container-page pt-[clamp(32px,5vw,64px)] pb-section">
          <Breadcrumb
            items={[
              { label: "Início", href: "/" },
              { label: "Mural", href: sections.mural.href },
              { label: "Artistas", href: sections.muralArtistas.href },
              { label: artista.nome },
            ]}
            className="mb-12"
          />
          <div className="grid-page items-end gap-y-10">
            <div className="col-span-12 flex flex-col gap-5 lg:col-span-5">
              <p className="flex flex-wrap items-center gap-3 text-meta text-muted-foreground">
                {localDoArtista(artista)}
                {artista.demo ? <ExampleBadge /> : null}
              </p>
              <h1
                id="artista-nome"
                className="font-display text-[clamp(2.75rem,1.6rem+4.4vw,5.5rem)]/[0.95] tracking-[-0.03em]"
              >
                {artista.nome}
              </h1>
              {artista.nomeCivil ? (
                <p className="text-sm text-muted-foreground">{artista.nomeCivil}</p>
              ) : null}
              <p className="max-w-[44ch] text-lead">{artista.bioCurta}</p>
              <ul className="flex flex-wrap gap-2">
                {linguagens.map((l) => (
                  <li key={l}>
                    <Chip>{l}</Chip>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
                {artista.links.instagram ? (
                  <Button asChild>
                    <a href={artista.links.instagram} target="_blank" rel="noopener noreferrer">
                      Seguir no Instagram
                    </a>
                  </Button>
                ) : null}
                <ShareImageButton
                  label="Compartilhar artista"
                  fileName={`artista-${slug}`}
                  shareText={`${artista.nome} no Mural Cultural do ${siteConfig.name}`}
                  copyLabel="Copiar o link"
                  imageBase={`/og/mural/artista/${slug}`}
                />
              </div>
            </div>
            {principal ? (
              <figure className="col-span-12 m-0 lg:col-span-6 lg:col-start-7">
                <Link href={`/mural/obras/${principal.slug}`} className="flex justify-center">
                  <Image
                    src={principal.imagens[0]!.src}
                    alt={principal.imagens[0]!.alt}
                    width={principal.imagens[0]!.largura}
                    height={principal.imagens[0]!.altura}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    priority
                    placeholder="blur"
                    blurDataURL={principal.imagens[0]!.blurDataURL}
                    className="h-auto max-h-[70svh] w-auto max-w-full"
                  />
                </Link>
                <figcaption className="mt-4 text-meta text-muted-foreground">
                  <span className="font-medium text-foreground">{artista.nome}</span>,{" "}
                  <i>{principal.titulo}</i>, {principal.ano}
                </figcaption>
              </figure>
            ) : null}
          </div>
        </div>
      </section>

      <Section tone="paper" aria-labelledby="sobre">
        <div className="grid-page gap-y-stack">
          <div className="col-span-12 lg:col-span-4">
            <h2 id="sobre" className="font-display text-h2">
              Sobre
            </h2>
            {links.length ? (
              <ul className="mt-6 flex flex-col border-t border-hair">
                {links.map(([key, url]) => (
                  <li key={key} className="border-b border-hair">
                    <a
                      href={url}
                      target={url!.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 py-3 text-sm transition-colors hover:text-brand-text"
                    >
                      {rotulosDeLink[key] ?? key}
                      <span className="text-meta text-muted-foreground">
                        {url!.startsWith("mailto:")
                          ? url!.slice(7)
                          : new URL(url!).hostname.replace(/^www\./, "")}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="col-span-12 flex flex-col gap-4 lg:col-span-7 lg:col-start-6">
            {(artista.bio ?? artista.bioCurta).split(/\n\s*\n/).map((p, i) => (
              <p key={i} className="max-w-[62ch] font-text text-body">
                {p}
              </p>
            ))}
          </div>
        </div>
      </Section>

      {obras.length ? (
        <Section tone="paper" divider aria-labelledby="obras">
          <h2 id="obras" className="mb-section-head font-display text-h2">
            Obras
          </h2>
          <ArtworkGallery items={obras.map(toLightboxItem)} />
        </Section>
      ) : null}

      {artista.temEntrevista ? (
        <Section tone="paper" divider aria-labelledby="entrevista">
          <div className="grid-page gap-y-6">
            <h2 id="entrevista" className="col-span-12 font-display text-h2 lg:col-span-4">
              Entrevista
            </h2>
            <div className="prose-editorial entrevista col-span-12 lg:col-span-7 lg:col-start-6">
              <Mdx code={artista.mdx} />
            </div>
          </div>
        </Section>
      ) : null}

      {relacionados.length ? (
        <Section tone="paper" divider aria-labelledby="relacionados">
          <h2 id="relacionados" className="mb-section-head font-display text-h2">
            Textos do Instituto relacionados
          </h2>
          <RelatedTexts textos={relacionados} />
        </Section>
      ) : null}
    </>
  );
}
