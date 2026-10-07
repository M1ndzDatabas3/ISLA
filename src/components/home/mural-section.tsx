import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/editorial/section-heading";
import { Section } from "@/components/layout/section";
import { Passepartout } from "@/components/mural/artwork";
import { ClassicCard } from "@/components/mural/blocks";
import { ExampleBadge } from "@/components/ui/example-badge";
import {
  getArtistasEmDestaque,
  getCapaDoMes,
  getClassicos,
  localDoArtista,
  obraDeCapa,
} from "@/lib/mural";
import { hrefDoArtista, hrefDaObra } from "@/lib/mural/summaries";
import { sections } from "@/lib/navigation";

/** Mural Cultural na home: Capa do mês, artistas em destaque e clássicos. */
export function MuralSection() {
  const capa = getCapaDoMes();
  const artistas = getArtistasEmDestaque(4);
  const classicos = getClassicos().slice(0, 3);

  return (
    <Section tone="ink" aria-labelledby="mural-home-titulo">
      <SectionHeading
        id="mural-home-titulo"
        title="Mural Cultural"
        description="Arte e cultura latino-americana: artistas que fazem arte política e popular hoje e leitura crítica de obras clássicas."
        action={{ label: "Visitar o Mural", href: sections.mural.href }}
      />

      {capa ? (
        <div className="grid-page items-center gap-y-10">
          <figure className="col-span-12 m-0 lg:col-span-6">
            <Link href={hrefDaObra(capa.obra.slug)} className="flex justify-center">
              <Image
                src={capa.obra.imagens[0]!.src}
                alt={capa.obra.imagens[0]!.alt}
                width={capa.obra.imagens[0]!.largura}
                height={capa.obra.imagens[0]!.altura}
                sizes="(min-width: 1024px) 45vw, 100vw"
                placeholder="blur"
                blurDataURL={capa.obra.imagens[0]!.blurDataURL}
                className="h-auto max-h-[64svh] w-auto max-w-full"
              />
            </Link>
            <figcaption className="mt-3 text-meta text-muted-foreground">
              <span className="font-medium text-foreground">{capa.artista.nome}</span>,{" "}
              <i>{capa.obra.titulo}</i>, {capa.obra.ano}
            </figcaption>
          </figure>
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-5 lg:col-start-8">
            <div>
              <p className="flex flex-wrap items-center gap-3 text-meta text-muted-foreground">
                Capa do mês
                {capa.capa.demo ? <ExampleBadge /> : null}
              </p>
              <p className="mt-2 font-display text-h2">
                <Link href={hrefDaObra(capa.obra.slug)} className="italic hover:text-brand-text">
                  {capa.obra.titulo}
                </Link>
              </p>
              <p className="mt-3 max-w-[44ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                {capa.capa.texto}
              </p>
            </div>
            {artistas.length ? (
              <ul className="flex flex-col border-t border-hair">
                {artistas.map((a) => {
                  const obra = obraDeCapa(a.slug);
                  return (
                    <li key={a.slug} className="border-b border-hair">
                      <Link
                        href={hrefDoArtista(a.slug)}
                        className="group flex items-center gap-4 py-3"
                      >
                        {obra ? (
                          <Passepartout
                            imagem={obra.imagens[0]!}
                            ratio="aspect-square"
                            sizes="64px"
                            className="w-14 shrink-0"
                          />
                        ) : null}
                        <span className="flex flex-col">
                          <span className="font-display text-[1.25rem] leading-tight transition-colors group-hover:text-brand-text">
                            {a.nome}
                          </span>
                          <span className="text-meta text-muted-foreground">
                            {localDoArtista(a)}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="max-w-[56ch] text-lead text-muted-foreground">
          Os primeiros artistas estão chegando.{" "}
          <Link href={sections.muralChamada.href} className="link-underline text-foreground">
            A chamada está aberta
          </Link>{" "}
          para quem faz arte política e popular.
        </p>
      )}

      <div className="mt-section border-t border-hair pt-stack">
        <div className="mb-section-head flex flex-wrap items-baseline justify-between gap-4">
          <h3 className="font-display text-h3">Clássicos</h3>
          <Link
            href={`${sections.muralObras.href}#classicos`}
            className="link-underline text-sm font-medium"
          >
            Todos os clássicos
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-x-[clamp(12px,2vw,32px)] gap-y-10 lg:grid-cols-6">
          {classicos.map((c) => (
            <ClassicCard key={c.slug} classico={c} />
          ))}
        </div>
      </div>
    </Section>
  );
}
