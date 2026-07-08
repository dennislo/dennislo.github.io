import "./src/styles/global.css";

export { wrapPageElement } from "./src/gatsby/wrapPageElement";

import { detectLocaleFromLanguages } from "./src/i18n/detect";
import {
  getStoredLocale,
  markAutoDetectedNotice,
  resolveRedirectTarget,
  storeLocale,
} from "./src/i18n/persistence";

export const onClientEntry = () => {
  if (typeof window === "undefined") return;
  const stored = getStoredLocale();
  const detected = detectLocaleFromLanguages(navigator.languages ?? []);
  const target = resolveRedirectTarget(
    window.location.pathname,
    stored,
    detected,
  );
  if (target) {
    if (stored === null && detected !== null) {
      storeLocale(detected);
      markAutoDetectedNotice(detected);
    }
    window.location.replace(target);
  }
};
