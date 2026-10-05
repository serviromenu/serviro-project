import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qgwanpsftvfylcancely.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "serviro.ir",
          },
        ],
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "www.serviro.ir",
          },
        ],
        destination: "/admin",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;