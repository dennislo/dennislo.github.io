import React, { useEffect, useState } from "react";
import { siteConfig } from "../../config";
import ExternalLink from "../ExternalLink/ExternalLink";

type InternalNavLink = { type: "internal"; label: string; href: `#${string}` };
type ExternalNavLink = { type: "external"; label: string; href: string };
type NavLink = InternalNavLink | ExternalNavLink;

const navLinks: NavLink[] = [
  { type: "internal", label: "About", href: "#about" },
  { type: "internal", label: "Projects", href: "#projects" },
  { type: "internal", label: "Experience", href: "#experience" },
  { type: "internal", label: "Education", href: "#education" },
  {
    type: "external",
    label: "Gists",
    href: "https://gist.github.com/dennislo/public",
  },
];

const desktopLinkClassName =
  "text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300";

const mobileLinkClassName =
  "block rounded-lg px-2 py-2 text-sm text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100";

const SiteHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isMenuOpen
          ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="relative px-4 py-4 md:px-16 lg:px-24"
      >
        <div className="flex items-center justify-between gap-4 md:items-center">
          <a
            href="#hero"
            className="font-bold text-gray-900 dark:text-gray-100 hover:opacity-80 transition-opacity duration-200"
          >
            {siteConfig.header}
          </a>

          <ul className="hidden md:flex md:items-center md:gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                {link.type === "internal" ? (
                  <a href={link.href} className={desktopLinkClassName}>
                    {link.label}
                  </a>
                ) : (
                  <ExternalLink
                    href={link.href}
                    className={desktopLinkClassName}
                  >
                    {link.label}
                  </ExternalLink>
                )}
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:text-gray-100 md:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="site-header-menu"
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            Menu
          </button>
        </div>

        <div
          id="site-header-menu"
          role="region"
          aria-label="Mobile primary menu"
          hidden={!isMenuOpen}
          className={`absolute left-0 right-0 top-full md:hidden ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <div className="mx-4 rounded-b-2xl border border-t-0 border-gray-100 bg-white/95 px-4 pb-4 pt-3 shadow-lg backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95">
            <ul className="flex max-h-[calc(100vh-4.5rem)] flex-col gap-3 overflow-y-auto">
              {navLinks.map((link) => (
                <li
                  key={link.href}
                  onClick={
                    link.type === "external"
                      ? () => setIsMenuOpen(false)
                      : undefined
                  }
                >
                  {link.type === "internal" ? (
                    <a
                      href={link.href}
                      className={mobileLinkClassName}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <ExternalLink
                      href={link.href}
                      className={mobileLinkClassName}
                    >
                      {link.label}
                    </ExternalLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default SiteHeader;
