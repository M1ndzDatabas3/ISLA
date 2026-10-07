/**
 * Taxonomia única da plataforma. Artigos, livros, trilhas, verbetes, filtros,
 * chips e o mega menu derivam daqui. Os slugs são estáveis: viram query params
 * (`/biblioteca?tradicao=marxismo-classico`) e, no futuro, chaves no CMS.
 */

interface Term<S extends string = string> {
  slug: S;
  label: string;
}

function terms<const T extends readonly Term[]>(list: T) {
  return list;
}

export const tradicoes = terms([
  { slug: "marxismo-classico", label: "Marxismo clássico" },
  { slug: "leninismo", label: "Leninismo" },
  { slug: "trotskismo", label: "Trotskismo" },
  { slug: "maoismo", label: "Maoísmo" },
  { slug: "anarquismo", label: "Anarquismo" },
  { slug: "socialismo-democratico", label: "Socialismo democrático" },
  { slug: "escola-de-frankfurt", label: "Escola de Frankfurt" },
  { slug: "marxismo-ocidental", label: "Marxismo ocidental" },
  { slug: "teoria-marxista-da-dependencia", label: "Teoria marxista da dependência" },
  { slug: "marxismo-negro", label: "Marxismo negro" },
  { slug: "feminismo-marxista", label: "Feminismo marxista" },
  { slug: "ecossocialismo", label: "Ecossocialismo" },
  { slug: "pensamento-decolonial", label: "Pensamento decolonial" },
  { slug: "socialismo-latino-americano", label: "Socialismo latino-americano" },
]);

export const areas = terms([
  { slug: "economia-politica", label: "Economia política" },
  { slug: "filosofia", label: "Filosofia" },
  { slug: "historia", label: "História" },
  { slug: "teoria-do-estado", label: "Teoria do Estado" },
  { slug: "cultura-e-estetica", label: "Cultura e estética" },
  { slug: "organizacao-politica", label: "Organização política" },
  { slug: "questao-agraria", label: "Questão agrária" },
  { slug: "trabalho", label: "Trabalho" },
  { slug: "imperialismo", label: "Imperialismo" },
  { slug: "educacao", label: "Educação" },
]);

export const regioes = terms([
  { slug: "brasil", label: "Brasil" },
  { slug: "america-latina", label: "América Latina" },
  { slug: "europa", label: "Europa" },
  { slug: "russia-urss", label: "Rússia/URSS" },
  { slug: "asia", label: "Ásia" },
  { slug: "africa", label: "África" },
  { slug: "caribe", label: "Caribe" },
  { slug: "mundo", label: "Mundo" },
]);

export const niveis = terms([
  { slug: "introdutorio", label: "Introdutório" },
  { slug: "intermediario", label: "Intermediário" },
  { slug: "avancado", label: "Avançado" },
]);

export const tiposDeObra = terms([
  { slug: "classico", label: "Clássico" },
  { slug: "comentador", label: "Comentador" },
  { slug: "introducao", label: "Introdução" },
  { slug: "contemporaneo", label: "Contemporâneo" },
]);

export const disponibilidades = terms([
  { slug: "edicao-em-portugues", label: "Edição em português" },
  { slug: "dominio-publico", label: "Domínio público" },
  { slug: "esgotado", label: "Esgotado" },
  { slug: "apenas-outro-idioma", label: "Apenas em outro idioma" },
]);

export const tiposDeArtigo = terms([
  { slug: "ensaio", label: "Ensaio" },
  { slug: "verbete", label: "Verbete" },
  { slug: "resenha", label: "Resenha" },
  { slug: "traducao", label: "Tradução" },
  { slug: "entrevista", label: "Entrevista" },
]);

export type Tradicao = (typeof tradicoes)[number]["slug"];
export type Area = (typeof areas)[number]["slug"];
export type Regiao = (typeof regioes)[number]["slug"];
export type Nivel = (typeof niveis)[number]["slug"];
export type TipoDeObra = (typeof tiposDeObra)[number]["slug"];
export type Disponibilidade = (typeof disponibilidades)[number]["slug"];
export type TipoDeArtigo = (typeof tiposDeArtigo)[number]["slug"];

/** Nome do query param de cada dimensão. Os filtros (nuqs) e os links do menu usam os mesmos nomes. */
export const filterParams = {
  tradicao: "tradicao",
  area: "area",
  regiao: "regiao",
  nivel: "nivel",
  tipoDeObra: "tipo",
  disponibilidade: "disponibilidade",
  tipoDeArtigo: "tipo",
} as const;

const taxonomies = {
  tradicao: tradicoes,
  area: areas,
  regiao: regioes,
  nivel: niveis,
  tipoDeObra: tiposDeObra,
  disponibilidade: disponibilidades,
  tipoDeArtigo: tiposDeArtigo,
} as const;

export type TaxonomyKey = keyof typeof taxonomies;

export function getTerms(key: TaxonomyKey): readonly Term[] {
  return taxonomies[key];
}

/** Rótulo legível de um slug. Lança erro em slug desconhecido para pegar erros de conteúdo no build. */
export function labelOf(key: TaxonomyKey, slug: string): string {
  const term = taxonomies[key].find((t) => t.slug === slug);
  if (!term) throw new Error(`Slug desconhecido na taxonomia "${key}": ${slug}`);
  return term.label;
}

/** Posição do nível (1, 2 ou 3), usada pelo badge de nível e pela ordenação. */
export function levelIndex(nivel: Nivel): 1 | 2 | 3 {
  return (niveis.findIndex((n) => n.slug === nivel) + 1) as 1 | 2 | 3;
}
