import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Lora } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { listDisciplines } from "@/lib/content";
import { portfolioNav } from "@/lib/navigation";
import { site } from "@/lib/site";
import { themeInitScript } from "@/lib/theme";
import "@/styles/globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.positioning,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Published discipline portfolios drive the navbar (ADR-019); cached like any read.
  const portfolios = portfolioNav(await listDisciplines());
  return (
    <html
      lang="en"
      // The inline script sets the theme class before hydration.
      suppressHydrationWarning
      className={`${lora.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-accent px-4 py-3 text-on-accent focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        {/* The page background is static; only the main column scrolls past the sticky
            sidebar (document scrolling, no nested scroll container). */}
        <div className="min-h-dvh md:grid md:grid-cols-[13.5rem_minmax(0,1fr)] lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)]">
          <SiteHeader portfolios={portfolios} />
          <div className="flex min-w-0 flex-col">
            <main
              id="main"
              tabIndex={-1}
              className="flex-1 px-5 pt-10 outline-none sm:px-8 md:px-10 md:pt-14 lg:px-16 lg:pt-20 xl:px-24"
            >
              {children}
            </main>
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
