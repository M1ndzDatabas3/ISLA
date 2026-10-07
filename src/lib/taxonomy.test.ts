import { describe, expect, it } from "vitest";

import { areas, labelOf, levelIndex, niveis, regioes, tradicoes } from "./taxonomy";

describe("taxonomia", () => {
  it("não tem slugs repetidos", () => {
    for (const list of [tradicoes, areas, regioes, niveis]) {
      const slugs = list.map((t) => t.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it("traduz slugs em rótulos e falha em slug desconhecido", () => {
    expect(labelOf("tradicao", "teoria-marxista-da-dependencia")).toBe(
      "Teoria marxista da dependência",
    );
    expect(() => labelOf("area", "inexistente")).toThrow();
  });

  it("ordena níveis", () => {
    expect(levelIndex("introdutorio")).toBe(1);
    expect(levelIndex("avancado")).toBe(3);
  });
});
