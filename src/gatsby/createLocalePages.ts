import type { Page, Actions } from "gatsby";
import { locales, defaultLocale, localizePath } from "../i18n/config";

const special404Paths = new Set(["/404/", "/404.html"]);

export function createLocalePages({
  page,
  actions,
}: {
  page: Page<Record<string, unknown>>;
  actions: Pick<Actions, "createPage" | "deletePage">;
}): void {
  const { createPage, deletePage } = actions;

  // Guard: already-localized pages must not be re-processed.
  if (page.context?.locale) {
    return;
  }

  // Delete original, then create one page per locale plus the
  // explicit en-GB alias so /en-GB/<path> resolves alongside the root path.
  deletePage(page);

  for (const locale of locales) {
    createPage({
      ...page,
      path: localizePath(page.path, locale),
      context: { ...page.context, locale },
    });
  }

  if (!special404Paths.has(page.path)) {
    // Explicit en-GB alias: /en-GB/ for root, /en-GB/<path> for everything else.
    const aliasPath = page.path === "/" ? "/en-GB/" : `/en-GB${page.path}`;
    createPage({
      ...page,
      path: aliasPath,
      context: { ...page.context, locale: defaultLocale },
    });
  }
}
