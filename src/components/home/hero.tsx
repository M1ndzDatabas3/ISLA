import Link from "next/link";

import { JoinDialog } from "@/components/community/join-dialog";
import { Button } from "@/components/ui/button";
import { sections } from "@/lib/navigation";
import { siteConfig } from "@/site.config";

import { HeroMedia } from "./hero-media";

const entries = [
  {
    label: "Trilhas de estudo",
    description: "Percursos guiados, do primeiro texto ao debate avançado.",
    href: sections.trilhas.href,
  },
  {
    label: "Indicação de livros",
    description: "Livros comentados, com nível de leitura e o que ler depois.",
    href: sections.biblioteca.href,
  },
  {
    label: "Faça parte",
    description: "Crie e desenvolva conteúdo com o Instituto. Deixe seu contato.",
  },
];

/** Linha do título revelada de baixo para cima por uma máscara (CSS, roda na primeira pintura). */
function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="-mt-[0.14em] -mb-[0.08em] block overflow-hidden pt-[0.14em] pb-[0.08em] lg:whitespace-nowrap">
      <span className="block animate-rise" style={{ animationDelay: `${delay}ms` }}>
        {children}
      </span>
    </span>
  );
}

/**
 * Hero "Arquivo": manchete à esquerda, vídeo da bandeira tratado como peça de
 * acervo à direita (moldura, retícula e marcas de corte), e três portas de entrada.
 * A entrada é em CSS; o parallax do vídeo (GSAP) só existe no desktop.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-titulo"
      className="container-page overflow-x-clip pt-stack pb-section"
    >
      <div className="grid-page items-center gap-y-14">
        <div className="col-span-12 lg:col-span-7">
          <h1
            id="hero-titulo"
            className="font-display text-hero lg:text-[clamp(3.5rem,5.6vw,5.1rem)]/[0.98]"
          >
            {siteConfig.manifesto.map((line, index) => {
              const last = index === siteConfig.manifesto.length - 1;
              return (
                <Line key={line} delay={index * 110}>
                  {/* Na última frase, o quadrado vermelho faz o papel do ponto final. */}
                  {last ? line.replace(/\.$/, "") : `${line} `}
                  {last ? (
                    <i
                      aria-hidden
                      className="title-mark animate-pop"
                      style={{ animationDelay: "950ms" }}
                    />
                  ) : null}
                </Line>
              );
            })}
          </h1>
          <p
            className="mt-8 max-w-[44ch] animate-fade-up font-text text-lead lg:mt-10"
            style={{ animationDelay: "450ms" }}
          >
            {siteConfig.mission}
          </p>
          <div
            className="mt-8 flex animate-fade-up flex-wrap items-center gap-x-7 gap-y-4"
            style={{ animationDelay: "560ms" }}
          >
            <Button asChild>
              <Link href={sections.trilhas.href}>Comece a estudar</Link>
            </Button>
            <Button asChild variant="link">
              <Link href={sections.biblioteca.href}>Explore a biblioteca</Link>
            </Button>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 lg:col-start-9">
          <HeroMedia />
        </div>
      </div>

      <nav
        aria-label="Por onde começar"
        className="mt-stack grid md:grid-cols-3 md:gap-x-[clamp(16px,2vw,32px)]"
      >
        {entries.map((entry, index) => {
          const content = (
            <>
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px animate-draw-x bg-hair"
                style={{ animationDelay: `${700 + index * 120}ms` }}
              />
              <span
                className="block animate-fade-up font-display text-[1.5rem] leading-tight transition-colors group-hover:text-brand-text"
                style={{ animationDelay: `${780 + index * 120}ms` }}
              >
                {entry.label}
              </span>
              <span
                className="mt-1.5 block animate-fade-up text-sm text-muted-foreground"
                style={{ animationDelay: `${840 + index * 120}ms` }}
              >
                {entry.description}
              </span>
            </>
          );
          const className = "group relative block py-5 text-left md:pt-6 md:pb-2";
          return entry.href ? (
            <Link key={entry.label} href={entry.href} className={className}>
              {content}
            </Link>
          ) : (
            <JoinDialog key={entry.label}>
              <button
                type="button"
                aria-haspopup="dialog"
                className={`${className} w-full cursor-pointer`}
              >
                {content}
              </button>
            </JoinDialog>
          );
        })}
      </nav>
    </section>
  );
}
