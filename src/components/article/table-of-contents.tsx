"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  text: string;
  depth: 2 | 3;
}

/** Acompanha qual seção está na tela (a mais próxima do topo). */
function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const headings = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visiveis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visiveis[0]) setActive(visiveis[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

function TocList({
  items,
  active,
  onNavigate,
}: {
  items: TocItem[];
  active: string;
  onNavigate?: () => void;
}) {
  return (
    <ol className="flex flex-col">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            onClick={onNavigate}
            aria-current={active === item.id ? "location" : undefined}
            className={cn(
              "-ml-px block border-l py-1.5 text-sm leading-snug transition-colors",
              item.depth === 3 ? "pl-7" : "pl-4",
              active === item.id
                ? "border-brand text-foreground"
                : "border-hair text-muted-foreground hover:text-foreground",
            )}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Sumário fixo ao lado do texto (desktop). */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const active = useActiveHeading(items.map((i) => i.id));
  if (!items.length) return null;
  return (
    <nav aria-label="Neste artigo">
      <p className="mb-3 text-meta text-muted-foreground">Neste artigo</p>
      <TocList items={items} active={active} />
    </nav>
  );
}

/** Sumário recolhível antes do texto (celular e tablet). */
export function TableOfContentsMobile({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);
  const active = useActiveHeading(items.map((i) => i.id));
  if (!items.length) return null;
  return (
    <nav aria-label="Neste artigo" className="border-y border-hair">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-full cursor-pointer items-center justify-between text-sm font-medium"
      >
        Neste artigo
        <ChevronDown
          className={cn("size-4 transition-transform", open && "rotate-180")}
          strokeWidth={1.5}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="pb-4">
          <TocList items={items} active={active} onNavigate={() => setOpen(false)} />
        </div>
      ) : null}
    </nav>
  );
}
