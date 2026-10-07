import { ComingSoon, comingSoonMetadata } from "@/components/layout/coming-soon";

export const metadata = comingSoonMetadata("podcast");

export default function Page() {
  return <ComingSoon section="podcast" />;
}
