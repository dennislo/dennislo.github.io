import {
  locales,
  defaultLocale,
  isLocale,
  localizePath,
  stripLocale,
  localeMeta,
} from "./config";

describe("locales constant", () => {
  it("contains exactly the four expected locale codes", () => {
    expect(locales).toEqual(["en-GB", "en-US", "zh-Hans", "es-ES"]);
  });

  it("has en-GB as the defaultLocale", () => {
    expect(defaultLocale).toBe("en-GB");
  });
});

describe("isLocale", () => {
  it.each(["en-GB", "en-US", "zh-Hans", "es-ES"] as const)(
    "returns true for valid locale %s",
    (locale) => {
      expect(isLocale(locale)).toBe(true);
    },
  );

  it("returns false for an unsupported locale code", () => {
    expect(isLocale("fr")).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(isLocale("")).toBe(false);
  });

  it("returns false for a locale with wrong casing (EN-GB)", () => {
    expect(isLocale("EN-GB")).toBe(false);
  });
});

describe("localizePath", () => {
  it("returns the path unchanged for the default locale en-GB (root)", () => {
    expect(localizePath("/", "en-GB")).toBe("/");
  });

  it("prefixes root path with zh-Hans locale", () => {
    expect(localizePath("/", "zh-Hans")).toBe("/zh-Hans/");
  });

  it("prefixes /contact-form/ with es-ES locale", () => {
    expect(localizePath("/contact-form/", "es-ES")).toBe(
      "/es-ES/contact-form/",
    );
  });

  it("returns an unprefixed path for any non-root en-GB path", () => {
    expect(localizePath("/contact-form/", "en-GB")).toBe("/contact-form/");
  });

  it("preserves a trailing hash fragment when adding a locale prefix", () => {
    expect(localizePath("/#about", "zh-Hans")).toBe("/zh-Hans/#about");
  });

  it("returns the path with hash unchanged for en-GB (no prefix added)", () => {
    expect(localizePath("/#about", "en-GB")).toBe("/#about");
  });

  it("preserves a query string when adding a locale prefix", () => {
    expect(localizePath("/search?q=foo", "zh-Hans")).toBe(
      "/zh-Hans/search?q=foo",
    );
  });
});

describe("stripLocale", () => {
  it("strips a known locale prefix and returns the base path", () => {
    expect(stripLocale("/zh-Hans/contact-form/")).toEqual({
      locale: "zh-Hans",
      basePath: "/contact-form/",
    });
  });

  it("returns en-GB and the original path when no locale prefix is present", () => {
    expect(stripLocale("/contact-form/")).toEqual({
      locale: "en-GB",
      basePath: "/contact-form/",
    });
  });

  it("returns en-GB and '/' for the root path", () => {
    expect(stripLocale("/")).toEqual({
      locale: "en-GB",
      basePath: "/",
    });
  });

  it("strips es-ES prefix correctly", () => {
    expect(stripLocale("/es-ES/")).toEqual({
      locale: "es-ES",
      basePath: "/",
    });
  });

  it("strips en-US prefix correctly", () => {
    expect(stripLocale("/en-US/about/")).toEqual({
      locale: "en-US",
      basePath: "/about/",
    });
  });

  it("strips the /en-GB/ default-locale alias to the base path", () => {
    expect(stripLocale("/en-GB/contact-form/")).toEqual({
      locale: "en-GB",
      basePath: "/contact-form/",
    });
  });

  it("strips a bare /en-GB alias to root", () => {
    expect(stripLocale("/en-GB")).toEqual({
      locale: "en-GB",
      basePath: "/",
    });
  });

  it("round-trips: localizePath then stripLocale yields the original base path", () => {
    for (const loc of locales) {
      const localized = localizePath("/contact-form/", loc);
      expect(stripLocale(localized)).toEqual({
        locale: loc,
        basePath: "/contact-form/",
      });
    }
  });
});

describe("localeMeta", () => {
  it.each(["en-GB", "en-US", "zh-Hans", "es-ES"] as const)(
    "has a non-empty label for locale %s",
    (locale) => {
      expect(localeMeta[locale].label).toBeTruthy();
    },
  );

  it.each(["en-GB", "en-US", "zh-Hans", "es-ES"] as const)(
    "has a non-empty flag for locale %s",
    (locale) => {
      expect(localeMeta[locale].flag).toBeTruthy();
    },
  );

  it.each(["en-GB", "en-US", "zh-Hans", "es-ES"] as const)(
    "has a non-empty htmlLang for locale %s",
    (locale) => {
      expect(localeMeta[locale].htmlLang).toBeTruthy();
    },
  );

  it.each(["en-GB", "en-US", "zh-Hans", "es-ES"] as const)(
    "has a non-empty ogLocale for locale %s",
    (locale) => {
      expect(localeMeta[locale].ogLocale).toBeTruthy();
    },
  );

  it("has an entry for every locale in the locales array", () => {
    for (const locale of locales) {
      expect(localeMeta).toHaveProperty(locale);
    }
  });
});
