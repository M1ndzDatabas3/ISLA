/**
 * Dados do card de citação. A atribuição sai sempre do acervo (autor da
 * citação curada, assinatura do artigo ou autor do <Citacao>), nunca de um
 * parâmetro livre; o texto de um trecho é o do próprio artigo.
 */
import { getArtigo, getAutor, getCitacoes } from "@/lib/content";

import { encontrarTrecho, LIMITE_DO_TRECHO, segmentosDoArtigo } from "./excerpt";

export type DadosDoCard = {
  texto: string;
  /** Quem disse ou escreveu (caixa alta no card). */
  atribuicao: string;
  /** Obra e ano de origem. */
  fonte?: string;
  /** "Trecho de: …" ou "Citado em: …". */
  origem?: string;
  /** Página para onde o card leva (rodapé). */
  caminho: string;
};

export type ResultadoDoCard =
  { ok: true; dados: DadosDoCard } | { ok: false; status: 400 | 404; mensagem: string };

const erro = (status: 400 | 404, mensagem: string): ResultadoDoCard => ({
  ok: false,
  status,
  mensagem,
});

const mensagens = {
  curto: "Selecione um trecho maior: uma frase inteira funciona melhor.",
  longo: `O trecho passa de ${LIMITE_DO_TRECHO} caracteres. Selecione um trecho menor.`,
  inexistente: "Esse trecho não está no artigo. Selecione o texto direto na página.",
  "em-revisao": "Esse trecho tem um dado em revisão e ainda não pode virar imagem.",
} as const;

export function resolverCard(params: URLSearchParams): ResultadoDoCard {
  const id = params.get("id");
  if (id) {
    const citacao = getCitacoes().find((c) => c.slug === id);
    const autor = citacao ? getAutor(citacao.autor) : undefined;
    if (!citacao || !autor) return erro(404, "Citação não encontrada.");
    return {
      ok: true,
      dados: {
        texto: citacao.texto,
        atribuicao: autor.nome,
        fonte: citacao.fonte,
        caminho: `/autores/${autor.slug}`,
      },
    };
  }

  const slug = params.get("artigo");
  const selecao = params.get("texto");
  if (!slug || !selecao) return erro(400, "Informe uma citação do acervo ou um trecho de artigo.");
  const artigo = getArtigo(slug);
  if (!artigo) return erro(404, "Artigo não encontrado.");
  // Seleção muito maior que o limite nem precisa ser procurada.
  if (selecao.length > LIMITE_DO_TRECHO * 3) return erro(400, mensagens.longo);

  const trecho = encontrarTrecho(selecao, segmentosDoArtigo(artigo.content));
  if (!trecho.ok) return erro(400, mensagens[trecho.motivo]);
  const caminho = `/artigos/${artigo.slug}`;

  if (trecho.segmento.tipo === "citacao") {
    const autor = getAutor(trecho.segmento.autor);
    if (!autor) return erro(400, "Não foi possível identificar o autor desta citação.");
    return {
      ok: true,
      dados: {
        texto: trecho.texto,
        atribuicao: autor.nome,
        fonte: trecho.segmento.fonte,
        origem: `Citado em: ${artigo.titulo}`,
        caminho,
      },
    };
  }
  return {
    ok: true,
    dados: {
      texto: trecho.texto,
      atribuicao: artigo.assinatura,
      origem: `Trecho de: ${artigo.titulo}`,
      caminho,
    },
  };
}
