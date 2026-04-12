import React from "react";
import { Link, HeadFC } from "gatsby";

const NotFoundPage = () => {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-white dark:bg-gray-950">
      <div className="text-center max-w-sm">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          404
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
          Page not found
        </p>
        <p className="text-gray-500 dark:text-gray-500 mb-8">
          Sorry 😔, we couldn&apos;t find what you were looking for.
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
          Go home
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
