import { describe, expect, it } from "vitest";

import { findBrokenReferences, getArtigos, getAutores, getConceitos, getLivros } from "./index";

describe("conteúdo", () => {
  it("não tem referências quebradas entre coleções", () => {
    expect(findBrokenReferences()).toEqual([]);
  });

  it("tem o mínimo para a home funcionar", () => {
    expect(getLivros().length).toBeGreaterThan(0);
    expect(getAutores().length).toBeGreaterThan(0);
    expect(getConceitos().length).toBeGreaterThan(0);
    expect(getArtigos().length).toBeGreaterThanOrEqual(0);
  });
});
