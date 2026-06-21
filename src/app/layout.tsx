import type { Metadata } from "next";
import "./globals.css";
import ShellWrapper from "@/components/layout/ShellWrapper";

export const metadata: Metadata = {
  title: {
    default: "Distribution Gandouz — Premium Wines, Spirits & Bar Events",
    template: "%s | Distribution Gandouz",
  },
  description:
    "Tunisia's premier beverage distributor. Browse luxury wines, premium spirits, craft beers, and book mobile bar rental services. Cash on delivery.",
  keywords: ["gandouz", "wines", "spirits", "beer", "Tunisia", "mobile bar", "cavista"],
  openGraph: {
    title: "Distribution Gandouz",
    description: "Tunisia's premier beverage distributor.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ShellWrapper>{children}</ShellWrapper>
      </body>
    </html>
  );
}
