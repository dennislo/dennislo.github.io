import React from "react";
import { render, screen } from "@testing-library/react";
import { wrapPageElement } from "./wrapPageElement";
import { useLocale } from "../i18n";

// A probe component that reads locale from the real useLocale hook and renders
// it into the DOM so assertions can inspect it without touching internal state.
const LocaleProbe = () => {
  const { locale } = useLocale();
  return <span role="status">{locale}</span>;
};

describe("wrapPageElement", () => {
  // ---------------------------------------------------------------------------
  // Valid locale in pageContext.
  // ---------------------------------------------------------------------------
  describe("when props.pageContext.locale is a valid locale", () => {
    it("wraps element in LocaleProvider and exposes the locale to children via useLocale (zh-Hant)", () => {
      // Arrange
      const element = <LocaleProbe />;
      const props = { pageContext: { locale: "zh-Hant" } };

      // Act
      const wrapped = wrapPageElement({
        element,
        props: props as never,
      });
      render(wrapped);

      // Assert
      expect(screen.getByRole("status")).toHaveTextContent("zh-Hant");
    });

    it("exposes en-US to children when pageContext.locale is 'en-US'", () => {
      const element = <LocaleProbe />;
      const props = { pageContext: { locale: "en-US" } };

      const wrapped = wrapPageElement({ element, props: props as never });
      render(wrapped);

      expect(screen.getByRole("status")).toHaveTextContent("en-US");
    });

    it("exposes zh-Hans to children when pageContext.locale is 'zh-Hans'", () => {
      const element = <LocaleProbe />;
      const props = { pageContext: { locale: "zh-Hans" } };

      const wrapped = wrapPageElement({ element, props: props as never });
      render(wrapped);

      expect(screen.getByRole("status")).toHaveTextContent("zh-Hans");
    });

    it("exposes en-GB to children when pageContext.locale is 'en-GB'", () => {
      const element = <LocaleProbe />;
      const props = { pageContext: { locale: "en-GB" } };

      const wrapped = wrapPageElement({ element, props: props as never });
      render(wrapped);

      expect(screen.getByRole("status")).toHaveTextContent("en-GB");
    });
  });

  // ---------------------------------------------------------------------------
  // Fallback to defaultLocale ("en-GB").
  // ---------------------------------------------------------------------------
  describe("when pageContext.locale is missing or invalid", () => {
    it("falls back to 'en-GB' when pageContext is undefined", () => {
      const element = <LocaleProbe />;
      const props = {};

      const wrapped = wrapPageElement({ element, props: props as never });
      render(wrapped);

      expect(screen.getByRole("status")).toHaveTextContent("en-GB");
    });

    it("falls back to 'en-GB' when pageContext exists but locale is absent", () => {
      const element = <LocaleProbe />;
      const props = { pageContext: {} };

      const wrapped = wrapPageElement({ element, props: props as never });
      render(wrapped);

      expect(screen.getByRole("status")).toHaveTextContent("en-GB");
    });

    it("falls back to 'en-GB' when pageContext.locale is an unsupported code ('fr')", () => {
      const element = <LocaleProbe />;
      const props = { pageContext: { locale: "fr" } };

      const wrapped = wrapPageElement({ element, props: props as never });
      render(wrapped);

      expect(screen.getByRole("status")).toHaveTextContent("en-GB");
    });

    it("falls back to 'en-GB' when pageContext.locale is an empty string", () => {
      const element = <LocaleProbe />;
      const props = { pageContext: { locale: "" } };

      const wrapped = wrapPageElement({ element, props: props as never });
      render(wrapped);

      expect(screen.getByRole("status")).toHaveTextContent("en-GB");
    });

    it("falls back to 'en-GB' when pageContext.locale has wrong casing ('EN-GB')", () => {
      const element = <LocaleProbe />;
      const props = { pageContext: { locale: "EN-GB" } };

      const wrapped = wrapPageElement({ element, props: props as never });
      render(wrapped);

      expect(screen.getByRole("status")).toHaveTextContent("en-GB");
    });
  });

  // ---------------------------------------------------------------------------
  // Return value is a React element (not null/undefined).
  // ---------------------------------------------------------------------------
  describe("return value", () => {
    it("returns a React element", () => {
      const element = <LocaleProbe />;
      const props = { pageContext: { locale: "en-GB" } };

      const result = wrapPageElement({ element, props: props as never });

      expect(React.isValidElement(result)).toBe(true);
    });
  });
});
