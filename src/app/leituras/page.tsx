import type { Metadata } from "next";

import { BookCard } from "@/components/editorial/book-card";
import { AuthorRow } from "@/components/editorial/author-card";
import { SectionHeading } from "@/components/editorial/section-heading";
import { CategoryDirectory, HubDoors, HubHeader, type HubDoor } from "@/components/hub/hub";
import { Section } from "@/components/layout/section";
import { getAutores, getLivros, getLivrosDoAutor } from "@/lib/content";
import { categoriasDeLivros } from "@/lib/content/facets";
import { toAuthorCard, toBookCard, toBookSummary } from "@/lib/content/summaries";
import { sections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: sections.leituras.label,
  description:
    "Biblioteca comentada e autores do pensamento socialista, com todas as categorias do acervo: tradição, área, região, tipo de obra, nível e disponibilidade.",
  alternates: { canonical: sections.leituras.href },
};

/** Página-mestre de Leituras: biblioteca, autores e todas as categorias do acervo. */
export default function LeiturasPage() {
  const livros = getLivros();
  const autores = getAutores();
  const categorias = categoriasDeLivros();
  const total = (key: string) => categorias.find((g) => g.key === key)?.items.length ?? 0;

  const introdutorios = livros.filter((l) => l.nivel === "introdutorio").slice(0, 5);
  const autoresComMaisObras = [...autores]
    .map((a) => ({ autor: a, obras: getLivrosDoAutor(a.slug).length }))
    .filter((x) => x.obras > 0)
    .sort((a, b) => b.obras - a.obras)
    .slice(0, 6)
    .map((x) => x.autor);

  const portas: HubDoor[] = [
    {
      label: sections.biblioteca.label,
      href: sections.biblioteca.href,
      description:
        "Livros comentados com ficha, edições em português, nível de leitura e indicação do que ler antes e depois.",
      meta: `${livros.length} livros`,
    },
    {
      label: sections.autores.label,
      href: sections.autores.href,
      description:
        "Pensadoras e pensadores do acervo, com biografia, obras, influências e os textos onde aparecem.",
      meta: `${autores.length} autoras e autores`,
    },
  ];
  if (!("soon" in sections.acervo && sections.acervo.soon)) {
    portas.push({
      label: sections.acervo.label,
      href: sections.acervo.href,
      description: sections.acervo.description,
    });
  }

  return (
    <>
      <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
        <HubHeader
          title="Leituras"
          lead="O que indicamos para ler: livros comentados, das obras clássicas às contemporâneas, e as autoras e autores por trás deles."
          stats={[
            { valor: livros.length, rotulo: "livros comentados", href: sections.biblioteca.href },
            { valor: autores.length, rotulo: "autoras e autores", href: sections.autores.href },
            { valor: total("tradicao"), rotulo: "tradições", href: "#categorias" },
            { valor: total("regiao"), rotulo: "regiões do mundo", href: "#categorias" },
          ]}
        />
        <HubDoors doors={portas} className="mt-section" />
      </Section>

      {introdutorios.length ? (
        <Section tone="paper" divider aria-labelledby="comecar">
          <SectionHeading
            id="comecar"
            title="Por onde começar"
            description="Livros de nível introdutório: não exigem leitura prévia e indicam o que ler em seguida."
            action={{ label: "Todos os introdutórios", href: "/biblioteca?nivel=introdutorio" }}
          />
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
            {introdutorios.map((livro) => (
              <BookCard key={livro.slug} book={toBookCard(toBookSummary(livro))} />
            ))}
          </div>
        </Section>
      ) : null}

      <Section
        tone="paper"
        divider
        id="categorias"
        aria-labelledby="categorias-titulo"
        className="scroll-mt-[var(--header-h)]"
      >
        <SectionHeading
          id="categorias-titulo"
          title="A biblioteca por categoria"
          description="Cada categoria abre a biblioteca já filtrada. Os números mostram quantos livros há em cada uma."
          action={{ label: "Abrir a biblioteca", href: sections.biblioteca.href }}
        />
        <CategoryDirectory groups={categorias} unidade={["livro", "livros"]} />
      </Section>

      {autoresComMaisObras.length ? (
        <Section tone="paper" divider aria-labelledby="autores-titulo">
          <SectionHeading
            id="autores-titulo"
            title="Autoras e autores"
            description="Quem tem mais obras comentadas no acervo."
            action={{ label: "Todos os autores", href: sections.autores.href }}
          />
          <div className="grid gap-x-[clamp(16px,2vw,32px)] md:grid-cols-2 lg:grid-cols-3">
            {autoresComMaisObras.map((autor) => (
              <AuthorRow key={autor.slug} author={toAuthorCard(autor)} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
