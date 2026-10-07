"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { ExampleBadge } from "@/components/ui/example-badge";
import { gsap, useGSAP } from "@/lib/gsap";

import type { ImagemDaObra } from "./artwork";

import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

interface MuralHeroProps {
  mes: string;
  obra: { titulo: string; href: string; ano: number; tecnica: string; imagem: ImagemDaObra };
  artista: { nome: string; href: string; local: string };
  ilustra?: { titulo: string; href: string };
  texto: string;
  demo?: boolean;
}

/**
 * Hero do Mural: a Capa do mês em tela cheia, sobre tinta. A obra se revela
 * de baixo para cima (clip-path) e o título entra letra a letra (SplitText).
 */
export function MuralHero({ mes, obra, artista, ilustra, texto, demo }: MuralHeroProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const title = root.current?.querySelector<HTMLElement>("[data-split-reveal]");
        const image = root.current?.querySelector<HTMLElement>("[data-clip-reveal]");
        const tl = gsap.timeline({ defaults: { ease: "poster" } });
        if (image) tl.to(image, { clipPath: "inset(0% 0 0 0)", duration: 1.3 }, 0);
        if (title) {
          const split = SplitText.create(title, { type: "chars,words", mask: "chars" });
          gsap.set(title, { visibility: "visible" });
          tl.from(split.chars, { yPercent: 110, duration: 0.9, stagger: 0.03 }, 0.2);
          return () => split.revert();
        }
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="mural-titulo"
      className="tone-ink overflow-hidden lg:min-h-[calc(100svh-var(--header-h))]"
    >
      <div className="container-page grid-page items-center gap-y-10 py-section lg:min-h-[calc(100svh-var(--header-h))]">
        <div className="col-span-12 flex flex-col gap-8 lg:col-span-5">
          <h1
            id="mural-titulo"
            data-split-reveal
            className="font-display text-[clamp(3.25rem,1.5rem+6.5vw,7.5rem)]/[0.92] tracking-[-0.03em]"
          >
            Mural Cultural
          </h1>
          <div className="flex flex-col gap-4 border-t border-hair pt-6">
            <p className="flex flex-wrap items-center gap-3 text-meta text-muted-foreground">
              Capa do mês, {mes}
              {demo ? <ExampleBadge /> : null}
            </p>
            <p className="font-display text-h3">
              <Link href={obra.href} className="italic transition-colors hover:text-brand-text">
                {obra.titulo}
              </Link>
              <span className="text-muted-foreground">, {obra.ano}</span>
            </p>
            <p className="text-sm">
              <Link href={artista.href} className="font-medium hover:text-brand-text">
                {artista.nome}
              </Link>
              <span className="text-muted-foreground">
                {" "}
                {artista.local}. {obra.tecnica}.
              </span>
            </p>
            <blockquote className="m-0 max-w-[44ch] border-l-2 border-brand pl-4 text-[0.9375rem] leading-relaxed text-muted-foreground">
              {texto}
            </blockquote>
            {ilustra ? (
              <p className="text-sm text-muted-foreground">
                Ilustra{" "}
                <Link href={ilustra.href} className="link-underline text-foreground">
                  {ilustra.titulo}
                </Link>
              </p>
            ) : null}
          </div>
        </div>

        <figure className="col-span-12 m-0 lg:col-span-6 lg:col-start-7">
          <div data-clip-reveal className="flex justify-center">
            <Image
              src={obra.imagem.src}
              alt={obra.imagem.alt}
              width={obra.imagem.largura}
              height={obra.imagem.altura}
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              placeholder="blur"
              blurDataURL={obra.imagem.blurDataURL}
              className="h-auto max-h-[72svh] w-auto max-w-full"
            />
          </div>
          <figcaption className="mt-4 text-meta text-muted-foreground">
            <span className="font-medium text-foreground">{artista.nome}</span>,{" "}
            <i>{obra.titulo}</i>, {obra.ano}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
