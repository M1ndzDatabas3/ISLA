"use client";

import { Search } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { useSearch } from "@/components/search/search-root";
import { useIsClient } from "@/hooks/use-is-client";
import { useScrollState } from "@/hooks/use-scroll-state";
import type { MegaMenuItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { MegaMenu } from "./mega-menu";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";

/**
 * Header fixo. Ao rolar, encolhe, fica preto com tudo em branco (hover em vermelho)
 * e a logo passa para a versão de texto branco.
 * É `fixed` (e não `sticky`) para que o encolhimento não mude o layout da página.
 */
export function SiteHeader({ menu }: { menu: MegaMenuItem[] }) {
  const { scrolled } = useScrollState(24);
  const search = useSearch();
  // A dica do atalho depende do sistema; só dá para saber no navegador.
  const isClient = useIsClient();
  const shortcut = isClient ? (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K") : null;

  return (
    <header
      data-scrolled={scrolled || undefined}
      className="site-header group/header fixed inset-x-0 top-0 z-40 border-b border-hair bg-background text-foreground transition-[background-color,color,border-color] duration-300 ease-poster"
    >
      <div
        className={cn(
          "container-page flex items-center gap-4 transition-[height] duration-300 ease-poster",
          "h-[calc(var(--header-h)-1px)] group-data-scrolled/header:h-14 lg:group-data-scrolled/header:h-16",
        )}
      >
        {/* A logo tem linhas pequenas: 40px de altura no mobile e 52px no desktop para
            continuarem legíveis. Ao rolar, encolhe e troca para a versão de texto branco. */}
        <Link href="/" className="relative mr-auto flex h-11 shrink-0 items-center lg:mr-6 lg:h-13">
          <span className="relative origin-left transition-transform duration-300 ease-poster group-data-scrolled/header:scale-[0.8]">
            <span className="block transition-opacity duration-300 group-data-scrolled/header:opacity-0">
              <Logo className="text-[40px] lg:text-[52px]" />
            </span>
            <span
              aria-hidden
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-data-scrolled/header:opacity-100"
            >
              <Logo tone="light" decorative className="text-[40px] lg:text-[52px]" />
            </span>
          </span>
        </Link>

        <MegaMenu items={menu} className="mr-auto" />

        <div className="flex items-center gap-1 lg:gap-2">
          <button
            type="button"
            onClick={search.open}
            className="inline-flex h-11 cursor-pointer items-center gap-2 px-2 font-sans text-sm text-muted-foreground transition-colors hover:text-foreground max-lg:w-11 max-lg:justify-center"
          >
            <Search className="size-4.5" strokeWidth={1.5} aria-hidden />
            <span className="max-lg:sr-only">Buscar</span>
            {shortcut ? (
              <kbd className="ml-1 hidden h-6 items-center border border-hair px-1.5 font-sans text-[0.6875rem] lg:inline-flex">
                {shortcut}
              </kbd>
            ) : null}
          </button>
          <ThemeToggle className="max-lg:hidden" />
          <Link
            href="/#newsletter"
            className="link-underline ml-3 text-sm font-medium max-lg:hidden"
          >
            Newsletter
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
