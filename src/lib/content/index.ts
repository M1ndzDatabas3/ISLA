/**
 * Camada de acesso ao conteúdo. Único ponto do app que lê /content (via Content
 * Collections). Para migrar para um CMS (Payload, Sanity), basta reimplementar
 * estas funções mantendo as assinaturas.
 */
import {
  allArtigos,
  allAutores,
  allCitacoes,
  allConceitos,
  allEpisodios,
  allEventos,
  allLivros,
  allMarcos,
  allObrasCulturais,
  allTrilhas,
  type Artigo,
  type Autore,
  type Citacoe,
  type Conceito,
  type Episodio,
  type Evento,
  type Livro,
  type Marco,
  type ObrasCulturai,
  type Trilha,
} from "content-collections";

import { labelOf, levelIndex, type TaxonomyKey } from "@/lib/taxonomy";

export type { Artigo, Conceito, Episodio, Evento, Livro, Marco, Trilha };
export type Autor = Autore;
export type Citacao = Citacoe;
export type ObraCultural = ObrasCulturai;

const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });

function indexBySlug<T extends { slug: string }>(list: T[]) {
  return new Map(list.map((item) => [item.slug, item]));
}

const autores = indexBySlug(allAutores);
const livros = indexBySlug(allLivros);
const conceitos = indexBySlug(allConceitos);
const artigos = indexBySlug(allArtigos);
const trilhas = indexBySlug(allTrilhas);

const pick = <T>(map: Map<string, T>, slugs: readonly string[]) =>
  slugs.map((slug) => map.get(slug)).filter((item): item is T => Boolean(item));

/** Ordena autores pelo sobrenome usado nas referências (Marx, Mariátegui…). */
export function sortName(nome: string) {
  return nome.split(" ").slice(-1)[0] ?? nome;
}

/* ---------------------------------- Autores --------------------------------- */

export function getAutores(): Autor[] {
  return [...allAutores].sort((a, b) => collator.compare(sortName(a.nome), sortName(b.nome)));
}

export function getAutor(slug: string) {
  return autores.get(slug);
}

export function getAutoresBySlugs(slugs: readonly string[]) {
  return pick(autores, slugs);
}

/** Quem este autor influenciou (inverso de `influenciadoPor`). */
export function getInfluenciados(slug: string): Autor[] {
  return getAutores().filter((autor) => autor.influenciadoPor.includes(slug));
}

/* ---------------------------------- Livros ---------------------------------- */

export function getLivros(): Livro[] {
  return [...allLivros].sort((a, b) => collator.compare(a.titulo, b.titulo));
}

export function getLivro(slug: string) {
  return livros.get(slug);
}

export function getLivrosBySlugs(slugs: readonly string[]) {
  return pick(livros, slugs);
}

export function getLivrosDoAutor(slug: string): Livro[] {
  return [...allLivros]
    .filter((livro) => livro.autores.includes(slug))
    .sort((a, b) => a.ano - b.ano);
}

export function getLivrosDestaque(): Livro[] {
  return getLivros().filter((livro) => livro.destaque);
}

/** Nomes dos autores de um livro, na ordem do cadastro. */
export function nomesDosAutores(livro: Pick<Livro, "autores">) {
  return getAutoresBySlugs(livro.autores).map((autor) => autor.nome);
}

/* --------------------------------- Glossário -------------------------------- */

export function getConceitos(): Conceito[] {
  return [...allConceitos].sort((a, b) => collator.compare(a.termo, b.termo));
}

export function getConceito(slug: string) {
  return conceitos.get(slug);
}

export function getConceitosBySlugs(slugs: readonly string[]) {
  return pick(conceitos, slugs);
}

/** Verbete da semana: muda a cada semana do ano, de forma determinística. */
export function getConceitoDaSemana(date = new Date()): Conceito | undefined {
  const lista = getConceitos();
  if (!lista.length) return undefined;
  const inicio = Date.UTC(date.getUTCFullYear(), 0, 1);
  const semana = Math.floor((date.getTime() - inicio) / (7 * 24 * 60 * 60 * 1000));
  return lista[semana % lista.length];
}

