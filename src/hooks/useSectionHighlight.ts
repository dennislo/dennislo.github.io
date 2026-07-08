import { useEffect } from "react";

/** How long the highlight wash remains visible once a heading comes into view. */
export const HIGHLIGHT_DURATION_MS = 2000;
/** Safety cutoff in case the smooth scroll never brings the heading into view. */
const OBSERVER_SAFETY_MS = 5000;
const HIGHLIGHT_CLASS = "section-heading-highlight";

/**
 * Drives the momentary "section heading highlight" effect: when the user
 * navigates to an in-page section (via header nav click, direct URL hash, or
 * any `a[href^="#"]` anchor), the target section's marked heading
 * (`[data-section-heading]`) receives a brief background wash once it
 * actually scrolls into view.
 *
 * Mounted once near the top of the page; renders nothing.
 */
export function useSectionHighlight(): void {
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let highlightTimer: number | null = null;
    let safetyTimer: number | null = null;
    let activeHeading: HTMLElement | null = null;

    const clearTimers = () => {
      if (highlightTimer !== null) {
        window.clearTimeout(highlightTimer);
        highlightTimer = null;
      }
      if (safetyTimer !== null) {
        window.clearTimeout(safetyTimer);
        safetyTimer = null;
      }
    };

    /** Cancels any in-flight observer/timers and clears an active highlight. */
    const reset = () => {
      observer?.disconnect();
      observer = null;
      clearTimers();
      activeHeading?.classList.remove(HIGHLIGHT_CLASS);
      activeHeading = null;
    };

    const trigger = (hash: string) => {
      const id = hash.slice(1);
      if (!id) return;

      const heading = document
        .getElementById(id)
        ?.querySelector<HTMLElement>("[data-section-heading]");
      // Sections without the marker (e.g. Hero) are intentionally a no-op.
      if (!heading) return;

      reset();

      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;

          observer?.disconnect();
          observer = null;
          if (safetyTimer !== null) {
            window.clearTimeout(safetyTimer);
            safetyTimer = null;
          }

          activeHeading = heading;
          heading.classList.add(HIGHLIGHT_CLASS);
          highlightTimer = window.setTimeout(() => {
            heading.classList.remove(HIGHLIGHT_CLASS);
            if (activeHeading === heading) activeHeading = null;
            highlightTimer = null;
          }, HIGHLIGHT_DURATION_MS);
        },
        { threshold: 0.5 },
      );
      observer.observe(heading); // Fires immediately if already in view.

      safetyTimer = window.setTimeout(reset, OBSERVER_SAFETY_MS);
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest?.('a[href^="#"]');
      const href = anchor?.getAttribute("href");
      if (href && href.length > 1) trigger(href);
    };

    const onHashChange = () => trigger(window.location.hash);

    if (window.location.hash) trigger(window.location.hash);
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHashChange);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
      reset();
    };
  }, []);
}
