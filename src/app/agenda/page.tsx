import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { sections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: sections.agenda.label,
  description: sections.agenda.description,
};

export default function Page() {
  return <ComingSoon section="agenda" phase={3} />;
}