/* ---------------------------------- Artigos --------------------------------- */

export function getArtigos(): Artigo[] {
  return [...allArtigos].sort((a, b) => b.data.localeCompare(a.data));
}

export function getArtigo(slug: string) {
  return artigos.get(slug);
}

export function getArtigosDestaque(): Artigo[] {
  const lista = getArtigos();
  const destaques = lista.filter((a) => a.destaque);
  return [...destaques, ...lista.filter((a) => !a.destaque)];
}

export function getArtigosComConceito(slug: string) {
  return getArtigos().filter((a) => a.conceitos.includes(slug));
}

export function getArtigosComLivro(slug: string) {
  return getArtigos().filter((a) => a.livros.includes(slug));
}

export function getArtigosComAutor(slug: string) {
  return getArtigos().filter((a) => a.autoresCitados.includes(slug));
}

/** Artigos relacionados: mais temas e referências em comum primeiro. */
export function getArtigosRelacionados(artigo: Artigo, limite = 3): Artigo[] {
  const score = (outro: Artigo) => {
    const comum = (a: readonly string[], b: readonly string[]) =>
      a.filter((x) => b.includes(x)).length;
    return (
      comum(artigo.tradicoes, outro.tradicoes) * 2 +
      comum(artigo.areas, outro.areas) * 2 +
      comum(artigo.conceitos, outro.conceitos) +
      comum(artigo.livros, outro.livros) +
      comum(artigo.autoresCitados, outro.autoresCitados)
    );
  };
  return getArtigos()
    .filter((outro) => outro.slug !== artigo.slug)
    .map((outro) => ({ outro, pontos: score(outro) }))
    .sort((a, b) => b.pontos - a.pontos || b.outro.data.localeCompare(a.outro.data))
    .slice(0, limite)
    .map(({ outro }) => outro);
}

/** Rótulo e link do tema principal de um artigo. */
export function temaDoArtigo(artigo: Pick<Artigo, "tema">) {
  const key: TaxonomyKey = artigo.tema.dimensao;
  return {
    label: labelOf(key, artigo.tema.slug),
    href: `/artigos?${artigo.tema.dimensao}=${artigo.tema.slug}`,
  };
}

/* -------------------------- Trilhas, marcos e afins ------------------------- */

export function getTrilhas(): Trilha[] {
  return [...allTrilhas].sort((a, b) => a.ordem - b.ordem);
}

export function getTrilha(slug: string) {
  return trilhas.get(slug);
}

const tiposDeEtapa: Record<Trilha["etapas"][number]["tipo"], string> = {
  texto: "Texto",
  livro: "Livro",
  capitulo: "Capítulo",
  video: "Vídeo",
  verbete: "Verbete",
  artigo: "Artigo",
};

/** Rótulo do tipo e link da etapa (artigo, livro/capítulo ou verbete do acervo). */
export function resolveEtapa(etapa: Trilha["etapas"][number]) {
  const ref = etapa.referencia;
  let href: string | undefined;
  if (ref) {
    if (etapa.tipo === "artigo" && artigos.has(ref)) href = `/artigos/${ref}`;
    else if ((etapa.tipo === "livro" || etapa.tipo === "capitulo") && livros.has(ref))
      href = `/biblioteca/${ref}`;
    else if (etapa.tipo === "verbete" && conceitos.has(ref)) href = `/glossario/${ref}`;
  }
  return { tipo: tiposDeEtapa[etapa.tipo], href };
}

export function getMarcos(): Marco[] {
  return [...allMarcos].sort((a, b) => a.ano - b.ano);
}

export function getCitacoes(): Citacao[] {
  return [...allCitacoes];
}

