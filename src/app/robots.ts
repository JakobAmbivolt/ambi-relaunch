import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/danke-fuer-ihre-anfrage/", "/impressum/", "/datenschutzerklaerung/"],
    },
    sitemap: "https://ambivolt.de/sitemap.xml",
  };
}
