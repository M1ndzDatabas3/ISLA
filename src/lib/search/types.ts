/** Contrato da busca. A implementação atual usa Fuse.js no navegador; trocar por
 * Meilisearch ou Pagefind significa só reimplementar `SearchProvider`. */

export type SearchDocType = "artigo" | "livro" | "autor" | "verbete" | "trilha" | "marco" | "secao";

export interface SearchDoc {
  id: string;
  type: SearchDocType;
  title: string;
  subtitle: string;
  href: string;
  /** Texto extra usado só para encontrar o documento. */
  keywords: string;
}

export interface SearchResult extends SearchDoc {
  score: number;
}

export interface SearchProvider {
  search(
    query: string,
    options?: { limit?: number; types?: SearchDocType[] },
  ): Promise<SearchResult[]>;
}

export const typeLabels: Record<SearchDocType, { singular: string; plural: string }> = {
  artigo: { singular: "Artigo", plural: "Artigos" },
  livro: { singular: "Livro", plural: "Livros" },
  autor: { singular: "Autor", plural: "Autores" },
  verbete: { singular: "Verbete", plural: "Verbetes" },
  trilha: { singular: "Trilha", plural: "Trilhas" },
  marco: { singular: "Marco histórico", plural: "Linha do tempo" },
  secao: { singular: "Seção", plural: "Seções do site" },
};
