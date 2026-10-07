import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { sections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: sections.mapa.label,
  description: sections.mapa.description,
};

export default function Page() {
  return <ComingSoon section="mapa" phase={3} />;
}
