import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Statischer Export (out/) für klassisches PHP-Webhosting (Strato).
  // Dadurch läuft public/kontakt.php auf dem Server (Apache/PHP).
  output: "export",
  // URL-Gleichheit mit dem Original (SEO): Trailing-Slashes → /seite/index.html
  trailingSlash: true,
  // Beim statischen Export gibt es keinen Bild-Optimierungs-Server → Bilder unverändert.
  images: {
    unoptimized: true,
  },
  // Hinweis: redirects() wird bei output:"export" NICHT unterstützt.
  // Die /datenschutz-Weiterleitung läuft daher über public/.htaccess (Strato/Apache).
};

export default nextConfig;
