import { ComingSoon, comingSoonMetadata } from "@/components/layout/coming-soon";

export const metadata = comingSoonMetadata("acervo");

export default function Page() {
  return <ComingSoon section="acervo" />;
}
