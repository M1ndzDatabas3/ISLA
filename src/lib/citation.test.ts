import { describe, expect, it } from "vitest";

import {
  abntAuthorName,
  abntBook,
  abntDate,
  abntOnlineArticle,
  bibtexAuthorName,
  bibtexBook,
  citationToText,
} from "./citation";

describe("ABNT", () => {
  it("inverte nomes de autor", () => {
    expect(abntAuthorName("Karl Marx")).toBe("MARX, Karl");
    expect(abntAuthorName("Ruy Mauro Marini")).toBe("MARINI, Ruy Mauro");
    expect(abntAuthorName("Caio Prado Júnior")).toBe("PRADO JÚNIOR, Caio");
    expect(abntAuthorName("Theotonio dos Santos")).toBe("SANTOS, Theotonio dos");
    expect(abntAuthorName("José Carlos Mariátegui")).toBe("MARIÁTEGUI, José Carlos");
  });

  it("formata datas", () => {
    expect(abntDate(new Date("2026-10-07T12:00:00Z"))).toBe("7 out. 2026");
    expect(abntDate(new Date("2026-05-01T12:00:00Z"))).toBe("1 maio 2026");
  });

  it("monta referência de livro com tradução e edição", () => {
    const ref = abntBook({
      autores: ["Karl Marx"],
      titulo: "O capital: crítica da economia política",
      ano: 1867,
      edicao: { editora: "Boitempo", cidade: "São Paulo", ano: 2013, tradutor: "Rubens Enderle" },
    });
    expect(ref.emphasis).toBe("O capital");
    expect(citationToText(ref)).toBe(
      "MARX, Karl. O capital: crítica da economia política. Tradução de Rubens Enderle. São Paulo: Boitempo, 2013.",
    );
  });

  it("usa [S. l.] e [s. n.] quando falta a edição", () => {
    const ref = abntBook({
      autores: ["Karl Marx", "Friedrich Engels"],
      titulo: "Manifesto do Partido Comunista",
      ano: 1848,
    });
    expect(citationToText(ref)).toBe(
      "MARX, Karl; ENGELS, Friedrich. Manifesto do Partido Comunista. [S. l.]: [s. n.], 1848.",
    );
  });

  it("monta referência de artigo on-line", () => {
    const ref = abntOnlineArticle({
      titulo: "O que é mais-valia",
      site: "Instituto Socialista Latino-Americano",
      data: "2026-09-10",
      url: "https://exemplo.org/artigos/o-que-e-mais-valia",
      acesso: new Date("2026-10-07T12:00:00Z"),
    });
    expect(citationToText(ref)).toBe(
      "INSTITUTO SOCIALISTA LATINO-AMERICANO. O que é mais-valia. Instituto Socialista Latino-Americano, 10 set. 2026. Disponível em: https://exemplo.org/artigos/o-que-e-mais-valia. Acesso em: 7 out. 2026.",
    );
  });
});

describe("BibTeX", () => {
  it("formata nomes e entrada de livro", () => {
    expect(bibtexAuthorName("Caio Prado Júnior")).toBe("Prado Júnior, Caio");
    const bib = bibtexBook({
      autores: ["Karl Marx", "Friedrich Engels"],
      titulo: "Manifesto do Partido Comunista",
      ano: 1848,
    });
    expect(bib).toContain("@book{marx1848manifesto,");
    expect(bib).toContain("author     = {Marx, Karl and Engels, Friedrich}");
  });
});
