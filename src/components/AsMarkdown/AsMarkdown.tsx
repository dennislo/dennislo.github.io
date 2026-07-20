import React from "react";

interface AsMarkdownProps {
  href: string;
  label: string;
}

function AsMarkdown({ href, label }: AsMarkdownProps) {
  return (
    <a
      href={href}
      aria-label={label}
      className="fixed bottom-6 right-20 z-50 inline-flex min-h-10 w-10 items-center justify-center whitespace-nowrap rounded-full border border-gray-200 bg-white px-0 py-2 text-sm font-semibold text-gray-700 shadow-md transition-all duration-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-auto sm:gap-2 sm:px-4 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
    >
      <svg
        viewBox="0 0 208 128"
        className="h-[0.85em] w-auto shrink-0"
        aria-hidden="true"
        focusable="false"
        fill="currentColor"
      >
        <rect
          x="7.5"
          y="7.5"
          width="193"
          height="113"
          rx="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="15"
        />
        <path
          fill="currentColor"
          d="M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39zm125 0l-30-33h20V30h20v35h20z"
        />
      </svg>
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}

export default AsMarkdown;
