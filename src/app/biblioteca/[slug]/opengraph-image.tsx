import { getAutoresBySlugs, getLivro } from "@/lib/content";
import { joinNames } from "@/lib/content/summaries";
import { ogSize, renderContentCard } from "@/lib/og/content-card";
import { labelOf } from "@/lib/taxonomy";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Livro da biblioteca comentada do Instituto Socialista Latino-Americano";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const livro = getLivro(slug);
  if (!livro) return renderContentCard({ kicker: "Biblioteca", title: "Livro não encontrado" });
  const autores = joinNames(getAutoresBySlugs(livro.autores).map((a) => a.nome));
  return renderContentCard({
    kicker: "Biblioteca comentada",
    title: livro.tituloCapa ?? livro.titulo,
    subtitle: `${autores}, ${livro.ano}`,
    meta: `Nível ${labelOf("nivel", livro.nivel).toLowerCase()}`,
  });
}
