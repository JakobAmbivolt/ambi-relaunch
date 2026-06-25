import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Inter_Tight } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarqueeBand } from "@/components/layout/MarqueeBand";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { ConsentProvider } from "@/components/layout/ConsentProvider";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { GoogleAnalytics } from "@/components/layout/GoogleAnalytics";

// Display: industrielle Grotesk für Headlines
const display = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

// Utility/Mono: technische Labels, Zahlen, Specs
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jbmono",
  display: "swap",
});

// Body: ruhiger, dichter Lesetext
const body = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ambivolt.de"),
  title: {
    default: "Photovoltaik-Montagesysteme - AmbiVolt Energietechnik",
    template: "%s | AmbiVolt",
  },
  description:
    "Entdecken Sie unsere hochwertigen Photovoltaik-Montagesysteme. Unsere Systeme gewährleisten eine schnelle Montage & Flexibilität am Dach!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      className={`${display.variable} ${mono.variable} ${body.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-white">
        <ConsentProvider>
          <ScrollProgress />
          <Header />
          <main className="flex-1">{children}</main>
          <MarqueeBand />
          <Footer />
          <CookieConsent />
          <GoogleAnalytics />
        </ConsentProvider>
      </body>
    </html>
  );
}
