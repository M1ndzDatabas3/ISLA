import Fuse from "fuse.js";

import type { SearchDoc, SearchProvider } from "./types";

/** Busca no navegador com Fuse.js sobre o índice estático. */
export function createFuseProvider(docs: SearchDoc[]): SearchProvider {
  const fuse = new Fuse(docs, {
    keys: [
      { name: "title", weight: 3 },
      { name: "subtitle", weight: 1 },
      { name: "keywords", weight: 1 },
    ],
    threshold: 0.34,
    ignoreLocation: true,
    includeScore: true,
  });
  return {
    async search(query, { limit = 20, types } = {}) {
      const q = query.trim();
      if (!q) return [];
      return fuse
        .search(q, { limit: limit * 3 })
        .filter((r) => !types || types.includes(r.item.type))
        .slice(0, limit)
        .map((r) => ({ ...r.item, score: r.score ?? 1 }));
    },
  };
}

let cached: Promise<SearchProvider> | null = null;

/** Baixa o índice uma vez, sob demanda (na primeira busca). */
export function loadSearchProvider() {
  cached ??= fetch("/busca-index.json")
    .then((r) => {
      if (!r.ok) throw new Error("Índice de busca indisponível");
      return r.json() as Promise<SearchDoc[]>;
    })
    .then(createFuseProvider)
    .catch((error) => {
      cached = null;
      throw error;
    });
  return cached;
}
