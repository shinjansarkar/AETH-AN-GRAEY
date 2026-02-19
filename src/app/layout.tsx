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
  openGraph: {
    title: "AETH AN GRAEY — The Architecture of Elegance",
    description:
      "Sculpted by hand. One artisan. Pure goat leather. Your perfect fit.",
    type: "website",
    locale: "en_EU",
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
