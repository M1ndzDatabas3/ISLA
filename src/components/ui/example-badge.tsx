import { cn } from "@/lib/utils";

/** Marca conteúdo ilustrativo (eventos e episódios de exemplo), para ninguém confundir com agenda real. */
export function ExampleBadge({ className }: { className?: string }) {
  return (
    <span
      title="Conteúdo ilustrativo, publicado só para demonstrar a seção."
      className={cn(
        "inline-flex items-center border border-dashed border-current px-1.5 py-px text-[0.6875rem] leading-4 font-medium text-muted-foreground",
        className,
      )}
    >
      Exemplo
    </span>
  );
}
