import type { Metadata } from "next";
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getAutoresBySlugs, getLivrosBySlugs, getMarcos } from "@/lib/content";
import { sections } from "@/lib/navigation";
import { labelOf } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: sections.linhaDoTempo.label,
  description:
    "Marcos das lutas e das ideias socialistas, do Manifesto Comunista à fundação do MST, com atenção à América Latina.",
  alternates: { canonical: sections.linhaDoTempo.href },
};

export default function LinhaDoTempoPage() {
  const marcos = getMarcos();

  return (
    <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Explorar", href: "/explorar" },
          { label: sections.linhaDoTempo.label },
        ]}
        className="mb-12"
      />
      <div className="grid-page items-end gap-y-6">
        <h1 className="col-span-12 font-display text-h1 lg:col-span-7">
          Linha do tempo
          <i aria-hidden className="title-mark" />
        </h1>
        <p className="col-span-12 max-w-[48ch] text-lead text-muted-foreground lg:col-span-5 lg:col-start-8">
          Revoluções, fundações e rupturas que marcaram o pensamento socialista, com os livros e
          autores do acervo ligados a cada uma.
        </p>
      </div>

      {/* A linha corre no centro da 3ª coluna do grid no desktop (entre o ano e o texto). */}
      <ol className="relative mt-section [--col:calc((100%-11*var(--gap))/12)] [--gap:clamp(16px,2vw,32px)]">
        <span
          aria-hidden
          className="absolute top-2 bottom-2 left-[5px] w-px bg-foreground lg:left-[calc(2.5*var(--col)+2*var(--gap)-0.5px)]"
        />
        {marcos.map((m) => {
          const livros = getLivrosBySlugs(m.livros);
          const autores = getAutoresBySlugs(m.autores);
          return (
            <li
              key={m.slug}
              id={m.slug}
              className="relative grid-page scroll-mt-[var(--header-h)] gap-y-3 pb-stack last:pb-0"
            >
              <div className="col-span-12 pl-9 lg:col-span-2 lg:pl-0 lg:text-right">
                <p className="font-display text-[clamp(2rem,1.5rem+1.6vw,2.75rem)] leading-none tabular-nums">
                  {m.ano}
                </p>
                {m.data ? <p className="mt-2 text-meta text-muted-foreground">{m.data}</p> : null}
              </div>
              <span
                aria-hidden
                className="absolute top-[0.6rem] left-0 size-[11px] border border-foreground bg-red lg:left-[calc(2.5*var(--col)+2*var(--gap)-5.5px)]"
              />
              <div className="col-span-12 pl-9 lg:col-span-8 lg:col-start-4 lg:pl-0">
                <h2 className="font-display text-h3">{m.titulo}</h2>
                <p className="mt-2 text-meta text-muted-foreground">
                  {labelOf("regiao", m.regiao)}
                  {m.areas.length
                    ? `, ${m.areas.map((a) => labelOf("area", a).toLowerCase()).join(", ")}`
                    : ""}
                </p>
                <p className="mt-4 max-w-[64ch] text-[1.0625rem] leading-relaxed">{m.resumo}</p>
                {livros.length || autores.length ? (
                  <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    {livros.map((l) => (
                      <Link key={l.slug} href={`/biblioteca/${l.slug}`} className="link-underline">
                        {l.tituloCapa ?? l.titulo}
                      </Link>
                    ))}
                    {autores.map((a) => (
                      <Link key={a.slug} href={`/autores/${a.slug}`} className="link-underline">
                        {a.nome}
                      </Link>
                    ))}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
