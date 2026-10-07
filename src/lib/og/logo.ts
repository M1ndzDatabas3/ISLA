import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { officialLogo, type LogoFileTone } from "@/lib/brand";

/** Logo oficial (PNG/SVG de public/brand) como data URL para o Satori, ou null se não existir. */
export async function officialLogoData(tone: LogoFileTone = "color") {
  const logo = officialLogo("horizontal", tone);
  if (!logo?.width || !logo.height) return null;
  const data = await readFile(join(process.cwd(), "public", logo.src));
  return {
    src: `data:${logo.type};base64,${data.toString("base64")}`,
    ratio: logo.width / logo.height,
  };
}
