import type { NextConfig } from "next";

/**
 * Dva načina rada:
 *  - zadano: puna aplikacija (Node poslužitelj) s administracijom
 *  - STATIC_EXPORT=1: statična verzija za GitHub Pages (bez administracije),
 *    BASE_PATH npr. "/grk-varazdin"
 */
const isStatic = process.env.STATIC_EXPORT === "1";
const basePath = isStatic ? process.env.BASE_PATH || "" : "";

const nextConfig: NextConfig = {
  ...(isStatic ? { output: "export" as const, trailingSlash: true, basePath } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_STATIC: isStatic ? "1" : "" },
  images: isStatic
    ? { loader: "custom", loaderFile: "./src/lib/image-loader.ts" }
    : {
        formats: ["image/avif", "image/webp"],
        // Dodajte domenu CMS-a / CDN-a kad slike budu izvan /public
        remotePatterns: [],
      },
};

export default nextConfig;
