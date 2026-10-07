import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/editorial/section-heading";
import { Section } from "@/components/layout/section";
import { Mdx } from "@/components/mdx/mdx-content";
import { Reveal } from "@/components/motion/reveal";
import { ArtistCard } from "@/components/mural/artist-card";
import {
  ClassicCard,
  ExhibitionFeature,
  MuralCallout,
  PosterCard,
} from "@/components/mural/blocks";
import { ArtworkGallery } from "@/components/mural/lightbox";
import { MuralHero } from "@/components/mural/mural-hero";
import {
  capaDaExposicao,
  getArtista,
  getArtistasEmDestaque,
  getCapaDoMes,
  getCartazes,
  getClassicos,
  getExposicaoAtual,
  getObras,
  getTextoMural,
  localDoArtista,
} from "@/lib/mural";
import { hrefDoArtista, hrefDaObra, toArtistListItem, toLightboxItem } from "@/lib/mural/summaries";
import { sections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Mural Cultural",
  description:
    "Arte e cultura latino-americana: perfis de artistas que fazem arte política e popular hoje, exposições, cartazes para baixar e leitura crítica de obras clássicas.",
  alternates: { canonical: sections.mural.href },
};

const mesPorExtenso = (mes: string) =>
  new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${mes}-15T12:00:00Z`),
  );

/** Página principal do Mural Cultural. */
export default function MuralPage() {
  const capa = getCapaDoMes();
  const manifesto = getTextoMural("manifesto");
  const destaques = getArtistasEmDestaque(4);
  const exposicao = getExposicaoAtual();
  const obras = getObras().slice(0, 9);
  const classicos = getClassicos().slice(0, 6);
  const cartazes = getCartazes().slice(0, 4);

  return (
    <>
      {capa ? (
        <MuralHero
          mes={mesPorExtenso(capa.capa.mes)}
          obra={{
            titulo: capa.obra.titulo,
            href: hrefDaObra(capa.obra.slug),
            ano: capa.obra.ano,
            tecnica: capa.obra.tecnica,
            imagem: capa.obra.imagens[0]!,
          }}
          artista={{
            nome: capa.artista.nome,
            href: hrefDoArtista(capa.artista.slug),
            local: localDoArtista(capa.artista),
          }}
          ilustra={capa.ilustra}
          texto={capa.capa.texto}
          demo={capa.capa.demo}
        />
      ) : (
        <section aria-labelledby="mural-titulo" className="tone-ink py-section">
          <div className="container-page">
            <h1
              id="mural-titulo"
              className="font-display text-[clamp(3.25rem,1.5rem+6.5vw,7.5rem)]/[0.92] tracking-[-0.03em]"
            >
              Mural Cultural
            </h1>
          </div>
        </section>
      )}

      {manifesto ? (
        <Section tone="paper" aria-label="Manifesto do Mural">
          <div className="grid-page">
            <div className="prose-editorial col-span-12 max-w-none text-[clamp(1.25rem,1.05rem+0.7vw,1.625rem)] leading-[1.5] lg:col-span-9">
              <Mdx code={manifesto.mdx} />
            </div>
          </div>
        </Section>
      ) : null}

      {destaques.length ? (
        <Section tone="paper" divider aria-labelledby="artistas-titulo">
          <SectionHeading
            id="artistas-titulo"
            title="Artistas em destaque"
            description="Quem faz arte política e popular hoje, com prioridade para artistas do Brasil."
            action={{ label: "Todos os artistas", href: sections.muralArtistas.href }}
          />
          <Reveal className="grid grid-cols-1 gap-x-[clamp(16px,2vw,32px)] gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {destaques.map((a) => (
              <div key={a.slug} data-reveal>
                <ArtistCard artist={toArtistListItem(a)} />
              </div>
            ))}
          </Reveal>
        </Section>
      ) : null}

      {exposicao ? (
        <Section tone="paper" divider aria-labelledby="exposicao-titulo">
          <SectionHeading
            id="exposicao-titulo"
            title="Exposição em cartaz"
            action={{
              label: "Todas as exposições",
              href: `${sections.muralObras.href}#exposicoes`,
            }}
          />
          <ExhibitionFeature
            href={`/mural/exposicoes/${exposicao.slug}`}
            titulo={exposicao.titulo}
            subtitulo={exposicao.subtitulo}
            curadoria={exposicao.curadoria}
            inicio={exposicao.inicio}
            fim={exposicao.fim}
            capa={capaDaExposicao(exposicao)}
            demo={exposicao.demo}
          />
        </Section>
      ) : null}

      {obras.length ? (
        <Section tone="paper" divider aria-labelledby="obras-titulo">
          <SectionHeading
            id="obras-titulo"
            title="Obras recentes"
            description="Clique numa obra para vê-la em tela cheia."
          />
          <Reveal>
            <ArtworkGallery items={obras.map(toLightboxItem)} />
          </Reveal>
        </Section>
      ) : null}

      <Section tone="paper" divider aria-labelledby="classicos-titulo">
        <SectionHeading
          id="classicos-titulo"
          title="Clássicos"
          description="Leitura crítica de filmes, canções e romances que ajudam a entender o continente."
          action={{ label: "Todos os clássicos", href: `${sections.muralObras.href}#classicos` }}
        />
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
          {classicos.map((c) => (
            <ClassicCard key={c.slug} classico={c} />
          ))}
        </div>
      </Section>

      {cartazes.length ? (
        <Section tone="paper" divider aria-labelledby="cartazes-titulo">
          <SectionHeading
            id="cartazes-titulo"
            title="Cartazes para baixar"
            description="Obras liberadas pelos artistas sob Creative Commons, para imprimir e colar com o crédito."
            action={{ label: "Todos para baixar", href: `${sections.muralObras.href}#para-baixar` }}
          />
          <div className="grid grid-cols-2 gap-x-[clamp(16px,2vw,32px)] gap-y-12 lg:grid-cols-4">
            {cartazes.map((o) => {
              const artista = getArtista(o.artista)!;
              return (
                <PosterCard
                  key={o.slug}
                  compact
                  poster={{
                    slug: o.slug,
                    titulo: o.titulo,
                    artista: artista.nome,
                    artistaHref: hrefDoArtista(artista.slug),
                    imagem: o.imagens[0]!,
                    licenca: o.licenca,
                    download: o.arquivoParaDownload!,
                    tamanho: o.tamanhoDoDownload,
                    demo: o.demo,
                  }}
                />
              );
            })}
          </div>
        </Section>
      ) : null}

      {!destaques.length ? (
        <Section tone="paper" divider aria-labelledby="em-breve">
          <h2 id="em-breve" className="font-display text-h2">
            Os primeiros artistas estão chegando
          </h2>
          <p className="mt-4 max-w-[52ch] text-lead text-muted-foreground">
            O Mural está sendo montado com artistas de todo o país. Enquanto isso, leia os{" "}
            <Link
              href={`${sections.muralObras.href}#classicos`}
              className="link-underline text-foreground"
            >
              clássicos
            </Link>{" "}
            ou{" "}
            <Link href={sections.muralChamada.href} className="link-underline text-foreground">
              inscreva o seu trabalho
            </Link>
            .
          </p>
        </Section>
      ) : null}

      <MuralCallout />
    </>
  );
}
