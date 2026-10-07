import type { NextRequest } from "next/server";

import { quoteCardImage } from "@/lib/og/quote-card";
import { isFormato, isTema } from "@/lib/share/card-options";
import { resolverCard } from "@/lib/share/quote-card";

/**
 * Card de citação para redes sociais.
 * - Citação do acervo: ?id=<slug em content/citacoes>
 * - Trecho de artigo: ?artigo=<slug>&texto=<seleção do leitor>. Só sai imagem se o
 *   trecho existir no corpo do artigo (até 400 caracteres); senão, 400 com o motivo.
 * - &formato=quadrado|stories|link e &tema=papel|tinta|vermelho.
 * Os parâmetros definem a imagem, então a CDN guarda a resposta até o próximo deploy.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const resultado = resolverCard(params);
  if (!resultado.ok) {
    return new Response(resultado.mensagem, {
      status: resultado.status,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  const formato = params.get("formato");
  const tema = params.get("tema");
  return quoteCardImage(
    resultado.dados,
    isFormato(formato) ? formato : "quadrado",
    isTema(tema) ? tema : "papel",
    {
      "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800",
    },
  );
}
