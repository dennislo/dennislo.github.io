import React from "react";
import Layout from "../components/Layout/Layout";
import SiteHeader from "../components/SiteHeader/SiteHeader";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Projects from "../components/Projects/Projects";
import GitHubActivity from "../components/GitHubActivity/GitHubActivity";
import Experience from "../components/Experience/Experience";
import Education from "../components/Education/Education";
import SiteFooter from "../components/SiteFooter/SiteFooter";
import { Head as SharedHead } from "../components/Head/Head";
import {
  buildPersonSchema,
  buildWebSiteSchema,
  buildProfilePageSchema,
} from "../schemas";
import { siteConfig } from "../config";
import {
  isLocale,
  defaultLocale,
  localeMeta,
  stripLocale,
} from "../i18n/config";
import { getDictionary } from "../i18n/dictionaries";

const IndexPage = () => {
  return (
    <Layout>
      <SiteHeader />
      <Hero />
      <About />
      <Projects />
      <GitHubActivity />
      <Experience />
      <Education />
      <SiteFooter />
    </Layout>
  );
};

export default IndexPage;

// HeadProps is kept loose so callers can pass pageContext/location from Gatsby
// without needing to know the exact generated types.
interface IndexHeadProps {
  pageContext?: { locale?: unknown };
  location?: { pathname?: string };
}

export function Head({ pageContext, location }: IndexHeadProps = {}) {
  const localeFromCtx = pageContext?.locale;
  const hasLocale =
    typeof localeFromCtx === "string" && isLocale(localeFromCtx);
  const locale = hasLocale ? localeFromCtx : defaultLocale;
  const dict = getDictionary(locale);
  const { basePath } = stripLocale(location?.pathname ?? "/");

  const schemas = [
    buildPersonSchema(siteConfig, {
      jobTitle: dict.seo.jsonLdJobTitle,
      description: dict.seo.jsonLdDescription,
      inLanguage: localeMeta[locale].htmlLang,
    }),
    buildWebSiteSchema(siteConfig, {
      description: dict.seo.description,
      inLanguage: localeMeta[locale].htmlLang,
    }),
    buildProfilePageSchema(siteConfig, {
      description: dict.seo.description,
      inLanguage: localeMeta[locale].htmlLang,
    }),
  ];

  // Only pass a dict-derived title when a locale is explicitly present so that
  // the no-arg call (no pageContext) retains the SharedHead default title.
  const title = hasLocale ? dict.seo.siteTitle : undefined;

  return (
    <>
      <SharedHead
        title={title}
        description={hasLocale ? dict.seo.description : undefined}
        locale={locale}
        path={basePath}
        schemas={schemas}
      />
      <link rel="alternate" type="text/markdown" href="/index.md" />
    </>
  );
}
