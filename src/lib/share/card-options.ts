/**
 * Opções do card de citação (/og/citacao), compartilhadas entre a rota e o
 * modal de compartilhar. Sem dependências de servidor.
 */

/** Tamanho máximo de um trecho de artigo no card. */
export const LIMITE_DO_TRECHO = 400;

export const formatosDoCard = [
  { id: "quadrado", label: "Quadrado", detalhe: "Feed do Instagram", largura: 1080, altura: 1080 },
  {
    id: "stories",
    label: "Stories",
    detalhe: "Stories e status, 9:16",
    largura: 1080,
    altura: 1920,
  },
  { id: "link", label: "Link", detalhe: "WhatsApp, X e Bluesky", largura: 1200, altura: 630 },
] as const;

export const temasDoCard = [
  { id: "papel", label: "Papel", amostra: "#F3EEE4" },
  { id: "tinta", label: "Tinta", amostra: "#111111" },
  { id: "vermelho", label: "Vermelho", amostra: "#C8102E" },
] as const;

export type FormatoDoCard = (typeof formatosDoCard)[number]["id"];
export type TemaDoCard = (typeof temasDoCard)[number]["id"];

/** De onde vem o texto: citação curada (content/citacoes) ou trecho de artigo. */
export type FonteDoCard = { id: string } | { artigo: string; texto: string };

export const isFormato = (v: string | null): v is FormatoDoCard =>
  formatosDoCard.some((f) => f.id === v);
export const isTema = (v: string | null): v is TemaDoCard => temasDoCard.some((t) => t.id === v);

export function urlDoCard(fonte: FonteDoCard, formato: FormatoDoCard, tema: TemaDoCard) {
  const params = new URLSearchParams(
    "id" in fonte ? { id: fonte.id } : { artigo: fonte.artigo, texto: fonte.texto },
  );
  params.set("formato", formato);
  params.set("tema", tema);
  return `/og/citacao?${params.toString()}`;
}

/**
 * Fragmento de texto (#:~:text=) para o navegador rolar até o trecho e
 * destacá-lo. Trechos longos usam início e fim, que resistem melhor a notas
 * de rodapé e quebras de parágrafo no meio.
 */
export function fragmentoDeTexto(texto: string) {
  const limpo = texto.replace(/\s+/g, " ").trim();
  // "-", "," e "&" têm sentido especial na sintaxe do fragmento.
  const codificar = (s: string) =>
    encodeURIComponent(s).replace(/-/g, "%2D").replace(/,/g, "%2C").replace(/&/g, "%26");
  const palavras = limpo.split(" ");
  if (palavras.length <= 8) return `#:~:text=${codificar(limpo)}`;
  return `#:~:text=${codificar(palavras.slice(0, 4).join(" "))},${codificar(palavras.slice(-4).join(" "))}`;
}
