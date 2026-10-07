import Image from "next/image";
import Link from "next/link";

import { ConferirNote } from "@/components/editorial/conferir";
import { ShareQuoteButton } from "@/components/editorial/share-quote-button";
import { CropMarks } from "@/components/graphics/crop-marks";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { ScrubWords } from "@/components/motion/scrub-words";
import { getAutor, getCitacoes, getLivro } from "@/lib/content";

/** Citação da faixa preta da home (slug em content/citacoes). */
export const FEATURED_QUOTE = "marx-tempo-disponivel";

/**
 * Citação em destaque na faixa preta: retrato de Marx em preto e branco como
 * peça de arquivo (Fig. 2, em continuidade com o hero) e a frase que se acende
 * palavra por palavra no scroll.
 */
export function FeaturedQuote() {
  const citacao = getCitacoes().find((c) => c.slug === FEATURED_QUOTE);
  const autor = citacao ? getAutor(citacao.autor) : undefined;
  if (!citacao || !autor) return null;
  const livro = citacao.livro ? getLivro(citacao.livro) : undefined;

  return (
    <section aria-labelledby="citacao-destaque" className="tone-ink py-section">
      <div className="container-page grid-page items-end gap-y-14">
        <figure className="col-span-9 m-0 sm:col-span-6 lg:col-span-4">
          <div className="relative">
            <CropMarks />
            {autor.retrato ? (
              <div className="relative aspect-[4/5] overflow-hidden bg-surface-ink">
                <ParallaxLayer amount={6}>
                  <Image
                    src={autor.retrato.src}
                    alt={autor.retrato.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, 70vw"
                    className="object-cover contrast-[1.08] grayscale"
                  />
                </ParallaxLayer>
              </div>
            ) : null}
          </div>
          {autor.retrato ? (
            <figcaption className="mt-6 flex gap-3 text-meta text-muted-foreground lg:mt-8">
              <span className="font-medium whitespace-nowrap text-foreground">Fig. 2</span>
              <span>
                {autor.nome}. {autor.retrato.credito}. {autor.retrato.licenca}.
              </span>
            </figcaption>
          ) : null}
        </figure>

        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <figure className="m-0">
            <blockquote
              id="citacao-destaque"
              className="m-0 font-display text-[clamp(1.875rem,1rem+2.6vw,3.625rem)]/[1.06] font-medium tracking-[-0.018em]"
            >
              <span aria-hidden className="text-red lg:-ml-[0.44em]">
                “
              </span>
              <ScrubWords text={citacao.texto} />
              <span aria-hidden className="text-red">
                ”
              </span>
            </blockquote>
            <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-hair pt-5 text-sm">
              <Link
                href={`/autores/${autor.slug}`}
                className="font-medium transition-colors hover:text-brand-text"
              >
                {autor.nome}
              </Link>
              <span className="text-muted-foreground">{citacao.fonte}</span>
              {citacao.conferir ? <ConferirNote nota={citacao.conferir} /> : null}
            </figcaption>
          </figure>

          {citacao.contexto ? (
            <p className="mt-8 max-w-[54ch] text-sm leading-relaxed text-muted-foreground">
              {citacao.contexto}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ShareQuoteButton
              text={citacao.texto}
              attribution={autor.nome}
              source={citacao.fonte}
            />
            {livro ? (
              <Link
                href={`/biblioteca/${livro.slug}`}
                className="link-underline text-sm font-medium"
              >
                Ficha de {livro.tituloCapa ?? livro.titulo}
              </Link>
            ) : null}
            <Link href={`/autores/${autor.slug}`} className="link-underline text-sm font-medium">
              Obras e influências de {autor.nome}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
