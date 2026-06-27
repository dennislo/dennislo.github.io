import React, { createContext, useContext } from "react";
import type { Locale } from "./config";
import type { TranslationDictionary } from "./types";
import { getDictionary } from "./dictionaries";

export interface LocaleContextValue {
  locale: Locale;
  dict: TranslationDictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}): React.ReactElement {
  const dict = getDictionary(locale);
  return (
    <LocaleContext.Provider value={{ locale, dict }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (ctx === null) {
    throw new Error(
      "useLocale must be used within a <LocaleProvider>. " +
        "Wrap your component tree with <LocaleProvider locale={locale}>.",
    );
  }
  return ctx;
}
