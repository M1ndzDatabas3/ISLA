"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { CommandPalette } from "./command-palette";

interface SearchContextValue {
  open: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

/** Atalho global (⌘K / Ctrl+K, e "/" fora de campos de texto) e a paleta de busca. */
export function SearchRoot({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing = (event.target as HTMLElement)?.closest(
        "input, textarea, select, [contenteditable=true]",
      );
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((v) => !v);
      } else if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <SearchContext value={value}>
      {children}
      <CommandPalette open={isOpen} onOpenChange={setIsOpen} />
    </SearchContext>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch precisa estar dentro de <SearchRoot>.");
  return context;
}
