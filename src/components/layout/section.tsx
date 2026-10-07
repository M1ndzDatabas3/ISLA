import { cn } from "@/lib/utils";

export type SectionTone = "paper" | "surface" | "ink" | "red";

interface SectionProps extends React.ComponentProps<"section"> {
  tone?: SectionTone;
  /** Remove o espaçamento vertical padrão. */
  flush?: boolean;
  /** Filete no topo, alinhado ao conteúdo: use entre duas seções do mesmo tom. */
  divider?: boolean;
}

/** Seção de página com tom de fundo. Os tons redefinem os tokens para o conteúdo se adaptar. */
export function Section({
  tone = "paper",
  flush,
  divider,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        `tone-${tone}`,
        !flush && "py-section",
        divider && "section-divider",
        className,
      )}
      {...props}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}
