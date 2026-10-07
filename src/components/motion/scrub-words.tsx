"use client";

import { useRef } from "react";

import { gsap, mediaConditions, useGSAP } from "@/lib/gsap";

/**
 * Texto que "acende" palavra por palavra conforme a leitura avança no scroll.
 * Com movimento reduzido (ou sem JavaScript), o texto aparece inteiro.
 */
export function ScrubWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${mediaConditions.isDesktop}, ${mediaConditions.isMobile}`, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-word]", ref.current);
        gsap.fromTo(
          items,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 82%",
              end: "bottom 52%",
              scrub: 0.4,
            },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i}>
          <span data-word>{word}</span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
