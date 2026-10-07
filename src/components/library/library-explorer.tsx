"use client";

import Fuse from "fuse.js";
import { Flip } from "gsap/Flip";
import { LayoutGrid, Link2, List, Search, SlidersHorizontal, X } from "lucide-react";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
  type inferParserType,
} from "nuqs";
import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";

import { BookCard } from "@/components/editorial/book-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/sonner";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { toBookCard, type BookSummary } from "@/lib/content/summaries";
import { gsap } from "@/lib/gsap";
import {
  areas,
  disponibilidades,
  levelIndex,
  niveis,
  regioes,
  tiposDeObra,
  tradicoes,
} from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

gsap.registerPlugin(Flip);

/* ------------------------------- Estado na URL ------------------------------- */

const lista = parseAsArrayOf(parseAsString).withDefault([]);
const ordens = ["relevancia", "recentes", "titulo", "nivel"] as const;
const vistas = ["grade", "lista"] as const;

const queryParsers = {
  q: parseAsString.withDefault("").withOptions({ throttleMs: 250 }),
  tradicao: lista,
  area: lista,
  regiao: lista,
  nivel: lista,
  tipo: lista,
  disponibilidade: lista,
  autor: lista,
  de: parseAsInteger,
  ate: parseAsInteger,
  ordem: parseAsStringLiteral(ordens).withDefault("relevancia"),
  vista: parseAsStringLiteral(vistas).withDefault("grade"),
};

type Filters = inferParserType<typeof queryParsers>;

/** Dimensões da taxonomia, na ordem da barra de filtros. */
const dimensoes = [
  {
    key: "tradicao",
    label: "Tradição",
    terms: tradicoes,
    values: (b: BookSummary) => b.tradicoes as string[],
  },
  { key: "area", label: "Área", terms: areas, values: (b: BookSummary) => b.areas },
  { key: "regiao", label: "Região", terms: regioes, values: (b: BookSummary) => b.regioes },
  { key: "nivel", label: "Nível de leitura", terms: niveis, values: (b: BookSummary) => [b.nivel] },
  {
    key: "tipo",
    label: "Tipo de obra",
    terms: tiposDeObra,
    values: (b: BookSummary) => [b.tipoDeObra],
  },
  {
    key: "disponibilidade",
    label: "Disponibilidade",
    terms: disponibilidades,
    values: (b: BookSummary) => b.disponibilidade as string[],
  },
] as const;

type DimKey = (typeof dimensoes)[number]["key"] | "autor";

const ordemLabel: Record<(typeof ordens)[number], string> = {
  relevancia: "Relevância",
  recentes: "Mais recentes",
  titulo: "Título, A a Z",
  nivel: "Nível de leitura",
};

const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });

interface LibraryExplorerProps {
  books: BookSummary[];
  authors: { slug: string; nome: string }[];
}

