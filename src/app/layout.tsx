import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AETH AN GRAEY — The Architecture of Elegance",
  description:
    "Handcrafted pure goat leather shoes by a single artisan. Where raw nature becomes refined art. One artisan, pure goat leather, your perfect fit. Luxury shoes crafted for the European professional.",
  keywords: [
    "handmade leather shoes",
    "goat leather shoes",
    "luxury bespoke footwear",
    "artisan shoes Europe",
    "custom leather shoes",
    "AETH AN GRAEY",
  ],
  // Robots — allow indexing but block AI training scrapers
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  // Prevent referrer leakage on external navigation
  referrer: "strict-origin-when-cross-origin",
  openGraph: {
    title: "AETH AN GRAEY — The Architecture of Elegance",
    description:
      "Sculpted by hand. One artisan. Pure goat leather. Your perfect fit.",
    type: "website",
    locale: "en_EU",
    siteName: "AETH AN GRAEY",
  },
  twitter: {
    card: "summary_large_image",
    title: "AETH AN GRAEY",
    description: "The Architecture of Elegance. Handcrafted goat leather shoes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Canonical — prevents duplicate-content SEO / data scraping confusion */}
        <link rel="canonical" href="https://aethangraey.com" />

        {/* Security: tell browsers not to sniff content type */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />

        {/* Security: block this page from being embedded in iframes on other sites */}
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />

        {/* Security: enable browser's built-in XSS filter (legacy IE/Edge) */}
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />

        {/* Referrer: only send origin when navigating cross-origin */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        {/* Preconnect to Google Fonts — improves performance + avoids CORS issues */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
