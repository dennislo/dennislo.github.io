import { test, expect } from "@playwright/test";

test("homepage has 3 JSON-LD script tags", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
    3,
  );
});

test("Person schema has correct name and sameAs links", async ({ page }) => {
  await page.goto("/");
  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((els) => els.map((el) => JSON.parse(el.textContent ?? "{}")));
  const person = schemas.find(
    (s: Record<string, unknown>) => s["@type"] === "Person",
  );
  expect(person).toBeDefined();
  expect(person.name).toBe("Dennis Lo");
  expect(person.sameAs).toContain("https://github.com/dennislo");
});

test("ProfilePage schema has Person as mainEntity", async ({ page }) => {
  await page.goto("/");
  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((els) => els.map((el) => JSON.parse(el.textContent ?? "{}")));
  const profilePage = schemas.find(
    (s: Record<string, unknown>) => s["@type"] === "ProfilePage",
  );
  expect(profilePage).toBeDefined();
  expect(profilePage.mainEntity["@type"]).toBe("Person");
  expect(
    Object.prototype.hasOwnProperty.call(profilePage.mainEntity, "@context"),
  ).toBe(false);
});

test("contact page has WebPage JSON-LD", async ({ page }) => {
  await page.goto("/contact-form");
  const scriptCount = await page
    .locator('script[type="application/ld+json"]')
    .count();
  expect(scriptCount).toBeGreaterThanOrEqual(1);
  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((els) => els.map((el) => JSON.parse(el.textContent ?? "{}")));
  const webPage = schemas.find(
    (s: Record<string, unknown>) => s["@type"] === "WebPage",
  );
  expect(webPage).toBeDefined();
});
