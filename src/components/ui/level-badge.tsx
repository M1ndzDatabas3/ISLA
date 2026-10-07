import { labelOf, levelIndex, type Nivel } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  nivel: Nivel;
  className?: string;
}

/** Nível de leitura em três pontos; os preenchidos em vermelho indicam a dificuldade. */
export function LevelBadge({ nivel, className }: LevelBadgeProps) {
  const filled = levelIndex(nivel);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-sans text-meta text-muted-foreground",
        className,
      )}
    >
      <span aria-hidden className="inline-flex items-center gap-[3px]">
        {[1, 2, 3].map((n) => (
          <i
            key={n}
            className={cn(
              "block size-[6px] rounded-full border",
              n <= filled ? "border-brand bg-brand" : "border-muted-foreground",
            )}
          />
        ))}
      </span>
      <span>
        <span className="sr-only">Nível: </span>
        {labelOf("nivel", nivel)}
      </span>
    </span>
  );
}
