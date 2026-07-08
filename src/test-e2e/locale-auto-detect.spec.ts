import { test, expect } from "@playwright/test";

test.describe("browser locale auto-detection", () => {
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
