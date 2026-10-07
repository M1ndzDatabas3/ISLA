"use client";

import { Popover as PopoverPrimitive } from "radix-ui";
import { useEffect, useRef, useState } from "react";

/**
 * Melhora progressiva das notas de rodapé do GFM: sem JS, a nota é uma âncora
 * para o fim do texto; com JS, abre num popover ao lado do número, com link
 * para a lista completa de notas.
 */
export function FootnotePopovers({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLElement | null>(null);
  const [note, setNote] = useState<{ html: string; id: string; label: string } | null>(null);

  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[data-footnote-ref]");
      if (!link) return;
      const id = decodeURIComponent(link.hash.slice(1));
      const item = document.getElementById(id);
      if (!item) return;
      event.preventDefault();
      const clone = item.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("[data-footnote-backref]").forEach((el) => el.remove());
      anchor.current = link;
      setNote({ html: clone.innerHTML, id, label: link.textContent ?? "" });
    };
    container.addEventListener("click", onClick);
    return () => container.removeEventListener("click", onClick);
  }, []);

  return (
    <div ref={root}>
      {children}
      <PopoverPrimitive.Root open={note !== null} onOpenChange={(open) => !open && setNote(null)}>
        <PopoverPrimitive.Anchor
          virtualRef={{
            current: {
              getBoundingClientRect: () => anchor.current?.getBoundingClientRect() ?? new DOMRect(),
            },
          }}
        />
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            side="top"
            align="center"
            sideOffset={8}
            collisionPadding={16}
            className="z-50 w-[min(24rem,calc(100vw-32px))] border border-hair bg-popover p-5 text-sm leading-relaxed text-popover-foreground shadow-overlay data-[state=open]:animate-in data-[state=open]:fade-in-0"
          >
            <p className="mb-2 text-meta text-muted-foreground">Nota {note?.label}</p>
            {note ? (
              <div
                className="[&_a]:text-brand-text [&_a]:underline [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: note.html }}
              />
            ) : null}
            <a
              href={`#${note?.id ?? ""}`}
              onClick={() => setNote(null)}
              className="link-underline mt-3 inline-block text-meta"
            >
              Ver todas as notas
            </a>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}
