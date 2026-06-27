import { test, expect } from "@playwright/test";
import { routes } from "../config";

test.describe("Contact icons", () => {
  test("email/contact icon on homepage has href /contact-form and navigates to the contact form", async ({
    page,
  }) => {
    await page.goto("/");

    // Assert ALL "Contact Dennis Lo" links on the homepage point to routes.contactForm
    const allContactIconLinks = page.getByRole("link", {
      name: "Contact Dennis Lo",
    });
    const links = await allContactIconLinks.all();
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      await expect(link).toHaveAttribute("href", routes.contactForm);
    }

    // Click the footer's contact icon via the contentinfo landmark for a stable, non-positional selector
    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Contact Dennis Lo" })
      .click();

    await expect(page).toHaveURL(new RegExp(`${routes.contactForm}/?$`));
    await expect(
      page.getByRole("heading", { name: "Contact Me" }),
    ).toBeVisible();
  });
});
