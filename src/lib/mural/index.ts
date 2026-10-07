/**
 * Camada de acesso ao Mural Cultural. Único ponto que lê content/mural.
 * Regras de visibilidade:
 * - conteúdo `demo: true` só aparece fora de produção ou com MURAL_DEMO=1
 *   (MURAL_DEMO=0 esconde também em desenvolvimento);
 * - artista só aparece com status "publicado" (o schema exige autorização);
 * - obra só aparece se o artista dela aparece.
 * Para trocar por um backoffice/CMS, reimplemente estas funções.
 */
import {
  allArtistas,
  allCapas,
  allClassicos,
  allExposicoes,
  allMuralTextos,
  allObras,
  type Artista,
  type Capa,
  type Classico,
  type Exposicoe,
  type Obra,
} from "content-collections";

import {
  getArtigo,
  getArtigos,
  getAutor,
  getConceito,
  getLivro,
  getTrilha,
  getTrilhas,
} from "@/lib/content";
import { temaParaConteudo, type TemaDoMural } from "@/lib/taxonomy";

export type { Artista, Capa, Classico, Obra };
export type Exposicao = Exposicoe;

const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });

/** Mostra conteúdo de demonstração? */
export const mostrarDemo =
  process.env.MURAL_DEMO === "1" ||
  (process.env.MURAL_DEMO !== "0" && process.env.NODE_ENV !== "production");

const visivel = (item: { demo: boolean }) => mostrarDemo || !item.demo;

/* --------------------------------- Artistas -------------------------------- */

const artistasVisiveis = allArtistas.filter((a) => a.status === "publicado" && visivel(a));
const artistasPorSlug = new Map(artistasVisiveis.map((a) => [a.slug, a]));

/** Artistas publicados, mais recentes primeiro. */
export function getArtistas(): Artista[] {
  return [...artistasVisiveis].sort(
    (a, b) =>
      (b.publicadoEm ?? "").localeCompare(a.publicadoEm ?? "") || collator.compare(a.nome, b.nome),
  );
}

export function getArtista(slug: string) {
  return artistasPorSlug.get(slug);
}

export function getArtistasEmDestaque(limite = 4): Artista[] {
  const destaque = getArtistas().filter((a) => a.destaque);
  return (destaque.length ? destaque : getArtistas()).slice(0, limite);
}

/** "Caruaru, PE" ou "Valparaíso, Chile". */
export function localDoArtista(a: Pick<Artista, "cidade" | "estado" | "pais">) {
  return a.pais === "Brasil" && a.estado ? `${a.cidade}, ${a.estado}` : `${a.cidade}, ${a.pais}`;
}

/* ---------------------------------- Obras ---------------------------------- */

const obrasVisiveis = allObras.filter((o) => visivel(o) && artistasPorSlug.has(o.artista));
const obrasPorSlug = new Map(obrasVisiveis.map((o) => [o.slug, o]));

/** Obras publicadas, mais recentes primeiro. */
export function getObras(): Obra[] {
  return [...obrasVisiveis].sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm));
}

export function getObra(slug: string) {
  return obrasPorSlug.get(slug);
}

export function getObrasDoArtista(slug: string): Obra[] {
  return getObras().filter((o) => o.artista === slug);
}

/** Obra que representa o artista (capa do card): a mais recente. */
export function obraDeCapa(slug: string): Obra | undefined {
  return getObrasDoArtista(slug)[0];
}

/** Cartazes: obras liberadas para download sob Creative Commons. */
export function getCartazes(): Obra[] {
  return getObras().filter((o) => o.permiteDownload && o.arquivoParaDownload);
}

/* ------------------------------- Exposições -------------------------------- */

const exposicoesVisiveis = allExposicoes
  .filter(visivel)
  .map((e) => ({ ...e, obras: e.obras.filter((slug) => obrasPorSlug.has(slug)) }))
  .filter((e) => e.obras.length > 0);

