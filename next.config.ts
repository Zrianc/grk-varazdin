import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Dodajte domenu CMS-a / CDN-a kad slike budu izvan /public
    remotePatterns: [],
  },
};

export default nextConfig;
