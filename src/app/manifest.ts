import type { MetadataRoute } from "next";

import { brandIcons } from "@/lib/brand";
import { palette } from "@/lib/tokens";
import { siteConfig } from "@/site.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    lang: siteConfig.locale,
    start_url: "/",
    display: "standalone",
    background_color: palette.paper,
    theme_color: palette.red,
    icons: [{ src: brandIcons.icon512.src, sizes: "512x512", type: "image/png" }],
  };
}