export function getExposicoes(): Exposicao[] {
  return [...exposicoesVisiveis].sort((a, b) => b.inicio.localeCompare(a.inicio));
}

export function getExposicao(slug: string) {
  return exposicoesVisiveis.find((e) => e.slug === slug);
}

/** Exposição em cartaz hoje (ou a mais recente). */
export function getExposicaoAtual(hoje = new Date()): Exposicao | undefined {
  const dia = hoje.toISOString().slice(0, 10);
  const lista = getExposicoes();
  return lista.find((e) => e.inicio <= dia && (!e.fim || e.fim >= dia)) ?? lista[0];
}

export function obrasDaExposicao(e: Exposicao): Obra[] {
  return e.obras.map((slug) => obrasPorSlug.get(slug)!).filter(Boolean);
}

/** Imagem de capa: a própria ou a da primeira obra. */
export function capaDaExposicao(e: Exposicao) {
  if (e.capa) return e.capa;
  return obrasDaExposicao(e)[0]?.imagens[0];
}

/* -------------------------------- Clássicos -------------------------------- */

export function getClassicos(): Classico[] {
  return [...allClassicos].sort((a, b) => a.ano - b.ano);
}

export function getClassico(slug: string) {
  return allClassicos.find((c) => c.slug === slug);
}

/* ------------------------------ Capa do mês -------------------------------- */

/** Capa do mês corrente ou, sem ela, a mais recente já publicada. */
export function getCapaDoMes(hoje = new Date()) {
  const mes = hoje.toISOString().slice(0, 7);
  const capas = allCapas
    .filter((c) => visivel(c) && obrasPorSlug.has(c.obra) && c.mes <= mes)
    .sort((a, b) => b.mes.localeCompare(a.mes));
  const capa = capas[0];
  if (!capa) return undefined;
  const obra = obrasPorSlug.get(capa.obra)!;
  const artista = artistasPorSlug.get(obra.artista)!;
  const ilustra = capa.ilustra
    ? capa.ilustra.tipo === "artigo"
      ? (() => {
          const a = getArtigo(capa.ilustra!.slug);
          return a ? { titulo: a.titulo, href: `/artigos/${a.slug}` } : undefined;
        })()
      : (() => {
          const t = getTrilha(capa.ilustra!.slug);
          return t ? { titulo: t.titulo, href: `/trilhas#${t.slug}` } : undefined;
        })()
    : undefined;
  return { capa, obra, artista, ilustra };
}

/* --------------------------------- Textos ---------------------------------- */

export function getTextoMural(slug: "manifesto" | "compromisso" | "chamada-aberta") {
  return allMuralTextos.find((t) => t.slug === slug);
}

/* --------------------------- Textos relacionados --------------------------- */

export interface TextoRelacionado {
  tipo: "Artigo" | "Trilha" | "Verbete" | "Livro";
  titulo: string;
  href: string;
}

/**
 * Textos do Instituto ligados a uma obra (ou a um conjunto de temas): primeiro
 * os indicados à mão, depois artigos e trilhas que tratam dos mesmos temas.
 */
