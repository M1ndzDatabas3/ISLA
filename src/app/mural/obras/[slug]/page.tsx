import { Download, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { VisualArtwork } from "schema-dts";

import { ShareImageButton } from "@/components/editorial/share-image-button";
import { Section } from "@/components/layout/section";
import { ArtworkCard, LicenseBadge } from "@/components/mural/artwork";
import { ArtworkGallery } from "@/components/mural/lightbox";
import { RelatedTexts } from "@/components/mural/related-texts";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ExampleBadge } from "@/components/ui/example-badge";
import {
  getArtista,
  getObra,
  getObras,
  getObrasDoArtista,
  localDoArtista,
  textosRelacionados,
} from "@/lib/mural";
import { hrefDoArtista, hrefDaObra, toLightboxItem } from "@/lib/mural/summaries";
import { sections } from "@/lib/navigation";
import { explicacaoDaLicenca, labelOf } from "@/lib/taxonomy";
import { siteConfig } from "@/site.config";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getObras().map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const obra = getObra(slug);
  if (!obra) return {};
  const artista = getArtista(obra.artista);
  const og = `/og/mural/obra/${slug}`;
  return {
    title: `${obra.titulo}, de ${artista?.nome}`,
    description: obra.descricao,
    alternates: { canonical: hrefDaObra(slug) },
    openGraph: { images: [{ url: og, width: 1200, height: 630, alt: obra.imagens[0]!.alt }] },
    twitter: { card: "summary_large_image", images: [og] },
  };
}

