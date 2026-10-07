import type { Metadata } from "next";

import { HubHeader } from "@/components/hub/hub";
import { Section } from "@/components/layout/section";
import { Mdx } from "@/components/mdx/mdx-content";
import { ChamadaForm } from "@/components/mural/chamada-form";
import { getTextoMural } from "@/lib/mural";
import { sections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Chamada aberta do Mural",
  description:
    "Como participar do Mural Cultural: o que procuramos, critérios de curadoria, como funciona a seleção e o que o artista recebe.",
  alternates: { canonical: sections.muralChamada.href },
};

export default function ChamadaAbertaPage() {
  const chamada = getTextoMural("chamada-aberta");
  const compromisso = getTextoMural("compromisso");

  return (
    <>
      <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
        <HubHeader
          title="Chamada aberta"
          breadcrumb={[
            { label: "Início", href: "/" },
            { label: "Mural", href: sections.mural.href },
            { label: "Chamada aberta" },
          ]}
          lead="O Mural recebe inscrições de artistas que fazem arte política e popular, em qualquer linguagem. A chamada fica aberta o tempo todo."
        />
        {chamada ? (
          <div className="mt-section grid-page">
            <div className="prose-editorial col-span-12 lg:col-span-8">
              <Mdx code={chamada.mdx} />
            </div>
          </div>
        ) : null}
      </Section>

      {compromisso ? (
        <section aria-labelledby="compromisso" className="tone-ink py-section">
          <div className="container-page grid-page gap-y-stack">
            <h2 id="compromisso" className="col-span-12 font-display text-h2 lg:col-span-4">
              {compromisso.titulo}
            </h2>
            <div className="prose-editorial col-span-12 lg:col-span-7 lg:col-start-6">
              <Mdx code={compromisso.mdx} />
            </div>
          </div>
        </section>
      ) : null}

      <Section
        tone="paper"
        id="inscricao"
        aria-labelledby="inscricao-titulo"
        className="scroll-mt-[var(--header-h)]"
      >
        <div className="grid-page gap-y-stack">
          <div className="col-span-12 lg:col-span-4">
            <h2 id="inscricao-titulo" className="font-display text-h2">
              Inscrição
            </h2>
            <p className="mt-4 max-w-[40ch] text-muted-foreground">
              Não é preciso enviar arquivos: mande links para onde o seu trabalho já está. A equipe
              responde a todas as inscrições.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <ChamadaForm />
          </div>
        </div>
      </Section>
    </>
  );
}
