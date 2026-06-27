import { test, expect, type Page } from "@playwright/test";

const desktopViewport = { width: 1280, height: 800 };

// The desktop switcher is the first "Select language" nav in the DOM (the mobile
// one lives inside the collapsed menu). Scope to it to avoid strict-mode clashes.
function desktopSwitcher(page: Page) {
  return page.getByRole("navigation", { name: "Select language" }).first();
}

test.describe("i18n locale routing and content", () => {
  test("root '/' renders English (UK) content with html lang en-GB", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en-GB");
    await expect(page.getByRole("heading", { name: "About Me" })).toBeVisible();
  });

  test("'/zh-Hans/' renders Simplified Chinese content with html lang zh-Hans", async ({
    page,
  }) => {
    await page.goto("/zh-Hans/");
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans");
    await expect(page.getByRole("heading", { name: "关于我" })).toBeVisible();
    // The English heading must NOT be present in the zh-Hans page.
    await expect(page.getByRole("heading", { name: "About Me" })).toHaveCount(
      0,
    );
  });

  test("'/zh-Hant/' renders Traditional Chinese content with html lang zh-Hant", async ({
    page,
  }) => {
    await page.goto("/zh-Hant/");
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hant");
  });

  test("'/en-US/' renders with html lang en-US", async ({ page }) => {
    await page.goto("/en-US/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
    await expect(page.getByRole("heading", { name: "About Me" })).toBeVisible();
  });
});

test.describe("i18n SEO metadata", () => {
  test("zh-Hans page exposes localized canonical and hreflang alternates", async ({
    page,
  }) => {
    await page.goto("/zh-Hans/");

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /\/zh-Hans\/$/);

    // 4 locale alternates + x-default (case-insensitive hreflang attribute).
    const alternates = page.locator(
      'link[rel="alternate"][hreflang], link[rel="alternate"][hrefLang]',
    );
    expect(await alternates.count()).toBeGreaterThanOrEqual(5);
  });

  test("zh-Hans JSON-LD WebSite schema declares inLanguage zh-Hans", async ({
    page,
  }) => {
    await page.goto("/zh-Hans/");
    const schemas = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((els) =>
        els.map((el) => JSON.parse(el.textContent ?? "{}")),
      );
    const webSite = schemas.find(
      (s: Record<string, unknown>) => s["@type"] === "WebSite",
    );
    expect(webSite).toBeDefined();
    expect(webSite.inLanguage).toBe("zh-Hans");
  });
});

test.describe("language switcher", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(desktopViewport);
  });

  test("switching to 简体中文 updates the URL, content, and persists the choice", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en-GB");

    await desktopSwitcher(page)
      .getByRole("link", { name: /简体中文/ })
      .click();

    await expect(page).toHaveURL(/\/zh-Hans\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans");
    await expect(page.getByRole("heading", { name: "关于我" })).toBeVisible();

    const stored = await page.evaluate(() =>
      localStorage.getItem("preferredLocale"),
    );
    expect(stored).toBe("zh-Hans");
  });

  test("the active locale is marked aria-current", async ({ page }) => {
    // On a localized page the switcher's aria-label is itself translated, so
    // locate the active locale link directly (first match = desktop switcher).
    await page.goto("/zh-Hant/");
    const active = page.getByRole("link", { name: /繁體中文/ }).first();
    await expect(active).toHaveAttribute("aria-current", "true");
  });
});

test.describe("locale persistence redirect", () => {
  test("a stored non-default locale redirects from '/' to the localized home", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem("preferredLocale", "zh-Hant");
    });
    await page.goto("/");
    await expect(page).toHaveURL(/\/zh-Hant\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hant");
  });
});
