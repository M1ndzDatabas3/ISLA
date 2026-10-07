"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { useEffect, useId, useState } from "react";

import { loadSearchProvider } from "@/lib/search/fuse-provider";
import { typeLabels, type SearchDocType, type SearchResult } from "@/lib/search/types";
import { cn } from "@/lib/utils";

const tipos = [
  "todos",
  "artigo",
  "livro",
  "autor",
  "verbete",
  "trilha",
  "marco",
  "artista",
  "obra",
  "classico",
] as const;

/** Página de busca: consulta e tipo na URL, resultados agrupados. */
export function SearchPageView() {
  const id = useId();
  const [{ q, tipo }, setParams] = useQueryStates(
    {
      q: parseAsString.withDefault("").withOptions({ throttleMs: 250 }),
      tipo: parseAsStringLiteral(tipos).withDefault("todos"),
    },
    { history: "replace", clearOnDefault: true },
  );
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let ativo = true;
    loadSearchProvider()
      .then((p) => p.search(q, { limit: 60 }))
      .then((r) => ativo && setResults(r))
      .catch(() => ativo && setErro(true));
    return () => {
      ativo = false;
    };
  }, [q]);

  const filtrados = (results ?? []).filter(
    (r) => r.type !== "secao" && (tipo === "todos" || r.type === tipo),
  );
  const contagem = (t: SearchDocType) => (results ?? []).filter((r) => r.type === t).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="relative">
        <label htmlFor={id} className="sr-only">
          Buscar no site
        </label>
        <Search
          className="pointer-events-none absolute top-1/2 left-0 size-5 -translate-y-1/2 text-muted-foreground"
          strokeWidth={1.5}
          aria-hidden
        />
        <input
          id={id}
          type="search"
          enterKeyHint="search"
          autoFocus
          value={q}
          onChange={(e) => void setParams({ q: e.target.value })}
          placeholder="Buscar artigos, livros, autores, verbetes e trilhas"
          className="h-16 w-full border-b border-foreground bg-transparent pr-12 pl-9 font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] outline-none placeholder:text-muted-foreground"
        />
        {q ? (
          <button
            type="button"
            onClick={() => void setParams({ q: "" })}
            aria-label="Limpar busca"
            className="absolute top-1/2 right-0 inline-flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-5" strokeWidth={1.5} aria-hidden />
          </button>
        ) : null}
      </div>

      <div role="group" aria-label="Tipo de resultado" className="flex flex-wrap gap-2">
        {tipos.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tipo === t}
            onClick={() => void setParams({ tipo: t })}
            className="inline-flex h-9 cursor-pointer items-center gap-2 border border-hair px-3 text-sm transition-colors hover:border-foreground aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background"
          >
            {t === "todos" ? "Todos" : typeLabels[t].plural}
            {q && t !== "todos" ? (
              <span className="tabular-nums opacity-70">{contagem(t)}</span>
            ) : null}
          </button>
        ))}
      </div>

      {erro ? (
        <p className="text-muted-foreground">
          Não foi possível carregar a busca. Tente recarregar a página.
        </p>
      ) : null}

      {!q.trim() ? (
        <p className="text-muted-foreground">
          Digite um termo: um conceito, um título, o nome de um autor.
        </p>
      ) : results && !filtrados.length ? (
        <p className="text-muted-foreground">Nada encontrado para “{q}”. Tente outra palavra.</p>
      ) : (
        <ul aria-live="polite">
          {filtrados.map((r) => (
            <li key={r.id}>
              <Link
                href={r.href}
                className="group grid gap-1 border-t border-hair py-5 sm:grid-cols-[8rem_1fr] sm:gap-6"
              >
                <span className="text-meta text-muted-foreground">
                  {typeLabels[r.type].singular}
                </span>
                <span>
                  <span
                    className={cn(
                      "block font-display text-[1.375rem] leading-tight transition-colors group-hover:text-brand-text",
                    )}
                  >
                    {r.title}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{r.subtitle}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
