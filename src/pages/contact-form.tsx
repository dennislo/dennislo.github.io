import React from "react";
import Layout from "../components/Layout/Layout";
import ContactForm from "../components/ContactForm/ContactForm";
import { Head as SharedHead } from "../components/Head/Head";
import { buildWebPageSchema } from "../schemas";
import { siteConfig } from "../config";
import {
  isLocale,
  defaultLocale,
  localizePath,
  stripLocale,
} from "../i18n/config";
import { getDictionary } from "../i18n/dictionaries";

const ContactFormPage = () => (
  <Layout>
    <ContactForm />
  </Layout>
);

export default ContactFormPage;

// HeadProps is kept loose so callers can pass pageContext/location from Gatsby
// without needing to know the exact generated types.
interface ContactHeadProps {
  pageContext?: { locale?: unknown };
  location?: { pathname?: string };
}

export function Head({ pageContext, location }: ContactHeadProps = {}) {
  const localeFromCtx = pageContext?.locale;
  const locale =
    typeof localeFromCtx === "string" && isLocale(localeFromCtx)
      ? localeFromCtx
      : defaultLocale;
  const dict = getDictionary(locale);
  const { basePath } = stripLocale(location?.pathname ?? "/contact-form/");

  const schemas = [
    buildWebPageSchema({
      url: `${siteConfig.siteUrl}${localizePath(basePath, locale)}`,
      name: dict.seo.contactPageTitle,
      description: dict.seo.contactPageDescription,
    }),
  ];

  return (
    <>
      <SharedHead
        title={dict.seo.contactPageTitle}
        description={dict.seo.contactPageDescription}
        locale={locale}
        path={basePath}
        schemas={schemas}
      />
      <link rel="alternate" type="text/markdown" href="/contact-form.md" />
    </>
  );
}
