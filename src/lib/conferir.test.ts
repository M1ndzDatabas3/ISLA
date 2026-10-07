import { describe, expect, it } from "vitest";

import { conferirLabel, known, splitConferir } from "./conferir";

describe("marcações [CONFERIR]", () => {
  it("gera rótulos legíveis", () => {
    expect(conferirLabel("[CONFERIR]")).toBe("a conferir");
    expect(conferirLabel("[CONFERIR tradução]")).toBe("tradução a conferir");
  });

  it("separa texto e marcas", () => {
    expect(splitConferir("Rodnei Nascimento [CONFERIR]")).toEqual([
      { kind: "text", value: "Rodnei Nascimento " },
      { kind: "mark", label: "a conferir" },
    ]);
    expect(splitConferir("sem marca")).toEqual([{ kind: "text", value: "sem marca" }]);
  });

  it("descarta valores em revisão", () => {
    expect(known("[CONFERIR]")).toBeUndefined();
    expect(known(2000)).toBe(2000);
  });
});
