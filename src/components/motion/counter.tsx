"use client";

import { useRef } from "react";

import { gsap, mediaConditions, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Número que conta de 0 até `value` ao entrar na tela (estático com movimento reduzido). */
export function Counter({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`${mediaConditions.isDesktop}, ${mediaConditions.isMobile}`, () => {
        const state = { n: 0 };
        el.textContent = "0";
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.to(state, {
              n: value,
              duration: 1.4,
              ease: "power3.out",
              snap: { n: 1 },
              onUpdate: () => {
                el.textContent = String(Math.round(state.n));
              },
            }),
        });
        return () => {
          el.textContent = String(value);
        };
      });
    },
    { scope: ref, dependencies: [value] },
  );

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
