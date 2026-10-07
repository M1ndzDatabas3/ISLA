import { describe, expect, it } from "vitest";

import { formatDate, formatLifespan, formatReadingTime, readingMinutes } from "./format";

describe("format", () => {
  it("formata datas curtas em pt-BR", () => {
    expect(formatDate("2026-10-07")).toBe("7 out. 2026");
  });

  it("arredonda tempo de leitura", () => {
    expect(formatReadingTime(13.6)).toBe("14 min");
    expect(formatReadingTime(0)).toBe("1 min");
    expect(readingMinutes("palavra ".repeat(1000))).toBe(5);
  });

  it("formata datas de vida", () => {
    expect(formatLifespan(1818, 1883)).toBe("1818–1883");
    expect(formatLifespan(1944)).toBe("1944–");
  });
});
