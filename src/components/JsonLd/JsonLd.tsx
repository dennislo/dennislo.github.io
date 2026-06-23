import React from "react";

interface JsonLdProps {
  schema: Record<string, unknown>;
}

export function JsonLd({ schema }: JsonLdProps): React.ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Replace </ with <\/ to prevent the browser from terminating the script tag early
        __html: JSON.stringify(schema).replace(/<\//g, "<\\/"),
      }}
    />
  );
}

export default JsonLd;
