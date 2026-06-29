import "./src/styles/global.css";
import React from "react";
import type { GatsbySSR } from "gatsby";
import { locales, defaultLocale } from "./src/i18n/config";

// Inline redirect script: runs synchronously in <head> before first paint so the
// browser never renders wrong-locale content when the user has a stored preference.
// onClientEntry handles the same logic for completeness, but the script prevents
// the flash that would otherwise occur while JS bundles load.
const validLocales = locales.join("','");
const REDIRECT_SCRIPT = `(function(){try{var s=localStorage.getItem('preferredLocale');if(s&&['${validLocales}'].indexOf(s)>-1&&s!=='${defaultLocale}'&&location.pathname==='/'){location.replace('/'+s+'/')}}catch(e){}})();`;

export const onRenderBody: GatsbySSR["onRenderBody"] = ({
  setHeadComponents,
}) => {
  setHeadComponents([
    React.createElement("script", {
      key: "locale-redirect",
      dangerouslySetInnerHTML: { __html: REDIRECT_SCRIPT },
    }),
  ]);
};

export { wrapPageElement } from "./src/gatsby/wrapPageElement";
