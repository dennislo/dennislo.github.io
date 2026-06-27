import { test, expect } from "@playwright/test";

test.describe("Contact icons", () => {
  test("email/contact icon on homepage has href /contact-form and navigates to the contact form", async ({
    page,
  }) => {
    await page.goto("/");

    // The email icon appears in both the Hero and the footer; use .first() to grab the first one
    const emailLink = page
      .getByRole("link", { name: "Email Dennis Lo" })
      .first();

    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute("href", "/contact-form");

    await emailLink.click();

    await expect(page).toHaveURL(/\/contact-form/);
    await expect(
      page.getByRole("heading", { name: "Contact Me" }),
    ).toBeVisible();
  });
});
