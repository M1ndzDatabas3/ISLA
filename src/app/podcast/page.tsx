import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { sections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: sections.podcast.label,
  description: sections.podcast.description,
};

export default function Page() {
  return <ComingSoon section="podcast" phase={3} />;
}
