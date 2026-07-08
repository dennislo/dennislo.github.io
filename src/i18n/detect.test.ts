import { detectLocaleFromLanguages } from "./detect";

describe("detectLocaleFromLanguages — exact matches", () => {
  it("returns 'en-GB' for an exact 'en-GB' entry", () => {
    expect(detectLocaleFromLanguages(["en-GB"])).toBe("en-GB");
  });

  it("returns 'en-US' for an exact 'en-US' entry", () => {
    expect(detectLocaleFromLanguages(["en-US"])).toBe("en-US");
  });

  it("returns 'zh-Hans' for an exact 'zh-Hans' entry", () => {
    expect(detectLocaleFromLanguages(["zh-Hans"])).toBe("zh-Hans");
  });

  it("returns 'es-ES' for an exact 'es-ES' entry", () => {
    expect(detectLocaleFromLanguages(["es-ES"])).toBe("es-ES");
  });
});

describe("detectLocaleFromLanguages — prefix matches", () => {
  it("resolves 'en-AU' to 'en-GB' (ambiguous English variant defaults to first array entry)", () => {
    expect(detectLocaleFromLanguages(["en-AU"])).toBe("en-GB");
  });

  it("resolves 'zh-TW' to 'zh-Hans'", () => {
    expect(detectLocaleFromLanguages(["zh-TW"])).toBe("zh-Hans");
  });

  it("resolves 'es-MX' to 'es-ES'", () => {
    expect(detectLocaleFromLanguages(["es-MX"])).toBe("es-ES");
  });

  it("resolves bare 'en' to 'en-GB'", () => {
    expect(detectLocaleFromLanguages(["en"])).toBe("en-GB");
  });
});

describe("detectLocaleFromLanguages — priority ordering across multiple entries", () => {
  it("skips an entry with no match at all and matches the next entry", () => {
    // 'fr-CA' has no exact or prefix match, so we move on to 'es-ES'.
    expect(detectLocaleFromLanguages(["fr-CA", "es-ES"])).toBe("es-ES");
  });

  it("stops at the first entry that produces any match, even if a later entry would have matched exactly", () => {
    // 'en-AU' matches via prefix ('en-GB') immediately, so we never reach 'es-ES'.
    expect(detectLocaleFromLanguages(["en-AU", "es-ES"])).toBe("en-GB");
  });
});

describe("detectLocaleFromLanguages — no match", () => {
  it("returns null when no entry matches any supported locale", () => {
    expect(detectLocaleFromLanguages(["fr-FR", "de-DE"])).toBeNull();
  });

  it("returns null for an empty array", () => {
    expect(detectLocaleFromLanguages([])).toBeNull();
  });
});
