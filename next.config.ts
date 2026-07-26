import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vinext's local Cloudflare runtime does not provide the production
  // ASSETS/IMAGES bindings used by its image optimization worker. Serving the
  // already-compressed files in /public directly keeps local development and
  // production previews reliable.
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
