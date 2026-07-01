import React from "react";
import Layout from "../components/Layout/Layout";
import MeetingBooker from "../components/MeetingBooker/MeetingBooker";
import { Head as SharedHead } from "../components/Head/Head";
import { buildWebPageSchema } from "../schemas";
import { siteConfig } from "../config";
import {
  defaultLocale,
  isLocale,
  localizePath,
  stripLocale,
} from "../i18n/config";
import { getDictionary } from "../i18n/dictionaries";
import { useLocale } from "../i18n";

function MeetPage() {
  const { dict } = useLocale();

  return (
    <Layout>
      <main className="min-h-screen bg-white px-6 py-24 dark:bg-gray-950 sm:px-10 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            {dict.meet.pageTitle}
          </h1>
          <MeetingBooker />
        </div>
      </main>
    </Layout>
  );
}

export default MeetPage;

interface MeetHeadProps {
  pageContext?: { locale?: unknown };
  location?: { pathname?: string };
}

export function Head({ pageContext, location }: MeetHeadProps = {}) {
  const localeFromCtx = pageContext?.locale;
  const locale =
    typeof localeFromCtx === "string" && isLocale(localeFromCtx)
      ? localeFromCtx
      : defaultLocale;
  const dict = getDictionary(locale);
  const { basePath } = stripLocale(location?.pathname ?? "/meet/");

  const schemas = [
    buildWebPageSchema({
      url: `${siteConfig.siteUrl}${localizePath(basePath, locale)}`,
      name: dict.seo.meetPageTitle,
      description: dict.seo.meetPageDescription,
    }),
  ];

  return (
    <SharedHead
      title={dict.seo.meetPageTitle}
      description={dict.seo.meetPageDescription}
      locale={locale}
      path={basePath}
      schemas={schemas}
    />
  );
}
