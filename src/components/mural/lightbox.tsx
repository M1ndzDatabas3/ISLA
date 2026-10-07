"use client";

import { ChevronLeft, ChevronRight, Maximize2, Minimize2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useCallback, useRef, useState } from "react";

import { LenisLock } from "@/components/ui/dialog";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { MuseumCaption, type ImagemDaObra } from "./artwork";

import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

export interface LightboxItem {
  id: string;
  imagem: ImagemDaObra;
  titulo: string;
  artista: string;
  artistaHref?: string;
  ano?: number;
  href?: string;
  /** Arquivo em alta resolução para o zoom (cai na imagem principal se não houver). */
  zoomSrc?: string;
  demo?: boolean;
}

interface ArtworkGalleryProps {
  items: LightboxItem[];
  /** masonry: galeria de miniaturas; single: uma obra grande (página da obra). */
  layout?: "masonry" | "single";
  sizes?: string;
  className?: string;
}

/**
 * Galeria com lightbox. A miniatura "cresce" até a tela cheia (GSAP Flip) e
 * volta ao fechar. Setas, teclado (← → Esc) e deslize no celular; o foco
 * fica preso no diálogo e o crédito do artista acompanha a imagem.
 */
export function ArtworkGallery({
  items,
  layout = "masonry",
  sizes,
  className,
}: ArtworkGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const pendingFlip = useRef<Flip.FlipState | null>(null);
  const pointer = useRef<number | null>(null);
  /** Botão que abriu o lightbox: recebe o foco de volta ao fechar. */
  const trigger = useRef<HTMLButtonElement | null>(null);

  const item = items[index]!;
  const total = items.length;
  const go = useCallback(
    (delta: number) => {
      setZoom(false);
      setIndex((i) => (i + delta + total) % total);
    },
    [total],
  );

  /** Miniatura na página (a que tem data-thumb), para a transição Flip. */
  const miniatura = (id: string) =>
    document.querySelector<HTMLElement>(`[data-thumb][data-flip-id="obra-${id}"]`);

  function abrir(i: number, botao: HTMLButtonElement) {
    trigger.current = botao;
    const thumb = miniatura(items[i]!.id);
    pendingFlip.current = thumb && !reduceMotion ? Flip.getState(thumb) : null;
    setIndex(i);
    setZoom(false);
    setOpen(true);
  }

  function fechar() {
    const big = document.querySelector<HTMLElement>("[data-lightbox-stage]");
    const thumb = miniatura(item.id);
    const state = big && thumb && !reduceMotion ? Flip.getState(big) : null;
    setOpen(false);
    if (state && thumb) {
      requestAnimationFrame(() =>
        Flip.from(state, { targets: thumb, duration: 0.45, ease: "poster", scale: true }),
      );
    }
  }

  /** Quando o palco monta no portal, faz a miniatura "crescer" até ele. */
  const stageRef = useCallback((el: HTMLDivElement | null) => {
    if (!el || !pendingFlip.current) return;
    const state = pendingFlip.current;
    pendingFlip.current = null;
    Flip.from(state, { targets: el, duration: 0.55, ease: "poster", scale: true });
  }, []);

  return (
    <>
      {layout === "single" ? (
        <figure className={cn("m-0", className)}>
          <button
            type="button"
            onClick={(e) => abrir(0, e.currentTarget)}
            aria-label={`Ampliar ${items[0]!.titulo}`}
            className="group relative block w-full cursor-zoom-in"
          >
            <span data-thumb data-flip-id={`obra-${items[0]!.id}`} className="block">
              <Image
                src={items[0]!.imagem.src}
                alt={items[0]!.imagem.alt}
                width={items[0]!.imagem.largura}
                height={items[0]!.imagem.altura}
                sizes={sizes ?? "(min-width: 1024px) 60vw, 100vw"}
                priority
                placeholder="blur"
                blurDataURL={items[0]!.imagem.blurDataURL}
                className="mx-auto h-auto max-h-[80svh] w-auto max-w-full"
              />
            </span>
            <span className="absolute right-3 bottom-3 inline-flex size-10 items-center justify-center bg-ink/80 text-paper opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <Maximize2 className="size-4" strokeWidth={1.5} aria-hidden />
            </span>
          </button>
        </figure>
      ) : (
        <ul
          className={cn(
            "columns-1 gap-x-[clamp(16px,2vw,32px)] sm:columns-2 lg:columns-3",
            className,
          )}
        >
          {items.map((it, i) => (
            <li key={it.id} data-reveal className="mb-[clamp(24px,3vw,40px)] break-inside-avoid">
              <figure className="group m-0">
                <button
                  type="button"
                  onClick={(e) => abrir(i, e.currentTarget)}
                  aria-label={`Ampliar ${it.titulo}, de ${it.artista}`}
                  className="relative block w-full cursor-zoom-in overflow-hidden bg-[#161616]"
                >
                  <span
                    data-thumb
                    data-flip-id={`obra-${it.id}`}
                    className="block transition-transform duration-700 ease-poster group-hover:scale-[1.03]"
                  >
                    <Image
                      src={it.imagem.src}
                      alt={it.imagem.alt}
                      width={it.imagem.largura}
                      height={it.imagem.altura}
                      sizes={sizes ?? "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"}
                      placeholder="blur"
                      blurDataURL={it.imagem.blurDataURL}
                      className="h-auto w-full"
                    />
                  </span>
                </button>
                <MuseumCaption
                  className="mt-3"
                  artista={it.artista}
                  artistaHref={it.artistaHref}
                  titulo={it.titulo}
                  obraHref={it.href}
                  ano={it.ano}
                  demo={it.demo}
                />
              </figure>
            </li>
          ))}
        </ul>
      )}

      <DialogPrimitive.Root open={open} onOpenChange={(v) => (v ? setOpen(true) : fechar())}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#0b0b0b]/95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            data-lenis-prevent
            aria-describedby={undefined}
            onCloseAutoFocus={(e) => {
              // Sem DialogTrigger, o Radix não sabe para onde devolver o foco.
              e.preventDefault();
              trigger.current?.focus({ preventScroll: true });
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") go(1);
              if (e.key === "ArrowLeft") go(-1);
            }}
            onPointerDown={(e) => (pointer.current = e.clientX)}
            onPointerUp={(e) => {
              if (pointer.current === null || zoom) return;
              const dx = e.clientX - pointer.current;
              pointer.current = null;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            }}
            className="fixed inset-0 z-50 flex flex-col text-[#f5f5f5] outline-none"
          >
            <LenisLock />
            <div className="flex h-14 shrink-0 items-center justify-between px-4 sm:px-6">
              <span className="font-sans text-meta text-[#a3a3a3] tabular-nums">
                {total > 1 ? `${index + 1} de ${total}` : ""}
              </span>
              <DialogPrimitive.Title className="sr-only">
                {item.titulo}, de {item.artista}
              </DialogPrimitive.Title>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setZoom((z) => !z)}
                  aria-pressed={zoom}
                  className="inline-flex size-11 cursor-pointer items-center justify-center hover:bg-white/10"
                >
                  {zoom ? (
                    <Minimize2 className="size-5" strokeWidth={1.5} aria-hidden />
                  ) : (
                    <Maximize2 className="size-5" strokeWidth={1.5} aria-hidden />
                  )}
                  <span className="sr-only">{zoom ? "Ajustar à tela" : "Ver em tamanho real"}</span>
                </button>
                <DialogPrimitive.Close className="inline-flex size-11 cursor-pointer items-center justify-center hover:bg-white/10">
                  <X className="size-5" strokeWidth={1.5} aria-hidden />
                  <span className="sr-only">Fechar</span>
                </DialogPrimitive.Close>
              </div>
            </div>

            <div className="relative min-h-0 flex-1">
              {zoom ? (
                <div
                  className="absolute inset-0 overflow-auto overscroll-contain"
                  data-lenis-prevent
                >
                  {/* Tamanho real: o arquivo em alta resolução, sem otimização */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.zoomSrc ?? item.imagem.src}
                    alt={item.imagem.alt}
                    className="max-w-none"
                    draggable={false}
                  />
                </div>
              ) : (
                <div
                  ref={stageRef}
                  key={item.id}
                  data-lightbox-stage
                  data-flip-id={`obra-${item.id}`}
                  className="absolute inset-x-4 inset-y-2 sm:inset-x-20"
                >
                  <Image
                    src={item.imagem.src}
                    alt={item.imagem.alt}
                    fill
                    sizes="100vw"
                    quality={90}
                    placeholder="blur"
                    blurDataURL={item.imagem.blurDataURL}
                    className="object-contain"
                  />
                </div>
              )}

              {total > 1 && !zoom ? (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    className="absolute top-1/2 left-1 hidden size-12 -translate-y-1/2 cursor-pointer items-center justify-center hover:bg-white/10 sm:inline-flex"
                  >
                    <ChevronLeft className="size-6" strokeWidth={1.5} aria-hidden />
                    <span className="sr-only">Obra anterior</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="absolute top-1/2 right-1 hidden size-12 -translate-y-1/2 cursor-pointer items-center justify-center hover:bg-white/10 sm:inline-flex"
                  >
                    <ChevronRight className="size-6" strokeWidth={1.5} aria-hidden />
                    <span className="sr-only">Próxima obra</span>
                  </button>
                </>
              ) : null}
            </div>

            <div className="flex shrink-0 items-end justify-between gap-6 px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] sm:px-6">
              <MuseumCaption
                className="[&_.text-foreground]:text-[#f5f5f5] [&_.text-muted-foreground]:text-[#a3a3a3]"
                artista={item.artista}
                titulo={item.titulo}
                ano={item.ano}
                credito={item.imagem.credito}
                demo={item.demo}
              />
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="shrink-0 font-sans text-sm underline underline-offset-4 hover:text-white"
                >
                  Ver a obra
                </Link>
              ) : null}
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
