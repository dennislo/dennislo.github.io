/**
 * Head component
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */

import React from "react";
import PropTypes from "prop-types";

export function Head() {
  const lang = "en";
  const title = "Who is DLO?";

  const metaDescription = `${title} - My personal homepage`;

  const author = "@dlo";

  return (
    <>
      <html lang={lang} />
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
        href="/favicon//favicon-16x16.png"
      />
      <link rel="manifest" href="/favicon/site.webmanifest" />
    </>
  );
}

Head.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
};

Head.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
};

export default Head;
