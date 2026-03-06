---
name: e2e-testing
description:
  Best practices and templates for writing Playwright end-to-end tests in this Gatsby/React project.
  Covers Playwright configuration, test structure, locators, web-first assertions, page objects, localStorage
  testing, theme testing, form validation testing, navigation, and debugging. Trigger words are "e2e, end-to-end,
  playwright, integration test, browser test, test:e2e".
---

# Playwright E2E Testing Best Practices

## Overview

This project uses Playwright for end-to-end tests. Tests live in `src/test-e2e/` and run against the Gatsby dev
server on `http://localhost:8000`. The Playwright config at `playwright.config.ts` auto-starts the server before
tests and shuts it down after.

## Workflow

1. **Choose the user journey.** Define the smallest end-to-end path that proves the behavior.
2. **Stabilize preconditions.** Set deterministic state in `beforeEach` (route, storage, auth/session fixtures).
3. **Use resilient locators.** Prefer `getByRole` and label-based selectors over CSS or brittle text chains.
4. **Execute actions like a user.** Navigate, click, type, and submit in the same order users would.
5. **Assert outcomes with web-first expectations.** Use `await expect(...)` checks instead of fixed delays.
6. **Keep tests isolated.** Ensure each spec can run independently and does not rely on execution order.
7. **Run focused Playwright commands.** Validate the changed spec first, then run broader suites when needed.
8. **Debug with traces/reports.** Use headed mode, Inspector, and trace viewer to resolve flaky or timing issues.

## Configuration

### Configuration Files

- [playwright.config.ts](../../../playwright.config.ts) — Playwright configuration (testDir, webServer, browser
  projects, timeouts)

### npm Scripts

```bash
npm run test:e2e          # Run all E2E tests (headless Chromium)
npm run test:e2e:headed   # Run with visible browser window
npm run test:e2e:ui       # Open Playwright UI mode (interactive test runner)
```

## Test Structure

### File Naming

- Place spec files in `src/test-e2e/`
- Use `.spec.ts` extension (not `.test.ts` — Playwright convention)
- Name by feature: `theme-toggle.spec.ts`, `contact-form.spec.ts`

### Test Organization

```typescript
import {test, expect} from "@playwright/test";

test.describe("Feature Name", () => {
  test.beforeEach(async ({page}) => {
    await page.goto("/");
  });

  test("does something visible to the user", async ({page}) => {
    // Arrange: set up any state
    // Act: interact with the page
    // Assert: verify the outcome
  });
});
```

## Best Practices

### 1. Use Role-Based Locators First

```typescript
// ✅ Preferred — accessible, robust
page.getByRole("button", {name: /switch to dark mode/i});
page.getByRole("textbox", {name: /email address/i});
page.getByRole("link", {name: /back/i});

// ✅ Also good — label-based for form fields
page.getByLabel("First Name");

// ⚠️ OK when role isn't available
page.getByText("Contact Me");

// ❌ Avoid — brittle, couples tests to CSS
page.locator(".contact-form-submit");
page.locator("#firstName");
```

### 2. Use Web-First Assertions (Auto-Waiting)

Playwright assertions automatically wait for the condition to be met (up to the configured timeout). Never use
`page.waitForTimeout()` — it's always a smell.

```typescript
// ✅ Web-first — waits up to timeout for condition
await expect(page.getByRole("button")).toBeVisible();
await expect(page.getByText("Error")).toBeVisible();
await expect(page).toHaveURL("/contact-form");

// ❌ Fragile — doesn't wait, fails on slow renders
expect(await page.$(".button")).toBeTruthy();

// ❌ Never do this
await page.waitForTimeout(2000);
```

### 3. Never Hardcode Waits

```typescript
// ❌ Bad
await page.waitForTimeout(1000);

// ✅ Good — wait for a specific condition
await expect(page.getByRole("alert")).toBeVisible();
await page.waitForLoadState("networkidle");
```

### 4. Keep Tests Independent

Each test must be independent. Use `test.beforeEach` to reset state (navigate to the page, clear localStorage).
Never rely on test execution order.

```typescript
test.beforeEach(async ({page}) => {
  // Inject localStorage BEFORE the page loads so ThemeContext reads it on first mount.
  // addInitScript runs before any page script — no reload needed.
  //
  // IMPORTANT: addInitScript runs on EVERY page load, including page.reload(). Use a
  // sessionStorage guard so the script only writes localStorage on the first navigation.
  // sessionStorage persists across reloads within the same tab, which is exactly the
  // scope we need. Without this guard, a reload() in a test would reset any localStorage
  // changes the test made (e.g. toggling the theme), causing false failures.
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("playwright-init")) {
      sessionStorage.setItem("playwright-init", "1");
      localStorage.setItem("theme-source", "manual");
      localStorage.setItem("theme", "light");
    }
  });
  await page.goto("/");
});
```

### 5. Test Behaviour, Not Implementation

```typescript
// ✅ Good — tests what the user observes
await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

// ❌ Bad — too tightly coupled to internal code
const state = await page.evaluate(() => window.__THEME_STATE__);
```

### 6. Use `page.evaluate` for localStorage and DOM Attributes

