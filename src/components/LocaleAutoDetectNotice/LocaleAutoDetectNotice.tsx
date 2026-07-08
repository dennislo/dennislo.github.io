import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link } from "gatsby";
import { useLocation } from "@gatsbyjs/reach-router";
import { useLocale } from "../../i18n";
import {
  localeMeta,
  stripLocale,
  localizePath,
  defaultLocale,
} from "../../i18n/config";
import type { Locale } from "../../i18n/config";
import {
  getAutoDetectedNotice,
  isAutoDetectedNoticeDismissed,
  dismissAutoDetectedNotice,
} from "../../i18n/persistence";

// SSR/hydration-safe: matches ThemeContext's pattern of never reading browser
// storage during the render that must match the server-rendered markup.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function LocaleAutoDetectNotice() {
  const { t } = useLocale();
  const { pathname } = useLocation();
  const [detectedLocale, setDetectedLocale] = useState<Locale | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setDetectedLocale(getAutoDetectedNotice());
    setDismissed(isAutoDetectedNoticeDismissed());
  }, []);

  if (!detectedLocale || dismissed) return null;

  const { basePath } = stripLocale(pathname);
  const englishTarget = localizePath(basePath, defaultLocale);

  const handleDismiss = () => {
    dismissAutoDetectedNotice();
    setDismissed(true);
  };

  return (
    <div
      role="status"
      className="relative z-[60] flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-blue-50 dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900 px-4 py-2 text-sm text-blue-900 dark:text-blue-100"
    >
      <span>
        {t("localeNotice.message", {
          language: localeMeta[detectedLocale].label,
        })}
      </span>
      <Link
        to={englishTarget}
        className="underline hover:no-underline font-medium"
      >
        {t("localeNotice.viewInEnglish")}
      </Link>
      <button
        type="button"
        onClick={handleDismiss}
        className="underline hover:no-underline"
      >
        {t("localeNotice.dismiss")}
      </button>
    </div>
  );
}

export default LocaleAutoDetectNotice;
