/**
 * Head component
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */

import React from "react";

type HeadProps = {
  title?: string;
  description?: string;
  lang?: string;
  author?: string;
};

export function Head({
  title = "Who is DLO?",
  description,
  lang = "en",
  author = "@dlo",
}: HeadProps) {
  const metaDescription = description ?? `${title} - My personal homepage`;
  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={author} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />
      <link rel="manifest" href="/favicon/site.webmanifest" />
    </>
  );
}

export default Head;
