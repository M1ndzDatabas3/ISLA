/**
 * Municípios por UF (IBGE). Só no servidor: o arquivo completo tem ~85 KB;
 * o cliente busca a lista de um estado por vez em /municipios/[uf].
 */
import dados from "@/data/municipios.json";

import type { SiglaUF } from "./estados";

const municipios = dados.municipios as Record<SiglaUF, string[]>;

export function municipiosDe(uf: SiglaUF): string[] {
  return municipios[uf] ?? [];
}

export function municipioExiste(uf: SiglaUF, nome: string) {
  return municipiosDe(uf).includes(nome);
}
