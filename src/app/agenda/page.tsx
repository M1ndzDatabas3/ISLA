import { ComingSoon, comingSoonMetadata } from "@/components/layout/coming-soon";

export const metadata = comingSoonMetadata("agenda");

export default function Page() {
  return <ComingSoon section="agenda" />;
}
