"use client";

import { SlidersHorizontal } from "lucide-react";
import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { useId, useLayoutEffect, useMemo, useRef } from "react";

import { ActiveFilters } from "@/components/filters/active-filters";
import { FacetPopover, type FacetOption } from "@/components/filters/facet-popover";
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
import { Input } from "@/components/ui/input";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { gsap } from "@/lib/gsap";

import { ArtistCard, type ArtistCardData } from "./artist-card";

import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

export interface ArtistListItem extends ArtistCardData {
  linguagemSlugs: string[];
  regiao: string;
  temaSlugs: string[];
  publicadoEm: string;
}

type Dim = "linguagem" | "regiao" | "tema";

const lista = parseAsArrayOf(parseAsString).withDefault([]);
const parsers = {
  q: parseAsString.withDefault("").withOptions({ throttleMs: 250 }),
  linguagem: lista,
  regiao: lista,
  tema: lista,
  ordem: parseAsStringLiteral(["recentes", "az"] as const).withDefault("recentes"),
};

const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

interface Props {
  artists: ArtistListItem[];
  facets: Record<Dim, { label: string; options: { value: string; label: string }[] }>;
}

/** Lista de artistas com busca, filtros na URL, ordenação e reorganização com Flip. */
export function ArtistsExplorer({ artists, facets }: Props) {
  const [f, setF] = useQueryStates(parsers, { history: "replace", scroll: false });
  const reduceMotion = usePrefersReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const id = useId();

  const valoresDe = (a: ArtistListItem, dim: Dim) =>
    dim === "linguagem" ? a.linguagemSlugs : dim === "regiao" ? [a.regiao] : a.temaSlugs;

  const passa = (a: ArtistListItem, exceto?: Dim) =>
    (!f.q || normalizar(`${a.nome} ${a.local}`).includes(normalizar(f.q))) &&
    (["linguagem", "regiao", "tema"] as Dim[]).every(
      (dim) =>
        dim === exceto || !f[dim].length || valoresDe(a, dim).some((v) => f[dim].includes(v)),
    );

  const visiveis = new Set(artists.filter((a) => passa(a)).map((a) => a.slug));
  const ordenados = useMemo(
    () =>
      [...artists].sort((a, b) =>
        f.ordem === "az"
          ? a.nome.localeCompare(b.nome, "pt-BR")
          : b.publicadoEm.localeCompare(a.publicadoEm),
      ),
    [artists, f.ordem],
  );

  const opcoes = (dim: Dim): FacetOption[] =>
    facets[dim].options.map((o) => ({
      ...o,
      count: artists.filter((a) => passa(a, dim) && valoresDe(a, dim).includes(o.value)).length,
    }));

  function update(patch: Partial<typeof f>) {
    if (!reduceMotion && gridRef.current)
      flipState.current = Flip.getState(gridRef.current.querySelectorAll("[data-flip-id]"));
    void setF(patch);
  }

  const toggle = (dim: Dim, value: string) =>
    update({
      [dim]: f[dim].includes(value) ? f[dim].filter((v) => v !== value) : [...f[dim], value],
    });

  const layoutKey = `${[...visiveis].join(",")}|${f.ordem}`;
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !gridRef.current) return;
    flipState.current = null;
    Flip.from(state, {
      targets: gridRef.current.querySelectorAll("[data-flip-id]"),
      duration: 0.6,
      ease: "poster",
      absolute: true,
      onEnter: (els) =>
        gsap.fromTo(els, { autoAlpha: 0, scale: 0.95 }, { autoAlpha: 1, scale: 1, duration: 0.4 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.95, duration: 0.3 }),
    });
  }, [layoutKey]);

  const ativos = (["linguagem", "regiao", "tema"] as Dim[]).flatMap((dim) =>
    f[dim].map((value) => ({
      key: dim,
      value,
      label: facets[dim].options.find((o) => o.value === value)?.label ?? value,
    })),
  );
  const limpar = () => update({ linguagem: [], regiao: [], tema: [], q: "" });
  const total = visiveis.size;

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-hair pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor={`${id}-q`} className="sr-only">
            Buscar artista por nome ou cidade
          </label>
          <Input
            id={`${id}-q`}
            type="search"
            value={f.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Buscar por nome ou cidade"
            className="h-10 w-full sm:w-72"
          />
          <div className="hidden flex-wrap items-center gap-2 lg:flex">
            {(["linguagem", "regiao", "tema"] as Dim[]).map((dim) => (
              <FacetPopover
                key={dim}
                label={facets[dim].label}
                options={opcoes(dim)}
                selected={f[dim]}
                onToggle={(v) => toggle(dim, v)}
              />
            ))}
          </div>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <SlidersHorizontal aria-hidden strokeWidth={1.5} />
                Filtrar{ativos.length ? ` (${ativos.length})` : ""}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filtrar artistas</DrawerTitle>
                <DrawerDescription>Combine linguagem, região e tema.</DrawerDescription>
              </DrawerHeader>
              <DrawerBody>
                {(["linguagem", "regiao", "tema"] as Dim[]).map((dim) => (
                  <fieldset key={dim} className="mb-6">
                    <legend className="mb-2 text-meta text-muted-foreground">
                      {facets[dim].label}
                    </legend>
                    <ul className="flex flex-col">
                      {opcoes(dim).map((o) => (
                        <li key={o.value} className="flex min-h-11 items-center gap-3">
                          <Checkbox
                            id={`${id}-${dim}-${o.value}`}
                            checked={f[dim].includes(o.value)}
                            onCheckedChange={() => toggle(dim, o.value)}
                          />
                          <label htmlFor={`${id}-${dim}-${o.value}`} className="flex-1 text-sm">
                            {o.label}
                          </label>
                          <span className="text-meta text-muted-foreground tabular-nums">
                            {o.count}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </fieldset>
                ))}
              </DrawerBody>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button className="w-full">
                    Ver {total} {total === 1 ? "artista" : "artistas"}
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <div className="ml-auto flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Ordenar
              <select
                value={f.ordem}
                onChange={(e) => update({ ordem: e.target.value as "recentes" | "az" })}
                className="h-10 cursor-pointer border border-hair bg-background px-2 text-sm text-foreground"
              >
                <option value="recentes">Mais recentes</option>
                <option value="az">A–Z</option>
              </select>
            </label>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              <span className="font-medium text-foreground tabular-nums">{total}</span>{" "}
              {total === 1 ? "artista" : "artistas"}
            </p>
          </div>
        </div>
        <ActiveFilters
          items={ativos}
          onRemove={(i) => toggle(i.key as Dim, i.value)}
          onClear={limpar}
        />
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-x-[clamp(16px,2vw,32px)] gap-y-12 pt-stack sm:grid-cols-2 lg:grid-cols-4"
      >
        {ordenados.map((a) => (
          <div key={a.slug} data-flip-id={a.slug} hidden={!visiveis.has(a.slug)}>
            <ArtistCard artist={a} />
          </div>
        ))}
      </div>
      {total === 0 ? (
        <div className="flex flex-col items-start gap-4 py-16">
          <p className="font-display text-h3">Nenhum artista com esses filtros</p>
          <Button variant="outline" onClick={limpar}>
            Limpar tudo
          </Button>
        </div>
      ) : null}
    </div>
  );
}
