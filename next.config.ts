import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // ─── Security Headers ─────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking — disallow framing by other sites
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // Prevent MIME-type sniffing attacks
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Enable XSS protection in older browsers
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Control referrer information sent to third-party sites
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Prevent browser from sending info about installed plugins
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Strict Transport Security — only served over HTTPS in production
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Content Security Policy — restrict sources for scripts, styles, images, fonts
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js inline scripts need 'unsafe-inline' or nonce; unsafe-eval for HMR dev
              "script-src 'self' 'unsafe-inline'",
              // Styles: self + Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts: self + Google Fonts CDN
              "font-src 'self' https://fonts.gstatic.com",
              // Images: self + Unsplash (for dynamic images) + data URIs
              "img-src 'self' https://images.unsplash.com data:",
              // Connections: self only (no external API calls)
              "connect-src 'self'",
              // Media: self only
              "media-src 'self'",
              // No plugins (Flash etc)
              "object-src 'none'",
              // Iframes: only same origin
              "frame-src 'self'",
              // Upgrade insecure requests to HTTPS
              "upgrade-insecure-requests",
              // Block mixed content
              "block-all-mixed-content",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // Disable the X-Powered-By: Next.js header (info disclosure)
  poweredByHeader: false,
};

export default nextConfig;
