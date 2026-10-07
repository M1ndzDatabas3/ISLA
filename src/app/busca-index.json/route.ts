import { buildSearchDocs } from "@/lib/search/build-index";

export const dynamic = "force-static";

/** Índice da busca, gerado no build e baixado só quando alguém busca. */
export function GET() {
  return Response.json(buildSearchDocs(), {
    headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
  });
}
