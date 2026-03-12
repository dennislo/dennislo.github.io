import React from "react";
import { Link } from "gatsby";
import { siteConfig } from "../../config";
import TablerEmail from "../icons/TablerEmail";
import TablerGithub from "../icons/TablerGithub";
import TablerLinkedin from "../icons/TablerLinkedin";
import TablerInstagram from "../icons/TablerInstagram";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
];

const SiteFooter = () => {
  const accent = siteConfig.accentColor;

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
      <div className="p-8 sm:p-12 md:p-16 lg:p-24">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Name & title */}
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {siteConfig.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {siteConfig.title}
            </p>
          </div>

          {/* Nav links */}
          <ul className="flex flex-wrap gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/contact-form"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* Social icons */}
          <div
            className="flex items-center gap-4 text-gray-600 dark:text-gray-400"
            style={{ ["--accent" as string]: accent }}
          >
            <a
              href={`mailto:${siteConfig.social.email}`}
              aria-label="Email Dennis Lo"
              className="transition-colors duration-300 hover:text-[--accent]"
            >
              <TablerEmail className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Dennis Lo on GitHub"
              className="transition-colors duration-300 hover:text-[--accent]"
            >
              <TablerGithub className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Dennis Lo on LinkedIn"
              className="transition-colors duration-300 hover:text-[--accent]"
            >
              <TablerLinkedin className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Dennis Lo on Instagram"
              className="transition-colors duration-300 hover:text-[--accent]"
            >
              <TablerInstagram className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} {siteConfig.name}. Built with ❤️ using{" "}
            <a
              href="https://www.gatsbyjs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors duration-300"
              style={{ color: accent }}
            >
              Gatsby.js
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
