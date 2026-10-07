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

/* ------------------------------- Mural Cultural ------------------------------ */

/** Linguagens do Mural (filtro de artistas e obras). A técnica fina vai em texto livre na obra. */
export const linguagensArtisticas = terms([
  { slug: "artes-visuais", label: "Artes visuais" },
  { slug: "ilustracao-e-quadrinhos", label: "Ilustração e quadrinhos" },
  { slug: "fotografia", label: "Fotografia" },
  { slug: "cartaz-e-design", label: "Cartaz e design gráfico" },
  { slug: "cordel-e-literatura", label: "Cordel e literatura" },
  { slug: "musica", label: "Música" },
  { slug: "cinema-e-audiovisual", label: "Cinema e audiovisual" },
  { slug: "teatro-e-performance", label: "Teatro e performance" },
]);

/**
 * Temas das obras do Mural. Os que existem como área ou tradição do site
 * apontam para elas (ver `temaParaConteudo`), para ligar obras e textos.
 */
export const temasDoMural = terms([
  { slug: "trabalho", label: "Trabalho" },
  { slug: "terra", label: "Terra" },
  { slug: "memoria", label: "Memória" },
  { slug: "raca", label: "Raça" },
  { slug: "genero", label: "Gênero" },
  { slug: "cidade", label: "Cidade" },
  { slug: "imperialismo", label: "Imperialismo" },
]);

/** Tema do Mural → área/tradição equivalente no acervo (para "textos relacionados"). */
export const temaParaConteudo: Record<
  (typeof temasDoMural)[number]["slug"],
  { areas?: string[]; tradicoes?: string[] }
> = {
  trabalho: { areas: ["trabalho"] },
  terra: { areas: ["questao-agraria"] },
  memoria: { areas: ["historia"] },
  raca: { tradicoes: ["marxismo-negro"] },
  genero: { tradicoes: ["feminismo-marxista"] },
  cidade: {},
  imperialismo: { areas: ["imperialismo"] },
};

/** Licenças das obras, com explicação em linguagem simples. */
export const licencas = terms([
  { slug: "todos-os-direitos-reservados", label: "Todos os direitos reservados" },
  { slug: "cc-by", label: "CC BY 4.0" },
  { slug: "cc-by-sa", label: "CC BY-SA 4.0" },
  { slug: "cc-by-nc", label: "CC BY-NC 4.0" },
  { slug: "cc-by-nc-sa", label: "CC BY-NC-SA 4.0" },
]);

export const explicacaoDaLicenca: Record<(typeof licencas)[number]["slug"], string> = {
  "todos-os-direitos-reservados":
    "A obra é exibida com autorização do artista. Não pode ser copiada, impressa nem reutilizada sem pedir a ele.",
  "cc-by":
    "Você pode baixar, imprimir, compartilhar e adaptar, inclusive para fins comerciais, desde que dê o crédito ao artista.",
  "cc-by-sa":
    "Você pode baixar, imprimir, compartilhar e adaptar, dando o crédito ao artista e mantendo a mesma licença no que criar a partir dela.",
  "cc-by-nc":
    "Você pode baixar, imprimir, compartilhar e adaptar para fins não comerciais, dando o crédito ao artista.",
  "cc-by-nc-sa":
    "Você pode baixar, imprimir, compartilhar e adaptar para fins não comerciais, dando o crédito e mantendo a mesma licença.",
};

export const urlDaLicenca: Partial<Record<(typeof licencas)[number]["slug"], string>> = {
  "cc-by": "https://creativecommons.org/licenses/by/4.0/deed.pt-br",
  "cc-by-sa": "https://creativecommons.org/licenses/by-sa/4.0/deed.pt-br",
  "cc-by-nc": "https://creativecommons.org/licenses/by-nc/4.0/deed.pt-br",
  "cc-by-nc-sa": "https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt-br",
};

/** Linguagem das obras clássicas (leitura crítica). */
export const linguagensClassicas = terms([
  { slug: "filme", label: "Filme" },
  { slug: "cancao", label: "Canção" },
  { slug: "romance", label: "Romance" },
  { slug: "poesia", label: "Poesia" },
  { slug: "gravura", label: "Gravura" },
  { slug: "pintura", label: "Pintura" },
  { slug: "cartaz", label: "Cartaz" },
  { slug: "teatro", label: "Teatro" },
]);

export type Tradicao = (typeof tradicoes)[number]["slug"];
export type Area = (typeof areas)[number]["slug"];
export type Regiao = (typeof regioes)[number]["slug"];
export type Nivel = (typeof niveis)[number]["slug"];
export type TipoDeObra = (typeof tiposDeObra)[number]["slug"];
export type Disponibilidade = (typeof disponibilidades)[number]["slug"];
export type TipoDeArtigo = (typeof tiposDeArtigo)[number]["slug"];
export type LinguagemArtistica = (typeof linguagensArtisticas)[number]["slug"];
export type TemaDoMural = (typeof temasDoMural)[number]["slug"];
export type Licenca = (typeof licencas)[number]["slug"];
export type LinguagemClassica = (typeof linguagensClassicas)[number]["slug"];

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
  linguagem: linguagensArtisticas,
  temaMural: temasDoMural,
  licenca: licencas,
  linguagemClassica: linguagensClassicas,
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
