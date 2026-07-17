import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { siteConfig } from "../config";
import {
  getLocalizedExperience,
  getLocalizedProjects,
} from "./localizedContent";
import type { TranslationDictionary } from "./types";
import { enUS } from "./translations/en-US";
import { esES } from "./translations/es-ES";
import { zhHans } from "./translations/zh-Hans";

interface LocaleCase {
  locale: "en-US" | "zh-Hans" | "es-ES";
  dict: TranslationDictionary;
  webAndMobileScope: string;
}

const localeCases: readonly LocaleCase[] = [
  {
    locale: "en-US",
    dict: enUS,
    webAndMobileScope: "across web and mobile",
  },
  {
    locale: "zh-Hans",
    dict: zhHans,
    webAndMobileScope: "跨 Web 和移动端",
  },
  {
    locale: "es-ES",
    dict: esES,
    webAndMobileScope: "en web y móvil",
  },
];

const canonicalExperienceFacts = [
  "Chargebee",
  "Commerce Tools",
  "Adyen",
  "React",
  "Redux",
  "Node",
  "MachineMax",
  "ScienceDirect",
  "Cell",
  "The Lancet",
  "Facebook",
  "Twitter",
  "Instagram",
  "YouTube",
] as const;

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function readLocalizedHomepage(locale: LocaleCase["locale"]): string {
  return normalizeWhitespace(
    readFileSync(resolve(process.cwd(), "static", locale, "index.md"), "utf8"),
  );
}

function missingContent(
  markdown: string,
  expected: readonly string[],
): string[] {
  return expected.filter(
    (content) => !markdown.includes(normalizeWhitespace(content)),
  );
}

function markdownLinkTargets(markdown: string): string[] {
  return Array.from(markdown.matchAll(/\]\(([^)]+)\)/g), (match) => match[1]);
}

describe.each(localeCases)(
  "$locale homepage Markdown parity",
  ({ locale, dict, webAndMobileScope }) => {
    it("contains every localized project name and description", () => {
      const markdown = readLocalizedHomepage(locale);
      const projects = getLocalizedProjects(dict);
      const expected = projects.flatMap(({ name, description }) => [
        name,
        description,
      ]);

      expect(missingContent(markdown, expected)).toEqual([]);
    });

    it("contains every locale-invariant skill for each project", () => {
      const markdown = readLocalizedHomepage(locale);
      const projects = getLocalizedProjects(dict);
      const experienceStart = markdown.indexOf(
        normalizeWhitespace(getLocalizedExperience(dict)[0].company),
      );
      const missingSkills = projects.flatMap((project, index) => {
        const projectStart = markdown.indexOf(
          normalizeWhitespace(project.name),
        );
        const nextProject = projects[index + 1];
        const projectEnd = nextProject
          ? markdown.indexOf(
              normalizeWhitespace(nextProject.name),
              projectStart + 1,
            )
          : experienceStart;
        const projectSection = markdown.slice(projectStart, projectEnd);

        return project.skills
          .filter(
            (skill) => !projectSection.includes(normalizeWhitespace(skill)),
          )
          .map((skill) => `${project.name}: ${skill}`);
      });

      expect(missingSkills).toEqual([]);
    });

    it("contains every authoritative experience field within its employer section", () => {
      const markdown = readLocalizedHomepage(locale);
      const experience = getLocalizedExperience(dict);
      const educationStart = markdown.indexOf(
        normalizeWhitespace(dict.education.degree),
      );
      const missingFields = experience.flatMap((entry, index) => {
        const companyStart = markdown.indexOf(
          normalizeWhitespace(entry.company),
        );
        const entryStart = markdown.lastIndexOf(
          normalizeWhitespace(entry.title),
          companyStart,
        );
        const nextEntry = experience[index + 1];
        const nextEntryStart = nextEntry
          ? markdown.lastIndexOf(
              normalizeWhitespace(nextEntry.title),
              markdown.indexOf(normalizeWhitespace(nextEntry.company)),
            )
          : educationStart;
        const employerSection = markdown.slice(entryStart, nextEntryStart);
        const expected = [
          entry.title,
          entry.company,
          entry.dateRange,
          ...entry.bullets,
        ];

        return missingContent(employerSection, expected).map(
          (content) => `${entry.company}: ${content}`,
        );
      });

      expect(missingFields).toEqual([]);
    });

    it("preserves named experience platforms and web/mobile scope", () => {
      const markdown = readLocalizedHomepage(locale);

      expect(
        missingContent(markdown, [
          ...canonicalExperienceFacts,
          webAndMobileScope,
        ]),
      ).toEqual([]);
    });

    it("contains every configured social and contact link", () => {
      const markdown = readLocalizedHomepage(locale);
      const expectedLinks = [
        `mailto:${siteConfig.social.email}`,
        siteConfig.social.meet,
        siteConfig.social.github,
        siteConfig.social.linkedin,
        siteConfig.social.instagram,
      ];

      expect(missingContent(markdown, expectedLinks)).toEqual([]);
    });

    it("keeps homepage and contact-form links within the active locale", () => {
      const markdown = readLocalizedHomepage(locale);
      const targets = markdownLinkTargets(markdown);

      expect(targets).toEqual(
        expect.arrayContaining([`/${locale}/`, `/${locale}/contact-form/`]),
      );
    });
  },
);
