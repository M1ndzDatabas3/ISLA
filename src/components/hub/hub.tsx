/**
 * Blocos das páginas-mestre (Artigos, Leituras, Explorar): cabeçalho com os
 * números da seção, portas de entrada para as subseções e o diretório de
 * categorias com contagem.
 */
import Link from "next/link";

import { Counter } from "@/components/motion/counter";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";
import type { GrupoDeCategorias } from "@/lib/content/facets";
import { cn } from "@/lib/utils";

export interface HubStat {
  valor: number;
  rotulo: string;
  href?: string;
}

export function HubHeader({
  title,
  lead,
  stats,
  breadcrumb,
}: {
  title: string;
  lead: string;
  stats?: HubStat[];
  /** Trilha completa; sem ela, "Início / título". */
  breadcrumb?: BreadcrumbItem[];
}) {
  return (
    <>
      <Breadcrumb
        items={breadcrumb ?? [{ label: "Início", href: "/" }, { label: title }]}
        className="mb-12"
      />
      <div className="grid-page items-end gap-y-6">
        <h1 className="col-span-12 font-display text-[clamp(3rem,1.6rem+5.4vw,6.5rem)]/[0.95] tracking-[-0.03em] lg:col-span-7">
          {title}
          <i aria-hidden className="title-mark" />
        </h1>
        <p className="col-span-12 max-w-[46ch] text-lead text-muted-foreground lg:col-span-5 lg:col-start-8">
          {lead}
        </p>
      </div>
      {stats?.length ? (
        <dl
          className={cn(
            "mt-stack grid grid-cols-2 border-t border-hair",
            stats.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
          )}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.rotulo}
              className={cn(
                "flex flex-col-reverse gap-1 border-b border-hair py-5 pr-4 lg:border-b-0 lg:py-6",
                i % 2 === 1 && "pl-4 lg:pl-0",
                i > 0 && "lg:border-l lg:border-hair lg:pl-6",
              )}
            >
              <dt className="text-sm text-muted-foreground">
                {stat.href ? (
                  <Link href={stat.href} className="hover:text-foreground">
                    {stat.rotulo}
                  </Link>
                ) : (
                  stat.rotulo
                )}
              </dt>
              <dd className="font-display text-[clamp(2.25rem,1.6rem+2vw,3.5rem)] leading-none tabular-nums">
                <Counter value={stat.valor} />
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </>
  );
}

export interface HubDoor {
  label: string;
  href: string;
  description: string;
  meta?: string;
}

/** Portas de entrada: uma por subseção, com o que ela tem. */
export function HubDoors({ doors, className }: { doors: HubDoor[]; className?: string }) {
  return (
    <ul
      className={cn(
        "grid gap-x-[clamp(16px,2vw,32px)] sm:grid-cols-2",
        doors.length >= 4 ? "lg:grid-cols-4" : doors.length === 3 ? "lg:grid-cols-3" : "",
        className,
      )}
    >
      {doors.map((door) => (
        <li key={door.href} className="group relative border-t-2 border-foreground pt-5 pb-stack">
          {door.meta ? <p className="text-meta text-muted-foreground">{door.meta}</p> : null}
          <h2
            className={cn(
              "mt-3 font-display transition-colors group-hover:text-brand-text",
              // Com quatro portas lado a lado, o título encolhe para caber numa linha.
              doors.length >= 4 ? "text-[clamp(1.625rem,1.2rem+1.1vw,2.125rem)]/[1.08]" : "text-h2",
            )}
          >
            <Link href={door.href} className="after:absolute after:inset-0 after:content-['']">
              {door.label}
            </Link>
          </h2>
          <p className="mt-3 max-w-[40ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
            {door.description}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Diretório de categorias com contagem (cada link abre a lista já filtrada). */
export function CategoryDirectory({
  groups,
  unidade,
}: {
  groups: GrupoDeCategorias[];
  /** "artigo" / "livro": usado no rótulo acessível da contagem. */
  unidade: [string, string];
}) {
  return (
    <div className="grid gap-x-[clamp(16px,2vw,32px)] gap-y-stack sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <section key={group.key} aria-labelledby={`cat-${group.key}`}>
          <h3 id={`cat-${group.key}`} className="mb-3 text-meta text-muted-foreground">
            {group.title}
          </h3>
          <ul className="border-t border-hair">
            {group.items.map((item) => (
              <li key={item.slug} className="border-b border-hair">
                <Link
                  href={item.href}
                  className="group flex items-baseline justify-between gap-4 py-2.5"
                >
                  <span className="transition-colors group-hover:text-brand-text">
                    {item.label}
                  </span>
                  <span className="text-meta text-muted-foreground tabular-nums">
                    {item.count}
                    <span className="sr-only"> {item.count === 1 ? unidade[0] : unidade[1]}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
