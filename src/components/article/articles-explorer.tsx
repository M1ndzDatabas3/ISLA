"use client";

import { parseAsArrayOf, parseAsString, useQueryStates, type inferParserType } from "nuqs";
import { useMemo } from "react";

import { ArticleCard, type ArticleCardData } from "@/components/editorial/article-card";
import { ActiveFilters, type ActiveFilter } from "@/components/filters/active-filters";
import { FacetPopover } from "@/components/filters/facet-popover";
import { Button } from "@/components/ui/button";
import { areas, niveis, regioes, tiposDeArtigo, tradicoes } from "@/lib/taxonomy";

export interface ArticleListItem extends ArticleCardData {
  slug: string;
  tradicoes: string[];
  areas: string[];
  regioes: string[];
  tipoSlug: string;
  nivelSlug: string;
}

const lista = parseAsArrayOf(parseAsString).withDefault([]);
const parsers = { tradicao: lista, area: lista, regiao: lista, tipo: lista, nivel: lista };
type Filters = inferParserType<typeof parsers>;

const dimensoes = [
  { key: "area", label: "Área", terms: areas, values: (a: ArticleListItem) => a.areas },
  {
    key: "tradicao",
    label: "Tradição",
    terms: tradicoes,
    values: (a: ArticleListItem) => a.tradicoes,
  },
  { key: "regiao", label: "Região", terms: regioes, values: (a: ArticleListItem) => a.regioes },
  {
    key: "tipo",
    label: "Formato",
    terms: tiposDeArtigo,
    values: (a: ArticleListItem) => [a.tipoSlug],
  },
  { key: "nivel", label: "Nível", terms: niveis, values: (a: ArticleListItem) => [a.nivelSlug] },
] as const;

type Key = (typeof dimensoes)[number]["key"];

export function ArticlesExplorer({ articles }: { articles: ArticleListItem[] }) {
  const [filters, setFilters] = useQueryStates(parsers, {
    history: "replace",
    shallow: true,
    clearOnDefault: true,
  });

  const matches = (a: ArticleListItem, f: Filters, except?: Key) =>
    dimensoes.every(
      (d) => d.key === except || !f[d.key].length || d.values(a).some((v) => f[d.key].includes(v)),
    );

  const visiveis = useMemo(() => articles.filter((a) => matches(a, filters)), [articles, filters]);

  const toggle = (key: Key, value: string) => {
    const atual = filters[key];
    void setFilters({
      [key]: atual.includes(value) ? atual.filter((v) => v !== value) : [...atual, value],
    });
  };

  const ativos: ActiveFilter[] = dimensoes.flatMap((d) =>
    filters[d.key].map((value) => ({
      key: d.key,
      value,
      label: d.terms.find((t) => t.slug === value)?.label ?? value,
    })),
  );
  const limpar = () => void setFilters({ tradicao: [], area: [], regiao: [], tipo: [], nivel: [] });

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-hair pb-5">
        <div className="flex flex-wrap items-center gap-2">
          {dimensoes.map((d) => (
            <FacetPopover
              key={d.key}
              label={d.label}
              selected={filters[d.key]}
              onToggle={(v) => toggle(d.key, v)}
              options={d.terms.map((t) => ({
                value: t.slug,
                label: t.label,
                count: articles.filter(
                  (a) => matches(a, filters, d.key) && d.values(a).includes(t.slug),
                ).length,
              }))}
            />
          ))}
          <p className="ml-auto text-sm text-muted-foreground" aria-live="polite">
            <span className="font-medium text-foreground tabular-nums">{visiveis.length}</span>{" "}
            {visiveis.length === 1 ? "artigo" : "artigos"}
          </p>
        </div>
        <ActiveFilters
          items={ativos}
          onRemove={(i) => toggle(i.key as Key, i.value)}
          onClear={limpar}
        />
      </div>

      {visiveis.length ? (
        <div className="grid gap-x-8 gap-y-14 pt-10 md:grid-cols-2 lg:grid-cols-3">
          {visiveis.map((article) => (
            <ArticleCard key={article.slug} article={article} headingLevel="h2" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-start gap-4 py-16">
          <p className="font-display text-h3">Nenhum artigo com esses filtros</p>
          <p className="max-w-[48ch] text-muted-foreground">
            Tire algum filtro para ver mais textos.
          </p>
          <Button variant="outline" onClick={limpar}>
            Limpar tudo
          </Button>
        </div>
      )}
    </div>
  );
}
