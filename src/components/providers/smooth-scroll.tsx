"use client";

import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Smooth scroll com Lenis, sincronizado com o ticker do GSAP e o ScrollTrigger.
 * Em prefers-reduced-motion a rolagem volta a ser nativa (smoothWheel desligado).
 * No toque o Lenis não interfere (syncTouch desligado por padrão).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Recalcula posições depois que as fontes carregam (a altura do texto muda).
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: !reduceMotion,
        anchors: { offset: -88 },
      }}
    >
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}

function ScrollTriggerSync() {
  useLenis(ScrollTrigger.update);
  return null;
}