export default async function ObraPage({ params }: Props) {
  const { slug } = await params;
  const obra = getObra(slug);
  if (!obra) notFound();
  const artista = getArtista(obra.artista)!;
  const imagem = obra.imagens[0]!;
  const outras = getObrasDoArtista(artista.slug)
    .filter((o) => o.slug !== slug)
    .slice(0, 4);
  const relacionados = textosRelacionados(obra.temas, obra.textosRelacionados, 4);
  const cc = obra.licenca.startsWith("cc-");

  type Linha = { termo: string; valor: React.ReactNode };
  const ficha: Linha[] = (
    [
      {
        termo: "Artista",
        valor: (
          <Link href={hrefDoArtista(artista.slug)} className="link-underline">
            {artista.nome}
          </Link>
        ),
      },
      { termo: "Ano", valor: obra.ano },
      { termo: "Linguagem", valor: labelOf("linguagem", obra.linguagem) },
      { termo: "Técnica", valor: obra.tecnica },
      obra.dimensoes ? { termo: "Dimensões", valor: obra.dimensoes } : null,
      { termo: "Origem", valor: localDoArtista(artista) },
      obra.temas.length
        ? { termo: "Temas", valor: obra.temas.map((t) => labelOf("temaMural", t)).join(", ") }
        : null,
      imagem.credito ? { termo: "Foto", valor: imagem.credito } : null,
    ] as (Linha | null)[]
  ).filter((x): x is Linha => Boolean(x));

  const jsonLd: VisualArtwork = {
    "@type": "VisualArtwork",
    name: obra.titulo,
    creator: {
      "@type": "Person",
      name: artista.nome,
      url: `${siteConfig.url}${hrefDoArtista(artista.slug)}`,
    },
    dateCreated: String(obra.ano),
    artMedium: obra.tecnica,
    artform: labelOf("linguagem", obra.linguagem),
    description: obra.descricao,
    image: `${siteConfig.url}${imagem.src}`,
    url: `${siteConfig.url}${hrefDaObra(slug)}`,
    license: cc
      ? `https://creativecommons.org/licenses/${obra.licenca.replace("cc-", "")}/4.0/`
      : undefined,
  };

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...jsonLd }} />
      <section aria-labelledby="obra-titulo" className="tone-ink">
        <div className="container-page pt-[clamp(32px,5vw,64px)] pb-section">
          <Breadcrumb
            items={[
              { label: "Início", href: "/" },
              { label: "Mural", href: sections.mural.href },
              { label: "Obras", href: sections.muralObras.href },
              { label: obra.titulo },
            ]}
            className="mb-10"
          />
          <ArtworkGallery
            layout="single"
            items={[toLightboxItem(obra)]}
            sizes="(min-width: 1024px) 70vw, 100vw"
          />
          <p className="mt-5 text-center text-meta text-muted-foreground">
            <span className="font-medium text-foreground">{artista.nome}</span>,{" "}
            <i>{obra.titulo}</i>, {obra.ano}. Clique na imagem para ampliar.
          </p>
        </div>
      </section>

      <Section tone="paper">
        <div className="grid-page items-start gap-y-stack">
          <div className="col-span-12 lg:col-span-7">
            <p className="flex flex-wrap items-center gap-3 text-meta text-muted-foreground">
              {labelOf("linguagem", obra.linguagem)}
              {obra.demo ? <ExampleBadge /> : null}
            </p>
            <h1 id="obra-titulo" className="mt-3 font-display text-h1 italic">
              {obra.titulo}
            </h1>
            <p className="mt-3 text-lead">
              <Link href={hrefDoArtista(artista.slug)} className="link-underline">
                {artista.nome}
              </Link>
              <span className="text-muted-foreground">, {obra.ano}</span>
            </p>
            <p className="mt-8 max-w-[62ch] font-text text-body">{obra.descricao}</p>
            {obra.comentarioCuratorial ? (
              <blockquote className="mt-8 max-w-[58ch] border-l-2 border-brand pl-5">
                <p className="text-meta text-muted-foreground">Comentário curatorial</p>
                <p className="mt-2 font-text text-body">{obra.comentarioCuratorial}</p>
              </blockquote>
            ) : null}
            <div className="mt-10">
              <ShareImageButton
                label="Compartilhar obra"
                fileName={`obra-${slug}`}
                shareText={`${obra.titulo}, de ${artista.nome}, no Mural Cultural do ${siteConfig.name}`}
                copyLabel="Copiar o link"
                imageBase={`/og/mural/obra/${slug}`}
              />
            </div>
          </div>

          <aside className="col-span-12 flex flex-col gap-stack lg:col-span-4 lg:col-start-9">
            <section aria-labelledby="ficha">
              <h2 id="ficha" className="text-meta text-muted-foreground">
                Ficha técnica
              </h2>
              <dl className="mt-3 border-t border-hair text-sm">
                {ficha.map((row) => (
                  <div
                    key={row.termo}
                    className="grid grid-cols-[7rem_1fr] gap-3 border-b border-hair py-2.5"
                  >
                    <dt className="text-muted-foreground">{row.termo}</dt>
                    <dd>{row.valor}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="licenca">
              <h2 id="licenca" className="text-meta text-muted-foreground">
                Licença
              </h2>
              <LicenseBadge licenca={obra.licenca} className="mt-3" />
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {explicacaoDaLicenca[obra.licenca]}
              </p>
              {obra.permiteDownload && obra.arquivoParaDownload ? (
                <div className="mt-4 flex flex-col gap-2">
                  <Button asChild variant="outline" className="self-start">
                    <a href={obra.arquivoParaDownload} download>
                      <Download aria-hidden strokeWidth={1.5} />
                      Baixar em alta resolução
                      {obra.tamanhoDoDownload ? ` (${obra.tamanhoDoDownload})` : ""}
                    </a>
                  </Button>
                  {obra.impressao ? (
                    <p className="text-meta text-muted-foreground">
                      Impressão: {obra.impressao.formato}.
                      {obra.impressao.observacao ? ` ${obra.impressao.observacao}` : ""}
                    </p>
                  ) : null}
                  <p className="text-meta text-muted-foreground">
                    Mantenha o crédito: {artista.nome}, <i>{obra.titulo}</i>, {obra.ano}.
                  </p>
                </div>
              ) : null}
            </section>

            {obra.disponivelParaVenda && obra.linkDeVenda ? (
              <Button asChild className="self-start">
                <a href={obra.linkDeVenda} target="_blank" rel="noopener noreferrer">
                  <ShoppingBag aria-hidden strokeWidth={1.5} />
                  Comprar esta obra
                </a>
              </Button>
            ) : null}
          </aside>
        </div>
      </Section>

      {obra.imagens.length > 1 ? (
        <Section tone="paper" divider aria-labelledby="detalhes">
          <h2 id="detalhes" className="mb-section-head font-display text-h2">
            Detalhes
          </h2>
          <ArtworkGallery
            items={obra.imagens.slice(1).map((img, i) => ({
              ...toLightboxItem(obra),
              id: `${obra.slug}-${i + 1}`,
              imagem: img,
              href: undefined,
              zoomSrc: undefined,
            }))}
          />
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

      {outras.length ? (
        <Section tone="paper" divider aria-labelledby="outras">
          <div className="mb-section-head flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="outras" className="font-display text-h2">
              Outras obras de {artista.nome}
            </h2>
            <Link href={hrefDoArtista(artista.slug)} className="link-underline text-sm font-medium">
              Ver o perfil
            </Link>
          </div>
          <div className="grid grid-cols-2 items-start gap-x-[clamp(16px,2vw,32px)] gap-y-10 lg:grid-cols-4">
            {outras.map((o) => (
              <ArtworkCard
                key={o.slug}
                href={hrefDaObra(o.slug)}
                imagem={o.imagens[0]!}
                titulo={o.titulo}
                artista={artista.nome}
                ano={o.ano}
                demo={o.demo}
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
