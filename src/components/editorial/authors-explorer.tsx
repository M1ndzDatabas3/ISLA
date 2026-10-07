"use client";

import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";

import { ActiveFilters, type ActiveFilter } from "@/components/filters/active-filters";
import { FacetPopover } from "@/components/filters/facet-popover";
import { regioes, tradicoes } from "@/lib/taxonomy";

import { AuthorCard, type AuthorCardData } from "./author-card";

export interface AuthorListItem extends AuthorCardData {
  slug: string;
  tradicaoSlugs: string[];
  regiaoSlugs: string[];
}

const lista = parseAsArrayOf(parseAsString).withDefault([]);

export function AuthorsExplorer({ authors }: { authors: AuthorListItem[] }) {
  const [f, setF] = useQueryStates(
    { tradicao: lista, regiao: lista },
    { history: "replace", shallow: true, clearOnDefault: true },
  );

  const passa = (a: AuthorListItem, except?: "tradicao" | "regiao") =>
    (except === "tradicao" ||
      !f.tradicao.length ||
      a.tradicaoSlugs.some((t) => f.tradicao.includes(t))) &&
    (except === "regiao" || !f.regiao.length || a.regiaoSlugs.some((r) => f.regiao.includes(r)));

  const visiveis = authors.filter((a) => passa(a));
  const toggle = (key: "tradicao" | "regiao", v: string) =>
    void setF({ [key]: f[key].includes(v) ? f[key].filter((x) => x !== v) : [...f[key], v] });

  const ativos: ActiveFilter[] = [
    ...f.tradicao.map((v) => ({
      key: "tradicao",
      value: v,
      label: tradicoes.find((t) => t.slug === v)?.label ?? v,
    })),
    ...f.regiao.map((v) => ({
      key: "regiao",
      value: v,
      label: regioes.find((t) => t.slug === v)?.label ?? v,
    })),
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-hair pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <FacetPopover
            label="Tradição"
            selected={f.tradicao}
            onToggle={(v) => toggle("tradicao", v)}
            options={tradicoes.map((t) => ({
              value: t.slug,
              label: t.label,
              count: authors.filter((a) => passa(a, "tradicao") && a.tradicaoSlugs.includes(t.slug))
                .length,
            }))}
          />
          <FacetPopover
            label="Região"
            selected={f.regiao}
            onToggle={(v) => toggle("regiao", v)}
            options={regioes.map((t) => ({
              value: t.slug,
              label: t.label,
              count: authors.filter((a) => passa(a, "regiao") && a.regiaoSlugs.includes(t.slug))
                .length,
            }))}
          />
          <p className="ml-auto text-sm text-muted-foreground" aria-live="polite">
            <span className="font-medium text-foreground tabular-nums">{visiveis.length}</span>{" "}
            {visiveis.length === 1 ? "autor" : "autores"}
          </p>
        </div>
        <ActiveFilters
          items={ativos}
          onRemove={(i) => toggle(i.key as "tradicao" | "regiao", i.value)}
          onClear={() => void setF({ tradicao: [], regiao: [] })}
        />
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 pt-10 md:grid-cols-3 lg:grid-cols-4">
        {visiveis.map((a) => (
          <AuthorCard key={a.slug} author={a} />
        ))}
      </div>
    </div>
  );
}
