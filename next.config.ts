import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // URL-Gleichheit mit dem Original (SEO): Trailing-Slashes
  trailingSlash: true,
  // Phase 1 nutzt nur lokale Assets in /public — keine Remote-Patterns nötig.
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
