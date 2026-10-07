import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/editorial/section-heading";
import { HubHeader } from "@/components/hub/hub";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import {
  ClassicCard,
  ExhibitionFeature,
  MuralCallout,
  PosterCard,
} from "@/components/mural/blocks";
import { ArtworkGallery } from "@/components/mural/lightbox";
import { Chip } from "@/components/ui/chip";
import {
  capaDaExposicao,
  getArtista,
  getCartazes,
  getClassicos,
  getExposicoes,
  getObras,
} from "@/lib/mural";
import { hrefDoArtista, toLightboxItem } from "@/lib/mural/summaries";
import { sections } from "@/lib/navigation";
import { linguagensArtisticas } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "Obras do Mural",
  description:
    "Todas as obras do Mural Cultural: dos artistas, liberadas para baixar sob Creative Commons, clássicos e exposições.",
  alternates: { canonical: sections.muralObras.href },
};

type Props = { searchParams: Promise<{ linguagem?: string }> };

/** Todas as obras do Mural numa só página, com atalhos para cada grupo. */
export default async function ObrasPage({ searchParams }: Props) {
  const { linguagem } = await searchParams;
  const todas = getObras();
  const linguagens = linguagensArtisticas.filter((l) => todas.some((o) => o.linguagem === l.slug));
  const obras = linguagem ? todas.filter((o) => o.linguagem === linguagem) : todas;
  const cartazes = getCartazes();
  const classicos = getClassicos();
  const exposicoes = getExposicoes();

  const grupos = [
    { id: "dos-artistas", label: "Dos artistas", count: todas.length },
    { id: "para-baixar", label: "Para baixar", count: cartazes.length },
    { id: "classicos", label: "Clássicos", count: classicos.length },
    { id: "exposicoes", label: "Exposições", count: exposicoes.length },
  ].filter((g) => g.count > 0);

  return (
    <>
      <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
        <HubHeader
          title="Obras"
          breadcrumb={[
            { label: "Início", href: "/" },
            { label: "Mural", href: sections.mural.href },
            { label: "Obras" },
          ]}
          lead="Todas as obras do Mural num só lugar: o trabalho dos artistas, os cartazes liberados para baixar, os clássicos com leitura crítica e as exposições."
          stats={grupos.map((g) => ({
            valor: g.count,
            rotulo: g.label.toLowerCase(),
            href: `#${g.id}`,
          }))}
        />
        {/* Com um grupo só (antes dos primeiros artistas), o atalho não ajuda em nada. */}
        {grupos.length > 1 ? (
          <nav aria-label="Grupos de obras" className="mt-stack flex flex-wrap gap-x-6 gap-y-2">
            {grupos.map((g) => (
              <a key={g.id} href={`#${g.id}`} className="link-underline text-sm font-medium">
                {g.label}
              </a>
            ))}
          </nav>
        ) : null}
      </Section>

      {todas.length ? (
        <Section
          tone="paper"
          divider
          id="dos-artistas"
          aria-labelledby="dos-artistas-titulo"
          className="scroll-mt-[var(--header-h)]"
        >
          <SectionHeading
            id="dos-artistas-titulo"
            title="Obras dos artistas"
            description="Clique numa obra para vê-la em tela cheia. O crédito do artista acompanha cada imagem."
            action={{ label: "Conhecer os artistas", href: sections.muralArtistas.href }}
          />
          {linguagens.length > 1 ? (
            <nav aria-label="Filtrar por linguagem" className="mb-stack flex flex-wrap gap-2">
              <Chip asChild aria-current={!linguagem ? "page" : undefined}>
                <Link href={`${sections.muralObras.href}#dos-artistas`} scroll={false}>
                  Todas
                </Link>
              </Chip>
              {linguagens.map((l) => (
                <Chip key={l.slug} asChild aria-current={linguagem === l.slug ? "page" : undefined}>
                  <Link
                    href={`${sections.muralObras.href}?linguagem=${l.slug}#dos-artistas`}
                    scroll={false}
                  >
                    {l.label}
                  </Link>
                </Chip>
              ))}
            </nav>
          ) : null}
          <Reveal key={linguagem ?? "todas"}>
            <ArtworkGallery items={obras.map(toLightboxItem)} />
          </Reveal>
        </Section>
      ) : (
        <Section tone="paper" divider id="dos-artistas" aria-labelledby="dos-artistas-titulo">
          <h2 id="dos-artistas-titulo" className="font-display text-h2">
            As primeiras obras estão a caminho
          </h2>
          <p className="mt-4 max-w-[52ch] text-lead text-muted-foreground">
            Estamos convidando artistas de todo o país. Enquanto isso, conheça os clássicos logo
            abaixo.
          </p>
        </Section>
      )}

      {cartazes.length ? (
        <Section
          tone="paper"
          divider
          id="para-baixar"
          aria-labelledby="para-baixar-titulo"
          className="scroll-mt-[var(--header-h)]"
        >
          <SectionHeading
            id="para-baixar-titulo"
            title="Para baixar"
            description="Obras liberadas pelos artistas sob Creative Commons. Respeite a licença de cada uma e mantenha sempre o crédito."
          />
          <div className="grid grid-cols-1 gap-x-[clamp(16px,2vw,32px)] gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {cartazes.map((o) => {
              const artista = getArtista(o.artista)!;
              return (
                <PosterCard
                  key={o.slug}
                  poster={{
                    slug: o.slug,
                    titulo: o.titulo,
                    artista: artista.nome,
                    artistaHref: hrefDoArtista(artista.slug),
                    imagem: o.imagens[0]!,
                    licenca: o.licenca,
                    download: o.arquivoParaDownload!,
                    tamanho: o.tamanhoDoDownload,
                    formato: o.impressao?.formato,
                    observacao: o.impressao?.observacao,
                    demo: o.demo,
                  }}
                />
              );
            })}
          </div>
        </Section>
      ) : null}

      <Section
        tone="paper"
        divider
        id="classicos"
        aria-labelledby="classicos-titulo"
        className="scroll-mt-[var(--header-h)]"
      >
        <SectionHeading
          id="classicos-titulo"
          title="Clássicos"
          description="Filmes, canções e romances que ajudam a entender a luta de classes na América Latina, cada um com uma leitura crítica."
        />
        <div className="grid grid-cols-2 gap-x-[clamp(16px,2vw,32px)] gap-y-14 sm:grid-cols-3 lg:grid-cols-6">
          {classicos.map((c) => (
            <ClassicCard key={c.slug} classico={c} />
          ))}
        </div>
      </Section>

      {exposicoes.length ? (
        <Section
          tone="paper"
          divider
          id="exposicoes"
          aria-labelledby="exposicoes-titulo"
          className="scroll-mt-[var(--header-h)]"
        >
          <SectionHeading id="exposicoes-titulo" title="Exposições" />
          <div className="flex flex-col gap-section">
            {exposicoes.map((e) => (
              <ExhibitionFeature
                key={e.slug}
                href={`/mural/exposicoes/${e.slug}`}
                titulo={e.titulo}
                subtitulo={e.subtitulo}
                curadoria={e.curadoria}
                inicio={e.inicio}
                fim={e.fim}
                capa={capaDaExposicao(e)}
                demo={e.demo}
              />
            ))}
          </div>
        </Section>
      ) : null}

      <MuralCallout />
    </>
  );
}
