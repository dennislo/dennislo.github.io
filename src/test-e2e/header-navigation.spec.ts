import {
  type ConsoleMessage,
  expect,
  type Page,
  type Response,
  test,
} from "@playwright/test";

const mobileViewport = { width: 390, height: 844 };

const sectionChecks = [
  { linkName: "About", hash: "#about", heading: "About Me" },
  { linkName: "Projects", hash: "#projects", heading: "Projects" },
  { linkName: "Experience", hash: "#experience", heading: "Experience" },
  { linkName: "Education", hash: "#education", heading: "Education" },
] as const;

function rectsIntersect(
  first: { x: number; y: number; width: number; height: number },
  second: { x: number; y: number; width: number; height: number },
) {
  return (
    first.x < second.x + second.width &&
    first.x + first.width > second.x &&
    first.y < second.y + second.height &&
    first.y + first.height > second.y
  );
}

function monitorRuntimeIssues(page: Page) {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failedResponses: string[] = [];

  page.on("console", (message: ConsoleMessage) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  page.on("pageerror", (error: Error) => {
    pageErrors.push(error.message);
  });

  page.on("response", (response: Response) => {
    const url = response.url();
    const isLocalAsset =
      url.startsWith("http://localhost:8000") ||
      url.startsWith("http://127.0.0.1:8000") ||
      url.startsWith("http://localhost:9000") ||
      url.startsWith("http://127.0.0.1:9000");

    if (isLocalAsset && response.status() >= 400) {
      failedResponses.push(`${response.status()} ${url}`);
    }
  });

  return { consoleErrors, pageErrors, failedResponses };
}

test.describe("Header navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(mobileViewport);
  });

  test("mobile menu opens, closes with Escape, and closes after choosing a link", async ({
    page,
  }) => {
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: /navigation menu/i });
    const primaryNav = page.getByRole("navigation", { name: "Primary" });

    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await menuButton.click();
    await primaryNav.getByRole("link", { name: "About" }).click();

    await expect(page).toHaveURL(/#about$/);
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  test("mobile menu renders as the top visual layer over the hero at the top of the page", async ({
    page,
  }) => {
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: /navigation menu/i });
    const mobileMenu = page.getByRole("region", {
      name: "Mobile primary menu",
    });
    const heroHeading = page.getByRole("heading", { name: "Hello! 👋" });

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
    await expect(heroHeading).toBeVisible();

    await menuButton.click();

    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(mobileMenu).toBeVisible();

    const menuBox = await mobileMenu.boundingBox();
    const heroBox = await heroHeading.boundingBox();

    expect(menuBox).not.toBeNull();
    expect(heroBox).not.toBeNull();

    if (rectsIntersect(menuBox!, heroBox!)) {
      const overlapPoint = {
        x: Math.max(menuBox!.x, heroBox!.x) + 8,
        y: Math.max(menuBox!.y, heroBox!.y) + 8,
      };

      const topLayerHandle = await page.evaluateHandle(
        ({ x, y }) => document.elementFromPoint(x, y),
        overlapPoint,
      );
      const isMenuOnTop = await page.evaluate(
        ({ menuId, node }) => {
          if (!(node instanceof Element)) {
            return false;
          }

          return node.closest(`#${menuId}`) !== null;
        },
        { menuId: "site-header-menu", node: topLayerHandle },
      );

      expect(isMenuOnTop).toBe(true);
    } else {
      expect(heroBox!.y).toBeGreaterThanOrEqual(
        menuBox!.y + menuBox!.height - 1,
      );
    }
  });

  test("mobile header links land sections below the fixed header", async ({
    page,
  }) => {
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: /navigation menu/i });
    const primaryNav = page.getByRole("navigation", { name: "Primary" });

    for (const section of sectionChecks) {
      await menuButton.click();
      await primaryNav.getByRole("link", { name: section.linkName }).click();
      await expect(page).toHaveURL(new RegExp(`${section.hash}$`));

      const headerBox = await page.locator("header").boundingBox();
      const heading = page.getByRole("heading", { name: section.heading });
      const headingBox = await heading.boundingBox();

      expect(headerBox).not.toBeNull();
      expect(headingBox).not.toBeNull();
      // Meaning: after the anchor jump, the heading should start below the fixed header instead of being overlapped by it.
      // Why this matters: a fixed header can visually cover anchor targets even though the browser technically scrolled
      // to the right element. The test guards against that regression by checking actual layout in the browser, not just the URL hash.
      expect(headingBox!.y).toBeGreaterThanOrEqual(headerBox!.height - 1);
    }
  });

  test("mobile menu exposes the Gists external link with the correct URL and new-tab attributes", async ({
    page,
  }) => {
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: /navigation menu/i });
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");

    const mobileMenu = page.getByRole("region", {
      name: "Mobile primary menu",
    });
    const gistsLink = mobileMenu.getByRole("link", { name: "Gists" });

    await expect(gistsLink).toBeVisible();
    await expect(gistsLink).toHaveAttribute(
      "href",
      "https://gist.github.com/dennislo/public",
    );
    await expect(gistsLink).toHaveAttribute("target", "_blank");
    await expect(gistsLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("homepage and contact form stay free of runtime and local asset errors", async ({
    page,
  }) => {
    const issues = monitorRuntimeIssues(page);

    await page.goto("/");
    await expect(
      page.getByRole("button", { name: /switch to (dark|light) mode/i }),
    ).toBeVisible();

    await page.goto("/contact-form");
    await expect(
      page.getByRole("heading", { name: "Contact Me" }),
    ).toBeVisible();

    expect(issues.consoleErrors).toEqual([]);
    expect(issues.pageErrors).toEqual([]);
    expect(issues.failedResponses).toEqual([]);
  });
});
