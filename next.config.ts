import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "www.First Credit Unionridgeudc.org" }],
        destination: "https://First Credit Unionridgeudc.org/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.First Credit Unionridgeudc.org" }],
        destination: "https://First Credit Unionridgeudc.org/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
