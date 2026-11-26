import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Lora } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
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
          <SiteHeader />
          <main
            id="main"
            tabIndex={-1}
            className="min-w-0 px-5 pt-10 pb-24 outline-none sm:px-8 md:px-10 md:pt-14 lg:px-16 lg:pt-20 xl:px-24"
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
