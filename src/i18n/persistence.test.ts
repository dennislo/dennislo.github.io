import {
  STORAGE_KEY,
  NOTICE_STORAGE_KEY,
  NOTICE_DISMISSED_KEY,
  getStoredLocale,
  storeLocale,
  resolveRedirectTarget,
  markAutoDetectedNotice,
  getAutoDetectedNotice,
  dismissAutoDetectedNotice,
  isAutoDetectedNoticeDismissed,
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

describe("persistence — resolveRedirectTarget with detected fallback", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns '/zh-Hans/' when stored is null and detected is 'zh-Hans' at root", () => {
    expect(resolveRedirectTarget("/", null, "zh-Hans")).toBe("/zh-Hans/");
  });

  it("returns null when stored is null and detected is null", () => {
    expect(resolveRedirectTarget("/", null, null)).toBeNull();
  });

  it("returns null when stored is null and detected is the default locale 'en-GB'", () => {
    expect(resolveRedirectTarget("/", null, "en-GB")).toBeNull();
  });

  it("returns '/es-ES/' when stored is 'es-ES' and detected is 'zh-Hans' (stored wins, detected ignored)", () => {
    expect(resolveRedirectTarget("/", "es-ES", "zh-Hans")).toBe("/es-ES/");
  });

  it("returns null on a non-root path even when stored is null and detected is non-default", () => {
    expect(resolveRedirectTarget("/contact-form/", null, "zh-Hans")).toBeNull();
  });

  it("preserves existing 2-argument behavior when detected is omitted", () => {
    expect(resolveRedirectTarget("/", "zh-Hans")).toBe("/zh-Hans/");
    expect(resolveRedirectTarget("/", null)).toBeNull();
  });
});

describe("persistence — NOTICE_STORAGE_KEY and NOTICE_DISMISSED_KEY", () => {
  it("exports the string constant 'localeAutoDetected'", () => {
    expect(NOTICE_STORAGE_KEY).toBe("localeAutoDetected");
  });

  it("exports the string constant 'localeNoticeDismissed'", () => {
    expect(NOTICE_DISMISSED_KEY).toBe("localeNoticeDismissed");
  });
});

describe("persistence — markAutoDetectedNotice / getAutoDetectedNotice", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("returns the marked locale after markAutoDetectedNotice has written it", () => {
    markAutoDetectedNotice("zh-Hans");
    expect(getAutoDetectedNotice()).toBe("zh-Hans");
  });

  it("writes the locale under NOTICE_STORAGE_KEY in sessionStorage", () => {
    markAutoDetectedNotice("es-ES");
    expect(sessionStorage.getItem(NOTICE_STORAGE_KEY)).toBe("es-ES");
  });

  it("returns null when nothing has been marked", () => {
    expect(getAutoDetectedNotice()).toBeNull();
  });

  it("returns null when an invalid locale string is stored", () => {
    sessionStorage.setItem(NOTICE_STORAGE_KEY, "fr");
    expect(getAutoDetectedNotice()).toBeNull();
  });

  it("does not throw when marking multiple times", () => {
    expect(() => {
      markAutoDetectedNotice("en-US");
      markAutoDetectedNotice("es-ES");
    }).not.toThrow();
  });
});

describe("persistence — dismissAutoDetectedNotice / isAutoDetectedNoticeDismissed", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("returns false before any dismiss call", () => {
    expect(isAutoDetectedNoticeDismissed()).toBe(false);
  });

  it("returns true after dismissAutoDetectedNotice has been called", () => {
    dismissAutoDetectedNotice();
    expect(isAutoDetectedNoticeDismissed()).toBe(true);
  });

  it("writes 'true' under NOTICE_DISMISSED_KEY in sessionStorage", () => {
    dismissAutoDetectedNotice();
    expect(sessionStorage.getItem(NOTICE_DISMISSED_KEY)).toBe("true");
  });

  it("does not throw when dismissing", () => {
    expect(() => dismissAutoDetectedNotice()).not.toThrow();
  });
});
