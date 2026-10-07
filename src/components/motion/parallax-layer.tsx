"use client";

import { useRef } from "react";

import { gsap, mediaConditions, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface ParallaxLayerProps {
  children: React.ReactNode;
  /** Deslocamento total em % da altura da camada ao atravessar a tela. */
  amount?: number;
  className?: string;
}

/**
 * Camada com parallax leve no scroll, só no desktop e sem prefers-reduced-motion.
 * A camada deve ser maior que a moldura (ex.: inset negativo) para não abrir vãos.
 */
export function ParallaxLayer({ children, amount = 8, className }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const layer = ref.current;
      if (!layer?.parentElement) return;
      const mm = gsap.matchMedia();
      mm.add(mediaConditions.isDesktop, () => {
        gsap.fromTo(
          layer,
          { yPercent: -amount / 2 },
          {
            yPercent: amount / 2,
            ease: "none",
            scrollTrigger: {
              trigger: layer.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: ref, dependencies: [amount] },
  );

  return (
    <div
      ref={ref}
      className={cn("absolute inset-x-0 -inset-y-[6%] will-change-transform", className)}
    >
      {children}
    </div>
  );
}
