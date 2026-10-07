"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Faixa em movimento contínuo, em CSS. Para no hover e no foco, e tem botão
 * de pausa (WCAG 2.2.2). Com movimento reduzido vira uma lista rolável.
 */
export function MarqueeTrack({ children, label }: { children: React.ReactNode; label: string }) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="group/marquee">
      <div className="overflow-hidden motion-reduce:overflow-x-auto">
        <div
          className={cn(
            "flex w-max animate-marquee group-focus-within/marquee:[animation-play-state:paused] group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none",
            paused && "[animation-play-state:paused]",
          )}
        >
          {children}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? `Retomar ${label}` : `Pausar ${label}`}
        className="absolute right-[var(--gutter)] bottom-2 inline-flex size-7 cursor-pointer items-center justify-center bg-background text-muted-foreground transition-colors hover:text-foreground motion-reduce:hidden"
      >
        {paused ? (
          <Play className="size-3.5" aria-hidden />
        ) : (
          <Pause className="size-3.5" aria-hidden />
        )}
      </button>
    </div>
  );
}
