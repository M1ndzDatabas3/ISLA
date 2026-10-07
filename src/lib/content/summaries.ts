/**
 * Versões enxutas e serializáveis dos documentos, para componentes de cliente
 * (sem o código MDX). Montadas no servidor.
 */
import type { ArticleCardData } from "@/components/editorial/article-card";
import type { BookCardData } from "@/components/editorial/book-card";
import {
  labelOf,
  type Disponibilidade,
  type Nivel,
  type TipoDeObra,
  type Tradicao,
} from "@/lib/taxonomy";

import { getAutoresBySlugs, temaDoArtigo, type Artigo, type Livro } from "./index";

export interface BookSummary {
  slug: string;
  href: string;
  titulo: string;
  tituloCapa?: string;
  tituloOriginal?: string;
  autores: string[];
  autorSlugs: string[];
  ano: number;
  tradicoes: Tradicao[];
  areas: string[];
  regioes: string[];
  nivel: Nivel;
  tipoDeObra: TipoDeObra;
  disponibilidade: Disponibilidade[];
  sinopse: string;
  destaque: boolean;
}

export function toBookSummary(livro: Livro): BookSummary {
  return {
    slug: livro.slug,
    href: `/biblioteca/${livro.slug}`,
    titulo: livro.titulo,
    tituloCapa: livro.tituloCapa,
    tituloOriginal: livro.tituloOriginal,
    autores: getAutoresBySlugs(livro.autores).map((a) => a.nome),
    autorSlugs: livro.autores,
    ano: livro.ano,
    tradicoes: livro.tradicoes as Tradicao[],
    areas: livro.areas,
    regioes: livro.regioes,
    nivel: livro.nivel as Nivel,
    tipoDeObra: livro.tipoDeObra as TipoDeObra,
    disponibilidade: livro.disponibilidade as Disponibilidade[],
    sinopse: livro.sinopse,
    destaque: livro.destaque,
  };
}

/** Nomes em lista natural: "Marx e Engels", "A, B e C". */
export function joinNames(nomes: string[]) {
  if (nomes.length <= 1) return nomes[0] ?? "";
  return `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`;
}

export function toBookCard(book: BookSummary): BookCardData {
  const area = book.areas[0];
  return {
    slug: book.slug,
    href: book.href,
    titulo: book.titulo,
    tituloCapa: book.tituloCapa,
    autor: joinNames(book.autores),
    ano: book.ano,
    tradicao: book.tradicoes[0]!,
    nivel: book.nivel,
    tipoDeObra: labelOf("tipoDeObra", book.tipoDeObra),
    sinopse: book.sinopse,
    tema: area
      ? { label: labelOf("area", area), href: `/biblioteca?area=${area}` }
      : {
          label: labelOf("tradicao", book.tradicoes[0]!),
          href: `/biblioteca?tradicao=${book.tradicoes[0]}`,
        },
  };
}

export function toArticleCard(artigo: Artigo): ArticleCardData {
  return {
    href: `/artigos/${artigo.slug}`,
    titulo: artigo.titulo,
    linhaFina: artigo.linhaFina,
    autor: artigo.assinatura,
    data: artigo.data,
    leituraMin: artigo.leituraMin,
    nivel: artigo.nivel as Nivel,
    tipo: labelOf("tipoDeArtigo", artigo.tipo),
    tema: temaDoArtigo(artigo),
    imagem: artigo.capa ? { src: artigo.capa.src, alt: artigo.capa.alt } : null,
  };
}
