import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { LocationProvider } from "@gatsbyjs/reach-router";
import { LocaleProvider } from "../i18n";
import type { Locale } from "../i18n/config";

/**
 * Renders `ui` inside a LocaleProvider for the given locale (defaults to "en-GB")
 * and a LocationProvider from @gatsbyjs/reach-router so that components calling
 * useLocation() (e.g. LanguageSwitcher) work in test environments.
 */
export function renderWithLocale(
  ui: React.ReactElement,
  locale: Locale = "en-GB",
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(
    <LocationProvider>
      <LocaleProvider locale={locale}>{ui}</LocaleProvider>
    </LocationProvider>,
    options,
  );
}

/**
 * Returns a React wrapper component that provides LocaleProvider.
 * Useful when you need a `wrapper` option for re-renders.
 */
export function makeLocaleWrapper(locale: Locale = "en-GB") {
  return function LocaleWrapper({ children }: { children: React.ReactNode }) {
    return (
      <LocationProvider>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </LocationProvider>
    );
  };
}
