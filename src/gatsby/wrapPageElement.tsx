import React from "react";
import { LocaleProvider } from "../i18n";
import { isLocale, defaultLocale } from "../i18n/config";
import type { Locale } from "../i18n/config";

export function wrapPageElement({
  element,
  props,
}: {
  element: React.ReactNode;
  props: { pageContext?: { locale?: string } };
}): React.ReactElement {
  const raw = props?.pageContext?.locale;
  const locale: Locale =
    typeof raw === "string" && isLocale(raw) ? raw : defaultLocale;

  return <LocaleProvider locale={locale}>{element}</LocaleProvider>;
}
