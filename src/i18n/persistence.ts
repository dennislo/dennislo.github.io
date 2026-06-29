import { isLocale, defaultLocale, localizePath } from "./config";
import type { Locale } from "./config";

export const STORAGE_KEY = "preferredLocale";

export function getStoredLocale(): Locale | null {
  try {
    if (typeof window === "undefined") return null;
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === null) return null;
    if (isLocale(value)) return value;
    return null;
  } catch {
    return null;
  }
}

export function storeLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Never throw — storage may be unavailable.
  }
}

export function resolveRedirectTarget(
  pathname: string,
  stored: Locale | null,
): string | null {
  if (pathname !== "/") return null;
  if (stored === null) return null;
  if (stored === defaultLocale) return null;
  return localizePath("/", stored);
}
