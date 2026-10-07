import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { sections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: sections.trilhas.label,
  description: sections.trilhas.description,
};

export default function Page() {
  return <ComingSoon section="trilhas" phase={3} />;
}
