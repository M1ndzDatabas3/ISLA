import { ComingSoon, comingSoonMetadata } from "@/components/layout/coming-soon";

export const metadata = comingSoonMetadata("debates");

export default function Page() {
  return <ComingSoon section="debates" />;
}
