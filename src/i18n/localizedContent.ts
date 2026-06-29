/**
 * localizedContent.ts
 *
 * Pure functions that merge locale-invariant structure from siteConfig with
 * localized display strings from a TranslationDictionary.
 *
 * Coupling note: the index↔key mapping below is intentional. Adding or
 * removing an item requires updating BOTH siteConfig (src/config.ts) and the
 * matching key in all four dictionaries (src/i18n/translations/).
 */

import { siteConfig } from "../config";
import type { TranslationDictionary } from "./types";

// Guard the index↔key coupling at module load time so a reorder in siteConfig
// fails loudly rather than silently attaching wrong localized strings.
if (process.env.NODE_ENV !== "test") {
  console.assert(
    siteConfig.projects[0]?.name?.includes("AI Dev Roundup"),
    "localizedContent: projects[0] expected to be AI Dev Roundup",
  );
  console.assert(
    siteConfig.projects[1]?.name?.includes("Chrome Extension"),
    "localizedContent: projects[1] expected to be Chrome Extension Mastery",
  );
  console.assert(
    siteConfig.experience[0]?.company?.startsWith("Crosstide"),
    "localizedContent: experience[0] expected to be Crosstide",
  );
  console.assert(
    siteConfig.experience[5]?.company === "Starcount",
    "localizedContent: experience[5] expected to be Starcount",
  );
}

// ─── Projects ────────────────────────────────────────────────────────────────
// siteConfig.projects index → dict.projects key prefix
// 0: aiDevRoundup, 1: chromeExtensionMastery, 2: extensionKit

export interface LocalizedProject {
  name: string;
  description: string;
  link: string;
  skills: string[];
}

export function getLocalizedProjects(
  dict: TranslationDictionary,
): LocalizedProject[] {
  const { projects } = dict;
  const projectKeys: Array<{
    nameKey: keyof typeof projects;
    descKey: keyof typeof projects;
    index: number;
  }> = [
    {
      nameKey: "aiDevRoundupName",
      descKey: "aiDevRoundupDescription",
      index: 0,
    },
    {
      nameKey: "chromeExtensionMasteryName",
      descKey: "chromeExtensionMasteryDescription",
      index: 1,
    },
    {
      nameKey: "extensionKitName",
      descKey: "extensionKitDescription",
      index: 2,
    },
  ];

  return projectKeys
    .filter(({ index }) => index < siteConfig.projects.length)
    .map(({ nameKey, descKey, index }) => ({
      name: projects[nameKey] as string,
      description: projects[descKey] as string,
      link: siteConfig.projects[index].link,
      skills: siteConfig.projects[index].skills,
    }));
}

// ─── Experience ──────────────────────────────────────────────────────────────
// siteConfig.experience index → company key prefix in dict.experience
// 0: Crosstide  (crosstideBullet1/2/3)
// 1: Pret       (pretBullet1/2)
// 2: NatWest    (natwestBullet1/2)
// 3: BCG        (bcgBullet1/2)
// 4: Elsevier   (elsevierBullet1/2)
// 5: Starcount  (starcountBullet1/2/3)

export interface LocalizedExperienceEntry {
  title: string;
  company: string;
  dateRange: string;
  bullets: string[];
}

type ExpDict = TranslationDictionary["experience"];

function expBullets(exp: ExpDict, keys: Array<keyof ExpDict>): string[] {
  return keys.map((k) => exp[k] as string);
}

