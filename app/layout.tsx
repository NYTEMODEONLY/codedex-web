import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CodeDex Pro — Pokémon TCG Code Scanner",
  description:
    "Scan, organize, and export Pokémon TCG redemption codes. Works on phone or desktop, codes never leave your device. A nytemode project.",
  authors: [{ name: "nytemode", url: "https://nytemode.com" }],
  keywords: [
    "Pokémon TCG",
    "QR scanner",
    "redemption codes",
    "code scanner",
    "nytemode",
  ],
  openGraph: {
    title: "CodeDex Pro",
    description: "The professional Pokémon TCG code scanner — in your browser.",
    siteName: "CodeDex Pro",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0D14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
