import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@klip/api", "@klip/utils"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
