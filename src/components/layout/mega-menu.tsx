"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationMenu } from "radix-ui";

import { megaMenu, type MegaMenuItem, type NavGroup } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Navegação principal do desktop com mega menu da taxonomia.
 * O viewport ocupa a largura toda, logo abaixo do header (que é o bloco de contenção).
 */
export function MegaMenu({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <NavigationMenu.Root delayDuration={80} className={cn("hidden lg:block", className)}>
      <NavigationMenu.List className="flex items-center gap-1">
        {megaMenu.map((item) => {
          const current = [item.href, ...item.groups.flatMap((g) => g.links.map((l) => l.href))]
            .filter((href): href is string => Boolean(href))
            .some((href) => pathname.startsWith(href.split("?")[0]!));
          return (
            <NavigationMenu.Item key={item.label}>
              <NavigationMenu.Trigger
                className={cn(
                  "group inline-flex h-11 cursor-pointer items-center gap-1 px-3 font-sans text-sm transition-colors hover:text-foreground data-[state=open]:text-foreground",
                  current ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
                <ChevronDown
                  aria-hidden
                  strokeWidth={1.5}
                  className="size-3.5 transition-transform duration-300 ease-poster group-data-[state=open]:rotate-180"
                />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in-0 data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out-0">
                <MegaPanel item={item} />
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>

      <div className="absolute inset-x-0 top-full">
        <NavigationMenu.Viewport
          className={cn(
            "relative w-full overflow-hidden border-b border-hair bg-background shadow-overlay",
            "h-[var(--radix-navigation-menu-viewport-height)] transition-[height] duration-300 ease-poster",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
          )}
        />
      </div>
    </NavigationMenu.Root>
  );
}

function MegaPanel({ item }: { item: MegaMenuItem }) {
  return (
    <div className="container-page grid-page gap-y-10 pt-10 pb-8">
      <div
        className={cn(
          "col-span-12 grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-x-10 gap-y-8",
          item.feature ? "xl:col-span-9" : "xl:col-span-12",
        )}
      >
        {item.groups.map((group) => (
          <MegaGroup key={group.title} group={group} />
        ))}
      </div>

      {item.feature ? (
        <div className="col-span-12 flex flex-col gap-3 border-l-2 border-brand pl-6 xl:col-span-3">
          <p className="font-display text-h3">{item.feature.title}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{item.feature.text}</p>
          <NavigationMenu.Link asChild>
            <Link
              href={item.feature.href}
              className="link-underline mt-2 self-start text-sm font-medium"
            >
              {item.feature.cta}
            </Link>
          </NavigationMenu.Link>
        </div>
      ) : null}

      {item.href ? (
        <div className="col-span-12 border-t border-hair pt-5">
          <NavigationMenu.Link asChild>
            <Link href={item.href} className="link-underline text-sm font-medium">
              Ver tudo em {item.label}
            </Link>
          </NavigationMenu.Link>
        </div>
      ) : null}
    </div>
  );
}

function MegaGroup({ group }: { group: NavGroup }) {
  const withDescriptions = group.links.some((link) => link.description);
  return (
    <div className={cn("min-w-0", group.span === 2 && "sm:col-span-2")}>
      <p className="mb-4 font-sans text-meta text-muted-foreground">{group.title}</p>
      <ul
        className={cn(
          withDescriptions ? "flex flex-col border-t border-hair" : "flex flex-col gap-2",
          !withDescriptions && group.span === 2 && "sm:block sm:columns-2 sm:gap-x-8 [&>li]:mb-2",
        )}
      >
        {group.links.map((link) => (
          <li
            key={link.href}
            className={cn("break-inside-avoid", withDescriptions && "border-b border-hair")}
          >
            <NavigationMenu.Link asChild>
              <Link href={link.href} className={cn("group block", withDescriptions && "py-3.5")}>
                {withDescriptions ? (
                  <>
                    <span className="font-display text-[1.25rem] leading-tight transition-colors group-hover:text-brand-text">
                      {link.label}
                    </span>
                    <span className="mt-1 block text-sm leading-snug text-muted-foreground">
                      {link.description}
                    </span>
                  </>
                ) : (
                  <span className="font-sans text-[0.9375rem] transition-colors group-hover:text-brand-text">
                    {link.label}
                  </span>
                )}
              </Link>
            </NavigationMenu.Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
