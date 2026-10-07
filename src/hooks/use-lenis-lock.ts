"use client";

import { useLenis } from "lenis/react";
import { useEffect } from "react";

let locks = 0;

/**
 * Para o Lenis enquanto um menu, modal ou drawer estiver aberto.
 * Conta travas para suportar sobreposições aninhadas.
 */
export function useLenisLock(active: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!active || !lenis) return;
    locks += 1;
    lenis.stop();
    return () => {
      locks = Math.max(0, locks - 1);
      if (locks === 0) lenis.start();
    };
  }, [active, lenis]);
}
