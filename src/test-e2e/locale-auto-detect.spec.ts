import { test, expect } from "@playwright/test";

test.describe("browser locale auto-detection", () => {
  // Fail fast on hydration mismatches: the locale-detection redirect lands the
  // user on a fresh full page load where LocaleAutoDetectNotice's first client
  // render must match the server-rendered markup exactly. Scoped to hydration-
  // shaped messages (not a blanket "no console errors" check) because this page
  // also makes real third-party network calls (GitHub API, Segment analytics)
  // that are flaky in CI/sandboxed environments for reasons unrelated to this
  // feature — see the "1 flaky" GitHub Analytics fetch failure already tolerated
  // elsewhere in this suite (header-navigation.spec.ts).
  let consoleErrors: string[];
  const hydrationErrorPattern = /hydrat|did not match|content does not match/i;

  test.beforeEach(async ({ page }) => {
    consoleErrors = [];
    page.on("pageerror", (err) => {
      if (hydrationErrorPattern.test(err.message)) {
        consoleErrors.push(err.message);
      }
    });
    page.on("console", (msg) => {
      if (msg.type() === "error" && hydrationErrorPattern.test(msg.text())) {
        consoleErrors.push(msg.text());
      }
    });
  });

  test.afterEach(() => {
    expect(
      consoleErrors,
      `Unexpected hydration errors:\n${consoleErrors.join("\n")}`,
    ).toEqual([]);
  });

  test.describe("supported browser locale, no stored preference", () => {
    test.use({ locale: "es-ES" });

    test("redirects '/' to the matched locale, shows the notice, and persists the choice", async ({
      page,
    }) => {
      await page.goto("/");

      await expect(page).toHaveURL(/\/es-ES\/$/);
      await expect(page.locator("html")).toHaveAttribute("lang", "es-ES");

      const stored = await page.evaluate(() =>
        localStorage.getItem("preferredLocale"),
      );
      expect(stored).toBe("es-ES");

      await expect(
        page.getByText(/Hemos cambiado a Español \(España\)/),
      ).toBeVisible();

      const viewInEnglish = page.getByRole("link", {
        name: /Ver en inglés/i,
      });
      await expect(viewInEnglish).toBeVisible();
      await viewInEnglish.click();

      await expect(page).toHaveURL(/\/$/);
      await expect(page.locator("html")).toHaveAttribute("lang", "en-GB");
    });

    test("dismissing the notice hides it and it stays hidden across client-side navigation", async ({
      page,
    }) => {
      await page.goto("/");
      await expect(page).toHaveURL(/\/es-ES\/$/);

      const notice = page.getByText(/Hemos cambiado a Español \(España\)/);
      await expect(notice).toBeVisible();

      await page.getByRole("button", { name: /Cerrar/i }).click();
      await expect(notice).not.toBeVisible();

      await page.goto("/es-ES/contact-form/");
      await expect(notice).not.toBeVisible();
    });
  });

  test.describe("unsupported browser locale, no stored preference", () => {
    test.use({ locale: "fr-FR" });

    test("stays on the default en-GB root with no redirect and no notice", async ({
      page,
    }) => {
      await page.goto("/");

      await expect(page).toHaveURL(/^http:\/\/localhost:\d+\/$/);
      await expect(page.locator("html")).toHaveAttribute("lang", "en-GB");

      const stored = await page.evaluate(() =>
        localStorage.getItem("preferredLocale"),
      );
      expect(stored).toBeNull();
    });
  });

  test.describe("stored preference takes priority over detection", () => {
    test.use({ locale: "es-ES" });

    test("a stored en-GB preference is respected even when the browser locale would match es-ES", async ({
      page,
    }) => {
      await page.addInitScript(() => {
        localStorage.setItem("preferredLocale", "en-GB");
      });
      await page.goto("/");

      await expect(page).toHaveURL(/^http:\/\/localhost:\d+\/$/);
      await expect(page.locator("html")).toHaveAttribute("lang", "en-GB");
      await expect(
        page.getByText(/Hemos cambiado a Español \(España\)/),
      ).toHaveCount(0);
    });
  });
});
