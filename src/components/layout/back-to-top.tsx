"use client";

import { ArrowUp } from "lucide-react";
import { useLenis } from "lenis/react";

export function BackToTop() {
  const lenis = useLenis();

  return (
    <button
      type="button"
      onClick={() => {
        if (lenis) lenis.scrollTo(0);
        else window.scrollTo({ top: 0 });
        document.getElementById("conteudo")?.focus({ preventScroll: true });
      }}
      className="inline-flex h-10 cursor-pointer items-center gap-1.5 transition-colors hover:text-foreground"
    >
      <ArrowUp className="size-3.5" strokeWidth={1.5} aria-hidden />
      Voltar ao topo
    </button>
  );
}
