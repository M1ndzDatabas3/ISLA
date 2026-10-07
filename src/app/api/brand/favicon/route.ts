import { brandMarkSvg } from "@/lib/og/brand-mark";

// TODO: substituído automaticamente por public/brand/favicon.svg quando o arquivo existir.
export const dynamic = "force-static";

export function GET() {
  return new Response(brandMarkSvg({ size: 32 }), {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" },
  });
}
