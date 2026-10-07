import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthorsExplorer, type AuthorListItem } from "@/components/editorial/authors-explorer";
import { Section } from "@/components/layout/section";
import { StaticAuthors } from "@/components/library/static-lists";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getAutores } from "@/lib/content";
import { sections } from "@/lib/navigation";
import { labelOf } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: sections.autores.label,
  description: sections.autores.description,
  alternates: { canonical: sections.autores.href },
};

export default function AutoresPage() {
  const authors: AuthorListItem[] = getAutores().map((a) => ({
    slug: a.slug,
    href: `/autores/${a.slug}`,
    nome: a.nome,
    nascimento: a.nascimento,
    morte: a.morte,
    nacionalidade: a.nacionalidade,
    tradicoes: a.tradicoes.map((t) => labelOf("tradicao", t)),
    tradicaoSlugs: a.tradicoes,
    regiaoSlugs: a.regioes,
    retrato: a.retrato ? { src: a.retrato.src, alt: a.retrato.alt } : null,
  }));

  return (
    <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
      <Breadcrumb
        items={[{ label: "Início", href: "/" }, { label: "Autores" }]}
        className="mb-10"
      />
      <div className="mb-12 grid-page items-end gap-y-4 lg:mb-16">
        <h1 className="col-span-12 font-display text-h1 lg:col-span-7">
          Autores
          <i aria-hidden className="title-mark" />
        </h1>
        <p className="col-span-12 max-w-[52ch] text-lead text-muted-foreground lg:col-span-5">
          Pensadoras e pensadores da tradição socialista, de Marx e Engels a Lélia Gonzalez e Ruy
          Mauro Marini, com obras, influências e os textos onde aparecem.
        </p>
      </div>
      <Suspense fallback={<StaticAuthors authors={authors} />}>
        <AuthorsExplorer authors={authors} />
      </Suspense>
    </Section>
  );
}
