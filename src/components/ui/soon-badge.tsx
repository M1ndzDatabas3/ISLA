import { cn } from "@/lib/utils";

/** "em breve" ao lado de links para seções ainda em preparação. */
export function SoonBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "ml-2 inline-flex translate-y-[-0.1em] items-center align-middle font-sans text-[0.6875rem] leading-none font-normal whitespace-nowrap text-muted-foreground",
        className,
      )}
    >
      em breve
    </span>
  );
}
