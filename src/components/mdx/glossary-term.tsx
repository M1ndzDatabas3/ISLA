"use client";

import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface GlossaryTermProps {
  termo: string;
  definicao: string;
  href: string;
  children: React.ReactNode;
}

/** Termo do glossário dentro do texto: sublinhado pontilhado que abre a definição curta. */
export function GlossaryTerm({ termo, definicao, href, children }: GlossaryTermProps) {
  return (
    <Popover>
      <PopoverTrigger className="cursor-help text-left underline decoration-brand-text decoration-dotted decoration-1 underline-offset-4 transition-colors hover:text-brand-text">
        {children}
      </PopoverTrigger>
      <PopoverContent>
        <p className="font-display text-lg">{termo}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{definicao}</p>
        <Link href={href} className="link-underline mt-4 inline-block text-sm font-medium">
          Ler o verbete
        </Link>
      </PopoverContent>
    </Popover>
  );
}
