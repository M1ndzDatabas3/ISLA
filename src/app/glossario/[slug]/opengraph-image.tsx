import { getConceito } from "@/lib/content";
import { ogSize, renderContentCard } from "@/lib/og/content-card";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Verbete do glossário do Instituto Socialista Latino-Americano";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const conceito = getConceito(slug);
  if (!conceito) return renderContentCard({ kicker: "Glossário", title: "Verbete não encontrado" });
  return renderContentCard({
    kicker: "Glossário",
    title: conceito.termo,
    subtitle: conceito.definicaoCurta,
  });
}
