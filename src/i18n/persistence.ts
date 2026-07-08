import { isLocale, defaultLocale, localizePath } from "./config";
import type { Locale } from "./config";

export const STORAGE_KEY = "preferredLocale";
export const NOTICE_STORAGE_KEY = "localeAutoDetected";
export const NOTICE_DISMISSED_KEY = "localeNoticeDismissed";

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
  detected: Locale | null = null,
): string | null {
  if (pathname !== "/") return null;
  const target = stored ?? detected;
  if (target === null) return null;
  if (target === defaultLocale) return null;
  return localizePath("/", target);
}

export function markAutoDetectedNotice(locale: Locale): void {
  try {
    sessionStorage.setItem(NOTICE_STORAGE_KEY, locale);
  } catch {
    // Never throw — storage may be unavailable.
  }
}

export function getAutoDetectedNotice(): Locale | null {
  try {
    if (typeof window === "undefined") return null;
    const value = sessionStorage.getItem(NOTICE_STORAGE_KEY);
    if (value === null) return null;
    if (isLocale(value)) return value;
    return null;
  } catch {
    return null;
  }
}

export function dismissAutoDetectedNotice(): void {
  try {
    sessionStorage.setItem(NOTICE_DISMISSED_KEY, "true");
  } catch {
    // Never throw — storage may be unavailable.
  }
}

export function isAutoDetectedNoticeDismissed(): boolean {
  try {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(NOTICE_DISMISSED_KEY) === "true";
  } catch {
    return false;
  }
}
