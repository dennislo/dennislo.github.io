import "./src/styles/global.css";
import type { GatsbySSR } from "gatsby";
import { localeMeta, defaultLocale } from "./src/i18n/config";

export const onRenderBody: GatsbySSR["onRenderBody"] = ({
  setHtmlAttributes,
}) => {
  setHtmlAttributes({ lang: localeMeta[defaultLocale].htmlLang });
};

export { wrapPageElement } from "./src/gatsby/wrapPageElement";
