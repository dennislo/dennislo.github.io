import {
  STORAGE_KEY,
  getStoredLocale,
  storeLocale,
  resolveRedirectTarget,
} from "./persistence";

describe("persistence — STORAGE_KEY", () => {
  it("exports the string constant 'preferredLocale'", () => {
    expect(STORAGE_KEY).toBe("preferredLocale");
  });
});

describe("persistence — getStoredLocale", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when nothing is stored", () => {
    expect(getStoredLocale()).toBeNull();
  });

  it("returns the stored locale after storeLocale has written it", () => {
    storeLocale("zh-Hans");
    expect(getStoredLocale()).toBe("zh-Hans");
  });

  it("returns 'en-GB' when it is stored", () => {
    storeLocale("en-GB");
    expect(getStoredLocale()).toBe("en-GB");
  });

  it("returns 'en-US' when it is stored", () => {
    storeLocale("en-US");
    expect(getStoredLocale()).toBe("en-US");
  });

  it("returns 'es-ES' when it is stored", () => {
    storeLocale("es-ES");
    expect(getStoredLocale()).toBe("es-ES");
  });

  it("returns null when an invalid locale string is stored (e.g. 'fr')", () => {
    localStorage.setItem(STORAGE_KEY, "fr");
    expect(getStoredLocale()).toBeNull();
  });

  it("returns null when an empty string is stored", () => {
    localStorage.setItem(STORAGE_KEY, "");
    expect(getStoredLocale()).toBeNull();
  });

  it("returns null when a plausible-but-invalid tag is stored", () => {
    localStorage.setItem(STORAGE_KEY, "en");
    expect(getStoredLocale()).toBeNull();
  });
});

describe("persistence — storeLocale", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("writes the locale under STORAGE_KEY in localStorage", () => {
    storeLocale("zh-Hans");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("zh-Hans");
  });

  it("overwrites a previously stored locale", () => {
    storeLocale("en-US");
    storeLocale("es-ES");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("es-ES");
  });

  it("does not throw even when called multiple times", () => {
    expect(() => {
      storeLocale("en-GB");
      storeLocale("zh-Hans");
    }).not.toThrow();
  });
});

describe("persistence — resolveRedirectTarget", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns '/zh-Hans/' when pathname is '/' and stored locale is 'zh-Hans'", () => {
    expect(resolveRedirectTarget("/", "zh-Hans")).toBe("/zh-Hans/");
  });

  it("returns '/en-US/' when pathname is '/' and stored locale is 'en-US'", () => {
    expect(resolveRedirectTarget("/", "en-US")).toBe("/en-US/");
  });

  it("returns '/es-ES/' when pathname is '/' and stored locale is 'es-ES'", () => {
    expect(resolveRedirectTarget("/", "es-ES")).toBe("/es-ES/");
  });

  it("returns null when pathname is '/' and stored locale is the default 'en-GB'", () => {
    // defaultLocale stored — no redirect needed, user is already at the right root
    expect(resolveRedirectTarget("/", "en-GB")).toBeNull();
  });

  it("returns null when pathname is '/' and stored is null", () => {
    expect(resolveRedirectTarget("/", null)).toBeNull();
  });

  it("returns null when pathname is '/contact-form/' (non-root) even with a non-default stored locale", () => {
    expect(resolveRedirectTarget("/contact-form/", "zh-Hans")).toBeNull();
  });

  it("returns null when pathname is the en-GB alias '/en-GB/' (not bare root)", () => {
    // The /en-GB/ alias is NOT the bare '/' root, so no redirect should fire
    expect(resolveRedirectTarget("/en-GB/", "es-ES")).toBeNull();
  });

  it("returns null when pathname is '/zh-Hans/' (already localized root)", () => {
    expect(resolveRedirectTarget("/zh-Hans/", "zh-Hans")).toBeNull();
  });

  it("returns null for any non-root path regardless of stored locale", () => {
    expect(resolveRedirectTarget("/about/", "es-ES")).toBeNull();
    expect(resolveRedirectTarget("/es-ES/about/", "es-ES")).toBeNull();
  });
});
