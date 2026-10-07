import type { Metadata } from "next";
import { Suspense } from "react";

import { HubHeader } from "@/components/hub/hub";
import { Section } from "@/components/layout/section";
import { ArtistCard } from "@/components/mural/artist-card";
import { ArtistsExplorer } from "@/components/mural/artists-explorer";
import { MuralCallout } from "@/components/mural/blocks";
import { getArtistas } from "@/lib/mural";
import { regioesDoMural } from "@/lib/mural/regioes";
import { toArtistListItem } from "@/lib/mural/summaries";
import { sections } from "@/lib/navigation";
import { linguagensArtisticas, temasDoMural } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "Artistas do Mural",
  description: "Perfis de artistas latino-americanos que fazem arte política e popular hoje.",
  alternates: { canonical: sections.muralArtistas.href },
};

const trilha = [
  { label: "Início", href: "/" },
  { label: "Mural", href: sections.mural.href },
  { label: "Artistas" },
];

export default function ArtistasPage() {
  const artists = getArtistas().map(toArtistListItem);
  const facets = {
    linguagem: {
      label: "Linguagem",
      options: linguagensArtisticas.map((l) => ({ value: l.slug, label: l.label })),
    },
    regiao: {
      label: "Região",
      options: regioesDoMural.map((r) => ({ value: r.slug, label: r.label })),
    },
    tema: { label: "Tema", options: temasDoMural.map((t) => ({ value: t.slug, label: t.label })) },
  };

  return (
    <>
      <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
        <HubHeader
          title="Artistas"
          breadcrumb={trilha}
          lead="Quem faz arte política e popular hoje na América Latina, com prioridade para artistas do Brasil. Filtre por linguagem, região ou tema."
        />
        <div className="mt-section">
          {artists.length ? (
            <Suspense
              fallback={
                <div className="grid grid-cols-1 gap-x-[clamp(16px,2vw,32px)] gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                  {artists.map((a) => (
                    <ArtistCard key={a.slug} artist={a} />
                  ))}
                </div>
              }
            >
              <ArtistsExplorer artists={artists} facets={facets} />
            </Suspense>
          ) : (
            <div className="border-t border-hair pt-stack">
              <h2 className="font-display text-h2">Os primeiros perfis estão a caminho</h2>
              <p className="mt-4 max-w-[52ch] text-lead text-muted-foreground">
                Estamos convidando artistas de todo o país. Se você faz arte política e popular, a
                chamada está aberta.
              </p>
            </div>
          )}
        </div>
      </Section>
      <MuralCallout />
    </>
  );
}
