"use client";

import { X } from "lucide-react";

export interface ActiveFilter {
  key: string;
  value: string;
  label: string;
}

/** Chips dos filtros ativos, cada um removível, e "Limpar tudo". */
export function ActiveFilters({
  items,
  onRemove,
  onClear,
}: {
  items: ActiveFilter[];
  onRemove: (item: ActiveFilter) => void;
  onClear: () => void;
}) {
  if (!items.length) return null;
  return (
    <ul aria-label="Filtros ativos" className="flex flex-wrap items-center gap-2">
      {items.map((item) => (
        <li key={`${item.key}-${item.value}`}>
          <button
            type="button"
            onClick={() => onRemove(item)}
            className="inline-flex h-8 cursor-pointer items-center gap-1.5 border border-foreground bg-foreground px-3 text-[0.8125rem] text-background transition-colors hover:border-brand hover:bg-brand hover:text-brand-foreground"
          >
            {item.label}
            <X className="size-3.5" aria-hidden />
            <span className="sr-only">Remover filtro</span>
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={onClear}
          className="ml-1 h-8 cursor-pointer text-sm font-medium underline underline-offset-4 hover:text-brand-text"
        >
          Limpar tudo
        </button>
      </li>
    </ul>
  );
}
