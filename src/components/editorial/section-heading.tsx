import Link from "next/link";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  description?: React.ReactNode;
  action?: { label: string; href: string };
  id?: string;
  as?: "h1" | "h2";
  className?: string;
}

/** Título de seção, com descrição e link de ação alinhados à direita no desktop. */
export function SectionHeading({
  title,
  description,
  action,
  id,
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-section-head grid-page items-baseline gap-y-3", className)}>
      <Tag
        id={id}
        className={cn(
          "col-span-12 font-display lg:col-span-6",
          Tag === "h1" ? "text-h1" : "text-h2",
        )}
      >
        {title}
      </Tag>
      {description ? (
        <div className="col-span-12 max-w-[48ch] text-sm text-muted-foreground lg:col-span-4 lg:col-start-7">
          {description}
        </div>
      ) : null}
      {action ? (
        <Link
          href={action.href}
          className="link-underline col-span-12 justify-self-start text-sm font-medium lg:col-span-2 lg:col-start-11 lg:justify-self-end"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
