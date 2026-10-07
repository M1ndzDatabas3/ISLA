import type { Metadata } from "next";

import { ConferirNote } from "@/components/editorial/conferir";
import { Section } from "@/components/layout/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getObrasCulturais } from "@/lib/content";
import { sections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: sections.cultura.label,
  description:
    "Filmes, canções e romances latino-americanos que ajudam a entender a luta de classes, comentados pelo Instituto.",
  alternates: { canonical: sections.cultura.href },
};

const tipos: Record<string, string> = {
  filme: "Filme",
  musica: "Música",
  literatura: "Literatura",
  "artes-visuais": "Artes visuais",
};

export default function CulturaPage() {
  const obras = getObrasCulturais();

  return (
    <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Explorar", href: "/explorar" },
          { label: sections.cultura.label },
        ]}
        className="mb-12"
      />
      <div className="grid-page items-end gap-y-6">
        <h1 className="col-span-12 font-display text-h1 lg:col-span-7">
          Cultura
          <i aria-hidden className="title-mark" />
        </h1>
        <p className="col-span-12 max-w-[48ch] text-lead text-muted-foreground lg:col-span-5 lg:col-start-8">
          Filmes, canções e romances que ajudam a entender a luta de classes na América Latina, em
          ordem cronológica.
        </p>
      </div>

      <ol className="mt-section grid gap-x-[clamp(16px,2vw,32px)] md:grid-cols-2">
        {obras.map((obra) => (
          <li key={obra.slug} className="border-t border-hair pt-6 pb-stack">
            <p className="flex items-baseline justify-between gap-4 text-meta text-muted-foreground">
              <span>{tipos[obra.tipo] ?? obra.tipo}</span>
              <span className="tabular-nums">
                {obra.pais}, {obra.ano}
              </span>
            </p>
            <h2 className="mt-3 font-display text-h2">{obra.titulo}</h2>
            <p className="mt-2">{obra.autoria}</p>
            <p className="mt-4 max-w-[60ch] leading-relaxed text-muted-foreground">{obra.resumo}</p>
            {obra.conferir ? (
              <p className="mt-3 text-meta">
                <ConferirNote nota={obra.conferir} />
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}
