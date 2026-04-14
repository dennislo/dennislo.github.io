import { expect, test } from "@playwright/test";

test.describe("Direct Markdown source routes", () => {
  test("GET /index.md returns raw Markdown with homepage H1", async ({
    page,
  }) => {
    await page.goto("/index.md");
    const body = await page.locator("body").textContent();
    expect(body).toContain("# Who is DLO?");
    expect(body).toContain("lo.dennis@gmail.com");
  });

  test("GET /contact-form.md returns raw Markdown with contact H1", async ({
    page,
  }) => {
    await page.goto("/contact-form.md");
    const body = await page.locator("body").textContent();
    expect(body).toContain("# Contact Dennis Lo");
    expect(body).toContain("lo.dennis@gmail.com");
  });

  test("GET /404.md returns raw Markdown with 404 H1", async ({ page }) => {
    await page.goto("/404.md");
    const body = await page.locator("body").textContent();
    expect(body).toContain("# Page Not Found");
  });

  test("homepage HTML route still renders", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
    await expect(page.locator("body")).not.toBeEmpty();
    // Page should render React content, not raw Markdown
    const body = await page.locator("body").textContent();
    expect(body).not.toMatch(/^# /);
  });

  test("contact-form HTML route still renders", async ({ page }) => {
    await page.goto("/contact-form");
    await expect(page).toHaveURL(/contact-form/);
    await expect(
      page.getByRole("heading", { name: "Contact Me" }),
    ).toBeVisible();
  });
});
