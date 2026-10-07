"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { ExampleBadge } from "@/components/ui/example-badge";
import { useMediaQuery } from "@/hooks/use-media-query";
import { gsap, mediaConditions, useGSAP } from "@/lib/gsap";

import type { ImagemDaObra } from "./artwork";

export interface Sala {
  id: string;
  imagem: ImagemDaObra;
  titulo: string;
  href: string;
  artista: string;
  artistaHref: string;
  ano: number;
  tecnica: string;
  dimensoes?: string;
  descricao: string;
  demo?: boolean;
}

/**
 * Visita à exposição. No desktop (com movimento) a seção fica presa e o scroll
 * vertical faz as obras passarem como numa parede de galeria, cada legenda
 * entrando junto. No celular (ou com movimento reduzido), sequência vertical
 * com scroll-snap, uma obra por "sala".
 */
export function ExhibitionWall({ salas }: { salas: Sala[] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const mobile = useMediaQuery("(max-width: 1023.98px)");

  // Scroll-snap vertical só no celular, enquanto a exposição está na tela.
  useEffect(() => {
    if (!mobile) return;
    const html = document.documentElement;
    const anterior = html.style.scrollSnapType;
    html.style.scrollSnapType = "y proximity";
    return () => {
      html.style.scrollSnapType = anterior;
    };
  }, [mobile]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mediaConditions.isDesktop, () => {
        const el = track.current;
        if (!el) return;
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);
        const parede = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-legenda]", el).forEach((legenda) => {
          gsap.from(legenda, {
            autoAlpha: 0,
            x: 40,
            duration: 0.6,
            ease: "poster",
            scrollTrigger: {
              trigger: legenda,
              containerAnimation: parede,
              start: "left 85%",
              toggleActions: "play none none reverse",
            },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label="Obras da exposição"
      className="tone-ink overflow-hidden lg:flex lg:h-svh lg:items-center"
    >
      <ol
        ref={track}
        className="flex flex-col gap-0 lg:w-max lg:flex-row lg:items-center lg:gap-[clamp(64px,8vw,160px)] lg:px-[max(var(--gutter),calc((100vw-var(--container-max))/2+var(--gutter)))]"
      >
        {salas.map((sala, i) => (
          <li
            key={sala.id}
            className="container-page flex min-h-[88svh] snap-center flex-col justify-center gap-6 py-12 lg:m-0 lg:min-h-0 lg:w-auto lg:max-w-none lg:flex-row lg:items-end lg:gap-10 lg:p-0"
          >
            <Link
              href={sala.href}
              className="block shrink-0"
              aria-label={`${sala.titulo}, de ${sala.artista}`}
            >
              <Image
                src={sala.imagem.src}
                alt={sala.imagem.alt}
                width={sala.imagem.largura}
                height={sala.imagem.altura}
                sizes="(min-width: 1024px) 60vw, 100vw"
                placeholder="blur"
                blurDataURL={sala.imagem.blurDataURL}
                className="h-auto max-h-[62svh] w-auto max-w-full lg:h-[64svh] lg:max-h-none lg:max-w-[70vw]"
              />
            </Link>
            <div data-legenda className="flex max-w-[34ch] flex-col gap-2 lg:w-72 lg:shrink-0">
              <p className="font-sans text-meta text-muted-foreground tabular-nums">
                Sala {i + 1} de {salas.length}
              </p>
              <p className="flex flex-wrap items-center gap-2 font-sans text-sm font-medium">
                <Link href={sala.artistaHref} className="hover:text-brand-text">
                  {sala.artista}
                </Link>
                {sala.demo ? <ExampleBadge /> : null}
              </p>
              <p className="font-display text-h3">
                <Link href={sala.href} className="italic hover:text-brand-text">
                  {sala.titulo}
                </Link>
                <span className="text-muted-foreground">, {sala.ano}</span>
              </p>
              <p className="text-meta text-muted-foreground">
                {[sala.tecnica, sala.dimensoes].filter(Boolean).join(", ")}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">{sala.descricao}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
