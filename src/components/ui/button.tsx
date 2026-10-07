import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 font-sans font-medium whitespace-nowrap select-none",
    "transition-[background-color,color,border-color,background-size] duration-300 ease-poster",
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /** Ação principal: vermelho chapado, sem sombra. Um por tela. */
        primary: "bg-brand text-brand-foreground hover:bg-foreground hover:text-background",
        /** Ação de apoio com contorno de 1px. */
        outline:
          "border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
        /** Link sublinhado que encolhe no hover. */
        link: "link-underline text-foreground",
        /** Botões de ícone e ações discretas. */
        quiet: "bg-transparent text-foreground hover:bg-accent",
      },
      size: {
        sm: "h-10 px-4 text-sm [&_svg]:size-4",
        md: "h-12 px-6 text-[0.9375rem] [&_svg]:size-4",
        lg: "h-14 px-7 text-base [&_svg]:size-5",
        icon: "size-11 p-0 [&_svg]:size-5",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0 pb-1" }],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /** Renderiza o filho (ex.: <Link>) com o estilo do botão. */
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
