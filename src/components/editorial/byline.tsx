import { cn } from "@/lib/utils";

export interface BylineItem {
  label: string;
  value: React.ReactNode;
}

/** Metadados em pares rótulo/valor (no lugar de "A · B · C"). */
export function Byline({ items, className }: { items: BylineItem[]; className?: string }) {
  return (
    <dl className={cn("flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col">
          <dt className="text-xs text-muted-foreground">{item.label}</dt>
          <dd className="font-medium tabular-nums">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