export function LibraryExplorer({ books, authors }: LibraryExplorerProps) {
  const [filters, setFilters] = useQueryStates(queryParsers, {
    history: "replace",
    shallow: true,
    clearOnDefault: true,
  });
  const reduceMotion = usePrefersReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const anos = useMemo(() => {
    const valores = books.map((b) => b.ano);
    return { min: Math.min(...valores), max: Math.max(...valores) };
  }, [books]);

  const fuse = useMemo(
    () =>
      new Fuse(books, {
        keys: [
          { name: "titulo", weight: 3 },
          { name: "tituloOriginal", weight: 1 },
          { name: "autores", weight: 2 },
          { name: "sinopse", weight: 1 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [books],
  );

  /** Livro passa nos filtros (opcionalmente ignorando uma dimensão, para as contagens). */
  const matches = (book: BookSummary, f: Filters, except?: DimKey) => {
    for (const dim of dimensoes) {
      if (dim.key === except) continue;
      const selecionados = f[dim.key];
      if (selecionados.length && !dim.values(book).some((v) => selecionados.includes(v)))
        return false;
    }
    if (except !== "autor" && f.autor.length && !book.autorSlugs.some((s) => f.autor.includes(s)))
      return false;
    if (f.de !== null && book.ano < f.de) return false;
    if (f.ate !== null && book.ano > f.ate) return false;
    return true;
  };

  const searchHits = useMemo(() => {
    const q = filters.q.trim();
    if (!q) return null;
    return new Map(fuse.search(q).map((r, i) => [r.item.slug, i]));
  }, [filters.q, fuse]);

  const { ordered, visible } = useMemo(() => {
    const visiveis = books.filter(
      (b) => matches(b, filters) && (!searchHits || searchHits.has(b.slug)),
    );
    const sorter = (a: BookSummary, b: BookSummary) => {
      switch (filters.ordem) {
        case "recentes":
          return b.ano - a.ano;
        case "titulo":
          return collator.compare(a.titulo, b.titulo);
        case "nivel":
          return levelIndex(a.nivel) - levelIndex(b.nivel) || collator.compare(a.titulo, b.titulo);
        default:
          if (searchHits) return (searchHits.get(a.slug) ?? 999) - (searchHits.get(b.slug) ?? 999);
          return Number(b.destaque) - Number(a.destaque) || collator.compare(a.titulo, b.titulo);
      }
    };
    const set = new Set(visiveis.map((b) => b.slug));
    // Os visíveis primeiro, na ordem pedida; os ocultos ficam no DOM para o Flip animar a saída.
    const ordenados = [...visiveis.sort(sorter), ...books.filter((b) => !set.has(b.slug))];
    return { ordered: ordenados, visible: set };
  }, [books, filters, searchHits]);

  /** Contagem por opção, considerando os demais filtros. */
  const counts = useMemo(() => {
    const result: Record<string, Record<string, number>> = {};
    for (const dim of dimensoes) {
      const base = books.filter(
        (b) => matches(b, filters, dim.key) && (!searchHits || searchHits.has(b.slug)),
      );
      result[dim.key] = {};
      for (const b of base)
        for (const v of dim.values(b)) result[dim.key]![v] = (result[dim.key]![v] ?? 0) + 1;
    }
    const baseAutor = books.filter(
      (b) => matches(b, filters, "autor") && (!searchHits || searchHits.has(b.slug)),
    );
    result.autor = {};
    for (const b of baseAutor)
      for (const s of b.autorSlugs) result.autor[s] = (result.autor[s] ?? 0) + 1;
    return result;
  }, [books, filters, searchHits]);

  /** Guarda as posições antes de qualquer mudança, para o Flip animar depois. */
  function update(patch: Partial<Filters>) {
    if (!reduceMotion && gridRef.current) {
      flipState.current = Flip.getState(gridRef.current.querySelectorAll("[data-flip-id]"));
    }
    void setFilters(patch);
  }

  const layoutKey = `${[...visible].join(",")}|${ordered.map((b) => b.slug).join(",")}|${filters.vista}`;

  useLayoutEffect(() => {
    const state = flipState.current;
    const grid = gridRef.current;
    if (!state || !grid) return;
    flipState.current = null;
    Flip.from(state, {
      targets: grid.querySelectorAll("[data-flip-id]"),
      duration: 0.6,
      ease: "poster",
      absolute: true,
      nested: true,
      onEnter: (els) =>
        gsap.fromTo(els, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.45 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.94, duration: 0.3 }),
    });
  }, [layoutKey]);

  const toggleValue = (key: DimKey, value: string) => {
    const atual = filters[key];
    update({
      [key]: atual.includes(value) ? atual.filter((v) => v !== value) : [...atual, value],
    } as Partial<Filters>);
  };

  const ativos = [
    ...dimensoes.flatMap((dim) =>
      filters[dim.key].map((value) => ({
        key: dim.key as DimKey,
        value,
        label: dim.terms.find((t) => t.slug === value)?.label ?? value,
      })),
    ),
    ...filters.autor.map((value) => ({
      key: "autor" as DimKey,
      value,
      label: authors.find((a) => a.slug === value)?.nome ?? value,
    })),
  ];
  const temPeriodo = filters.de !== null || filters.ate !== null;
  const totalAtivos = ativos.length + (temPeriodo ? 1 : 0) + (filters.q ? 1 : 0);

  function limparTudo() {
    update({
      q: "",
      tradicao: [],
      area: [],
      regiao: [],
      nivel: [],
      tipo: [],
      disponibilidade: [],
      autor: [],
      de: null,
      ate: null,
    });
  }

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado", { description: "Quem abrir verá a mesma seleção de livros." });
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  }

  const panel = (
    <FilterPanel
      filters={filters}
      counts={counts}
      authors={authors}
      anos={anos}
      onToggle={toggleValue}
      onPeriodo={(de, ate) =>
        update({ de: de === anos.min ? null : de, ate: ate === anos.max ? null : ate })
      }
    />
  );

  return (
    <div className="grid-page items-start gap-y-8">
      <aside aria-label="Filtros" className="hidden lg:col-span-3 lg:block">
        <div
          data-lenis-prevent
          className="sticky top-[calc(var(--header-h)+24px)] max-h-[calc(100dvh-var(--header-h)-48px)] overflow-y-auto pr-4 pb-8"
        >
          {panel}
        </div>
      </aside>

      <div className="col-span-12 min-w-0 lg:col-span-9">
        {/* Barra de ferramentas */}
        <div className="flex flex-col gap-4 border-b border-hair pb-5">
          <div className="flex items-center gap-3">
            <SearchField value={filters.q} onChange={(q) => update({ q })} />
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="shrink-0 lg:hidden">
                  <SlidersHorizontal aria-hidden strokeWidth={1.5} />
                  Filtrar{totalAtivos ? ` (${totalAtivos})` : ""}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Filtrar livros</DrawerTitle>
                  <DrawerDescription>
                    Combine tradição, área, região, nível e período.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerBody>{panel}</DrawerBody>
                <DrawerFooter>
                  <Button variant="link" onClick={limparTudo}>
                    Limpar tudo
                  </Button>
                  <DrawerClose asChild>
                    <Button className="flex-1">
                      Ver {visible.size} {visible.size === 1 ? "livro" : "livros"}
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              <span className="font-medium text-foreground tabular-nums">{visible.size}</span>{" "}
              {visible.size === 1 ? "livro" : "livros"}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                Ordenar por
                <select
                  value={filters.ordem}
                  onChange={(e) => update({ ordem: e.target.value as Filters["ordem"] })}
                  className="h-10 cursor-pointer border border-hair bg-background px-2 text-foreground transition-colors hover:border-foreground"
                >
                  {ordens.map((o) => (
                    <option key={o} value={o}>
                      {ordemLabel[o]}
                    </option>
                  ))}
                </select>
              </label>
              <div role="group" aria-label="Visualização" className="inline-flex gap-1">
                {vistas.map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={filters.vista === v}
                    onClick={() => update({ vista: v })}
                    className="inline-flex size-10 cursor-pointer items-center justify-center border border-hair text-muted-foreground transition-colors hover:text-foreground aria-pressed:border-foreground aria-pressed:text-foreground"
                  >
                    {v === "grade" ? (
                      <LayoutGrid className="size-4" strokeWidth={1.5} aria-hidden />
                    ) : (
                      <List className="size-4" strokeWidth={1.5} aria-hidden />
                    )}
                    <span className="sr-only">
                      {v === "grade" ? "Grade de capas" : "Lista detalhada"}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={copiarLink}
                className="inline-flex h-10 cursor-pointer items-center gap-2 text-sm transition-colors hover:text-brand-text"
              >
                <Link2 className="size-4" strokeWidth={1.5} aria-hidden />
                Copiar link desta seleção
              </button>
            </div>
          </div>

          {totalAtivos ? (
            <ul aria-label="Filtros ativos" className="flex flex-wrap items-center gap-2">
              {filters.q ? (
                <ActiveChip label={`Busca: ${filters.q}`} onRemove={() => update({ q: "" })} />
              ) : null}
              {ativos.map((a) => (
                <ActiveChip
                  key={`${a.key}-${a.value}`}
                  label={a.label}
                  onRemove={() => toggleValue(a.key, a.value)}
                />
              ))}
              {temPeriodo ? (
                <ActiveChip
                  label={`De ${filters.de ?? anos.min} a ${filters.ate ?? anos.max}`}
                  onRemove={() => update({ de: null, ate: null })}
                />
              ) : null}
              <li>
                <button
                  type="button"
                  onClick={limparTudo}
                  className="ml-1 h-8 cursor-pointer text-sm font-medium underline underline-offset-4 hover:text-brand-text"
                >
                  Limpar tudo
                </button>
              </li>
            </ul>
          ) : null}
        </div>

        {/* Resultados */}
        <div
          ref={gridRef}
          className={cn(
            "pt-8",
            filters.vista === "grade"
              ? "grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 xl:grid-cols-4"
              : "flex flex-col",
          )}
        >
          {ordered.map((book) => (
            <div key={book.slug} data-flip-id={book.slug} hidden={!visible.has(book.slug)}>
              <BookCard
                book={toBookCard(book)}
                variant={filters.vista === "grade" ? "grid" : "list"}
              />
            </div>
          ))}
        </div>

        {visible.size === 0 ? (
          <div className="flex flex-col items-start gap-4 py-16">
            <p className="font-display text-h3">Nenhum livro com esses filtros</p>
            <p className="max-w-[48ch] text-muted-foreground">
              Tire algum filtro ou busque por outro termo. A biblioteca cresce a cada mês.
            </p>
            <Button variant="outline" onClick={limparTudo}>
              Limpar tudo
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------- Peças menores ------------------------------- */

function SearchField({ value, onChange }: { value: string; onChange: (q: string) => void }) {
  const id = useId();
  const [local, setLocal] = useState(value);
  const [synced, setSynced] = useState(value);
  // Acompanha mudanças externas (ex.: "Limpar tudo") sem perder o que está sendo digitado.
  if (value !== synced) {
    setSynced(value);
    setLocal(value);
  }

  return (
    <div className="relative flex-1">
      <label htmlFor={id} className="sr-only">
        Buscar por título, autor ou tema
      </label>
      <Search
        className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-muted-foreground"
        strokeWidth={1.5}
        aria-hidden
      />
      <input
        id={id}
        type="search"
        value={local}
        onChange={(e) => {
          setLocal(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Buscar por título, autor ou tema"
        className="h-12 w-full border-b border-input bg-transparent pr-2 pl-7 text-base outline-none placeholder:text-muted-foreground focus-visible:border-foreground"
      />
    </div>
  );
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex h-8 cursor-pointer items-center gap-1.5 border border-foreground bg-foreground px-3 text-[0.8125rem] text-background transition-colors hover:border-brand hover:bg-brand hover:text-brand-foreground"
      >
        {label}
        <X className="size-3.5" aria-hidden />
        <span className="sr-only">Remover filtro</span>
      </button>
    </li>
  );
}

interface FilterPanelProps {
  filters: Filters;
  counts: Record<string, Record<string, number>>;
  authors: { slug: string; nome: string }[];
  anos: { min: number; max: number };
  onToggle: (key: DimKey, value: string) => void;
  onPeriodo: (de: number, ate: number) => void;
}

function FilterPanel({ filters, counts, authors, anos, onToggle, onPeriodo }: FilterPanelProps) {
  const id = useId();
  const [todosAutores, setTodosAutores] = useState(false);
  const [periodo, setPeriodo] = useState<[number, number]>([
    filters.de ?? anos.min,
    filters.ate ?? anos.max,
  ]);
  const [periodoSync, setPeriodoSync] = useState(`${filters.de}-${filters.ate}`);
  if (`${filters.de}-${filters.ate}` !== periodoSync) {
    setPeriodoSync(`${filters.de}-${filters.ate}`);
    setPeriodo([filters.de ?? anos.min, filters.ate ?? anos.max]);
  }

  const autoresComLivro = authors.filter(
    (a) => (counts.autor?.[a.slug] ?? 0) > 0 || filters.autor.includes(a.slug),
  );
  const autoresVisiveis = todosAutores ? autoresComLivro : autoresComLivro.slice(0, 8);

  return (
    <Accordion type="multiple" defaultValue={["tradicao", "area", "nivel"]}>
      {dimensoes.map((dim) => {
        const opcoes = dim.terms.filter(
          (t) => (counts[dim.key]?.[t.slug] ?? 0) > 0 || filters[dim.key].includes(t.slug),
        );
        if (!opcoes.length) return null;
        return (
          <AccordionItem key={dim.key} value={dim.key}>
            <AccordionTrigger className="py-4 font-sans text-sm font-medium tracking-normal">
              <span>
                {dim.label}
                {filters[dim.key].length ? (
                  <span className="ml-2 text-brand-text tabular-nums">
                    {filters[dim.key].length}
                  </span>
                ) : null}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <ul className="flex flex-col gap-1">
                {opcoes.map((t) => (
                  <OptionRow
                    key={t.slug}
                    id={`${id}-${dim.key}-${t.slug}`}
                    label={t.label}
                    count={counts[dim.key]?.[t.slug] ?? 0}
                    checked={filters[dim.key].includes(t.slug)}
                    onChange={() => onToggle(dim.key, t.slug)}
                  />
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        );
      })}

      <AccordionItem value="autor">
        <AccordionTrigger className="py-4 font-sans text-sm font-medium tracking-normal">
          <span>
            Autor
            {filters.autor.length ? (
              <span className="ml-2 text-brand-text tabular-nums">{filters.autor.length}</span>
            ) : null}
          </span>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <ul className="flex flex-col gap-1">
            {autoresVisiveis.map((a) => (
              <OptionRow
                key={a.slug}
                id={`${id}-autor-${a.slug}`}
                label={a.nome}
                count={counts.autor?.[a.slug] ?? 0}
                checked={filters.autor.includes(a.slug)}
                onChange={() => onToggle("autor", a.slug)}
              />
            ))}
          </ul>
          {autoresComLivro.length > 8 ? (
            <button
              type="button"
              onClick={() => setTodosAutores((v) => !v)}
              className="mt-3 cursor-pointer text-sm underline underline-offset-4 hover:text-brand-text"
            >
              {todosAutores ? "Mostrar menos" : `Mostrar todos (${autoresComLivro.length})`}
            </button>
          ) : null}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="periodo">
        <AccordionTrigger className="py-4 font-sans text-sm font-medium tracking-normal">
          Período de publicação
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <p className="mb-2 text-sm tabular-nums" aria-live="polite">
            {periodo[0]} a {periodo[1]}
          </p>
          <Slider
            min={anos.min}
            max={anos.max}
            step={1}
            value={periodo}
            minStepsBetweenThumbs={0}
            onValueChange={(v) => setPeriodo([v[0]!, v[1]!])}
            onValueCommit={(v) => onPeriodo(v[0]!, v[1]!)}
            aria-label="Período de publicação"
          />
          <div className="flex justify-between text-meta text-muted-foreground tabular-nums">
            <span>{anos.min}</span>
            <span>{anos.max}</span>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function OptionRow({
  id,
  label,
  count,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <li className="flex min-h-9 items-center gap-3">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <Label
        htmlFor={id}
        className={cn(
          "flex-1 cursor-pointer text-sm font-normal",
          count === 0 && !checked && "text-muted-foreground",
        )}
      >
        {label}
      </Label>
      <span className="text-meta text-muted-foreground tabular-nums">{count}</span>
    </li>
  );
}
