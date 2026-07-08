import { test, expect } from "@playwright/test";

const companyName = "Agile IT & Software Limited";
const companyAddress =
  "Brookfield Court Selby Road, Garforth, Leeds LS25 1NB, UK";
const companyNumber = "10042911";
const vatNumber = "235 2977 88";

test.describe("footer company details", () => {
  test("'/' footer shows the invariant company legal details", async ({
    page,
  }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");

    await expect(footer.getByText(companyName)).toBeVisible();
    await expect(footer.getByText(companyAddress)).toBeVisible();
    await expect(footer.getByText(companyNumber)).toBeVisible();
    await expect(footer.getByText(vatNumber)).toBeVisible();
  });

  test("'/zh-Hans/' footer keeps the invariant company legal details and stays localized", async ({
    page,
  }) => {
    await page.goto("/zh-Hans/");
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans");

    const footer = page.getByRole("contentinfo");

    await expect(
      footer.getByText("盧偉康 (Dennis Lo)", { exact: true }).first(),
    ).toBeVisible();
    await expect(footer.getByText(`增值税号: ${vatNumber}`)).toBeVisible();
    await expect(footer.getByText(companyName)).toBeVisible();
    await expect(footer.getByText(companyAddress)).toBeVisible();
    await expect(footer.getByText(companyNumber)).toBeVisible();
    await expect(footer.getByText(vatNumber)).toBeVisible();
  });

  test("'/' footer uses the capitalized English VAT label", async ({
    page,
  }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");

    await expect(footer.getByText(`VAT Number: ${vatNumber}`)).toBeVisible();
  });

  test("'/' footer shows the company legal details without horizontal overflow on a mobile viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const footer = page.getByRole("contentinfo");

    await expect(footer.getByText(companyName)).toBeVisible();
    await expect(footer.getByText(companyAddress)).toBeVisible();
    await expect(footer.getByText(companyNumber)).toBeVisible();
    await expect(footer.getByText(vatNumber)).toBeVisible();

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
