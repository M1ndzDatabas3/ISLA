import { estados, type SiglaUF } from "@/lib/estados";
import { municipiosDe } from "@/lib/localidades";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return estados.map((e) => ({ uf: e.sigla }));
}

/** Lista de municípios de uma UF, gerada no build (fonte: IBGE). */
export async function GET(_request: Request, { params }: { params: Promise<{ uf: string }> }) {
  const { uf } = await params;
  return Response.json(municipiosDe(uf as SiglaUF), {
    headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
  });
}
