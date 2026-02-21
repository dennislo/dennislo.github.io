import { test, expect } from "@playwright/test";

test.describe("Contact Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact-form");
    await expect(page).toHaveURL(/contact-form/);
  });

  test("page loads with heading 'Contact Me'", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Contact Me" }),
    ).toBeVisible();
  });

  test("all form fields are present", async ({ page }) => {
    await expect(page.getByLabel("First Name")).toBeVisible();
    await expect(page.getByLabel("Last Name")).toBeVisible();
    await expect(page.getByLabel("Mobile Number")).toBeVisible();
    await expect(page.getByLabel("Email Address")).toBeVisible();
    await expect(page.getByLabel("Message")).toBeVisible();
  });

  test("submit button is present", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /send message/i }),
    ).toBeVisible();
  });

  test("submitting empty form shows validation errors on all required fields", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /send message/i }).click();

    // All five fields must show client-side validation errors.
    // Count assumes Formspree state.errors initialises as null (no server-error alert on first render).
    await expect(page.getByRole("alert").first()).toBeVisible();
    const alerts = page.getByRole("alert");
    await expect(alerts).toHaveCount(5);
  });

  test("invalid email format shows validation error on blur", async ({
    page,
  }) => {
    await page.getByLabel("Email Address").fill("not-an-email");
    await page.getByLabel("Email Address").blur();

    await expect(page.getByText(/enter a valid email address/i)).toBeVisible();
  });

  test("invalid mobile format shows validation error on blur", async ({
    page,
  }) => {
    await page.getByLabel("Mobile Number").fill("abc");
    await page.getByLabel("Mobile Number").blur();

    await expect(page.getByText(/enter a valid phone number/i)).toBeVisible();
  });

  test("message shorter than 10 characters shows length error on blur", async ({
    page,
  }) => {
    await page.getByLabel("Message").fill("Hi");
    await page.getByLabel("Message").blur();

    await expect(
      page.getByText(/message must be at least 10 characters/i),
    ).toBeVisible();
  });

  test("back link navigates to homepage", async ({ page }) => {
    await page.getByRole("link", { name: /back/i }).click();

    await expect(page).toHaveURL("/");
  });

  test("form fields have aria-invalid set when errors are shown", async ({
    page,
  }) => {
    // Trigger validation on email by filling an invalid value and blurring
    await page.getByLabel("Email Address").fill("bad");
    await page.getByLabel("Email Address").blur();

    await expect(page.getByLabel("Email Address")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
