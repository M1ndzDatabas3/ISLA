import { getAutor } from "@/lib/content";
import { formatLifespan } from "@/lib/format";
import { ogSize, renderContentCard } from "@/lib/og/content-card";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Autor no acervo do Instituto Socialista Latino-Americano";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const autor = getAutor(slug);
  if (!autor) return renderContentCard({ kicker: "Autores", title: "Autor não encontrado" });
  return renderContentCard({
    kicker: "Autores",
    title: autor.nome,
    subtitle: autor.bioCurta,
    meta: [formatLifespan(autor.nascimento, autor.morte), autor.nacionalidade]
      .filter(Boolean)
      .join(", "),
  });
}
