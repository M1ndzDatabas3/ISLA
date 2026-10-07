import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { sections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: sections.debates.label,
  description: sections.debates.description,
};

export default function Page() {
  return <ComingSoon section="debates" phase={3} />;
}
