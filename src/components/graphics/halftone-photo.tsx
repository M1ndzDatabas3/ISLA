"use client";

import { useEffect, useRef } from "react";

import { drawHalftone, halftoneTones, type HalftoneTone } from "@/lib/halftone";
import { cn } from "@/lib/utils";

interface HalftonePhotoProps {
  seed: number;
  /** Altura (0 a 1) onde começa a multidão. */
  horizon?: number;
  tone?: HalftoneTone;
  /** Descrição da imagem. Sem ela, a imagem é tratada como decorativa. */
  label?: string;
  className?: string;
}

/**
 * Placeholder de foto histórica: retícula gerada em canvas.
 * Só desenha quando entra (ou está perto de entrar) na tela e redesenha ao mudar de tamanho.
 */
export function HalftonePhoto({
  seed,
  horizon,
  tone = "paper",
  label,
  className,
}: HalftonePhotoProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const colors = halftoneTones[tone];

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let visible = false;
    let frame = 0;

    const render = () => {
      frame = 0;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawHalftone(ctx, width, height, { seed, horizon, colors });
    };
    const schedule = () => {
      if (visible && !frame) frame = requestAnimationFrame(render);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          visible = true;
          schedule();
        }
      },
      { rootMargin: "300px" },
    );
    const ro = new ResizeObserver(schedule);
    io.observe(canvas);
    ro.observe(canvas);
    return () => {
      io.disconnect();
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [seed, horizon, colors]);

  return (
    <canvas
      ref={ref}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("block size-full", className)}
      style={{ backgroundColor: colors.background }}
    />
  );
}
