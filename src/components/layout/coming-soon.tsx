import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { sections, type SectionKey } from "@/lib/navigation";

import { Section } from "./section";

/** Seções prontas que fazem sentido enquanto a seção pedida não abre. */
const enquantoIsso: Partial<Record<SectionKey, SectionKey[]>> = {
  acervo: ["biblioteca", "autores", "trilhas"],
  mapa: ["autores", "glossario", "linhaDoTempo"],
  debates: ["artigos", "glossario", "biblioteca"],
  cultura: ["artigos", "biblioteca", "linhaDoTempo"],
  podcast: ["artigos", "trilhas", "biblioteca"],
  agenda: ["trilhas", "artigos", "biblioteca"],
  publique: ["artigos", "sobre", "biblioteca"],
};

/** Metadados de página em preparação: fora dos buscadores até abrir. */
export function comingSoonMetadata(section: SectionKey): Metadata {
  return {
    title: sections[section].label,
    description: sections[section].description,
    robots: { index: false, follow: true },
  };
}

interface ComingSoonProps {
  section: SectionKey;
  /** Ação extra no bloco "Em preparação" (ex.: o modal Faça parte em Publique). */
  action?: React.ReactNode;
}

/** Página de seção ainda em preparação: diz o que vem e aponta o que já existe. */
export function ComingSoon({ section, action }: ComingSoonProps) {
  const { label, description } = sections[section];
  const sugestoes = (enquantoIsso[section] ?? ["artigos", "biblioteca", "trilhas"]).map(
    (key) => sections[key],
  );

  return (
    <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
      <Breadcrumb items={[{ label: "Início", href: "/" }, { label }]} className="mb-12" />
      <h1 className="max-w-[16ch] font-display text-h1">
        {label}
        <i aria-hidden className="title-mark" />
      </h1>
      <p className="mt-6 max-w-[46ch] font-text text-lead text-muted-foreground">{description}</p>

      <div className="mt-section grid-page gap-y-stack border-t border-hair pt-stack">
        <div className="col-span-12 lg:col-span-5">
          <h2 className="font-display text-h3">Em preparação</h2>
          <p className="mt-3 max-w-[44ch] text-muted-foreground">
            Esta seção ainda não abriu. Quem assina a newsletter recebe o aviso quando ela estiver
            no ar.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/#newsletter" className="link-underline text-sm font-medium">
              Assinar a newsletter
            </Link>
            {action}
          </div>
        </div>

        <nav aria-labelledby="enquanto-isso" className="col-span-12 lg:col-span-6 lg:col-start-7">
          <h2 id="enquanto-isso" className="text-meta text-muted-foreground">
            Enquanto isso
          </h2>
          <ul className="mt-3 flex flex-col border-t border-hair">
            {sugestoes.map((s) => (
              <li key={s.href} className="border-b border-hair">
                <Link href={s.href} className="group block py-4">
                  <span className="font-display text-[1.375rem] leading-tight transition-colors group-hover:text-brand-text">
                    {s.label}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{s.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Section>
  );
}
