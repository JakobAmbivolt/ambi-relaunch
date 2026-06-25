import { beforeEach, describe, expect, it } from "vitest";
import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  clearGaCookies,
  readConsent,
  writeConsent,
} from "./consent";

describe("readConsent / writeConsent", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("liefert null, wenn noch keine Entscheidung gespeichert ist", () => {
    expect(readConsent()).toBeNull();
  });

  it("speichert und liest eine Einwilligung (granted)", () => {
    writeConsent("granted");
    expect(readConsent()).toBe("granted");
  });

  it("speichert und liest eine Ablehnung (denied)", () => {
    writeConsent("denied");
    expect(readConsent()).toBe("denied");
  });

  it("verlangt eine neue Entscheidung, wenn die gespeicherte Version veraltet ist", () => {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ v: CONSENT_VERSION - 1, decision: "granted" }),
    );
    expect(readConsent()).toBeNull();
  });

  it("liefert null bei beschaedigten Daten, ohne zu werfen", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "kein-json{{");
    expect(() => readConsent()).not.toThrow();
    expect(readConsent()).toBeNull();
  });
});

describe("clearGaCookies", () => {
  it("entfernt _ga-Cookies", () => {
    document.cookie = "_ga=GA1.1.123456; path=/";
    document.cookie = "_ga_7X55K1M2J1=GS1.1.abc; path=/";
    document.cookie = "wichtig=behalten; path=/";

    clearGaCookies();

    expect(document.cookie).not.toContain("_ga=");
    expect(document.cookie).not.toContain("_ga_7X55K1M2J1=");
    expect(document.cookie).toContain("wichtig=behalten");
  });
});