export function getLocalizedExperience(
  dict: TranslationDictionary,
): LocalizedExperienceEntry[] {
  const { experience: exp } = dict;
  const { experience: cfg } = siteConfig;

  const titleFor = (company: string): string => {
    // Starcount used "Senior Software Engineer"; all others are contractors.
    if (company === "Starcount") return exp.roleSenior;
    return exp.roleContractor;
  };

  // All six entries are defined in siteConfig. Return an empty array if the
  // config is cleared (e.g. in tests that stub siteConfig.experience = []).
  if (cfg.length === 0) return [];

  return [
    {
      title: titleFor(cfg[0].company),
      company: cfg[0].company,
      dateRange: cfg[0].dateRange,
      bullets: expBullets(exp, [
        "crosstideBullet1",
        "crosstideBullet2",
        "crosstideBullet3",
      ]),
    },
    ...(cfg.length > 1
      ? [
          {
            title: titleFor(cfg[1].company),
            company: cfg[1].company,
            dateRange: cfg[1].dateRange,
            bullets: expBullets(exp, ["pretBullet1", "pretBullet2"]),
          },
        ]
      : []),
    ...(cfg.length > 2
      ? [
          {
            title: titleFor(cfg[2].company),
            company: cfg[2].company,
            dateRange: cfg[2].dateRange,
            bullets: expBullets(exp, ["natwestBullet1", "natwestBullet2"]),
          },
        ]
      : []),
    ...(cfg.length > 3
      ? [
          {
            title: titleFor(cfg[3].company),
            company: cfg[3].company,
            dateRange: cfg[3].dateRange,
            bullets: expBullets(exp, ["bcgBullet1", "bcgBullet2"]),
          },
        ]
      : []),
    ...(cfg.length > 4
      ? [
          {
            title: titleFor(cfg[4].company),
            company: cfg[4].company,
            dateRange: cfg[4].dateRange,
            bullets: expBullets(exp, ["elsevierBullet1", "elsevierBullet2"]),
          },
        ]
      : []),
    ...(cfg.length > 5
      ? [
          {
            title: titleFor(cfg[5].company),
            company: cfg[5].company,
            dateRange: cfg[5].dateRange,
            bullets: expBullets(exp, [
              "starcountBullet1",
              "starcountBullet2",
              "starcountBullet3",
            ]),
          },
        ]
      : []),
  ];
}

// ─── Education ───────────────────────────────────────────────────────────────
// siteConfig.education[0] is the single entry (school/dateRange invariant).

export interface LocalizedEducationEntry {
  degree: string;
  school: string;
  dateRange: string;
  achievements: string[];
}

export function getLocalizedEducation(
  dict: TranslationDictionary,
): LocalizedEducationEntry[] {
  const { education: edu } = dict;
  const { education: cfg } = siteConfig;

  return [
    {
      degree: edu.degree,
      school: cfg[0].school,
      dateRange: cfg[0].dateRange,
      achievements: [edu.achievement1, edu.achievement2],
    },
  ];
}

// ─── Clients ─────────────────────────────────────────────────────────────────
// siteConfig.clients index → dict.about.clients key
// 0: advertisingMedia, 1: hrRecruitment, 2: retailConsumer,
// 3: scienceEducation, 4: financeBanking, 5: itTelecommunications

export function getLocalizedClients(dict: TranslationDictionary): string[] {
  const { clients } = dict.about;
  return [
    clients.advertisingMedia,
    clients.hrRecruitment,
    clients.retailConsumer,
    clients.scienceEducation,
    clients.financeBanking,
    clients.itTelecommunications,
  ];
}

// ─── Fun Facts ───────────────────────────────────────────────────────────────
// emoji from siteConfig.funFacts[i], text from dict.about.funFacts.factN
// 0: fact1, 1: fact2, 2: fact3

export interface LocalizedFunFact {
  emoji: string;
  text: string;
}

export function getLocalizedFunFacts(
  dict: TranslationDictionary,
): LocalizedFunFact[] {
  const { funFacts } = dict.about;
  return [
    { emoji: siteConfig.funFacts[0].emoji, text: funFacts.fact1 },
    { emoji: siteConfig.funFacts[1].emoji, text: funFacts.fact2 },
    { emoji: siteConfig.funFacts[2].emoji, text: funFacts.fact3 },
  ];
}
