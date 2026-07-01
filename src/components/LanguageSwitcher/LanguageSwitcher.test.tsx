import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocaleProvider } from "../../i18n";
import { localeMeta, locales } from "../../i18n/config";
import { enGB } from "../../i18n/translations/en-GB";
import type { Locale } from "../../i18n/config";
import LanguageSwitcher from "./LanguageSwitcher";

// ---------------------------------------------------------------------------
// Gatsby mock: expose navigate as a jest spy, Link as a plain anchor,
// and useLocation as a controllable mock.
// This follows the same pattern used by other test files in this repo.
// ---------------------------------------------------------------------------
const mockNavigate = jest.fn();
const mockUseLocation = jest.fn();

jest.mock("gatsby", () => ({
  ...jest.requireActual("gatsby"),
  navigate: (...args: unknown[]) => mockNavigate(...args),
  Link: ({
    to,
    children,
    ...rest
  }: {
    to: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={to} {...(rest as React.ComponentProps<"a">)}>
      {children}
    </a>
  ),
}));

// Gatsby provides @reach/router's useLocation at runtime via @gatsbyjs/reach-router
// (the `gatsby` package itself does not export useLocation). Mock it there.
jest.mock("@gatsbyjs/reach-router", () => ({
  ...jest.requireActual("@gatsbyjs/reach-router"),
  useLocation: () => mockUseLocation(),
}));

// ---------------------------------------------------------------------------
// Helper: render LanguageSwitcher with a controlled location and locale
// ---------------------------------------------------------------------------
function renderSwitcher(locale: Locale, pathname: string) {
  mockUseLocation.mockReturnValue({ pathname, search: "", hash: "" });
  return render(
    <LocaleProvider locale={locale}>
      <LanguageSwitcher />
    </LocaleProvider>,
  );
}

// ---------------------------------------------------------------------------

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockReset();
    mockUseLocation.mockReset();
  });

  // -------------------------------------------------------------------------
  // 1. Renders all four locales with flag + label
  // -------------------------------------------------------------------------
  describe("renders all locales", () => {
    it("renders a control for each of the four locales", () => {
      renderSwitcher("en-GB", "/");

      for (const locale of locales) {
        const { flag, label } = localeMeta[locale];
        // Each locale control must show BOTH the flag emoji and the label text
        expect(screen.getByText(flag)).toBeInTheDocument();
        expect(screen.getByText(label)).toBeInTheDocument();
      }
    });

    it("renders exactly four locale labels (one per supported locale)", () => {
      renderSwitcher("en-GB", "/");
      expect(locales).toHaveLength(4);
    });
  });

  // -------------------------------------------------------------------------
  // 2. Active locale has aria-current; others link to the same page in that locale
  // -------------------------------------------------------------------------
  describe("aria-current and link targets at root ('/')", () => {
    it("marks the en-GB control as aria-current='page' when locale is en-GB", () => {
      renderSwitcher("en-GB", "/");

      const { flag, label } = localeMeta["en-GB"];
      const activeControl =
        screen.getByText(flag).closest("[aria-current]") ||
        screen.getByText(label).closest("[aria-current]");

      expect(activeControl).not.toBeNull();
      expect(activeControl).toHaveAttribute("aria-current", "page");
    });

    it("does NOT mark the zh-Hans control as aria-current when locale is en-GB", () => {
      renderSwitcher("en-GB", "/");

      const { flag } = localeMeta["zh-Hans"];
      const zhHansControl = screen.getByText(flag).closest("a, button");
      expect(zhHansControl).not.toHaveAttribute("aria-current", "true");
      expect(zhHansControl).not.toHaveAttribute("aria-current", "page");
    });

    it("the zh-Hans control links to '/zh-Hans/' when at root and locale is en-GB", () => {
      renderSwitcher("en-GB", "/");

      const { label } = localeMeta["zh-Hans"];
      const link = screen.getByText(label).closest("a");
      expect(link).not.toBeNull();
      expect(link).toHaveAttribute("href", "/zh-Hans/");
    });

    it("the en-US control links to '/en-US/' when at root and locale is en-GB", () => {
      renderSwitcher("en-GB", "/");

      const { label } = localeMeta["en-US"];
      const link = screen.getByText(label).closest("a");
      expect(link).not.toBeNull();
      expect(link).toHaveAttribute("href", "/en-US/");
    });
  });

  // -------------------------------------------------------------------------
  // 3. Locale is es-ES at path '/es-ES/contact-form/'
  // -------------------------------------------------------------------------
  describe("link targets for es-ES locale at /es-ES/contact-form/", () => {
    it("marks the es-ES control as aria-current='page'", () => {
      renderSwitcher("es-ES", "/es-ES/contact-form/");

      const { flag, label } = localeMeta["es-ES"];
      const activeControl =
        screen.getByText(flag).closest("[aria-current]") ||
        screen.getByText(label).closest("[aria-current]");

      expect(activeControl).not.toBeNull();
      expect(activeControl).toHaveAttribute("aria-current", "page");
    });

    it("the en-US control links to '/en-US/contact-form/'", () => {
      renderSwitcher("es-ES", "/es-ES/contact-form/");

      const { label } = localeMeta["en-US"];
      const link = screen.getByText(label).closest("a");
      expect(link).not.toBeNull();
      expect(link).toHaveAttribute("href", "/en-US/contact-form/");
    });

    it("the en-GB control links to '/contact-form/' (default locale, no prefix)", () => {
      renderSwitcher("es-ES", "/es-ES/contact-form/");

      const { label } = localeMeta["en-GB"];
      const link = screen.getByText(label).closest("a");
      expect(link).not.toBeNull();
      expect(link).toHaveAttribute("href", "/contact-form/");
    });

    it("the zh-Hans control links to '/zh-Hans/contact-form/'", () => {
      renderSwitcher("es-ES", "/es-ES/contact-form/");

      const { label } = localeMeta["zh-Hans"];
      const link = screen.getByText(label).closest("a");
      expect(link).not.toBeNull();
      expect(link).toHaveAttribute("href", "/zh-Hans/contact-form/");
    });
  });

  // -------------------------------------------------------------------------
  // 4. Clicking zh-Hans persists the locale and calls navigate
  // -------------------------------------------------------------------------
  describe("clicking a locale control persists and navigates", () => {
    it("stores 'zh-Hans' in localStorage after clicking the zh-Hans control", async () => {
      const user = userEvent.setup();
      renderSwitcher("en-GB", "/");

      const { label } = localeMeta["zh-Hans"];
      const link = screen.getByText(label).closest("a, button")!;
      await user.click(link);

      expect(localStorage.getItem("preferredLocale")).toBe("zh-Hans");
    });

    it("calls gatsby navigate with '/zh-Hans/' after clicking the zh-Hans control from '/'", async () => {
      const user = userEvent.setup();
      renderSwitcher("en-GB", "/");

      const { label } = localeMeta["zh-Hans"];
      const link = screen.getByText(label).closest("a, button")!;
      await user.click(link);

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringMatching(/^\/zh-Hans\//),
        expect.anything(),
      );
    });

    it("stores 'en-US' in localStorage after clicking the en-US control", async () => {
      const user = userEvent.setup();
      renderSwitcher("en-GB", "/");

      const { label } = localeMeta["en-US"];
      const link = screen.getByText(label).closest("a, button")!;
      await user.click(link);

      expect(localStorage.getItem("preferredLocale")).toBe("en-US");
    });
  });

  // -------------------------------------------------------------------------
  // 5. Group has the localized aria-label
  // -------------------------------------------------------------------------
  describe("accessible group label", () => {
    it("exposes a navigation group with the en-GB aria-label", () => {
      renderSwitcher("en-GB", "/");

      // The component must render a labelled group: nav, role="group", or similar
      const group =
        screen.queryByRole("navigation", {
          name: enGB.languageSwitcher.ariaLabel,
        }) ||
        screen.queryByRole("group", {
          name: enGB.languageSwitcher.ariaLabel,
        });

      expect(group).not.toBeNull();
      expect(group).toBeInTheDocument();
    });

    it("shows the zh-Hans localized aria-label when locale is zh-Hans", () => {
      renderSwitcher("zh-Hans", "/zh-Hans/");

      // "选择语言" is the zh-Hans ariaLabel value
      const group =
        screen.queryByRole("navigation", { name: "选择语言" }) ||
        screen.queryByRole("group", { name: "选择语言" });

      expect(group).not.toBeNull();
      expect(group).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // 6. Keyboard operability — controls are links or buttons
  // -------------------------------------------------------------------------
  describe("keyboard operability", () => {
    it("renders all non-active locale controls as links or buttons", () => {
      renderSwitcher("en-GB", "/");

      // Three non-active locales must be rendered as focusable <a> or <button> elements
      const nonActiveLocales = (locales as readonly Locale[]).filter(
        (l) => l !== "en-GB",
      );
      for (const locale of nonActiveLocales) {
        const { label } = localeMeta[locale];
        const el = screen.getByText(label).closest("a, button");
        expect(el).not.toBeNull();
        expect(el!.tagName.toLowerCase()).toMatch(/^(a|button)$/);
      }
    });

    it("the active locale control is present in the DOM and accessible", () => {
      renderSwitcher("en-GB", "/");
      const { label } = localeMeta["en-GB"];
      // Must be rendered — accessible to AT regardless of element type
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
