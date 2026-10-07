"use client";

import { useRef } from "react";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { motion } from "@/lib/tokens";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Intervalo entre os itens marcados com data-reveal. */
  stagger?: number;
}

/**
 * Entrada no scroll: fade + deslocamento curto, uma vez só.
 * Anima os filhos marcados com `data-reveal` (ou o próprio bloco, se não houver).
 * O que já está visível ao carregar nunca começa escondido, e em
 * prefers-reduced-motion nada é animado.
 */
export function Reveal({ children, className, stagger = motion.stagger }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const marked = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
        const items = marked.length > 0 ? marked : [root];
        const belowFold = items.filter(
          (el) => el.getBoundingClientRect().top > window.innerHeight * 0.92,
        );
        if (belowFold.length === 0) return;

        gsap.set(belowFold, { autoAlpha: 0, y: motion.distance });
        ScrollTrigger.batch(belowFold, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: motion.duration.slow,
              stagger,
              overwrite: true,
            }),
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
