"use client";

import { useRef } from "react";

import { gsap, mediaConditions, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Trilho horizontal. No desktop (com movimento) a seção fica presa no centro da
 * tela e o scroll vertical desloca os cards para o lado; no celular, com
 * movimento reduzido ou em telas baixas demais, é uma faixa rolável com scroll-snap.
 */
export function HorizontalRail({
  header,
  children,
  className,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mediaConditions.isDesktop, () => {
        const vp = viewport.current;
        const tr = track.current;
        if (!vp || !tr) return;
        const distance = () => Math.max(0, tr.scrollWidth - vp.clientWidth);
        const header =
          parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) ||
          72;
        // O padding da seção pode sair da tela durante o pin; o conteúdo, não.
        const content = (root.current?.firstElementChild as HTMLElement | null)?.offsetHeight;
        const fits = (content ?? Infinity) <= window.innerHeight - header * 2;
        if (distance() < 24 || !fits) return;

        gsap.set(vp, { overflow: "visible" });
        gsap.to(tr, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "center center",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={cn("overflow-x-clip", className)}>
      <div className="container-page">
        {header}
        <div
          ref={viewport}
          className="-mx-[var(--gutter)] snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain px-[var(--gutter)] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          <div ref={track} className="flex w-max gap-[clamp(16px,2vw,32px)] pb-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
