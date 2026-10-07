import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { sections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: sections.publique.label,
  description: sections.publique.description,
};

export default function Page() {
  return <ComingSoon section="publique" phase={3} />;
}
