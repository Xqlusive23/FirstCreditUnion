import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
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
