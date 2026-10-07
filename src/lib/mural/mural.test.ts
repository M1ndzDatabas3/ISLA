import { describe, expect, it } from "vitest";

import { findBrokenMuralReferences, getCartazes, getObras, localDoArtista } from "./index";

describe("Mural", () => {
  it("não tem referências quebradas", () => {
    expect(findBrokenMuralReferences()).toEqual([]);
  });

  it("só oferece download de obras com licença Creative Commons", () => {
    for (const obra of getCartazes()) expect(obra.licenca.startsWith("cc-")).toBe(true);
  });

  it("toda imagem de obra tem texto alternativo e dimensões", () => {
    for (const obra of getObras())
      for (const img of obra.imagens) {
        expect(img.alt.length).toBeGreaterThanOrEqual(15);
        expect(img.largura).toBeGreaterThan(0);
      }
  });

  it("formata o local do artista", () => {
    expect(localDoArtista({ cidade: "Caruaru", estado: "PE", pais: "Brasil" })).toBe("Caruaru, PE");
    expect(localDoArtista({ cidade: "Valparaíso", estado: undefined, pais: "Chile" })).toBe(
      "Valparaíso, Chile",
    );
  });
});
