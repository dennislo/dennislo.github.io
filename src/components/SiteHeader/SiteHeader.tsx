import React, { useEffect, useState } from "react";
import { siteConfig } from "../../config";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
];

const SiteHeader: React.FC = () => {
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="px-4 py-4 md:px-16 lg:px-24"
      >
        <div className="flex items-center justify-between gap-4 md:items-start">
          <a
            href="#hero"
            className="font-bold text-gray-900 dark:text-gray-100 hover:opacity-80 transition-opacity duration-200"
          >
            {siteConfig.header}
          </a>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:text-gray-100 md:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="site-header-menu"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            Menu
          </button>
        </div>
        <ul
          id="site-header-menu"
          className={`mt-4 flex-col gap-3 md:mt-0 md:flex md:flex-row md:items-center md:justify-end md:gap-6 lg:gap-8 ${
            isMenuOpen ? "flex" : "hidden"
          }`}
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default SiteHeader;
