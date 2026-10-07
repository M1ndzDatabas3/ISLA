import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const chipVariants = cva(
  [
    "relative inline-flex cursor-pointer items-center gap-1.5 border font-sans whitespace-nowrap transition-colors duration-200",
    // Área de toque de 44px sem aumentar o chip.
    "after:absolute after:inset-x-0 after:-inset-y-2 after:content-['']",
    "[&_svg]:size-3.5 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        outline:
          "border-hair bg-transparent text-foreground hover:border-foreground aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background",
        solid:
          "border-foreground bg-foreground text-background hover:border-brand hover:bg-brand hover:text-brand-foreground",
      },
      size: {
        sm: "h-7 px-2.5 text-xs",
        md: "h-8 px-3 text-[0.8125rem]",
      },
    },
    defaultVariants: { variant: "outline", size: "md" },
  },
);

interface ChipProps extends React.ComponentProps<"span">, VariantProps<typeof chipVariants> {
  /** Renderiza o filho (link ou botão) com o estilo do chip. */
  asChild?: boolean;
}

/** Chip de taxonomia. Use asChild com <Link> para chips clicáveis e <button aria-pressed> para filtros. */
function Chip({ className, variant, size, asChild = false, ...props }: ChipProps) {
  const Comp = asChild ? Slot.Root : "span";
  return (
    <Comp data-slot="chip" className={cn(chipVariants({ variant, size }), className)} {...props} />
  );
}

export { Chip, chipVariants };
