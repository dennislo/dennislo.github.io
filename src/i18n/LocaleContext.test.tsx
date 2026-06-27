import React from "react";
import { render, screen } from "@testing-library/react";
import { LocaleProvider } from "./LocaleContext";
import { useLocale } from "./useLocale";
import type { Locale } from "./config";

// A helper component that exposes the useLocale hook values through the DOM
// so we can assert on them without testing implementation details.
const LocaleConsumer = ({
  translationKey,
  vars,
}: {
  translationKey: string;
  vars?: Record<string, string | number>;
}) => {
  const { locale, localizePath, t } = useLocale();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="translation">{t(translationKey, vars)}</span>
      <span data-testid="localized-root">{localizePath("/")}</span>
    </div>
  );
};

function renderWithLocale(
  locale: Locale,
  translationKey: string,
  vars?: Record<string, string | number>,
) {
  return render(
    <LocaleProvider locale={locale}>
      <LocaleConsumer translationKey={translationKey} vars={vars} />
    </LocaleProvider>,
  );
}

describe("LocaleProvider + useLocale", () => {
  describe("locale value", () => {
    it("exposes the provided locale (en-GB)", () => {
      renderWithLocale("en-GB", "nav.menu");
      expect(screen.getByTestId("locale")).toHaveTextContent("en-GB");
    });

    it("exposes the provided locale (zh-Hans)", () => {
      renderWithLocale("zh-Hans", "nav.menu");
      expect(screen.getByTestId("locale")).toHaveTextContent("zh-Hans");
    });
  });

  describe("t() — basic key resolution", () => {
    it("resolves nav.menu to the exact en-GB value 'Menu'", () => {
      renderWithLocale("en-GB", "nav.menu");
      expect(screen.getByTestId("translation")).toHaveTextContent("Menu");
    });

    it("resolves nav.about to the exact en-GB value 'About'", () => {
      renderWithLocale("en-GB", "nav.about");
      expect(screen.getByTestId("translation")).toHaveTextContent("About");
    });

    it("resolves nav.menu to the exact zh-Hans value '菜单'", () => {
      renderWithLocale("zh-Hans", "nav.menu");
      expect(screen.getByTestId("translation")).toHaveTextContent("菜单");
    });
  });

  describe("t() — interpolation", () => {
    it("substitutes {name} in projects.viewProjectAria", () => {
      renderWithLocale("en-GB", "projects.viewProjectAria", { name: "X" });
      expect(screen.getByTestId("translation")).toHaveTextContent("X");
      // The raw template token should not appear in the output.
      expect(screen.getByTestId("translation").textContent).not.toContain(
        "{name}",
      );
    });

    it("substitutes a numeric interpolation variable", () => {
      renderWithLocale("en-GB", "projects.viewProjectAria", { name: 42 });
      expect(screen.getByTestId("translation")).toHaveTextContent("42");
    });
  });

  describe("t() — missing key fallback", () => {
    it("returns the key string when the key does not exist", () => {
      renderWithLocale("en-GB", "does.not.exist");
      expect(screen.getByTestId("translation")).toHaveTextContent(
        "does.not.exist",
      );
    });

    it("does not throw when the key does not exist", () => {
      expect(() => renderWithLocale("en-GB", "does.not.exist")).not.toThrow();
    });

    it("returns the key string even in non-default locales when the key is absent", () => {
      renderWithLocale("zh-Hant", "completely.missing.key");
      expect(screen.getByTestId("translation")).toHaveTextContent(
        "completely.missing.key",
      );
    });

    it("warns in development when a key is missing from a non-default locale", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
      renderWithLocale("zh-Hans", "completely.missing.key");
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("completely.missing.key"),
      );
      warnSpy.mockRestore();
    });
  });

  describe("localizePath() — bound to current locale", () => {
    it("returns '/' for the root path when locale is en-GB", () => {
      renderWithLocale("en-GB", "nav.menu");
      expect(screen.getByTestId("localized-root")).toHaveTextContent("/");
    });

    it("returns '/zh-Hans/' for the root path when locale is zh-Hans", () => {
      renderWithLocale("zh-Hans", "nav.menu");
      expect(screen.getByTestId("localized-root")).toHaveTextContent(
        "/zh-Hans/",
      );
    });

    it("returns '/zh-Hant/' for the root path when locale is zh-Hant", () => {
      renderWithLocale("zh-Hant", "nav.menu");
      expect(screen.getByTestId("localized-root")).toHaveTextContent(
        "/zh-Hant/",
      );
    });

    it("returns '/en-US/' or '/' for the root path when locale is en-US", () => {
      // en-US is not the default locale so it should receive a prefix.
      renderWithLocale("en-US", "nav.menu");
      expect(screen.getByTestId("localized-root")).toHaveTextContent("/en-US/");
    });
  });

  describe("useLocale — error when used outside provider", () => {
    it("throws when useLocale is called outside LocaleProvider", () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      expect(() =>
        render(<LocaleConsumer translationKey="nav.menu" />),
      ).toThrow();
      consoleErrorSpy.mockRestore();
    });
  });
});
