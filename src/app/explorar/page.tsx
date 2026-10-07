import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/editorial/section-heading";
import { CulturePodcast } from "@/components/home/culture-podcast";
import { TimelinePreview } from "@/components/home/timeline-preview";
import { HubDoors, HubHeader, type HubDoor } from "@/components/hub/hub";
import { Section } from "@/components/layout/section";
import { LevelBadge } from "@/components/ui/level-badge";
import { getConceitos, getMarcos, getObrasCulturais, getTrilhas } from "@/lib/content";
import { sections } from "@/lib/navigation";
import type { Nivel } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: sections.explorar.label,
  description:
    "Trilhas de estudo com etapas e perguntas, glossário de conceitos, linha do tempo das lutas socialistas e obras de cultura latino-americana.",
  alternates: { canonical: sections.explorar.href },
};

/** Primeira letra sem acento ("Á" → "A"), para agrupar o glossário. */
const inicial = (termo: string) => termo.normalize("NFD").replace(/[̀-ͯ]/g, "")[0]!.toUpperCase();

/** Página-mestre de Explorar: trilhas, glossário, linha do tempo e cultura. */
export default function ExplorarPage() {
  const trilhas = getTrilhas();
  const conceitos = getConceitos();
  const marcos = getMarcos();
  const obras = getObrasCulturais();

  const porLetra = new Map<string, typeof conceitos>();
  for (const c of conceitos) {
    const letra = inicial(c.termo);
    porLetra.set(letra, [...(porLetra.get(letra) ?? []), c]);
  }

  const portas: HubDoor[] = [
    {
      label: sections.trilhas.label,
      href: sections.trilhas.href,
      description: "O que ler e em que ordem, com tempo estimado e perguntas para cada etapa.",
      meta: `${trilhas.length} trilhas`,
    },
    {
      label: sections.glossario.label,
      href: sections.glossario.href,
      description:
        "Conceitos de A a Z, com os autores que os formularam e os textos onde aparecem.",
      meta: `${conceitos.length} verbetes`,
    },
    {
      label: sections.linhaDoTempo.label,
      href: sections.linhaDoTempo.href,
      description:
        "Revoluções, fundações e rupturas, com atenção ao que aconteceu na América Latina.",
      meta: `${marcos.length} marcos`,
    },
    {
      label: sections.cultura.label,
      href: sections.cultura.href,
      description: "Filmes, canções e romances que ajudam a entender a luta de classes.",
      meta: `${obras.length} obras`,
    },
  ];

  return (
    <>
      <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
        <HubHeader
          title="Explorar"
          lead="Caminhos para estudar além da leitura: trilhas com etapas e perguntas, um glossário de conceitos, a linha do tempo das lutas e obras de cultura."
          stats={[
            { valor: trilhas.length, rotulo: "trilhas de estudo", href: sections.trilhas.href },
            {
              valor: conceitos.length,
              rotulo: "verbetes no glossário",
              href: sections.glossario.href,
            },
            { valor: marcos.length, rotulo: "marcos históricos", href: sections.linhaDoTempo.href },
            { valor: obras.length, rotulo: "obras de cultura", href: sections.cultura.href },
          ]}
        />
        <HubDoors doors={portas} className="mt-section" />
      </Section>

      <Section tone="paper" divider aria-labelledby="trilhas-titulo">
        <SectionHeading
          id="trilhas-titulo"
          title="Trilhas de estudo"
          description="Comece pela primeira se nunca estudou o tema."
          action={{ label: "Ver as trilhas", href: sections.trilhas.href }}
        />
        <ul className="grid gap-x-[clamp(16px,2vw,32px)] md:grid-cols-3">
          {trilhas.map((trilha) => (
            <li key={trilha.slug} className="group relative border-t border-hair pt-5 pb-stack">
              <div className="flex items-center justify-between gap-4 text-meta text-muted-foreground">
                <span>
                  {trilha.etapas.length} etapas, {trilha.duracao}
                </span>
                <LevelBadge nivel={trilha.nivel as Nivel} />
              </div>
              <h3 className="mt-4 font-display text-h3 transition-colors group-hover:text-brand-text">
                <Link
                  href={`${sections.trilhas.href}#${trilha.slug}`}
                  className="after:absolute after:inset-0 after:content-['']"
                >
                  {trilha.titulo}
                </Link>
              </h3>
              <p className="mt-3 max-w-[44ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                {trilha.descricao}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="paper" divider aria-labelledby="glossario-titulo">
        <SectionHeading
          id="glossario-titulo"
          title="Glossário de A a Z"
          description="Definições curtas, com os autores de referência e os textos onde cada conceito aparece."
          action={{ label: "Abrir o glossário", href: sections.glossario.href }}
        />
        <div className="columns-2 gap-x-[clamp(16px,2vw,32px)] sm:columns-3 lg:columns-4">
          {[...porLetra.entries()].map(([letra, lista]) => (
            <div key={letra} className="mb-6 break-inside-avoid">
              <p aria-hidden className="font-display text-[1.75rem] leading-none text-brand-text">
                {letra}
              </p>
              <ul className="mt-2 flex flex-col">
                {lista.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/glossario/${c.slug}`}
                      className="inline-block py-1 transition-colors hover:text-brand-text"
                    >
                      {c.termo}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <TimelinePreview />
      <CulturePodcast />
    </>
  );
}
