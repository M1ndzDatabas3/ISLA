import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { Section } from "@/components/layout/section";
import { sections } from "@/lib/navigation";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: sections.sobre.label,
  description: sections.sobre.description,
};

export default function Page() {
  return (
    <ComingSoon section="sobre" phase={3}>
      <Section tone="paper" className="border-t border-hair">
        <h2 id="linha-editorial" className="font-display text-h2">
          Linha editorial
        </h2>
        <p className="mt-6 max-w-[60ch] font-text text-lead text-muted-foreground">
          {siteConfig.editorialLine}
        </p>
      </Section>
    </ComingSoon>
  );
}
