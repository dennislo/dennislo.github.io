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

    await expect(footer.getByText(companyName)).toBeVisible();
    await expect(footer.getByText(companyAddress)).toBeVisible();
    await expect(footer.getByText(companyNumber)).toBeVisible();
    await expect(footer.getByText(vatNumber)).toBeVisible();
  });
});
