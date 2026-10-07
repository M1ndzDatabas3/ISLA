"use client";

import { Command } from "cmdk";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { SiglaUF } from "@/lib/estados";
import { cn } from "@/lib/utils";

const cache = new Map<string, Promise<string[]>>();

function carregarMunicipios(uf: string) {
  let lista = cache.get(uf);
  if (!lista) {
    lista = fetch(`/municipios/${uf}`).then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json() as Promise<string[]>;
    });
    lista.catch(() => cache.delete(uf));
    cache.set(uf, lista);
  }
  return lista;
}

const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const LIMITE = 120;

interface CityComboboxProps {
  id: string;
  name: string;
  uf: SiglaUF | "";
  value: string;
  onChange: (cidade: string) => void;
  invalid?: boolean;
  describedBy?: string;
}

/**
 * Cidade do estado escolhido, com busca que ignora acentos.
 * O valor vai no formulário por um campo oculto.
 */
export function CityCombobox({
  id,
  name,
  uf,
  value,
  onChange,
  invalid,
  describedBy,
}: CityComboboxProps) {
  const [open, setOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const [lista, setLista] = useState<{ uf: string; cidades: string[] } | null>(null);
  const [falhou, setFalhou] = useState<string | null>(null);

  useEffect(() => {
    if (!uf) return;
    let ativo = true;
    carregarMunicipios(uf)
      .then((cidades) => ativo && setLista({ uf, cidades }))
      .catch(() => ativo && setFalhou(uf));
    return () => {
      ativo = false;
    };
  }, [uf]);

  const cidades = lista && lista.uf === uf ? lista.cidades : null;
  const carregando = Boolean(uf) && !cidades && falhou !== uf;

  const resultados = useMemo(() => {
    if (!cidades) return [];
    const termo = normalizar(busca.trim());
    const filtradas = termo ? cidades.filter((c) => normalizar(c).includes(termo)) : cidades;
    return filtradas.slice(0, LIMITE);
  }, [cidades, busca]);

  const rotulo = !uf
    ? "Escolha o estado primeiro"
    : carregando
      ? "Carregando cidades…"
      : value || "Escolha a cidade";

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <Popover
        open={open}
        onOpenChange={(aberto) => {
          setOpen(aberto);
          if (!aberto) setBusca("");
        }}
      >
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            data-invalid={invalid || undefined}
            aria-describedby={describedBy}
            disabled={!uf || carregando}
            className={cn(
              "flex h-12 w-full cursor-pointer items-center justify-between gap-3 border border-input bg-background px-4 text-left text-base outline-none",
              "focus-visible:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              "disabled:cursor-not-allowed disabled:opacity-60 data-invalid:border-brand-text",
              !value && "text-muted-foreground",
            )}
          >
            <span className="truncate">{rotulo}</span>
            <ChevronDown aria-hidden strokeWidth={1.5} className="size-4 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[16rem] p-0">
          <Command shouldFilter={false} label="Cidades" loop>
            <Command.Input
              value={busca}
              onValueChange={setBusca}
              placeholder="Digite o nome da cidade"
              className="h-12 w-full border-b border-hair bg-transparent px-4 text-base outline-none placeholder:text-muted-foreground"
            />
            <Command.List
              data-lenis-prevent
              className="max-h-64 overflow-y-auto overscroll-contain py-1"
            >
              <Command.Empty className="px-4 py-6 text-sm text-muted-foreground">
                {falhou === uf
                  ? "Não foi possível carregar as cidades. Feche e tente de novo."
                  : "Nenhuma cidade com esse nome neste estado."}
              </Command.Empty>
              {resultados.map((cidade) => (
                <Command.Item
                  key={cidade}
                  value={cidade}
                  onSelect={() => {
                    onChange(cidade);
                    setOpen(false);
                    setBusca("");
                  }}
                  className="flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm data-[selected=true]:bg-accent"
                >
                  {cidade}
                  {cidade === value ? (
                    <Check aria-hidden className="size-4 text-brand-text" />
                  ) : null}
                </Command.Item>
              ))}
              {cidades && resultados.length === LIMITE ? (
                <p className="px-4 py-2 text-meta text-muted-foreground">
                  Digite para encontrar outras cidades.
                </p>
              ) : null}
            </Command.List>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
