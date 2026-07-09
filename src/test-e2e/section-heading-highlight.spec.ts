import { test, expect, type Page } from "@playwright/test";

const HIGHLIGHT_CLASS = "section-heading-highlight";
const mobileViewport = { width: 390, height: 844 };
const desktopViewport = { width: 1280, height: 800 };

async function openMobileMenu(page: Page) {
  await page.getByRole("button", { name: /navigation menu/i }).click();
}

async function clickNavLink(page: Page, linkName: string, mobile: boolean) {
  if (mobile) {
    await openMobileMenu(page);
  }
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: linkName })
    .click();
}

test.describe("Section heading highlight", () => {
  test("desktop: clicking a nav link highlights the target heading, which fades out after ~2s", async ({
    page,
  }) => {
    await page.setViewportSize(desktopViewport);
    await page.goto("/");

    const heading = page.getByRole("heading", { name: "Activity" });
    await expect(heading).not.toHaveClass(new RegExp(HIGHLIGHT_CLASS));

    await clickNavLink(page, "Activity", false);

    await expect(heading).toHaveClass(new RegExp(HIGHLIGHT_CLASS));
    // The highlight must clear on its own within a few seconds of appearing.
    await expect(heading).not.toHaveClass(new RegExp(HIGHLIGHT_CLASS), {
      timeout: 3000,
    });
  });

  test("mobile: opening the menu and choosing a section link highlights its heading", async ({
    page,
  }) => {
    await page.setViewportSize(mobileViewport);
    await page.goto("/");

    const heading = page.getByRole("heading", { name: "Experience" });
    await expect(heading).not.toHaveClass(new RegExp(HIGHLIGHT_CLASS));

    await clickNavLink(page, "Experience", true);

    await expect(heading).toHaveClass(new RegExp(HIGHLIGHT_CLASS));
    await expect(heading).not.toHaveClass(new RegExp(HIGHLIGHT_CLASS), {
      timeout: 3000,
    });
  });

  test("direct navigation to a URL hash highlights the target heading on arrival", async ({
    page,
  }) => {
    await page.setViewportSize(desktopViewport);
    await page.goto("/#projects");

    const heading = page.getByRole("heading", { name: "Projects" });

    await expect(heading).toHaveClass(new RegExp(HIGHLIGHT_CLASS));
    await expect(heading).not.toHaveClass(new RegExp(HIGHLIGHT_CLASS), {
      timeout: 3000,
    });
  });

  test("re-clicking the same nav link after the highlight clears triggers it again", async ({
    page,
  }) => {
    await page.setViewportSize(desktopViewport);
    await page.goto("/");

    const heading = page.getByRole("heading", { name: "Education" });

    await clickNavLink(page, "Education", false);
    await expect(heading).toHaveClass(new RegExp(HIGHLIGHT_CLASS));
    await expect(heading).not.toHaveClass(new RegExp(HIGHLIGHT_CLASS), {
      timeout: 3000,
    });

    // The URL hash is already #education, so this re-click must not rely on
    // a hashchange event to re-trigger the highlight.
    await clickNavLink(page, "Education", false);
    await expect(heading).toHaveClass(new RegExp(HIGHLIGHT_CLASS));
  });

  test("dark theme: the highlight uses the dark-mode accent tint", async ({
    page,
  }) => {
    await page.setViewportSize(desktopViewport);
    await page.addInitScript(() => {
      if (!sessionStorage.getItem("playwright-init")) {
        sessionStorage.setItem("playwright-init", "1");
        localStorage.setItem("theme-source", "manual");
        localStorage.setItem("theme", "dark");
      }
    });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    const heading = page.getByRole("heading", { name: "About Me" });
    await clickNavLink(page, "About", false);
    await expect(heading).toHaveClass(new RegExp(HIGHLIGHT_CLASS));

    // The wash fades in over the heading's transition-colors duration, so poll
    // until the color settles rather than reading it mid-transition.
    // Dark-mode wash: blue-400 @ ~32% opacity, tuned up from an initial 18%
    // that was too faint to see against gray-950. Distinct from the
    // light-mode accent wash and from a fully transparent background.
    await expect
      .poll(() =>
        heading.evaluate((el) => window.getComputedStyle(el).backgroundColor),
      )
      .toBe("rgba(96, 165, 250, 0.32)");
  });

  test("light theme: the highlight uses the light-mode accent tint", async ({
    page,
  }) => {
    await page.setViewportSize(desktopViewport);
    await page.addInitScript(() => {
      if (!sessionStorage.getItem("playwright-init")) {
        sessionStorage.setItem("playwright-init", "1");
        localStorage.setItem("theme-source", "manual");
        localStorage.setItem("theme", "light");
      }
    });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const heading = page.getByRole("heading", { name: "About Me" });
    await clickNavLink(page, "About", false);
    await expect(heading).toHaveClass(new RegExp(HIGHLIGHT_CLASS));

    // The wash fades in over the heading's transition-colors duration, so poll
    // until the color settles rather than reading it mid-transition.
    // Light-mode wash: accent #1d4ed8 @ 10% opacity (see plan's CSS spec).
    await expect
      .poll(() =>
        heading.evaluate((el) => window.getComputedStyle(el).backgroundColor),
      )
      .toBe("rgba(29, 78, 216, 0.1)");
  });

  test("the highlight causes no layout shift on the heading", async ({
    page,
  }) => {
    await page.setViewportSize(desktopViewport);
    await page.goto("/");

    const heading = page.getByRole("heading", { name: "Activity" });
    const before = await heading.boundingBox();
    expect(before).not.toBeNull();

    await clickNavLink(page, "Activity", false);
    await expect(heading).toHaveClass(new RegExp(HIGHLIGHT_CLASS));
    const during = await heading.boundingBox();
    expect(during).not.toBeNull();

    await expect(heading).not.toHaveClass(new RegExp(HIGHLIGHT_CLASS), {
      timeout: 3000,
    });
    const after = await heading.boundingBox();
    expect(after).not.toBeNull();

    // Round to the nearest pixel: only the background should change, never
    // the box the heading occupies.
    expect(Math.round(during!.width)).toBe(Math.round(before!.width));
    expect(Math.round(during!.height)).toBe(Math.round(before!.height));
    expect(Math.round(during!.x)).toBe(Math.round(before!.x));
    expect(Math.round(after!.width)).toBe(Math.round(before!.width));
    expect(Math.round(after!.height)).toBe(Math.round(before!.height));
    expect(Math.round(after!.x)).toBe(Math.round(before!.x));
  });

  test("the highlight wash hugs the heading text and does not extend past it", async ({
    page,
  }) => {
    await page.setViewportSize(desktopViewport);
    await page.goto("/");

    const heading = page.getByRole("heading", { name: "Activity" });
    await clickNavLink(page, "Activity", false);
    await expect(heading).toHaveClass(new RegExp(HIGHLIGHT_CLASS));

    const headingWidth = (await heading.boundingBox())!.width;
    const textWidth = await heading.evaluate((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return range.getBoundingClientRect().width;
    });

    // The heading is a block element by default, which previously let its
    // highlighted background span the full parent column regardless of how
    // narrow the text was. It must now shrink-wrap to the text (plus the
    // small px-3 padding on each side), not the column.
    expect(headingWidth).toBeGreaterThanOrEqual(textWidth);
    expect(headingWidth).toBeLessThan(textWidth + 30);
  });
});
