/**
 * Categorias com contagem, a partir do conteúdo real. Alimentam o mega menu e
 * as páginas-mestre: só aparecem categorias que têm ao menos um item.
 */
import {
  areas,
  disponibilidades,
  niveis,
  regioes,
  tiposDeArtigo,
  tiposDeObra,
  tradicoes,
} from "@/lib/taxonomy";

import { getArtigos, getLivros } from "./index";

export interface Categoria {
  slug: string;
  label: string;
  count: number;
  href: string;
}

export interface GrupoDeCategorias {
  /** Dimensão (tradicao, area…), para chaves e âncoras. */
  key: string;
  title: string;
  items: Categoria[];
}

function contar(listas: readonly (readonly string[])[]) {
  const mapa = new Map<string, number>();
  for (const lista of listas) for (const slug of lista) mapa.set(slug, (mapa.get(slug) ?? 0) + 1);
  return mapa;
}

function grupo(
  key: string,
  title: string,
  terms: readonly { slug: string; label: string }[],
  contagem: Map<string, number>,
  href: (slug: string) => string,
): GrupoDeCategorias {
  return {
    key,
    title,
    items: terms
      .filter((t) => (contagem.get(t.slug) ?? 0) > 0)
      .map((t) => ({ slug: t.slug, label: t.label, count: contagem.get(t.slug)!, href: href(t.slug) })),
  };
}

/** Categorias dos artigos; os links levam à lista completa em /artigos (âncora #todos). */
export function categoriasDeArtigos(): GrupoDeCategorias[] {
  const artigos = getArtigos();
  const link = (param: string) => (slug: string) => `/artigos?${param}=${slug}#todos`;
  return [
    grupo("area", "Por área", areas, contar(artigos.map((a) => a.areas)), link("area")),
    grupo("tradicao", "Por tradição", tradicoes, contar(artigos.map((a) => a.tradicoes)), link("tradicao")),
    grupo("regiao", "Por região", regioes, contar(artigos.map((a) => a.regioes)), link("regiao")),
    grupo("tipo", "Por formato", tiposDeArtigo, contar(artigos.map((a) => [a.tipo])), link("tipo")),
    grupo("nivel", "Por nível", niveis, contar(artigos.map((a) => [a.nivel])), link("nivel")),
  ].filter((g) => g.items.length > 0);
}

/** Categorias da biblioteca; os links abrem /biblioteca já filtrada. */
export function categoriasDeLivros(): GrupoDeCategorias[] {
  const livros = getLivros();
  const link = (param: string) => (slug: string) => `/biblioteca?${param}=${slug}`;
  return [
    grupo("tradicao", "Tradição", tradicoes, contar(livros.map((l) => l.tradicoes)), link("tradicao")),
    grupo("area", "Área", areas, contar(livros.map((l) => l.areas)), link("area")),
    grupo("regiao", "Região", regioes, contar(livros.map((l) => l.regioes)), link("regiao")),
    grupo("tipo", "Tipo de obra", tiposDeObra, contar(livros.map((l) => [l.tipoDeObra])), link("tipo")),
    grupo("nivel", "Nível de leitura", niveis, contar(livros.map((l) => [l.nivel])), link("nivel")),
    grupo(
      "disponibilidade",
      "Disponibilidade",
      disponibilidades,
      contar(livros.map((l) => l.disponibilidade)),
      link("disponibilidade"),
    ),
  ].filter((g) => g.items.length > 0);
}