```typescript
// Read localStorage
const theme = await page.evaluate(() => localStorage.getItem("theme"));
expect(theme).toBe("dark");

// Check data-theme on <html>
await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
```

## Common Patterns

### Navigation

```typescript
// Navigate to a page and wait for load
await page.goto("/contact-form");
await expect(page).toHaveURL(/contact-form/);

// Click a link and wait for navigation
await page.getByRole("link", {name: /back/i}).click();
await expect(page).toHaveURL("/");
```

### Theme Testing (data-theme, CSS variables)

```typescript
// Get current theme
const theme = await page.locator("html").getAttribute("data-theme");

// Assert theme attribute
await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

// Click toggle and assert theme flipped
const toggleBtn = page.getByRole("button", {
  name: /switch to (dark|light) mode/i,
});
await toggleBtn.click();
await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

// Assert localStorage persists manual theme
const source = await page.evaluate(() => localStorage.getItem("theme-source"));
expect(source).toBe("manual");
```

### Form Interaction and Validation

```typescript
// Fill a field and blur to trigger validation
await page.getByLabel("Email Address").fill("bad-email");
await page.getByLabel("Email Address").blur();
await expect(
  page.getByRole("alert", {name: /enter a valid email/i}),
).toBeVisible();

// Submit an empty form and check all errors appear
await page.getByRole("button", {name: /send message/i}).click();
await expect(page.getByRole("alert").first()).toBeVisible();
```

### Checking Icon Presence (SVG)

```typescript
// The theme toggle shows a moon (light mode) or sun (dark mode)
// Use aria-label on the button instead of asserting SVG internals
const btn = page.getByRole("button", {name: /switch to dark mode/i});
await expect(btn).toBeVisible(); // implies light mode is active
```

## Template Tests

### Minimal Spec File

```typescript
import {test, expect} from "@playwright/test";

test.describe("Page Title", () => {
  test.beforeEach(async ({page}) => {
    await page.goto("/");
  });

  test("page loads with correct title", async ({page}) => {
    await expect(page).toHaveTitle(/DLO/);
  });
});
```

### Theme Toggle Spec Template

```typescript
import {test, expect} from "@playwright/test";

test.describe("Theme Toggle", () => {
  test.beforeEach(async ({page}) => {
    // Inject localStorage BEFORE the page loads so ThemeContext reads it on first mount.
    // addInitScript runs before any page script, so no reload is needed.
    //
    // The sessionStorage guard makes the write happen only on the first navigation.
    // addInitScript also fires on page.reload(), so without the guard it would overwrite
    // any theme changes made by the test before the reload, causing false failures.
    await page.addInitScript(() => {
      if (!sessionStorage.getItem("playwright-init")) {
        sessionStorage.setItem("playwright-init", "1");
        localStorage.setItem("theme-source", "manual");
        localStorage.setItem("theme", "light");
      }
    });
    await page.goto("/");
  });

  test("toggle switches theme from light to dark", async ({page}) => {
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.getByRole("button", {name: /switch to dark mode/i}).click();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});
```

### Contact Form Spec Template

```typescript
import {test, expect} from "@playwright/test";

test.describe("Contact Form", () => {
  test.beforeEach(async ({page}) => {
    await page.goto("/contact-form");
    await expect(page).toHaveURL(/contact-form/);
  });

  test("shows validation errors on empty submit", async ({page}) => {
    await page.getByRole("button", {name: /send message/i}).click();
    await expect(page.getByRole("alert").first()).toBeVisible();
  });
});
```

## Debugging

### Run a Single Spec File

```bash
npx playwright test src/test-e2e/theme-toggle.spec.ts
npx playwright test src/test-e2e/contact-form.spec.ts
```

### Run with Debug Mode (Playwright Inspector)

```bash
PWDEBUG=1 npx playwright test src/test-e2e/theme-toggle.spec.ts
```

### Open Last HTML Report

```bash
npx playwright show-report
```

### View Traces on Failure

Set `trace: "on"` in `playwright.config.ts` during debugging (change from `"on-first-retry"`), then:

```bash
npx playwright show-trace test-results/...trace.zip
```

### Common Issues

| Symptom                       | Cause                                                         | Fix                                                                                 |
|-------------------------------|---------------------------------------------------------------|-------------------------------------------------------------------------------------|
| `net::ERR_CONNECTION_REFUSED` | Dev server not ready                                          | Increase `webServer.timeout` or check `gatsby develop`                              |
| Locator not found             | Wrong selector or page hasn't loaded                          | Use `await expect(locator).toBeVisible()` before interacting                        |
| Flaky `data-theme` tests      | Theme set by time-of-day logic                                | Always set `localStorage` in `beforeEach` for a deterministic start                 |
| Reload resets `localStorage`  | `addInitScript` runs on every load, including `page.reload()` | Wrap init writes in a `sessionStorage` guard so they only apply on first navigation |
| `waitForTimeout` needed       | State change not awaited                                      | Use web-first assertions (`await expect(...).toHaveAttribute(...)`)                 |

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Locators](https://playwright.dev/docs/locators)
- [Web-First Assertions](https://playwright.dev/docs/test-assertions)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging with Playwright](https://playwright.dev/docs/debug)
