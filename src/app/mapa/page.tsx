import { ComingSoon, comingSoonMetadata } from "@/components/layout/coming-soon";

export const metadata = comingSoonMetadata("mapa");

export default function Page() {
  return <ComingSoon section="mapa" />;
}
