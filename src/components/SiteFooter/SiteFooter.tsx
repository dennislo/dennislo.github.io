import React from "react";
import { Link } from "gatsby";
import { routes, sectionNavLinks, siteConfig } from "../../config";
import { useLocale } from "../../i18n";
import ExternalLink from "../ExternalLink/ExternalLink";
import TablerEmail from "../icons/TablerEmail";
import TablerGithub from "../icons/TablerGithub";
import TablerLinkedin from "../icons/TablerLinkedin";
import TablerInstagram from "../icons/TablerInstagram";
import type { TranslationDictionary } from "../../i18n";

// Map from section href to the nav dictionary key (mirrors SiteHeader)
const hrefToNavKey: Record<string, keyof TranslationDictionary["nav"]> = {
  "#about": "about",
  "#projects": "projects",
  "#github-activity": "activity",
  "#experience": "experience",
  "#education": "education",
};

const SiteFooter = () => {
  const accent = siteConfig.accentColor;
  const { t, localizePath } = useLocale();

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
            {sectionNavLinks.map((link) => {
              const key = hrefToNavKey[link.href] ?? "about";
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
                  >
                    {t(`nav.${key}`)}
                  </a>
                </li>
              );
            })}
            <li>
              <Link
                to={localizePath(routes.contactForm)}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
              >
                {t("footer.contact")}
              </Link>
            </li>
          </ul>

          {/* Social icons */}
          <div
            className="flex items-center gap-4 text-gray-600 dark:text-gray-400"
            style={{ ["--accent" as string]: accent }}
          >
            <Link
              to={localizePath(routes.contactForm)}
              aria-label={t("footer.emailAria")}
              className="transition-colors duration-300 hover:text-[--accent]"
            >
              <TablerEmail className="h-5 w-5" />
            </Link>
            <ExternalLink
              href={siteConfig.social.github}
              aria-label={t("footer.githubAria")}
              className="transition-colors duration-300 hover:text-[--accent]"
            >
              <TablerGithub className="h-5 w-5" />
            </ExternalLink>
            <ExternalLink
              href={siteConfig.social.linkedin}
              aria-label={t("footer.linkedinAria")}
              className="transition-colors duration-300 hover:text-[--accent]"
            >
              <TablerLinkedin className="h-5 w-5" />
            </ExternalLink>
            <ExternalLink
              href={siteConfig.social.instagram}
              aria-label={t("footer.instagramAria")}
              className="transition-colors duration-300 hover:text-[--accent]"
            >
              <TablerInstagram className="h-5 w-5" />
            </ExternalLink>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} {siteConfig.name}.{" "}
            {t("footer.builtWith")} ❤️ {t("footer.using")}{" "}
            <ExternalLink
              href="https://www.gatsbyjs.org/"
              className="underline transition-colors duration-300"
              style={{ color: accent }}
            >
              Gatsby.js
            </ExternalLink>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
