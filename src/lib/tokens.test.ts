import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { contrastRatio, palette, paletteDark } from "./tokens";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

const cssVar = (name: string) => {
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  return match?.[1]?.toUpperCase();
};

describe("tokens", () => {
  it("tokens.ts e globals.css têm a mesma paleta", () => {
    const map: Record<keyof typeof palette, string> = {
      paper: "paper",
      ink: "ink",
      inkMuted: "ink-muted",
      red: "red",
      redDark: "red-dark",
      redText: "red-text",
      hair: "hair-light",
    };
    for (const [key, cssName] of Object.entries(map)) {
      expect(cssVar(cssName), cssName).toBe(palette[key as keyof typeof palette]);
    }
  });

  it("pares de texto passam no WCAG AA (4,5:1)", () => {
    const pairs: [string, string][] = [
      [palette.ink, palette.paper],
      [palette.inkMuted, palette.paper],
      [palette.red, palette.paper],
      [palette.redText, palette.paper],
      [palette.paper, palette.red],
      [palette.paper, palette.redDark],
      [paletteDark.foreground, paletteDark.background],
      [paletteDark.foreground, paletteDark.surface],
      [paletteDark.muted, paletteDark.background],
      [paletteDark.redText, paletteDark.background],
      [paletteDark.redText, paletteDark.surface],
      [paletteDark.foreground, paletteDark.red],
    ];
    for (const [fg, bg] of pairs) {
      expect(contrastRatio(fg, bg), `${fg} sobre ${bg}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});
