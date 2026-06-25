import { defineConfig } from "vitest/config";

// Schlankes Test-Setup: vorerst nur die reine Consent-Logik (Browser-APIs
// wie localStorage/document.cookie brauchen eine DOM-Umgebung → jsdom).
export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
  },
});
