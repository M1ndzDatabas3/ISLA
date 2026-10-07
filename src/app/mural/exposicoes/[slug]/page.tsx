import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ExhibitionEvent } from "schema-dts";

import { ShareImageButton } from "@/components/editorial/share-image-button";
import { Section } from "@/components/layout/section";
import { Mdx } from "@/components/mdx/mdx-content";
import { ExhibitionWall } from "@/components/mural/exhibition-wall";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ExampleBadge } from "@/components/ui/example-badge";
import { getTrilha } from "@/lib/content";
import { formatLongDate } from "@/lib/format";
import { getExposicao, getExposicoes, obrasDaExposicao } from "@/lib/mural";
import { toSala } from "@/lib/mural/summaries";
import { sections } from "@/lib/navigation";
import { siteConfig } from "@/site.config";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getExposicoes().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const e = getExposicao(slug);
  if (!e) return {};
  const og = `/og/mural/exposicao/${slug}`;
  return {
    title: `${e.titulo}, exposição do Mural`,
    description: e.subtitulo ?? `Exposição com curadoria de ${e.curadoria.join(", ")}.`,
    alternates: { canonical: `/mural/exposicoes/${slug}` },
    openGraph: { images: [{ url: og, width: 1200, height: 630, alt: e.titulo }] },
    twitter: { card: "summary_large_image", images: [og] },
  };
}

export default async function ExposicaoPage({ params }: Props) {
  const { slug } = await params;
  const e = getExposicao(slug);
  if (!e) notFound();
  const obras = obrasDaExposicao(e);
  const trilha = e.trilha ? getTrilha(e.trilha) : undefined;
  const periodo = `${formatLongDate(e.inicio)}${e.fim ? ` a ${formatLongDate(e.fim)}` : ""}`;

  const jsonLd: ExhibitionEvent = {
    "@type": "ExhibitionEvent",
    name: e.titulo,
    description: e.subtitulo,
    startDate: e.inicio,
    ...(e.fim ? { endDate: e.fim } : {}),
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: { "@type": "VirtualLocation", url: `${siteConfig.url}/mural/exposicoes/${slug}` },
    organizer: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    workFeatured: obras.map((o) => ({ "@type": "VisualArtwork", name: o.titulo })),
  };

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...jsonLd }} />
      <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Mural", href: sections.mural.href },
            { label: "Obras", href: `${sections.muralObras.href}#exposicoes` },
            { label: e.titulo },
          ]}
          className="mb-12"
        />
        <div className="grid-page gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <p className="flex flex-wrap items-center gap-3 text-meta text-muted-foreground">
              {periodo}
              {e.demo ? <ExampleBadge /> : null}
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.75rem,1.6rem+4.4vw,5.5rem)]/[0.95] tracking-[-0.03em]">
              {e.titulo}
            </h1>
            {e.subtitulo ? (
              <p className="mt-5 text-lead text-muted-foreground">{e.subtitulo}</p>
            ) : null}
          </div>
          <div className="prose-editorial col-span-12 lg:col-span-7">
            <Mdx code={e.mdx} />
          </div>
          <p className="col-span-12 text-meta text-muted-foreground lg:col-span-7">
            {obras.length} obras. Role para percorrer a exposição.
          </p>
        </div>
      </Section>

      <ExhibitionWall salas={obras.map(toSala)} />

      <Section tone="paper" aria-labelledby="ficha">
        <div className="grid-page gap-y-stack">
          <div className="col-span-12 lg:col-span-4">
            <h2 id="ficha" className="font-display text-h2">
              Ficha da exposição
            </h2>
          </div>
          <dl className="col-span-12 border-t border-hair text-sm lg:col-span-7 lg:col-start-6">
            {[
              { termo: "Curadoria", valor: e.curadoria.join(", ") },
              { termo: "Período", valor: periodo },
              { termo: "Obras", valor: String(obras.length) },
            ].map((row) => (
              <div
                key={row.termo}
                className="grid grid-cols-[8rem_1fr] gap-3 border-b border-hair py-3"
              >
                <dt className="text-muted-foreground">{row.termo}</dt>
                <dd>{row.valor}</dd>
              </div>
            ))}
          </dl>
          {trilha ? (
            <div className="col-span-12 lg:col-span-7 lg:col-start-6">
              <p className="text-meta text-muted-foreground">Para estudar o tema</p>
              <Link
                href={`/trilhas#${trilha.slug}`}
                className="mt-2 block font-display text-h3 transition-colors hover:text-brand-text"
              >
                {trilha.titulo}
              </Link>
              <p className="mt-2 max-w-[56ch] text-sm text-muted-foreground">{trilha.descricao}</p>
            </div>
          ) : null}
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <ShareImageButton
              label="Compartilhar exposição"
              fileName={`exposicao-${slug}`}
              shareText={`Exposição “${e.titulo}” no Mural Cultural do ${siteConfig.name}`}
              copyLabel="Copiar o link"
              imageBase={`/og/mural/exposicao/${slug}`}
            />
          </div>
        </div>
      </Section>
    </>
  );
}
