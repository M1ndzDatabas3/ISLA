import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { BottomNav } from "@/components/layout/bottom-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { CookieConsent } from "@/components/privacy/cookie-consent";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SearchRoot } from "@/components/search/search-root";
import { Toaster } from "@/components/ui/sonner";
import { brandIcons } from "@/lib/brand";
import { buildMegaMenu } from "@/lib/menu";
import { themeInitScript } from "@/lib/theme";
import { palette } from "@/lib/tokens";
import { siteConfig } from "@/site.config";

import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.shortName}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.ogLocale,
    siteName: siteConfig.name,
    images: [{ url: brandIcons.ogDefault.src, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      {
        url: brandIcons.favicon.src,
        type: brandIcons.favicon.type,
        ...(brandIcons.favicon.width
          ? { sizes: `${brandIcons.favicon.width}x${brandIcons.favicon.height}` }
          : {}),
      },
    ],
    apple: [{ url: brandIcons.appleTouch.src, sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  // O site abre no claro; o ThemeProvider troca esta cor quando a pessoa escolhe o escuro.
  themeColor: palette.paper,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Aplica o tema antes da primeira pintura */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="pb-[var(--bottom-nav-h)]">
        <ThemeProvider>
          <NuqsAdapter>
            <SmoothScroll>
              <SearchRoot>
                <SkipLink />
                <SiteHeader menu={buildMegaMenu()} />
                <main id="conteudo" tabIndex={-1} className="pt-[var(--header-h)] outline-none">
                  {children}
                </main>
                <SiteFooter />
                <BottomNav />
                <Toaster />
                <CookieConsent />
              </SearchRoot>
            </SmoothScroll>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
