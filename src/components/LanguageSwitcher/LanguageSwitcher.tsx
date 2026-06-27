import React from "react";
import { navigate, Link } from "gatsby";
import { useLocation } from "@gatsbyjs/reach-router";
import {
  locales,
  localeMeta,
  stripLocale,
  localizePath,
} from "../../i18n/config";
import { useLocale } from "../../i18n/useLocale";
import { storeLocale } from "../../i18n/persistence";

function LanguageSwitcher() {
  const { locale, t } = useLocale();
  const { pathname } = useLocation();
  const { basePath } = stripLocale(pathname);

  return (
    <nav aria-label={t("languageSwitcher.ariaLabel")}>
      {locales.map((loc) => {
        const { flag, label } = localeMeta[loc];
        const target = localizePath(basePath, loc);
        const isActive = loc === locale;

        const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          storeLocale(loc);
          const hash =
            typeof window !== "undefined" ? window.location.hash : "";
          navigate(target + hash, {});
        };

        return (
          <Link
            key={loc}
            to={target}
            onClick={handleClick}
            aria-current={isActive ? "true" : undefined}
            className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <span aria-hidden="true">{flag}</span>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default LanguageSwitcher;