export function getCitacoesDoAutor(slug: string): Citacao[] {
  return allCitacoes.filter((c) => c.autor === slug);
}

/** Eventos a partir de `agora`, do mais próximo ao mais distante. */
export function getProximosEventos(agora = new Date(), limite = 4): Evento[] {
  return [...allEventos]
    .filter((e) => new Date(e.inicio).getTime() >= agora.getTime())
    .sort((a, b) => a.inicio.localeCompare(b.inicio))
    .slice(0, limite);
}

export function getEpisodios(): Episodio[] {
  return [...allEpisodios].sort((a, b) => b.data.localeCompare(a.data));
}

export function getObrasCulturais(): ObraCultural[] {
  return [...allObrasCulturais].sort((a, b) => a.ano - b.ano);
}

/* ----------------------------- Ordenação por nível ----------------------------- */

export function compareNivel(
  a: { nivel: Parameters<typeof levelIndex>[0] },
  b: { nivel: Parameters<typeof levelIndex>[0] },
) {
  return levelIndex(a.nivel) - levelIndex(b.nivel);
}

/* ------------------------------ Integridade -------------------------------- */

/**
 * Lista referências quebradas entre coleções (slug citado que não existe).
 * Roda nos testes e no build de produção.
 */
export function findBrokenReferences(): string[] {
  const problems: string[] = [];
  const check = (
    origem: string,
    campo: string,
    slugs: readonly string[],
    destino: Map<string, unknown>,
  ) => {
    for (const slug of slugs)
      if (!destino.has(slug)) problems.push(`${origem} → ${campo}: "${slug}" não existe`);
  };
  for (const a of allAutores)
    check(`autores/${a.slug}`, "influenciadoPor", a.influenciadoPor, autores);
  for (const l of allLivros) {
    check(`livros/${l.slug}`, "autores", l.autores, autores);
    check(`livros/${l.slug}`, "lerAntes", l.lerAntes, livros);
    check(`livros/${l.slug}`, "lerDepois", l.lerDepois, livros);
  }
  for (const c of allConceitos) {
    check(`glossario/${c.slug}`, "autores", c.autores, autores);
    check(`glossario/${c.slug}`, "relacionados", c.relacionados, conceitos);
  }
  for (const a of allArtigos) {
    check(`artigos/${a.slug}`, "livros", a.livros, livros);
    check(`artigos/${a.slug}`, "conceitos", a.conceitos, conceitos);
    check(`artigos/${a.slug}`, "autoresCitados", a.autoresCitados, autores);
    if (a.trilha) check(`artigos/${a.slug}`, "trilha", [a.trilha], trilhas);
    try {
      labelOf(a.tema.dimensao, a.tema.slug);
    } catch {
      problems.push(
        `artigos/${a.slug} → tema: "${a.tema.slug}" não está na taxonomia "${a.tema.dimensao}"`,
      );
    }
    for (const match of a.content.matchAll(/<Termo\s+slug="([^"]+)"/g)) {
      check(`artigos/${a.slug}`, "<Termo>", [match[1]!], conceitos);
    }
    for (const match of a.content.matchAll(/<Citacao\s+autor="([^"]+)"/g)) {
      check(`artigos/${a.slug}`, "<Citacao>", [match[1]!], autores);
    }
  }
  for (const m of allMarcos) {
    check(`marcos/${m.slug}`, "livros", m.livros, livros);
    check(`marcos/${m.slug}`, "autores", m.autores, autores);
  }
  for (const c of allCitacoes) {
    check(`citacoes/${c.slug}`, "autor", [c.autor], autores);
    if (c.livro) check(`citacoes/${c.slug}`, "livro", [c.livro], livros);
  }
  return problems;
}

if (process.env.NEXT_PHASE === "phase-production-build") {
  const problems = findBrokenReferences();
  if (problems.length) {
    throw new Error(`Referências quebradas em /content:\n- ${problems.join("\n- ")}`);
  }
}
