import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aethangraey.com"),
  title: "AETH AN GRAEY — The Architecture of Elegance | Handcrafted Goat Leather Shoes",
  description:
    "Handcrafted pure goat leather shoes by a single artisan. Where raw nature becomes refined art. One artisan, pure goat leather, your perfect fit. Luxury bespoke footwear crafted for the European professional.",
  keywords: [
    "handmade leather shoes",
    "pure goat leather shoes",
    "luxury bespoke footwear",
    "artisan shoes Europe",
    "custom leather shoes",
    "handcrafted men's shoes",
    "AETH AN GRAEY",
    "elegant leather footwear",
    "premium goat leather",
  ],
  authors: [{ name: "AETH AN GRAEY" }],
  creator: "AETH AN GRAEY",
  publisher: "AETH AN GRAEY",
  // Robots — allow indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Prevent referrer leakage on external navigation
  referrer: "strict-origin-when-cross-origin",
  openGraph: {
    title: "AETH AN GRAEY — The Architecture of Elegance",
    description:
      "Sculpted by hand. One artisan. Pure goat leather. Your perfect fit. Discover our luxury bespoke footwear.",
    url: "https://aethangraey.com",
    type: "website",
    locale: "en_IE",
    siteName: "AETH AN GRAEY",
    images: [
      {
        url: "/favicon.ico",
        width: 800,
        height: 600,
        alt: "AETH AN GRAEY Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AETH AN GRAEY | Artisan Leather Footwear",
    description: "The Architecture of Elegance. Handcrafted goat leather shoes by a single artisan.",
    images: ["/favicon.ico"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  alternates: {
    canonical: "https://aethangraey.com",
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
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Brand",
              "name": "AETH AN GRAEY",
              "url": "https://aethangraey.com",
              "description": "Handcrafted pure goat leather shoes by a single artisan. Where raw nature becomes refined art. Luxury shoes crafted for the European professional.",
              "logo": "https://aethangraey.com/logo.png"
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "AETH AN GRAEY",
              "url": "https://aethangraey.com/"
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
