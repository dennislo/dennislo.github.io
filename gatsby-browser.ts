import "./src/styles/global.css";

export { wrapPageElement } from "./src/gatsby/wrapPageElement";

import { getStoredLocale, resolveRedirectTarget } from "./src/i18n/persistence";

export const onClientEntry = () => {
  if (typeof window === "undefined") return;
  const target = resolveRedirectTarget(
    window.location.pathname,
    getStoredLocale(),
    `${window.location.search}${window.location.hash}`,
  );
  if (target) window.location.replace(target);
};
