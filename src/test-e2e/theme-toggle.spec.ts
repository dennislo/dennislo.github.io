import { test, expect } from "@playwright/test";

test.describe("Theme Toggle", () => {
  test.beforeEach(async ({ page }) => {
    // Inject localStorage BEFORE the page loads so ThemeContext reads it on first mount.
    // The sessionStorage guard ensures the script only sets localStorage on the FIRST
    // navigation. addInitScript runs on every page load (including page.reload()), so
    // without the guard it would overwrite any theme changes the test made before reload.
    await page.addInitScript(() => {
      if (!sessionStorage.getItem("playwright-init")) {
        sessionStorage.setItem("playwright-init", "1");
        localStorage.setItem("theme-source", "manual");
        localStorage.setItem("theme", "light");
      }
    });
    await page.goto("/");
  });

  test("page loads with light theme applied to <html>", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("theme toggle button is visible", async ({ page }) => {
    const toggle = page.getByRole("button", {
      name: /switch to (dark|light) mode/i,
    });
    await expect(toggle).toBeVisible();
  });

  test("clicking toggle switches from light to dark", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.getByRole("button", { name: /switch to dark mode/i }).click();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("clicking toggle switches from dark back to light", async ({ page }) => {
    // First switch to dark
    await page.getByRole("button", { name: /switch to dark mode/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    // Then switch back to light
    await page.getByRole("button", { name: /switch to light mode/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("theme is persisted to localStorage after toggle", async ({ page }) => {
    await page.getByRole("button", { name: /switch to dark mode/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    const source = await page.evaluate(() =>
      localStorage.getItem("theme-source"),
    );
    const savedTheme = await page.evaluate(() => localStorage.getItem("theme"));

    expect(source).toBe("manual");
    expect(savedTheme).toBe("dark");
  });

  test("persisted manual theme is restored after page reload", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /switch to dark mode/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.reload();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("toggle button shows moon icon in light mode (switch to dark)", async ({
    page,
  }) => {
    // In light mode the button label is "Switch to dark mode"
    await expect(
      page.getByRole("button", { name: /switch to dark mode/i }),
    ).toBeVisible();
  });

  test("toggle button shows sun icon in dark mode (switch to light)", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /switch to dark mode/i }).click();

    // In dark mode the button label is "Switch to light mode"
    await expect(
      page.getByRole("button", { name: /switch to light mode/i }),
    ).toBeVisible();
  });
});
