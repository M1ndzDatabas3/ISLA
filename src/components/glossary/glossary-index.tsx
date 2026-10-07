"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useId, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export interface GlossaryEntry {
  slug: string;
  termo: string;
  definicaoCurta: string;
}

const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/** Índice de A a Z fixo e busca instantânea por termo ou definição. */
export function GlossaryIndex({ entries }: { entries: GlossaryEntry[] }) {
  const id = useId();
  const [query, setQuery] = useState("");

  const filtrados = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return entries;
    return entries.filter((e) => normalize(`${e.termo} ${e.definicaoCurta}`).includes(q));
  }, [entries, query]);

  const grupos = useMemo(() => {
    const map = new Map<string, GlossaryEntry[]>();
    for (const e of filtrados) {
      const letra = normalize(e.termo)[0]!.toUpperCase();
      map.set(letra, [...(map.get(letra) ?? []), e]);
    }
    return map;
  }, [filtrados]);

  return (
    <div className="grid-page items-start gap-y-8">
      <div className="col-span-12 flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:col-span-3">
        <div className="relative">
          <label htmlFor={id} className="sr-only">
            Buscar no glossário
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden
          />
          <input
            id={id}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar um conceito"
            className="h-12 w-full border-b border-input bg-transparent pr-2 pl-7 text-base outline-none placeholder:text-muted-foreground focus-visible:border-foreground"
          />
        </div>
        <nav aria-label="Letras" className="flex flex-wrap gap-1 lg:max-w-[15rem]">
          {LETRAS.map((letra) => {
            const ativa = grupos.has(letra);
            return ativa ? (
              <a
                key={letra}
                href={`#letra-${letra}`}
                className="inline-flex size-9 items-center justify-center border border-hair text-sm font-medium transition-colors hover:border-foreground"
              >
                {letra}
              </a>
            ) : (
              <span
                key={letra}
                aria-hidden
                className="inline-flex size-9 items-center justify-center text-sm text-muted-foreground/50"
              >
                {letra}
              </span>
            );
          })}
        </nav>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          <span className="font-medium text-foreground tabular-nums">{filtrados.length}</span>{" "}
          {filtrados.length === 1 ? "verbete" : "verbetes"}
        </p>
      </div>

      <div className="col-span-12 lg:col-span-8 lg:col-start-5">
        {filtrados.length === 0 ? (
          <p className="py-10 text-muted-foreground">
            Nenhum verbete encontrado. Tente outra palavra.
          </p>
        ) : null}
        {[...grupos.entries()].map(([letra, itens]) => (
          <section
            key={letra}
            id={`letra-${letra}`}
            aria-labelledby={`h-letra-${letra}`}
            className="scroll-mt-[calc(var(--header-h)+24px)] pb-10"
          >
            <h2 id={`h-letra-${letra}`} className="mb-2 font-display text-h2 text-brand-text">
              {letra}
            </h2>
            <ul>
              {itens.map((e) => (
                <li key={e.slug}>
                  <Link
                    href={`/glossario/${e.slug}`}
                    className="group grid gap-1 border-t border-hair py-5 sm:grid-cols-[14rem_1fr] sm:gap-8"
                  >
                    <span
                      className={cn(
                        "font-display text-[1.375rem] leading-tight transition-colors group-hover:text-brand-text",
                      )}
                    >
                      {e.termo}
                    </span>
                    <span className="text-[0.95rem] leading-relaxed text-muted-foreground">
                      {e.definicaoCurta}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
