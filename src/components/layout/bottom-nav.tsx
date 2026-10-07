"use client";

import { Frame, House, LibraryBig, Route, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useScrollState } from "@/hooks/use-scroll-state";
import { bottomNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const icons = {
  inicio: House,
  leituras: LibraryBig,
  trilhas: Route,
  mural: Frame,
  busca: Search,
} as const;

/** Atalhos fixos no mobile. Some ao rolar para baixo e volta ao rolar para cima. */
export function BottomNav() {
  const pathname = usePathname();
  const { hidden } = useScrollState(24);

  return (
    <nav
      aria-label="Atalhos"
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-hair bg-background pb-[env(safe-area-inset-bottom)] lg:hidden",
        "transition-transform duration-300 ease-poster",
        hidden && "translate-y-full",
      )}
    >
      <ul className="grid h-16 grid-cols-5">
        {bottomNav.map((item) => {
          const Icon = icons[item.key];
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-full flex-col items-center justify-center gap-1 font-sans text-[0.6875rem]",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {active ? (
                  <span aria-hidden className="absolute inset-x-4 top-0 h-0.5 bg-brand" />
                ) : null}
                <Icon className="size-5" aria-hidden strokeWidth={1.5} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