export function textosRelacionados(
  temas: readonly TemaDoMural[],
  explicitos: Obra["textosRelacionados"] = [],
  limite = 4,
): TextoRelacionado[] {
  const out: TextoRelacionado[] = [];
  const vistos = new Set<string>();
  const add = (t: TextoRelacionado | undefined) => {
    if (!t || vistos.has(t.href)) return;
    vistos.add(t.href);
    out.push(t);
  };
  for (const ref of explicitos) {
    if (ref.tipo === "artigo") {
      const a = getArtigo(ref.slug);
      add(a && { tipo: "Artigo", titulo: a.titulo, href: `/artigos/${a.slug}` });
    } else if (ref.tipo === "trilha") {
      const t = getTrilha(ref.slug);
      add(t && { tipo: "Trilha", titulo: t.titulo, href: `/trilhas#${t.slug}` });
    } else if (ref.tipo === "verbete") {
      const c = getConceito(ref.slug);
      add(c && { tipo: "Verbete", titulo: c.termo, href: `/glossario/${c.slug}` });
    } else {
      const l = getLivro(ref.slug);
      add(l && { tipo: "Livro", titulo: l.tituloCapa ?? l.titulo, href: `/biblioteca/${l.slug}` });
    }
  }
  const areas = new Set(temas.flatMap((t) => temaParaConteudo[t]?.areas ?? []));
  const tradicoes = new Set(temas.flatMap((t) => temaParaConteudo[t]?.tradicoes ?? []));
  for (const a of getArtigos()) {
    if (a.areas.some((x) => areas.has(x)) || a.tradicoes.some((x) => tradicoes.has(x)))
      add({ tipo: "Artigo", titulo: a.titulo, href: `/artigos/${a.slug}` });
  }
  for (const t of getTrilhas()) {
    const etapas = t.etapas.map((e) => e.referencia).filter(Boolean) as string[];
    if (
      etapas.some((slug) =>
        getArtigos().some((a) => a.slug === slug && a.areas.some((x) => areas.has(x))),
      )
    )
      add({ tipo: "Trilha", titulo: t.titulo, href: `/trilhas#${t.slug}` });
  }
  return out.slice(0, limite);
}

/* ------------------------------- Integridade ------------------------------- */

/** Referências quebradas no Mural (roda nos testes e no build). Considera tudo, inclusive demo. */
export function findBrokenMuralReferences(): string[] {
  const problems: string[] = [];
  const artistas = new Set(allArtistas.map((a) => a.slug));
  const obras = new Set(allObras.map((o) => o.slug));
  for (const o of allObras) {
    if (!artistas.has(o.artista))
      problems.push(`mural/obras/${o.slug} → artista "${o.artista}" não existe`);
    for (const t of o.textosRelacionados) {
      const ok =
        t.tipo === "artigo"
          ? getArtigo(t.slug)
          : t.tipo === "trilha"
            ? getTrilha(t.slug)
            : t.tipo === "verbete"
              ? getConceito(t.slug)
              : getLivro(t.slug);
      if (!ok) problems.push(`mural/obras/${o.slug} → ${t.tipo} "${t.slug}" não existe`);
    }
  }
  for (const e of allExposicoes) {
    for (const slug of e.obras)
      if (!obras.has(slug)) problems.push(`mural/exposicoes/${e.slug} → obra "${slug}" não existe`);
    if (e.trilha && !getTrilha(e.trilha))
      problems.push(`mural/exposicoes/${e.slug} → trilha "${e.trilha}" não existe`);
  }
  for (const c of allCapas) {
    if (!obras.has(c.obra)) problems.push(`mural/capas/${c.slug} → obra "${c.obra}" não existe`);
    if (c.ilustra) {
      const ok =
        c.ilustra.tipo === "artigo" ? getArtigo(c.ilustra.slug) : getTrilha(c.ilustra.slug);
      if (!ok)
        problems.push(`mural/capas/${c.slug} → ${c.ilustra.tipo} "${c.ilustra.slug}" não existe`);
    }
  }
  for (const c of allClassicos) {
    for (const slug of c.conceitos)
      if (!getConceito(slug))
        problems.push(`mural/classicos/${c.slug} → conceito "${slug}" não existe`);
    for (const slug of c.autores)
      if (!getAutor(slug)) problems.push(`mural/classicos/${c.slug} → autor "${slug}" não existe`);
  }
  return problems;
}

if (process.env.NEXT_PHASE === "phase-production-build") {
  const problems = findBrokenMuralReferences();
  if (problems.length)
    throw new Error(`Referências quebradas no Mural:\n- ${problems.join("\n- ")}`);
}
