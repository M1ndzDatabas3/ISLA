"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useRef, useState } from "react";

import { Logo } from "@/components/brand/Logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LenisLock } from "@/components/ui/dialog";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { gsap, useGSAP } from "@/lib/gsap";
import { sections, siteMap } from "@/lib/navigation";

import { ThemeSwitcher } from "./theme-toggle";

/**
 * Menu em tela cheia do mobile. Entra como uma cortina (o painel desce enquanto
 * o conteúdo sobe em sentido contrário) e sai pelo mesmo caminho, mais rápido.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  // Só inverte a timeline de entrada (não cria animação nova), então dispensa contextSafe.
  function close() {
    const tl = timeline.current;
    if (!tl) {
      setOpen(false);
      return;
    }
    tl.eventCallback("onReverseComplete", () => setOpen(false));
    tl.timeScale(1.8).reverse();
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          className="inline-flex size-11 cursor-pointer flex-col items-center justify-center gap-1.25 lg:hidden"
        >
          <span aria-hidden className="block h-px w-5 bg-foreground" />
          <span aria-hidden className="block h-px w-5 bg-foreground" />
          <span className="sr-only">Abrir menu</span>
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 overflow-hidden outline-none lg:hidden"
        >
          <LenisLock />
          <DialogPrimitive.Title className="sr-only">Menu principal</DialogPrimitive.Title>
          <MenuPanel
            onClose={close}
            onTimeline={(tl) => {
              timeline.current = tl;
            }}
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

interface MenuPanelProps {
  onClose: () => void;
  onTimeline: (tl: gsap.core.Timeline | null) => void;
}

/** Montado só com o menu aberto, então a animação de entrada roda no momento certo. */
function MenuPanel({ onClose, onTimeline }: MenuPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduceMotion) {
        onTimeline(null);
        return;
      }
      onTimeline(
        gsap
          .timeline()
          .from("[data-curtain]", { yPercent: -100, duration: 0.7 })
          .from("[data-curtain-inner]", { yPercent: 100, duration: 0.7 }, 0)
          .from("[data-item]", { y: 20, autoAlpha: 0, stagger: 0.03, duration: 0.5 }, 0.3),
      );
      return () => onTimeline(null);
    },
    { scope: ref, dependencies: [reduceMotion] },
  );

  return (
    <div ref={ref} className="h-full">
      <div data-curtain className="h-full overflow-hidden will-change-transform">
        <div
          data-curtain-inner
          data-lenis-prevent
          className="relative flex h-full flex-col overflow-y-auto overscroll-contain bg-background text-foreground will-change-transform"
        >
          <div className="container-page flex h-16 shrink-0 items-center justify-between border-b border-hair">
            <Link href="/" onClick={onClose} className="inline-flex">
              <Logo className="text-[32px]" />
            </Link>
            <DialogPrimitive.Close className="-mr-2 inline-flex size-11 cursor-pointer items-center justify-center">
              <X className="size-5" strokeWidth={1.5} aria-hidden />
              <span className="sr-only">Fechar menu</span>
            </DialogPrimitive.Close>
          </div>

          <nav aria-label="Menu principal" className="container-page flex-1 pt-6 pb-10">
            <Link
              data-item
              href={sections.busca.href}
              onClick={onClose}
              className="mb-10 flex h-12 items-center gap-3 border-b border-input font-sans text-[0.9375rem] text-muted-foreground"
            >
              <Search className="size-4" strokeWidth={1.5} aria-hidden />
              Buscar artigos, livros, autores…
            </Link>

            {/* Grupos em acordeão; o primeiro link de cada um leva à página-mestre. */}
            <Accordion type="single" collapsible className="flex flex-col">
              {siteMap.map((group) => (
                <AccordionItem key={group.title} value={group.title} data-item>
                  <AccordionTrigger className="py-4 text-[1.75rem] leading-tight">
                    {group.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="flex flex-col pb-4">
                      {group.href ? (
                        <li>
                          <Link
                            href={group.href}
                            onClick={onClose}
                            className="block py-2 text-[1.0625rem] font-medium transition-colors hover:text-brand-text"
                          >
                            Visão geral de {group.title}
                          </Link>
                        </li>
                      ) : null}
                      {group.links
                        .filter((link) => link.href !== group.href)
                        .map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={onClose}
                              className="block py-2 text-[1.0625rem] text-muted-foreground transition-colors hover:text-foreground"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </nav>

          <div
            data-item
            className="container-page flex flex-wrap items-center justify-between gap-4 border-t border-hair py-5 pb-[max(20px,env(safe-area-inset-bottom))]"
          >
            <ThemeSwitcher />
            <Link
              href="/#newsletter"
              onClick={onClose}
              className="link-underline text-sm font-medium"
            >
              Assinar a newsletter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
