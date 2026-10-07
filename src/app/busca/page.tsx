import type { Metadata } from "next";
import { Suspense } from "react";

import { Section } from "@/components/layout/section";
import { SearchPageView } from "@/components/search/search-page";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { sections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: sections.busca.label,
  description: sections.busca.description,
  robots: { index: false, follow: true },
};

export default function BuscaPage() {
  return (
    <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
      <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Busca" }]} className="mb-10" />
      <h1 className="mb-10 font-display text-h1">
        Busca
        <i aria-hidden className="title-mark" />
      </h1>
      <div className="max-w-4xl">
        <Suspense fallback={null}>
          <SearchPageView />
        </Suspense>
      </div>
    </Section>
  );
}
