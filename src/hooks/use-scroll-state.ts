"use client";

import { useEffect, useState } from "react";

interface ScrollState {
  /** Passou do limite (header encolhido). */
  scrolled: boolean;
  /** Rolando para baixo depois do limite (barra inferior se esconde). */
  hidden: boolean;
}

/**
 * Estado de rolagem para o header e a barra inferior.
 * O Lenis rola a janela nativamente, então o evento `scroll` da janela basta.
 */
export function useScrollState(threshold = 24): ScrollState {
  const [state, setState] = useState<ScrollState>({ scrolled: false, hidden: false });

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      setState((prev) => {
        const scrolled = y > threshold;
        let hidden = prev.hidden;
        if (Math.abs(delta) > 6) hidden = delta > 0 && y > threshold * 4;
        if (!scrolled) hidden = false;
        return prev.scrolled === scrolled && prev.hidden === hidden ? prev : { scrolled, hidden };
      });
      lastY = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return state;
}
