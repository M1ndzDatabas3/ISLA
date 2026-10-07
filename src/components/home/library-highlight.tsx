import { BookCard } from "@/components/editorial/book-card";
import { SectionHeading } from "@/components/editorial/section-heading";
import { Section } from "@/components/layout/section";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { getAutores, getConceitos, getLivros, getLivrosDestaque, getTrilhas } from "@/lib/content";
import { toBookCard, toBookSummary } from "@/lib/content/summaries";
import { sections } from "@/lib/navigation";

/** Biblioteca em destaque: o tamanho do acervo e uma estante com os livros marcados como destaque. */
export function LibraryHighlight() {
  const destaques = getLivrosDestaque();
  const estante = (destaques.length >= 5 ? destaques : getLivros()).slice(0, 5);
  if (!estante.length) return null;

  const numeros = [
    { valor: getLivros().length, rotulo: "livros comentados", href: sections.biblioteca.href },
    { valor: getAutores().length, rotulo: "autoras e autores", href: sections.autores.href },
    {
      valor: getConceitos().length,
      rotulo: "verbetes no glossário",
      href: sections.glossario.href,
    },
    { valor: getTrilhas().length, rotulo: "trilhas de estudo", href: sections.trilhas.href },
  ];

  return (
    <Section tone="paper" divider>
      <SectionHeading
        title="Biblioteca comentada"
        description="Cada livro tem ficha, edições em português, nível de leitura e indicação do que ler antes e depois."
        action={{ label: "Abrir a biblioteca", href: sections.biblioteca.href }}
      />

      <dl className="mb-stack grid grid-cols-2 border-t border-hair lg:grid-cols-4">
        {numeros.map((n, i) => (
          <div
            key={n.rotulo}
            className={
              "flex flex-col-reverse gap-1 border-b border-hair py-5 pr-4 lg:border-b-0 lg:py-6" +
              (i % 2 === 1 ? " pl-4 lg:pl-0" : "") +
              (i > 0 ? " lg:border-l lg:border-hair lg:pl-6" : "")
            }
          >
            <dt className="text-sm text-muted-foreground">
              <a href={n.href} className="hover:text-foreground">
                {n.rotulo}
              </a>
            </dt>
            <dd className="font-display text-[clamp(2.25rem,1.6rem+2vw,3.5rem)] leading-none tabular-nums">
              <Counter value={n.valor} />
            </dd>
          </div>
        ))}
      </dl>

      <Reveal className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
        {estante.map((livro) => (
          <div key={livro.slug} data-reveal>
            <BookCard book={toBookCard(toBookSummary(livro))} />
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
