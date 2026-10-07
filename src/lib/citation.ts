/**
 * Referências bibliográficas: ABNT NBR 6023:2018 e BibTeX.
 * Funções puras (testadas em citation.test.ts).
 */

const SUFIXOS = new Set(["júnior", "junior", "jr.", "filho", "neto", "sobrinho"]);

/**
 * "Caio Prado Júnior" → "PRADO JÚNIOR, Caio"; "Theotonio dos Santos" → "SANTOS, Theotonio dos".
 * Regra ABNT: entrada pelo último sobrenome; sufixos de parentesco acompanham o sobrenome.
 */
export function abntAuthorName(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  if (partes.length === 1) return partes[0]!.toLocaleUpperCase("pt-BR");
  const ultimo = partes[partes.length - 1]!;
  const corte =
    SUFIXOS.has(ultimo.toLocaleLowerCase("pt-BR")) && partes.length > 2
      ? partes.length - 2
      : partes.length - 1;
  const sobrenome = partes.slice(corte).join(" ").toLocaleUpperCase("pt-BR");
  const prenomes = partes.slice(0, corte).join(" ");
  return `${sobrenome}, ${prenomes}`;
}

/** "Karl Marx" → "Marx, Karl" (ordem do BibTeX). */
export function bibtexAuthorName(nome: string): string {
  const [sobrenome, prenomes] = abntAuthorName(nome).split(", ");
  const capitalizado = (sobrenome ?? "")
    .toLocaleLowerCase("pt-BR")
    .replace(/(^|\s)\p{L}/gu, (letra) => letra.toLocaleUpperCase("pt-BR"));
  return prenomes ? `${capitalizado}, ${prenomes}` : capitalizado;
}

const MESES_ABNT = [
  "jan.",
  "fev.",
  "mar.",
  "abr.",
  "maio",
  "jun.",
  "jul.",
  "ago.",
  "set.",
  "out.",
  "nov.",
  "dez.",
];

/** Data no formato ABNT: "7 out. 2026". */
export function abntDate(date: Date): string {
  return `${date.getUTCDate()} ${MESES_ABNT[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** Título com subtítulo: só o título vai em destaque (negrito). */
function splitTitle(titulo: string) {
  const i = titulo.indexOf(":");
  return i === -1
    ? { titulo, subtitulo: "" }
    : { titulo: titulo.slice(0, i), subtitulo: titulo.slice(i) };
}

export interface BookCitationInput {
  autores: string[];
  titulo: string;
  ano: number;
  edicao?: { editora: string; cidade?: string; ano?: number | string; tradutor?: string };
}

export interface CitationParts {
  /** Texto antes do destaque, o trecho em negrito e o restante (para renderizar com <strong>). */
  before: string;
  emphasis: string;
  after: string;
}

export function abntBook({ autores, titulo, ano, edicao }: BookCitationInput): CitationParts {
  const nomes = autores.map(abntAuthorName).join("; ");
  const { titulo: t, subtitulo } = splitTitle(titulo);
  const traducao = edicao?.tradutor ? ` Tradução de ${edicao.tradutor}.` : "";
  const local = edicao?.cidade ?? "[S. l.]";
  const editora = edicao?.editora ?? "[s. n.]";
  const anoEdicao = edicao?.ano ?? ano;
  return {
    before: `${nomes}. `,
    emphasis: t,
    after: `${subtitulo}.${traducao} ${local}: ${editora}, ${anoEdicao}.`,
  };
}

export interface ArticleCitationInput {
  titulo: string;
  site: string;
  /** Data ISO de publicação. */
  data: string;
  url: string;
  acesso: Date;
}

/** Artigo assinado pela redação: entrada pela instituição. */
export function abntOnlineArticle({
  titulo,
  site,
  data,
  url,
  acesso,
}: ArticleCitationInput): CitationParts {
  return {
    before: `${site.toLocaleUpperCase("pt-BR")}. ${titulo}. `,
    emphasis: site,
    after: `, ${abntDate(new Date(`${data}T12:00:00Z`))}. Disponível em: ${url}. Acesso em: ${abntDate(acesso)}.`,
  };
}

export const citationToText = ({ before, emphasis, after }: CitationParts) =>
  `${before}${emphasis}${after}`;

const bibtexEscape = (value: string) => value.replace(/[{}]/g, "");

export function bibtexKey(nomeAutor: string, titulo: string, ano: number | string) {
  const sobrenome = bibtexAuthorName(nomeAutor).split(",")[0] ?? "autor";
  const palavra =
    titulo
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .find((p) => p.length > 3) ?? "obra";
  const base = sobrenome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  return `${base}${ano}${palavra}`;
}

export function bibtexBook({ autores, titulo, ano, edicao }: BookCitationInput): string {
  const campos: [string, string | number][] = [
    ["author", autores.map(bibtexAuthorName).join(" and ")],
    ["title", titulo],
    ["year", edicao?.ano ?? ano],
  ];
  if (edicao?.editora) campos.push(["publisher", edicao.editora]);
  if (edicao?.cidade) campos.push(["address", edicao.cidade]);
  if (edicao?.tradutor) campos.push(["translator", edicao.tradutor]);
  if (edicao?.ano && edicao.ano !== ano) campos.push(["origyear", ano]);
  const key = bibtexKey(autores[0] ?? "autor", titulo, ano);
  return `@book{${key},\n${campos.map(([k, v]) => `  ${k.padEnd(10)} = {${bibtexEscape(String(v))}}`).join(",\n")}\n}`;
}

export function bibtexOnline({ titulo, site, data, url, acesso }: ArticleCitationInput): string {
  const key = bibtexKey(site, titulo, data.slice(0, 4));
  const campos: [string, string][] = [
    ["author", `{${site}}`],
    ["title", titulo],
    ["year", data.slice(0, 4)],
    ["date", data],
    ["url", url],
    ["urldate", acesso.toISOString().slice(0, 10)],
  ];
  return `@online{${key},\n${campos.map(([k, v]) => `  ${k.padEnd(8)} = {${k === "author" ? v : bibtexEscape(v)}}`).join(",\n")}\n}`;
}
