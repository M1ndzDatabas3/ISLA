import Link from "next/link";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { sections, type SectionKey } from "@/lib/navigation";

import { Section } from "./section";

interface ComingSoonProps {
  section: SectionKey;
  /** Fase do plano em que a seção será construída. */
  phase: 2 | 3 | 4;
  children?: React.ReactNode;
}

/** Página provisória de uma seção ainda não construída. */
export function ComingSoon({ section, phase, children }: ComingSoonProps) {
  const { label, description } = sections[section];

  return (
    <>
      <Section tone="paper" className="border-b border-hair">
        <Breadcrumb items={[{ label: "Início", href: "/" }, { label }]} className="mb-12" />
        <h1 className="max-w-[16ch] font-display text-h1">
          {label}
          <i aria-hidden className="title-mark" />
        </h1>
        <p className="mt-6 max-w-[46ch] font-text text-lead text-muted-foreground">{description}</p>
        <p className="mt-10 border-l-2 border-brand pl-4 text-sm">
          Seção em construção, prevista para a fase {phase} do projeto.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Button asChild>
            <Link href="/">Voltar ao início</Link>
          </Button>
          <Button asChild variant="link">
            <Link href={sections.biblioteca.href}>Ir para a biblioteca</Link>
          </Button>
        </div>
      </Section>
      {children}
    </>
  );
}
