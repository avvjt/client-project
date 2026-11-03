import type { Metadata, Viewport } from "next";
import { Manrope, Inter, IBM_Plex_Mono, Noto_Sans_Arabic, Noto_Sans_SC } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { cookies } from "next/headers";
import { Toaster } from "@/components/ui/sonner";
import { dirFor, LOCALE_COOKIE, toLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  display: "swap",
});

const notoSC = Noto_Sans_SC({
  variable: "--font-noto-sc",
  subsets: ["latin"],
  display: "swap",
});

/** Canonical production origin — localhost must never ship to metadata. */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dispoconceptpvtltd.com";

/** og:locale requires language_TERRITORY format ("en" alone is invalid). */
const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  fr: "fr_FR",
  de: "de_DE",
  es: "es_ES",
  nl: "nl_NL",
  ar: "ar_AR",
  zh: "zh_CN",
};

/** Locale-aware metadata: titles/descriptions follow the visitor's locale cookie. */
export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = toLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const t = getDictionary(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `Dispo-Concept — ${t.meta.home}`,
      template: "%s | Dispo-Concept",
    },
    description: t.meta.homeDescription,
    keywords: [
      "medical grade elements manufacturer",
      "medical consumables manufacturer India",
      "surgical gown manufacturer India",
      "reinforced surgical gown BVB",
      "sterilization wrap supplier",
      "procedure pack manufacturer",
      "3-ply face mask manufacturer Bangalore",
      "medical caps and shoe covers manufacturer",
      "hospital consumables supplier",
      "medical consumables export",
      "custom surgical procedure packs",
      "UN procurement medical supplies",
      "Bengaluru medical manufacturer",
    ],
    applicationName: "Dispo-Concept",
    creator: "Dispo-Concept Private Limited",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/manifest.webmanifest",
    openGraph: {
      type: "website",
      siteName: "Dispo-Concept",
      title: `Dispo-Concept — ${t.meta.home}`,
      description: t.meta.homeDescription,
      locale: OG_LOCALE[locale] ?? "en_US",
      url: SITE_URL,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Dispo-Concept — medical-products business in Bengaluru, India",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Dispo-Concept — ${t.meta.home}`,
      description: t.meta.homeDescription,
      images: ["/og-image.png"],
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F8FA" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1726" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Locale is stored in a cookie so the server renders the correct lang/dir
  // on first paint (no content flash for returning visitors).
  const cookieStore = await cookies();
  const locale = toLocale(cookieStore.get(LOCALE_COOKIE)?.value);

  return (
    <html lang={locale} dir={dirFor(locale)} suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${inter.variable} ${plexMono.variable} ${notoArabic.variable} ${notoSC.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
