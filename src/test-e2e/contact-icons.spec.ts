import { test, expect } from "@playwright/test";
import { routes } from "../config";

const meetUrl = "https://www.cal.eu/dennis-lo/online-meeting";

test.describe("Contact icons", () => {
  test("email/contact icon on homepage has href /contact-form and navigates to the contact form", async ({
    page,
  }) => {
    await page.goto("/");

    // Assert ALL "Contact Dennis Lo" links on the homepage point to routes.contactForm.
    // The built site renders the route with Gatsby's trailing slash, so tolerate it.
    const contactFormHref = new RegExp(`^${routes.contactForm}/?$`);
    const allContactIconLinks = page.getByRole("link", {
      name: "Contact Dennis Lo",
    });
    const links = await allContactIconLinks.all();
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      await expect(link).toHaveAttribute("href", contactFormHref);
    }

    // Click the footer's contact icon via the contentinfo landmark for a stable, non-positional selector
    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Contact Dennis Lo" })
      .click();

    // gatsby develop lazily compiles each page's bundle/page-data on first
    // visit, which can take several seconds and exceeds the default 5s
    // expect timeout. Give this navigation extra headroom instead of
    // guessing with an arbitrary wait.
    await expect(page).toHaveURL(new RegExp(`${routes.contactForm}/?$`), {
      timeout: 15_000,
    });
    await expect(page.getByRole("heading", { name: "Contact Me" })).toBeVisible(
      { timeout: 15_000 },
    );
  });

  test("Meet social icons open Cal.eu in a new tab from the homepage and footer", async ({
    page,
  }) => {
    await page.goto("/");

    const meetLinks = page.getByRole("link", { name: "Meet with Dennis Lo" });
    const links = await meetLinks.all();
    expect(links.length).toBeGreaterThanOrEqual(2);

    for (const link of links) {
      await expect(link).toHaveAttribute("href", meetUrl);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }

    await expect(
      page
        .getByRole("contentinfo")
        .getByRole("link", { name: "Meet with Dennis Lo" }),
    ).toBeVisible();
  });
});
