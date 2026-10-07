"use client";

import { useRef } from "react";

import { gsap, mediaConditions, useGSAP } from "@/lib/gsap";

/**
 * Linha do tempo que se desenha com o scroll: a linha cresce (horizontal no
 * desktop, vertical no celular) e cada marco acende quando ela passa.
 * Sem movimento, tudo aparece pronto.
 */
export function TimelineTrack({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: mediaConditions.isDesktop, isMobile: mediaConditions.isMobile },
        (ctx) => {
          const { isDesktop } = ctx.conditions as { isDesktop: boolean };
          const line = root.current?.querySelector<HTMLElement>("[data-line]");
          const dots = gsap.utils.toArray<HTMLElement>("[data-dot]", root.current);
          if (!line || !dots.length) return;

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: isDesktop ? "top 75%" : "top 70%",
              end: isDesktop ? "bottom 55%" : "bottom 60%",
              scrub: 0.5,
            },
          });
          tl.from(line, { [isDesktop ? "scaleX" : "scaleY"]: 0, duration: dots.length });
          dots.forEach((dot, i) => {
            tl.from(dot, { scale: 0.4, backgroundColor: "transparent", duration: 0.3 }, i + 0.1);
          });
        },
      );
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative">
      <span
        data-line
        aria-hidden
        className="absolute top-0 bottom-0 left-[5px] w-px origin-top bg-foreground lg:top-[5px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto lg:origin-left"
      />
      {children}
    </div>
  );
}
