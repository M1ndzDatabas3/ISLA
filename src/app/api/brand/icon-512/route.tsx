import { ImageResponse } from "next/og";

import { BrandMark } from "@/lib/og/brand-mark";
import { palette } from "@/lib/tokens";

// TODO: substituído por public/brand/icon-512.png quando o arquivo existir.
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: palette.paper,
      }}
    >
      <BrandMark size={340} />
    </div>,
    { width: 512, height: 512 },
  );
}
