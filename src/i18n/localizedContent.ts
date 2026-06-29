/**
 * localizedContent.ts
 *
 * Pure functions that merge locale-invariant structure from siteConfig with
 * localized display strings from a TranslationDictionary.
 *
 * siteConfig entries carry stable content keys, while dictionaries provide
 * localized display strings for those keys.
 */

import { siteConfig } from "../config";
import type { TranslationDictionary } from "./types";

// ─── Projects ────────────────────────────────────────────────────────────────

export interface LocalizedProject {
  name: string;
  description: string;
  link: string;
  skills: string[];
}

type ProjectContentKey = (typeof siteConfig.projects)[number]["contentKey"];
type ProjectsDict = TranslationDictionary["projects"];

const projectContentByKey: Record<
  ProjectContentKey,
  {
    nameKey: keyof ProjectsDict;
    descKey: keyof ProjectsDict;
  }
> = {
  aiDevRoundup: {
    nameKey: "aiDevRoundupName",
    descKey: "aiDevRoundupDescription",
  },
  chromeExtensionMastery: {
    nameKey: "chromeExtensionMasteryName",
    descKey: "chromeExtensionMasteryDescription",
  },
  extensionKit: {
    nameKey: "extensionKitName",
    descKey: "extensionKitDescription",
  },
};

export function getLocalizedProjects(
  dict: TranslationDictionary,
): LocalizedProject[] {
  const { projects } = dict;

  return siteConfig.projects.map(({ contentKey, link, skills }) => {
    const { nameKey, descKey } = projectContentByKey[contentKey];
    return {
      name: projects[nameKey] as string,
      description: projects[descKey] as string,
      link,
      skills,
    };
  });
}

// ─── Experience ──────────────────────────────────────────────────────────────

export interface LocalizedExperienceEntry {
  title: string;
  company: string;
  dateRange: string;
  bullets: string[];
}

type ExpDict = TranslationDictionary["experience"];
type ExperienceContentKey =
  (typeof siteConfig.experience)[number]["contentKey"];

function expBullets(exp: ExpDict, keys: Array<keyof ExpDict>): string[] {
  return keys.map((k) => exp[k] as string);
}

const experienceContentByKey: Record<
  ExperienceContentKey,
  {
    titleKey: keyof Pick<ExpDict, "roleContractor" | "roleSenior">;
    bulletKeys: Array<keyof ExpDict>;
  }
> = {
  crosstide: {
    titleKey: "roleContractor",
    bulletKeys: ["crosstideBullet1", "crosstideBullet2", "crosstideBullet3"],
  },
  pret: {
    titleKey: "roleContractor",
    bulletKeys: ["pretBullet1", "pretBullet2"],
  },
  natwest: {
    titleKey: "roleContractor",
    bulletKeys: ["natwestBullet1", "natwestBullet2"],
  },
  bcg: {
    titleKey: "roleContractor",
    bulletKeys: ["bcgBullet1", "bcgBullet2"],
  },
  elsevier: {
    titleKey: "roleContractor",
    bulletKeys: ["elsevierBullet1", "elsevierBullet2"],
  },
  starcount: {
    titleKey: "roleSenior",
    bulletKeys: ["starcountBullet1", "starcountBullet2", "starcountBullet3"],
  },
};

export function getLocalizedExperience(
  dict: TranslationDictionary,
): LocalizedExperienceEntry[] {
  const { experience: exp } = dict;

  return siteConfig.experience.map(({ contentKey, company, dateRange }) => {
    const { titleKey, bulletKeys } = experienceContentByKey[contentKey];
    return {
      title: exp[titleKey] as string,
      company,
      dateRange,
      bullets: expBullets(exp, bulletKeys),
    };
  });
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
