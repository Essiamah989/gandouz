import type { Metadata } from "next";
import "./globals.css";
import ShellWrapper from "@/components/layout/ShellWrapper";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: {
    default: "Gandouz - Wines and spirits",
    template: "%s | Gandouz - Wines and spirits",
  },
  description:
    "Le premier distributeur de boissons en Tunisie. Découvrez nos vins de luxe, spiritueux premium, bières artisanales et réservez des services de location de bar mobile. Paiement à la livraison.",
  keywords: ["gandouz", "vins", "spiritueux", "bière", "Tunisie", "bar mobile", "caviste"],
  openGraph: {
    title: "Gandouz - Wines and spirits",
    description: "Le premier distributeur de boissons en Tunisie.",
    type: "website",
    locale: "fr_FR",
  },
};

import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="fr" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body className="min-h-screen flex flex-col antialiased">
          <ShellWrapper>{children}</ShellWrapper>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
