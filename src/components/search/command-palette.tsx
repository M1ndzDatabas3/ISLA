"use client";

import { Command } from "cmdk";
import {
  ArrowRight,
  BookOpen,
  Clapperboard,
  Frame,
  FileText,
  Hash,
  History,
  LayoutGrid,
  Loader2,
  Palette,
  Route,
  Search,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useEffect, useState } from "react";

import { LenisLock } from "@/components/ui/dialog";
import { sections } from "@/lib/navigation";
import { loadSearchProvider } from "@/lib/search/fuse-provider";
import { typeLabels, type SearchDocType, type SearchResult } from "@/lib/search/types";

const ordem: SearchDocType[] = [
  "artigo",
  "livro",
  "autor",
  "verbete",
  "trilha",
  "marco",
  "artista",
  "obra",
  "classico",
  "secao",
];
const icones: Record<SearchDocType, typeof FileText> = {
  artigo: FileText,
  livro: BookOpen,
  autor: User,
  verbete: Hash,
  trilha: Route,
  marco: History,
  artista: Palette,
  obra: Frame,
  classico: Clapperboard,
  secao: LayoutGrid,
};

const atalhos = [
  sections.biblioteca,
  sections.trilhas,
  sections.glossario,
  sections.artigos,
  sections.autores,
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<"idle" | "ready" | "error">("idle");
  const loading = open && status === "idle";

  // Baixa o índice na primeira abertura.
  useEffect(() => {
    if (!open || status !== "idle") return;
    loadSearchProvider()
      .then(() => setStatus("ready"))
      .catch(() => setStatus("error"));
  }, [open, status]);

  useEffect(() => {
    if (status !== "ready") return;
    let ativo = true;
    loadSearchProvider()
      .then((provider) => provider.search(query, { limit: 24 }))
      .then((r) => {
        if (ativo) setResults(r);
      });
    return () => {
      ativo = false;
    };
  }, [query, status]);

  function go(href: string) {
    onOpenChange(false);
    setQuery("");
    router.push(href);
  }

  const grupos = ordem
    .map((type) => ({ type, items: results.filter((r) => r.type === type) }))
    .filter((g) => g.items.length);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/40 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed top-[max(16px,12vh)] left-1/2 z-50 w-[calc(100%-32px)] max-w-2xl -translate-x-1/2 border border-hair bg-popover text-popover-foreground shadow-overlay data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2"
        >
          <LenisLock />
          <DialogPrimitive.Title className="sr-only">Buscar no site</DialogPrimitive.Title>
          <Command shouldFilter={false} label="Buscar no site" loop>
            <div className="flex items-center gap-3 border-b border-hair px-5">
              <Search
                className="size-4 shrink-0 text-muted-foreground"
                strokeWidth={1.5}
                aria-hidden
              />
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder="Buscar artigos, livros, autores e verbetes"
                className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
              {loading ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden />
              ) : null}
            </div>

            <Command.List
              data-lenis-prevent
              className="max-h-[min(60vh,520px)] overflow-y-auto overscroll-contain p-2"
            >
              {status === "error" ? (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  Não foi possível carregar a busca. Verifique a conexão e tente de novo.
                </p>
              ) : null}

              {query.trim() && status === "ready" ? (
                <Command.Empty className="px-3 py-8 text-center text-sm text-muted-foreground">
                  Nada encontrado para “{query}”. Tente outra palavra ou o nome de um autor.
                </Command.Empty>
              ) : null}

              {!query.trim() ? (
                <Command.Group
                  heading="Ir para"
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-meta [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  {atalhos.map((s) => (
                    <Item
                      key={s.href}
                      value={s.href}
                      onSelect={() => go(s.href)}
                      title={s.label}
                      subtitle={s.description}
                      Icon={LayoutGrid}
                    />
                  ))}
                </Command.Group>
              ) : null}

              {grupos.map((g) => (
                <Command.Group
                  key={g.type}
                  heading={typeLabels[g.type].plural}
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-meta [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  {g.items.map((r) => (
                    <Item
                      key={r.id}
                      value={r.id}
                      onSelect={() => go(r.href)}
                      title={r.title}
                      subtitle={r.subtitle}
                      Icon={icones[r.type]}
                    />
                  ))}
                </Command.Group>
              ))}

              {query.trim() && results.length ? (
                <Command.Item
                  value="__todos__"
                  onSelect={() => go(`/busca?q=${encodeURIComponent(query.trim())}`)}
                  className="mt-1 flex cursor-pointer items-center justify-between border-t border-hair px-3 py-3 text-sm data-[selected=true]:bg-accent"
                >
                  Ver todos os resultados para “{query.trim()}”
                  <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
                </Command.Item>
              ) : null}
            </Command.List>

            <div className="hidden items-center gap-4 border-t border-hair px-5 py-2.5 text-meta text-muted-foreground sm:flex">
              <span>
                <Kbd>↑</Kbd> <Kbd>↓</Kbd> navegar
              </span>
              <span>
                <Kbd>Enter</Kbd> abrir
              </span>
              <span>
                <Kbd>Esc</Kbd> fechar
              </span>
            </div>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function Item({
  value,
  onSelect,
  title,
  subtitle,
  Icon,
}: {
  value: string;
  onSelect: () => void;
  title: string;
  subtitle: string;
  Icon: typeof FileText;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="flex cursor-pointer items-start gap-3 px-3 py-2.5 data-[selected=true]:bg-accent"
    >
      <Icon
        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
        strokeWidth={1.5}
        aria-hidden
      />
      <span className="min-w-0">
        <span className="block truncate text-[0.9375rem]">{title}</span>
        <span className="block truncate text-meta text-muted-foreground">{subtitle}</span>
      </span>
    </Command.Item>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center border border-hair px-1 font-sans text-[0.6875rem]">
      {children}
    </kbd>
  );
}
