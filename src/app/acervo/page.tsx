import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { sections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: sections.acervo.label,
  description: sections.acervo.description,
};

export default function Page() {
  return <ComingSoon section="acervo" phase={3} />;
}
