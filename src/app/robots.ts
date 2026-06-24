import type { MetadataRoute } from "next";

// Statisch generieren (nötig für output: "export")
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/danke-fuer-ihre-anfrage/"],
    },
    sitemap: "https://ambivolt.de/sitemap.xml",
  };
}
