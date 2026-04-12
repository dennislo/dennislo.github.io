import { expect, test } from "@playwright/test";

const markdownRoutes = [
  {
    route: "/index.md",
    heading: "# Who is DLO?",
    source: "Source: src/config.ts - update this file when config changes",
  },
  {
    route: "/contact-form.md",
    heading: "# Contact Dennis Lo",
    source: "Source: src/config.ts - update this file when config changes",
  },
  {
    route: "/404.md",
    heading: "# Page Not Found",
    source: "Source: src/config.ts - update this file when config changes",
  },
] as const;

test.describe("Markdown source routes", () => {
  for (const { route, heading, source } of markdownRoutes) {
    test(`serves ${route}`, async ({ page }) => {
      const response = await page.goto(route);

      expect(response?.status()).toBe(200);
      await expect(page.locator("body")).toContainText(heading);
      await expect(page.locator("body")).toContainText(source);
    });
  }

  test("html pages advertise markdown alternates", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator('link[rel="alternate"][type="text/markdown"]'),
    ).toHaveAttribute("href", "/index.md");

    await page.goto("/contact-form");
    await expect(
      page.locator('link[rel="alternate"][type="text/markdown"]'),
    ).toHaveAttribute("href", "/contact-form.md");

    await page.goto("/404");
    await expect(
      page.locator('link[rel="alternate"][type="text/markdown"]'),
    ).toHaveAttribute("href", "/404.md");
  });
});
