import React, { useCallback, useEffect, useState } from "react";
import { Link } from "gatsby";
import { routes, sectionNavLinks, siteConfig } from "../../config";
import { useLocale } from "../../i18n";
import type { TranslationDictionary, TranslationKey } from "../../i18n";
import ExternalLink from "../ExternalLink/ExternalLink";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";

// Map from section href to the nav dictionary key
const hrefToNavKey: Record<string, keyof TranslationDictionary["nav"]> = {
  "#about": "about",
  "#projects": "projects",
  "#github-activity": "activity",
  "#experience": "experience",
  "#education": "education",
};

function navTranslationKey(
  key: keyof TranslationDictionary["nav"],
): Extract<TranslationKey, `nav.${string}`> {
  return `nav.${key}` as Extract<TranslationKey, `nav.${string}`>;
}

type InternalNavLink = { type: "internal"; href: `#${string}` };
type ExternalNavLink = {
  type: "external";
  label: keyof TranslationDictionary["nav"];
  href: string;
};
type RouteNavLink = {
  type: "route";
  href: `/${string}`;
  label: keyof TranslationDictionary["nav"];
  renderAsAnchor?: boolean;
};
type NavLink = InternalNavLink | ExternalNavLink | RouteNavLink;

// Static links whose labels come from the dictionary
const staticNavLinks: NavLink[] = [
  ...sectionNavLinks.map((link) => ({
    type: "internal" as const,
    href: link.href,
  })),
  {
    type: "external" as const,
    label: "gists",
    href: "https://gist.github.com/dennislo/public",
  },
  {
    type: "route" as const,
    href: routes.contactForm,
    label: "contact",
  },
  {
    type: "route" as const,
    href: routes.meet,
    label: "meet",
    renderAsAnchor: true,
  },
];

const desktopLinkClassName =
  "text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300";

const mobileLinkClassName =
  "block rounded-lg px-2 py-2 text-sm text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100";

type NavLinkWithLabel =
  | { type: "internal"; href: `#${string}`; label: string }
  | { type: "external"; href: string; label: string }
  | {
      type: "route";
      href: `/${string}`;
      label: string;
      renderAsAnchor?: boolean;
    };

const NavLinkItem = ({
  link,
  className,
  onClick,
}: {
  link: NavLinkWithLabel;
  className: string;
  onClick?: () => void;
}) => {
  if (link.type === "internal") {
    return (
      <a href={link.href} className={className} onClick={onClick}>
        {link.label}
      </a>
    );
  }
  if (link.type === "route") {
    if (link.renderAsAnchor) {
      return (
        <a href={link.href} className={className} onClick={onClick}>
          {link.label}
        </a>
      );
    }
    return (
      <Link to={link.href} className={className} onClick={onClick}>
        {link.label}
      </Link>
    );
  }
  return (
    <ExternalLink href={link.href} className={className} onClick={onClick}>
      {link.label}
    </ExternalLink>
  );
};

const SiteHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, localizePath } = useLocale();

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeMenuOnResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", closeMenuOnResize, { passive: true });
    return () => window.removeEventListener("resize", closeMenuOnResize);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeMenuOnEscape);
    return () => window.removeEventListener("keydown", closeMenuOnEscape);
  }, [isMenuOpen]);

  // Resolve localized labels for each nav link
  const navLinks: NavLinkWithLabel[] = staticNavLinks.map((link) => {
    if (link.type === "internal") {
      const key = hrefToNavKey[link.href] ?? "about";
      return { ...link, label: t(navTranslationKey(key)) };
    }
    if (link.type === "external") {
      // The only external link is Gists; its label key is stored in link.label
      return { ...link, label: t(navTranslationKey(link.label)) };
    }
    return {
      ...link,
      href: localizePath(link.href) as `/${string}`,
      label: t(navTranslationKey(link.label)),
    };
  });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isMenuOpen
          ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label={t("nav.primaryAriaLabel")}
        className="relative px-4 py-4 md:px-16 lg:px-24"
      >
        <div className="flex items-center justify-between gap-4 md:items-center">
          <a
            href="#hero"
            className="font-bold text-gray-900 dark:text-gray-100 hover:opacity-80 transition-opacity duration-200"
          >
            {siteConfig.header}
          </a>

          <ul className="hidden md:flex md:items-center md:gap-4 lg:gap-5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLinkItem link={link} className={desktopLinkClassName} />
              </li>
            ))}
          </ul>

          <div className="hidden md:flex md:items-center md:gap-1">
            <LanguageSwitcher />
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:text-gray-100 md:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="site-header-menu"
            aria-label={isMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {t("nav.menu")}
          </button>
        </div>

        <div
          id="site-header-menu"
          role="region"
          aria-label={t("nav.mobileMenuAriaLabel")}
          hidden={!isMenuOpen}
          className={`absolute left-0 right-0 top-full md:hidden ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <div className="mx-4 rounded-b-2xl border border-t-0 border-gray-100 bg-white/95 px-4 pb-4 pt-3 shadow-lg backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95">
            <ul className="flex max-h-[calc(100vh-4.5rem)] flex-col gap-3 overflow-y-auto">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLinkItem
                    link={link}
                    className={mobileLinkClassName}
                    onClick={closeMenu}
                  />
                </li>
              ))}
            </ul>
            <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-800">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default SiteHeader;
