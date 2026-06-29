import type { siteConfig } from "./config";
import { localeMeta, defaultLocale } from "./i18n/config";

type SiteConfig = typeof siteConfig;

export interface LocalizedSeoOverrides {
  jobTitle?: string;
  description?: string;
  name?: string;
  inLanguage?: string;
}

// Base type with index signature so all schema types are assignable to Record<string, unknown>
interface JsonLdBase {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
}

export interface PersonSchemaNode {
  "@type": "Person";
  name: string;
  url: string;
  email: string;
  jobTitle: string;
  description: string;
  sameAs: string[];
  knowsAbout: string[];
  alumniOf: { "@type": "EducationalOrganization"; name: string };
  [key: string]: unknown;
}

// Intersection type — avoids duplicating all eight field declarations
export type PersonSchema = PersonSchemaNode & {
  "@context": "https://schema.org";
};

export interface WebSiteSchema extends JsonLdBase {
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  inLanguage: string;
}

export interface ProfilePageSchema extends JsonLdBase {
  "@type": "ProfilePage";
  url: string;
  name: string;
  description: string;
  inLanguage: string;
  mainEntity: PersonSchemaNode;
}

export interface ArticleSchemaOptions {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}

export interface ArticleSchema extends JsonLdBase {
  "@type": "Article";
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  author: PersonSchemaNode;
}

export interface WebPageSchemaOptions {
  url: string;
  name: string;
  description?: string;
}

export interface WebPageSchema extends JsonLdBase {
  "@type": "WebPage";
  url: string;
  name: string;
  description?: string;
}

function buildPersonNode(
  config: SiteConfig,
  seo?: LocalizedSeoOverrides,
): PersonSchemaNode {
  return {
    "@type": "Person",
    name: config.name,
    url: config.siteUrl,
    email: config.social.email,
    jobTitle: seo?.jobTitle ?? config.title,
    description: seo?.description ?? config.description,
    sameAs: [
      config.social.github,
      config.social.linkedin,
      config.social.instagram,
    ],
    knowsAbout: [...config.skills],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: config.education[0].school,
    },
  };
}

export function buildPersonSchema(
  config: SiteConfig,
  seo?: LocalizedSeoOverrides,
): PersonSchema {
  return { "@context": "https://schema.org", ...buildPersonNode(config, seo) };
}

export function buildWebSiteSchema(
  config: SiteConfig,
  seo?: LocalizedSeoOverrides,
): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.header,
    url: config.siteUrl,
    description: seo?.description ?? config.description,
    inLanguage: seo?.inLanguage ?? localeMeta[defaultLocale].htmlLang,
  };
}

export function buildProfilePageSchema(
  config: SiteConfig,
  seo?: LocalizedSeoOverrides,
): ProfilePageSchema {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: config.siteUrl,
    name: config.header,
    description: seo?.description ?? config.description,
    inLanguage: seo?.inLanguage ?? localeMeta[defaultLocale].htmlLang,
    mainEntity: buildPersonNode(config, seo),
  };
}

export function buildArticleSchema(
  config: SiteConfig,
  options: ArticleSchemaOptions,
): ArticleSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.headline,
    description: options.description,
    url: options.url,
    datePublished: options.datePublished,
    ...(options.dateModified !== undefined && {
      dateModified: options.dateModified,
    }),
    ...(options.image !== undefined && { image: options.image }),
    author: buildPersonNode(config),
  };
}

export function buildWebPageSchema(
  options: WebPageSchemaOptions,
): WebPageSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: options.url,
    name: options.name,
    ...(options.description !== undefined && {
      description: options.description,
    }),
  };
}
