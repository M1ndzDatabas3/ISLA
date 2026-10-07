/** Regiões do Brasil (pelo estado) e "América Latina" para artistas de outros países. */

export const regioesDoMural = [
  { slug: "norte", label: "Norte" },
  { slug: "nordeste", label: "Nordeste" },
  { slug: "centro-oeste", label: "Centro-Oeste" },
  { slug: "sudeste", label: "Sudeste" },
  { slug: "sul", label: "Sul" },
  { slug: "america-latina", label: "Outros países" },
] as const;

const porUF: Record<string, (typeof regioesDoMural)[number]["slug"]> = {
  AC: "norte",
  AP: "norte",
  AM: "norte",
  PA: "norte",
  RO: "norte",
  RR: "norte",
  TO: "norte",
  AL: "nordeste",
  BA: "nordeste",
  CE: "nordeste",
  MA: "nordeste",
  PB: "nordeste",
  PE: "nordeste",
  PI: "nordeste",
  RN: "nordeste",
  SE: "nordeste",
  DF: "centro-oeste",
  GO: "centro-oeste",
  MT: "centro-oeste",
  MS: "centro-oeste",
  ES: "sudeste",
  MG: "sudeste",
  RJ: "sudeste",
  SP: "sudeste",
  PR: "sul",
  RS: "sul",
  SC: "sul",
};

export function regiaoDoArtista(a: { estado?: string; pais: string }) {
  if (a.pais !== "Brasil") return "america-latina";
  return (a.estado && porUF[a.estado.toUpperCase()]) || "sudeste";
}

export const labelDaRegiao = (slug: string) =>
  regioesDoMural.find((r) => r.slug === slug)?.label ?? slug;
