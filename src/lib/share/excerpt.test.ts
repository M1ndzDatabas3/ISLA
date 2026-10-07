import { describe, expect, it } from "vitest";

import { allArtigos } from "content-collections";

import { encontrarTrecho, segmentosDoArtigo, textoPlano } from "./excerpt";

const mdx = `Mais-valia é o nome que Marx deu à parte do valor produzido, no centro de *O capital*, publicado em 1867, e responde: de onde vem o lucro?[^1]

## Uma mercadoria especial

A resposta está na <Termo slug="forca-de-trabalho">força de trabalho</Termo>, isto é, a capacidade de trabalhar.

Em 1929 houve críticas às teses peruanas [CONFERIR]. Depois o partido mudou de nome.

<Citacao autor="caio-prado-junior" fonte="Formação do Brasil contemporâneo (1942)">Nada mais que isto.</Citacao>

[^1]: MARX, Karl. O capital. Uma nota que não entra no card.
`;

const segmentos = segmentosDoArtigo(mdx);

describe("textoPlano", () => {
  it("tira a marcação e mantém o texto de componentes e links", () => {
    expect(
      textoPlano('Veja [o verbete](/glossario/x) e *ênfase* com <Termo slug="a">termo</Termo>.'),
    ).toBe("Veja o verbete e ênfase com termo.");
  });
});

describe("encontrarTrecho", () => {
  it("acha o trecho ignorando aspas, hífens, pontuação e marcação", () => {
    const r = encontrarTrecho("mais valia é o nome que Marx deu", segmentos);
    expect(r).toEqual({
      ok: true,
      texto: "Mais-valia é o nome que Marx deu",
      segmento: segmentos[0],
    });
  });

  it("devolve o texto do artigo, não o da seleção", () => {
    const r = encontrarTrecho("no centro de “O capital”, publicado em 1867", segmentos);
    expect(r.ok && r.texto).toBe("no centro de O capital, publicado em 1867");
  });

  it("completa palavras cortadas nas pontas", () => {
    const r = encontrarTrecho("ais-valia é o nome que Mar", segmentos);
    expect(r.ok && r.texto).toBe("Mais-valia é o nome que Marx");
  });

  // O navegador tira o número sobrescrito da nota antes de enviar a seleção.
  it("atravessa a chamada de nota e o título seguinte", () => {
    const r = encontrarTrecho("de onde vem o lucro? Uma mercadoria", segmentos);
    expect(r.ok && r.texto).toBe("de onde vem o lucro? Uma mercadoria");
  });

  it("atribui a citação ao autor citado", () => {
    const r = encontrarTrecho("Nada mais que isto.", segmentos);
    expect(r.ok && r.segmento).toMatchObject({ tipo: "citacao", autor: "caio-prado-junior" });
    expect(r.ok && r.texto).toBe("Nada mais que isto.");
  });

  it("recusa trecho que não está no artigo", () => {
    expect(encontrarTrecho("o lucro vem da troca desigual de mercadorias", segmentos)).toEqual({
      ok: false,
      motivo: "inexistente",
    });
  });

  it("recusa a frase que termina num dado em revisão, mesmo sem a marca selecionada", () => {
    expect(encontrarTrecho("Em 1929 houve críticas às teses peruanas", segmentos)).toEqual({
      ok: false,
      motivo: "em-revisao",
    });
    expect(encontrarTrecho("Depois o partido mudou de nome.", segmentos).ok).toBe(true);
  });

  it("recusa trecho com dado em revisão", () => {
    expect(encontrarTrecho("críticas às teses peruanas. Depois o partido", segmentos)).toEqual({
      ok: false,
      motivo: "em-revisao",
    });
  });

  it("recusa seleção curta demais e trecho acima de 400 caracteres", () => {
    expect(encontrarTrecho("Marx", segmentos)).toEqual({ ok: false, motivo: "curto" });
    const longo = segmentosDoArtigo(`${"palavra ".repeat(80)}fim`);
    expect(encontrarTrecho(`${"palavra ".repeat(60)}fim`, longo)).toEqual({
      ok: false,
      motivo: "longo",
    });
  });

  it("não usa as notas de rodapé", () => {
    expect(encontrarTrecho("Uma nota que não entra no card", segmentos).ok).toBe(false);
  });

  it("encontra parágrafos reais dos artigos publicados", () => {
    for (const artigo of allArtigos) {
      const segs = segmentosDoArtigo(artigo.content);
      const prosa = segs[0]!.texto.replace(/\u0000/g, "");
      const frase = prosa.split(/\n\n/).find((p) => p.length > 80 && !p.includes("http"))!;
      const pedaco = frase.replace(/\s+/g, " ").trim().slice(0, 120);
      const r = encontrarTrecho(pedaco, segs);
      expect(r.ok, `${artigo.slug}: ${pedaco}`).toBe(true);
    }
  });
});
