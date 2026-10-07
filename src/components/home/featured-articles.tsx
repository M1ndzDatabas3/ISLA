import { ArticleCard } from "@/components/editorial/article-card";
import { SectionHeading } from "@/components/editorial/section-heading";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { getArtigosDestaque } from "@/lib/content";
import { toArticleCard } from "@/lib/content/summaries";

/** Destaques editoriais: um texto em destaque e uma coluna de leituras recentes. */
export function FeaturedArticles() {
  const artigos = getArtigosDestaque();
  const [principal, ...resto] = artigos;
  if (!principal) return null;

  return (
    <Section tone="paper">
      <SectionHeading
        title="Destaques"
        description="Ensaios, resenhas e verbetes da redação, com fontes e indicações de leitura."
        action={{ label: "Todos os artigos", href: "/artigos" }}
      />
      <Reveal className="grid-page gap-y-12">
        <div data-reveal className="col-span-12 lg:col-span-7">
          <ArticleCard article={toArticleCard(principal)} variant="feature" />
        </div>
        <div className="col-span-12 lg:col-span-4 lg:col-start-9">
          {resto.slice(0, 4).map((artigo) => (
            <div key={artigo.slug} data-reveal>
              <ArticleCard article={toArticleCard(artigo)} variant="compact" />
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
