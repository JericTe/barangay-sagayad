import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { getSiteSettings } from "@/lib/data";

// Self-hosted (not fetched from Google Fonts at build time) — both are
// variable fonts under the SIL Open Font License, sourced from Google's own
// open-source font repository. Self-hosting also means the site never
// depends on fonts.googleapis.com being reachable for someone on a slow
// provincial connection to see the page correctly.
const sora = localFont({
  src: "./fonts/Sora-Variable.ttf",
  variable: "--font-sora",
  weight: "100 800",
  display: "swap",
});

const publicSans = localFont({
  src: "./fonts/PublicSans-Variable.ttf",
  variable: "--font-public-sans",
  weight: "100 900",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = `${settings.barangayName} | ${settings.municipality}, ${settings.province}`;
  const description = `Official digital barangay hall for ${settings.barangayName}, ${settings.municipality}, ${settings.province}. Request documents, report issues, view announcements, and stay connected with your local government.`;

  return {
    title: {
      default: title,
      template: `%s | ${settings.barangayName}`,
    },
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_PH",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://localhost:3000"),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`${sora.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        {/* Runs before paint so a saved text-size preference doesn't flash back to normal on load. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var s=localStorage.getItem('sagayad-text-size');if(s)document.documentElement.dataset.textSize=s;}catch(e){}`,
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <EmergencyBanner settings={settings} />
        <Header barangayName={settings.barangayName} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
