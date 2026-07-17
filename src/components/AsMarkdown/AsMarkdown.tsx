import React from "react";

interface AsMarkdownProps {
  href: string;
  label: string;
}

function AsMarkdown({ href, label }: AsMarkdownProps) {
  return (
    <a
      href={href}
      className="fixed bottom-6 right-20 z-50 inline-flex min-h-10 items-center whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-md transition-all duration-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
    >
      {label}
    </a>
  );
}

export default AsMarkdown;
