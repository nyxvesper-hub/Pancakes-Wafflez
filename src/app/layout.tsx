import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/components/bakery/query-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pancakes & Wafflez — Casablanca | All-Day Brunch, Tea & Bakery",
  description:
    "Maison de brunch à Casablanca. Pancakes moelleux, gaufres dorées, pâtisseries maison et thé à la menthe. Ouvert tous les jours sauf lundi, 10h–19h.",
  keywords: [
    "pancakes Casablanca",
    "waffles Maroc",
    "brunch Casablanca",
    "bakery Morocco",
    "tea house Casablanca",
    "Pancakes & Wafflez",
  ],
  authors: [{ name: "Pancakes & Wafflez" }],
  openGraph: {
    title: "Pancakes & Wafflez — Casablanca",
    description:
      "Maison de brunch à Casablanca. Ouvert tous les jours sauf lundi, 10h–19h.",
    type: "website",
    locale: "fr_MA",
    alternateLocale: "ar_MA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${fraunces.variable} antialiased bg-background text-foreground font-sans`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
