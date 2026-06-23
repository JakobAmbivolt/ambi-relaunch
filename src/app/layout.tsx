import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarqueeBand } from "@/components/layout/MarqueeBand";

const sans = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-metro", display: "swap" });

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
    <html lang="de" className={`${sans.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <MarqueeBand />
        <Footer />
      </body>
    </html>
  );
}
