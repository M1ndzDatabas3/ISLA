import { getArtigo } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { ogSize, renderContentCard } from "@/lib/og/content-card";
import { labelOf } from "@/lib/taxonomy";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Artigo do Instituto Socialista Latino-Americano";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artigo = getArtigo(slug);
  if (!artigo) return renderContentCard({ kicker: "Artigos", title: "Artigo não encontrado" });
  return renderContentCard({
    kicker: labelOf("tipoDeArtigo", artigo.tipo),
    title: artigo.titulo,
    subtitle: artigo.linhaFina,
    meta: `${artigo.assinatura}, ${formatDate(artigo.data)}`,
  });
}
