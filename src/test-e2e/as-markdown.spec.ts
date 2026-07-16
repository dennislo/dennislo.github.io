import { expect, test } from "@playwright/test";

const defaultLocaleRoutes = [
  { htmlPath: "/", markdownPath: "/index.md" },
  { htmlPath: "/contact-form", markdownPath: "/contact-form.md" },
  { htmlPath: "/404/", markdownPath: "/404.md" },
];

test.describe("As Markdown link", () => {
  for (const { htmlPath, markdownPath } of defaultLocaleRoutes) {
    test(`${htmlPath} links to ${markdownPath}`, async ({ page }) => {
      await page.goto(htmlPath);

      const link = page.getByRole("link", { name: "As Markdown" });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", markdownPath);

      await link.click();

      await expect(page).toHaveURL(new RegExp(`${markdownPath}$`));
    });
  }

  test("localized homepage uses its localized label and canonical Markdown route", async ({
    page,
  }) => {
    await page.goto("/zh-Hans/");

    const link = page.getByRole("link", { name: "以 Markdown 格式查看" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/index.md");

    await link.click();

    await expect(page).toHaveURL(/\/index\.md$/);
  });

  test("localized contact page targets the canonical unlocalized Markdown route", async ({
    page,
  }) => {
    await page.goto("/es-ES/contact-form/");

    const link = page.getByRole("link", { name: "Ver como Markdown" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/contact-form.md");
  });

  test("localized 404 targets the canonical unlocalized Markdown route", async ({
    page,
  }) => {
    await page.goto("/zh-Hans/404/");

    const link = page.getByRole("link", { name: "以 Markdown 格式查看" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/404.md");
  });
});
