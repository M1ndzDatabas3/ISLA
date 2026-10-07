"use client";

import { ChevronDown } from "lucide-react";
import { useId } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

interface FacetPopoverProps {
  label: string;
  options: FacetOption[];
  selected: string[];
  onToggle: (value: string) => void;
}

/** Botão de filtro compacto que abre a lista de opções com contagem. */
export function FacetPopover({ label, options, selected, onToggle }: FacetPopoverProps) {
  const id = useId();
  const visiveis = options.filter((o) => o.count > 0 || selected.includes(o.value));
  if (!visiveis.length) return null;

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "inline-flex h-10 cursor-pointer items-center gap-2 border px-3 text-sm transition-colors hover:border-foreground",
          selected.length ? "border-foreground" : "border-hair",
        )}
      >
        {label}
        {selected.length ? (
          <span className="text-brand-text tabular-nums">{selected.length}</span>
        ) : null}
        <ChevronDown className="size-3.5" strokeWidth={1.5} aria-hidden />
      </PopoverTrigger>
      <PopoverContent className="max-h-80 w-72 overflow-y-auto" data-lenis-prevent>
        <ul className="flex flex-col gap-1">
          {visiveis.map((o) => (
            <li key={o.value} className="flex min-h-9 items-center gap-3">
              <Checkbox
                id={`${id}-${o.value}`}
                checked={selected.includes(o.value)}
                onCheckedChange={() => onToggle(o.value)}
              />
              <Label
                htmlFor={`${id}-${o.value}`}
                className="flex-1 cursor-pointer text-sm font-normal"
              >
                {o.label}
              </Label>
              <span className="text-meta text-muted-foreground tabular-nums">{o.count}</span>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
