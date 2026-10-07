import { describe, expect, it } from "vitest";

import { curlyQuotes } from "./typography";

describe("aspas tipográficas", () => {
  it("abre e fecha aspas", () => {
    expect(curlyQuotes('O capítulo "Sentido da colonização", de 1942')).toBe(
      "O capítulo “Sentido da colonização”, de 1942",
    );
    expect(curlyQuotes('"Racismo e sexismo" foi apresentado')).toBe(
      "“Racismo e sexismo” foi apresentado",
    );
  });

  it("deixa texto sem aspas intacto", () => {
    expect(curlyQuotes("sem aspas")).toBe("sem aspas");
  });
});
