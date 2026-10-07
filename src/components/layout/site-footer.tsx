import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { CookiePreferencesButton } from "@/components/privacy/cookie-consent";
import { sections, siteMap } from "@/lib/navigation";
import { activeSocialLinks, siteConfig } from "@/site.config";

import { BackToTop } from "./back-to-top";
import { ThemeSwitcher } from "./theme-toggle";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hair bg-background">
      <div className="container-page grid-page gap-y-12 pt-section pb-stack">
        <div className="col-span-12 flex flex-col gap-5 lg:col-span-4">
          <Link href="/" className="inline-flex self-start">
            <Logo className="text-[44px]" />
          </Link>
          <p className="max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
            {siteConfig.editorialLine}
          </p>
          <Link
            href={`${sections.sobre.href}#linha-editorial`}
            className="link-underline self-start text-sm font-medium"
          >
            Linha editorial
          </Link>
        </div>

        <nav
          aria-label="Mapa do site"
          className="col-span-12 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:col-span-7 lg:col-start-6"
        >
          {siteMap.map((group) => (
            <div key={group.title}>
              <p className="mb-4 font-sans text-sm font-medium">
                {group.href ? (
                  <Link href={group.href} className="transition-colors hover:text-brand-text">
                    {group.title}
                  </Link>
                ) : (
                  group.title
                )}
              </p>
              <ul className="flex flex-col gap-1">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {activeSocialLinks.length > 0 ? (
          <ul aria-label="Redes sociais" className="col-span-12 flex flex-wrap gap-x-6 gap-y-2">
            {activeSocialLinks.map((social) => (
              <li key={social.network}>
                <a
                  href={social.href}
                  rel="me noopener"
                  target="_blank"
                  className="link-underline text-sm"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="container-page">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-hair py-6 text-meta text-muted-foreground">
          <p>
            © {year} {siteConfig.name}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href={sections.privacidade.href}
              className="transition-colors hover:text-foreground"
            >
              Política de privacidade
            </Link>
            <CookiePreferencesButton className="cursor-pointer transition-colors hover:text-foreground" />
            <ThemeSwitcher />
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
