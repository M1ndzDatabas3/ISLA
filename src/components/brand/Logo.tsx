import { officialLogo, type BrandFile, type LogoFileTone, type LogoVariant } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/site.config";

export type LogoTone = "auto" | LogoFileTone;

interface LogoProps {
  variant?: LogoVariant;
  /**
   * - `auto`: segue o tema e a cor do texto ao redor (padrão).
   * - `color`: versão principal, para fundo branco.
   * - `light`: para fundos preto e vermelho.
   * - `dark`: monocromática em preto.
   */
  tone?: LogoTone;
  /** A logo mede 1em de altura: controle o tamanho com font-size (ex.: `text-[40px]`). */
  className?: string;
  /** Use quando a logo estiver dentro de um link ou botão que já tem nome acessível. */
  decorative?: boolean;
}

/** Quebras de linha do nome no placeholder. */
const nameLines: Record<Exclude<LogoVariant, "simbolo">, string[]> = {
  horizontal: ["Instituto Socialista", "Latino-Americano"],
  vertical: ["Instituto Socialista", "Latino-Americano"],
};

/**
 * Logo do Instituto. Único ponto de uso da marca no site.
 * Usa os arquivos oficiais de public/brand/ quando existem (ver README.md lá).
 */
export function Logo({ variant = "horizontal", tone = "auto", className, decorative }: LogoProps) {
  const a11y = decorative
    ? ({ "aria-hidden": true } as const)
    : ({ role: "img", "aria-label": siteConfig.name } as const);

  const official = officialLogo(variant, tone === "auto" ? "color" : tone);

  if (official) {
    const light = officialLogo(variant, "light");
    return (
      <span {...a11y} className={cn("inline-flex text-[28px] leading-none", className)}>
        {tone === "auto" && light && light.src !== official.src ? (
          <>
            <OfficialImage file={official} className="dark:hidden" />
            <OfficialImage file={light} className="hidden dark:block" />
          </>
        ) : (
          <OfficialImage file={official} />
        )}
      </span>
    );
  }

  // Placeholder: só aparece se não houver arquivo oficial da variação em public/brand/.
  return (
    <span
      {...a11y}
      data-logo-tone={tone}
      className={cn(
        "inline-flex text-[28px] leading-none",
        variant === "vertical" ? "flex-col items-start gap-[0.5em]" : "items-center gap-[0.42em]",
        tone === "color" || tone === "dark" ? "text-ink" : tone === "light" ? "text-paper" : null,
        className,
      )}
    >
      <PlaceholderSymbol tone={tone} />
      {variant !== "simbolo" ? (
        <span
          aria-hidden
          className="font-sans text-[0.46em] leading-[1.18] font-medium tracking-[-0.005em]"
        >
          {nameLines[variant].map((line) => (
            <span key={line} className="block whitespace-nowrap">
              {line}
            </span>
          ))}
        </span>
      ) : null}
    </span>
  );
}

function OfficialImage({ file, className }: { file: BrandFile; className?: string }) {
  return (
    // Arquivo estático da marca; largura e altura vêm do manifesto para não haver salto de layout.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={file.src}
      width={file.width}
      height={file.height}
      alt=""
      decoding="async"
      className={cn("h-[1em] w-auto max-w-none", className)}
    />
  );
}

/** Placeholder: quadrado vermelho cortado por uma diagonal fina. */
function PlaceholderSymbol({ tone }: { tone: LogoTone }) {
  const square = tone === "dark" ? "var(--ink)" : "var(--red)";
  const outlined = tone === "light";

  return (
    <svg aria-hidden viewBox="0 0 24 24" className="block size-[1em] shrink-0" focusable="false">
      <rect
        className="logo-square"
        x="0.5"
        y="0.5"
        width="23"
        height="23"
        fill={square}
        stroke={outlined ? "var(--paper)" : square}
        strokeWidth="1"
      />
      <path d="M0 24 L24 0" stroke="var(--paper)" strokeWidth="2" />
    </svg>
  );
}
