import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { LocaleProvider } from "../i18n";
import type { Locale } from "../i18n/config";

/**
 * Renders `ui` inside a LocaleProvider for the given locale (defaults to "en-GB").
 * Use this helper for any component that calls useLocale() internally.
 */
export function renderWithLocale(
  ui: React.ReactElement,
  locale: Locale = "en-GB",
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(<LocaleProvider locale={locale}>{ui}</LocaleProvider>, options);
}

/**
 * Returns a React wrapper component that provides LocaleProvider.
 * Useful when you need a `wrapper` option for re-renders.
 */
export function makeLocaleWrapper(locale: Locale = "en-GB") {
  return function LocaleWrapper({ children }: { children: React.ReactNode }) {
    return <LocaleProvider locale={locale}>{children}</LocaleProvider>;
  };
}
