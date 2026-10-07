import { ComingSoon, comingSoonMetadata } from "@/components/layout/coming-soon";

export const metadata = comingSoonMetadata("cultura");

export default function Page() {
  return <ComingSoon section="cultura" />;
}
