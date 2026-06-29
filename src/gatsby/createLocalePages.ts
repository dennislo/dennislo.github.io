import type { Page, Actions } from "gatsby";
import { locales, defaultLocale, localizePath } from "../i18n/config";

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

  // 404 page: delete original, create once with defaultLocale (no locale fan-out).
  // Use exact match to avoid catching Gatsby's internal /dev-404-page/.
  if (page.path === "/404/" || page.path === "/404.html") {
    deletePage(page);
    createPage({
      ...page,
      context: { ...page.context, locale: defaultLocale },
    });
    return;
  }

  // Normal page: delete original, then create one page per locale plus the
  // explicit en-GB alias so /en-GB/<path> resolves alongside the root path.
  deletePage(page);

  for (const locale of locales) {
    createPage({
      ...page,
      path: localizePath(page.path, locale),
      context: { ...page.context, locale },
    });
  }

  // Explicit en-GB alias: /en-GB/ for root, /en-GB/<path> for everything else.
  const aliasPath = page.path === "/" ? "/en-GB/" : `/en-GB${page.path}`;
  createPage({
    ...page,
    path: aliasPath,
    context: { ...page.context, locale: defaultLocale },
  });
}
