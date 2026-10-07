import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { sections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: sections.cultura.label,
  description: sections.cultura.description,
};

export default function Page() {
  return <ComingSoon section="cultura" phase={3} />;
}
