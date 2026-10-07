"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { CropMarks } from "@/components/graphics/crop-marks";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

/**
 * Vídeo do hero (gerado por scripts/hero-video.swift a partir de public/herovideo.mov):
 * loop contínuo de 8s com fusão na emenda, recorte 2:3, H.264 sem áudio.
 */
const video = {
  src: "/media/hero-bandeira.mp4",
  poster: "/media/hero-bandeira-poster.jpg",
  width: 864,
  height: 1296,
};

type NetworkInformation = { saveData?: boolean };

/**
 * Peça de acervo do hero: vídeo numa moldura 2:3, com uma retícula muito leve
 * por trás e marcas de corte nos cantos, como numa prancha de arquivo.
 * Toca só quando visível; parado com movimento reduzido ou economia de dados.
 */
export function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const reduceMotion = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    const saveData = (navigator as Navigator & { connection?: NetworkInformation }).connection
      ?.saveData;
    if (reduceMotion || saveData) {
      element.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (!userPaused.current) element.play().catch(() => setPlaying(false));
        } else {
          element.pause();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(element);
    return () => io.disconnect();
  }, [reduceMotion]);

  function toggle() {
    const element = videoRef.current;
    if (!element) return;
    if (element.paused) {
      userPaused.current = false;
      element.play().catch(() => setPlaying(false));
    } else {
      userPaused.current = true;
      element.pause();
    }
  }

  return (
    <figure className="relative m-0">
      <div className="relative">
        {/* Retícula muito leve saindo por trás da moldura, à esquerda; nunca sob a legenda */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-[6%] -left-[4%] h-[56%] w-[64%] animate-fade-up halftone [mask-image:radial-gradient(ellipse_at_0%_100%,#000_20%,transparent_70%)] text-foreground opacity-[0.16] lg:-left-[12%] dark:opacity-[0.22]"
          style={{ animationDelay: "700ms" }}
        />
        <CropMarks className="animate-fade-up" style={{ animationDelay: "950ms" }} />
        <div className="relative aspect-[2/3] animate-reveal-up overflow-hidden bg-[#efe7dd]">
          <ParallaxLayer>
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="metadata"
              poster={video.poster}
              width={video.width}
              height={video.height}
              aria-hidden
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              className="size-full animate-settle object-cover"
            >
              <source src={video.src} type="video/mp4" />
            </video>
          </ParallaxLayer>
        </div>
      </div>

      <figcaption
        className="mt-6 flex animate-fade-up items-baseline justify-between gap-4 text-meta text-muted-foreground lg:mt-8"
        style={{ animationDelay: "800ms" }}
      >
        <span className="flex gap-3">
          <span className="font-medium whitespace-nowrap text-foreground">Fig. 1</span>
          {/* TODO: confirmar autoria e licença do vídeo para o crédito. */}
          <span>Bandeira vermelha com a foice e o martelo.</span>
        </span>
        <button
          type="button"
          onClick={toggle}
          className="relative inline-flex shrink-0 cursor-pointer items-center gap-1.5 transition-colors after:absolute after:-inset-3 after:content-[''] hover:text-foreground"
        >
          {playing ? (
            <Pause className="size-3.5" strokeWidth={1.5} aria-hidden />
          ) : (
            <Play className="size-3.5" strokeWidth={1.5} aria-hidden />
          )}
          {playing ? "Pausar" : "Reproduzir"}
          <span className="sr-only"> vídeo</span>
        </button>
      </figcaption>
    </figure>
  );
}
