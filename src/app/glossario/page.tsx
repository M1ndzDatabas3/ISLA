import type { Metadata } from "next";

import { GlossaryIndex } from "@/components/glossary/glossary-index";
import { Section } from "@/components/layout/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getConceitos } from "@/lib/content";
import { sections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: sections.glossario.label,
  description: sections.glossario.description,
  alternates: { canonical: sections.glossario.href },
};

export default function GlossarioPage() {
  const entries = getConceitos().map((c) => ({
    slug: c.slug,
    termo: c.termo,
    definicaoCurta: c.definicaoCurta,
  }));
  return (
    <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
      <Breadcrumb
        items={[{ label: "Início", href: "/" }, { label: "Glossário" }]}
        className="mb-10"
      />
      <div className="mb-12 grid-page items-end gap-y-4 lg:mb-16">
        <h1 className="col-span-12 font-display text-h1 lg:col-span-7">
          Glossário
          <i aria-hidden className="title-mark" />
        </h1>
        <p className="col-span-12 max-w-[52ch] text-lead text-muted-foreground lg:col-span-5">
          Conceitos da tradição socialista explicados com clareza, com os autores que os formularam
          e os textos onde aparecem.
        </p>
      </div>
      <GlossaryIndex entries={entries} />
    </Section>
  );
}
