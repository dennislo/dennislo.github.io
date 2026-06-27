import React from "react";
import { Link, HeadFC } from "gatsby";
import { useLocale } from "../i18n";

const NotFoundPage = () => {
  const { t } = useLocale();

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-white dark:bg-gray-950">
      <div className="text-center max-w-sm">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t("notFound.title")}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
          {t("notFound.heading")}
        </p>
        <p className="text-gray-500 dark:text-gray-500 mb-8">
          {t("notFound.body")}
          {process.env.NODE_ENV === "development" && (
            <span className="block mt-2">
              Try creating a page in{" "}
              <code className="px-1.5 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded text-sm">
                src/pages/
              </code>
              .
            </span>
          )}
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors duration-200"
        >
          {t("notFound.goHomeButton")}
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;

export const Head: HeadFC = () => (
  <>
    <title>Not found</title>
    <link rel="alternate" type="text/markdown" href="/404.md" />
  </>
);
