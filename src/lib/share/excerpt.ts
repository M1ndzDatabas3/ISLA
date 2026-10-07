/**
 * Trechos de artigo que podem virar card de citação. O card leva a marca do
 * Instituto, então o texto nunca vem do parâmetro: a busca localiza o trecho
 * no corpo do artigo e o card mostra o texto do próprio artigo, com a
 * atribuição derivada dos dados (assinatura do artigo ou autor do <Citacao>).
 * Funções puras (testadas em excerpt.test.ts).
 */
import { curlyQuotes } from "@/lib/typography";

import { LIMITE_DO_TRECHO } from "./card-options";

export { LIMITE_DO_TRECHO };
/** Abaixo disso o trecho não diz nada sozinho (contando só letras e números). */
const MINIMO_DE_CARACTERES = 12;

export type Segmento =
  | { tipo: "prosa"; texto: string }
  | { tipo: "citacao"; texto: string; autor: string; fonte?: string };

export type TrechoEncontrado =
  | { ok: true; texto: string; segmento: Segmento }
  | { ok: false; motivo: "curto" | "longo" | "inexistente" | "em-revisao" };

/** Marca invisível no lugar de um [CONFERIR]: trecho que a contém não vira card. */
const EM_REVISAO = "\u0000";

const atributos = (bruto: string) =>
  Object.fromEntries([...bruto.matchAll(/(\w+)="([^"]*)"/g)].map((m) => [m[1]!, m[2]!]));

/** Markdown/MDX → texto corrido, como o leitor vê na página. */
export function textoPlano(md: string): string {
  return md
    .replace(/\[\^[^\]]+\](?!:)/g, "") // chamadas de nota (o número sobrescrito)
    .replace(/\[CONFERIR[^\]]*\]/g, EM_REVISAO)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // imagens
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links: fica o texto
    .replace(/<\/?[A-Za-z][^>]*>/g, "") // componentes (<Termo>…): fica o texto de dentro
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "")
    .replace(/(\*\*|__|\*|`)/g, "")
    .replace(/(^|\s)_([^_]+)_(?=[\s.,;:!?)]|$)/g, "$1$2");
}

/**
 * Divide o MDX de um artigo em prosa (assinada pelo artigo) e citações
 * (<Citacao autor="…">, de outra pessoa). Notas de rodapé ficam de fora.
 */
export function segmentosDoArtigo(mdx: string): Segmento[] {
  const semNotas = mdx.replace(/^\[\^[^\]]+\]:[^\n]*(?:\n(?: {2,}|\t)[^\n]*)*/gm, "");
  const citacoes: Segmento[] = [];
  const prosa = semNotas.replace(
    /<Citacao\b([^>]*)>([\s\S]*?)<\/Citacao>/g,
    (_, attrs: string, texto: string) => {
      const { autor, fonte } = atributos(attrs);
      if (autor) {
        citacoes.push({
          tipo: "citacao",
          texto: textoPlano(texto),
          autor,
          ...(fonte ? { fonte } : {}),
        });
      }
      return "\n\n";
    },
  );
  return [{ tipo: "prosa", texto: textoPlano(prosa) }, ...citacoes];
}

const alfanumerico = /[\p{L}\p{N}]/u;
const ABRE = /[(\[“‘«"'¿¡]/;
const FECHA = /[.,;:!?…)\]”’»"']/;

/** Só letras e números, em minúsculas, com o índice de cada um no texto original. */
function normalizar(texto: string) {
  let chars = "";
  const indices: number[] = [];
  for (let i = 0; i < texto.length; i++) {
    const ch = texto[i]!;
    if (alfanumerico.test(ch)) {
      chars += ch.toLocaleLowerCase("pt-BR");
      indices.push(i);
    }
  }
  return { chars, indices };
}

/**
 * Procura a seleção do leitor nos segmentos do artigo. Aspas, hífens,
 * pontuação, espaços e marcação não contam na comparação; o trecho devolvido
 * é o do artigo, estendido até palavras inteiras.
 */
export function encontrarTrecho(selecao: string, segmentos: Segmento[]): TrechoEncontrado {
  const consulta = selecao.normalize("NFC").trim();
  const alvo = normalizar(consulta).chars;
  if (alvo.length < MINIMO_DE_CARACTERES) return { ok: false, motivo: "curto" };

  for (const segmento of segmentos) {
    const fonte = segmento.texto.normalize("NFC");
    const { chars, indices } = normalizar(fonte);
    const pos = chars.indexOf(alvo);
    if (pos < 0) continue;

    let inicio = indices[pos]!;
    let fim = indices[pos + alvo.length - 1]! + 1;
    // Palavras inteiras: uma seleção que começou no meio da palavra não corta o card.
    while (inicio > 0 && alfanumerico.test(fonte[inicio - 1]!)) inicio--;
    while (fim < fonte.length && alfanumerico.test(fonte[fim]!)) fim++;
    // Pontuação nas pontas só entra se o leitor também a selecionou.
    if (!alfanumerico.test(consulta[0]!))
      while (inicio > 0 && ABRE.test(fonte[inicio - 1]!)) inicio--;
    if (!alfanumerico.test(consulta[consulta.length - 1]!))
      while (fim < fonte.length && FECHA.test(fonte[fim]!)) fim++;

    const trecho = fonte.slice(inicio, fim);
    // O [CONFERIR] vale para a afirmação inteira: vem logo antes do ponto final.
    const fimDaFrase = fonte.slice(fim).search(/[.!?](\s|$)/);
    const frase = fonte.slice(inicio, fimDaFrase < 0 ? fonte.length : fim + fimDaFrase + 1);
    if (frase.includes(EM_REVISAO)) return { ok: false, motivo: "em-revisao" };
    const texto = curlyQuotes(
      trecho.replace(/\s+/g, " ").trim(),
      fonte[inicio - 1] ?? "",
      fonte[fim] ?? "",
    );
    if (texto.length > LIMITE_DO_TRECHO) return { ok: false, motivo: "longo" };
    return { ok: true, texto, segmento };
  }
  return { ok: false, motivo: "inexistente" };
}
