import type { Metadata } from "next";
import { Suspense } from "react";

import { Section } from "@/components/layout/section";
import { LibraryExplorer } from "@/components/library/library-explorer";
import { StaticLibrary } from "@/components/library/static-lists";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getAutores, getLivros } from "@/lib/content";
import { toBookSummary } from "@/lib/content/summaries";
import { sections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: sections.biblioteca.label,
  description: sections.biblioteca.description,
  alternates: { canonical: sections.biblioteca.href },
};

export default function BibliotecaPage() {
  const livros = getLivros();
  const books = livros.map(toBookSummary);
  const comLivro = new Set(livros.flatMap((l) => l.autores));
  const authors = getAutores()
    .filter((a) => comLivro.has(a.slug))
    .map((a) => ({ slug: a.slug, nome: a.nome }));

  return (
    <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
      <Breadcrumb
        items={[{ label: "Início", href: "/" }, { label: "Biblioteca" }]}
        className="mb-10"
      />
      <div className="mb-12 grid-page items-end gap-y-4 lg:mb-16">
        <h1 className="col-span-12 font-display text-h1 lg:col-span-7">
          Biblioteca comentada
          <i aria-hidden className="title-mark" />
        </h1>
        <p className="col-span-12 max-w-[52ch] text-lead text-muted-foreground lg:col-span-5">
          {livros.length} livros escolhidos e comentados, dos clássicos aos contemporâneos, com
          filtros por tradição, área, região e nível de leitura. Cada seleção gera um link que você
          pode compartilhar.
        </p>
      </div>
      <Suspense fallback={<StaticLibrary books={books} />}>
        <LibraryExplorer books={books} authors={authors} />
      </Suspense>
    </Section>
  );
}
