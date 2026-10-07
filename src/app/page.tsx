import type { Organization, WebSite } from "schema-dts";

import { FeaturedArticles } from "@/components/home/featured-articles";
import { Hero } from "@/components/home/hero";
import { LibraryHighlight } from "@/components/home/library-highlight";
import { MuralSection } from "@/components/home/mural-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { QuoteMarquee } from "@/components/home/quote-marquee";
import { FeaturedQuote } from "@/components/home/featured-quote";
import { TimelinePreview } from "@/components/home/timeline-preview";
import { TrilhasRail } from "@/components/home/trilhas-rail";
import { JsonLd } from "@/components/seo/json-ld";
import { brandIcons } from "@/lib/brand";
import { siteConfig } from "@/site.config";

export default function HomePage() {
  const organization: Organization = {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organizacao`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${brandIcons.icon512.src}`,
    description: siteConfig.description,
  };
  const website: WebSite = {
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "pt-BR",
    publisher: { "@id": `${siteConfig.url}/#organizacao` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/busca?q={search_term_string}`,
      // @ts-expect-error query-input é aceito pelo Google, mas não está no schema-dts
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [organization, website] }} />
      <Hero />
      <FeaturedQuote />
      <FeaturedArticles />
      <QuoteMarquee />
      <TrilhasRail />
      <LibraryHighlight />
      <MuralSection />
      <TimelinePreview divider={false} />
      <NewsletterSection />
    </>
  );
}
