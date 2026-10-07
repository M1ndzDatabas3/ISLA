import { palette } from "@/lib/tokens";

/** Símbolo provisório em SVG puro (favicon). */
export function brandMarkSvg({ size }: { size: number }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"><rect width="24" height="24" fill="${palette.red}"/><path d="M0 24 L24 0" stroke="${palette.paper}" stroke-width="2"/></svg>`;
}

/** Versão JSX do símbolo para dentro de ImageResponse. */
export function BrandMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" fill={palette.red} />
      <path d="M0 24 L24 0" stroke={palette.paper} strokeWidth="2" />
    </svg>
  );
}
