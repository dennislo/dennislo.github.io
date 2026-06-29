import type { Page, Actions } from "gatsby";
import { createLocalePages } from "./createLocalePages";

// Minimal page factory — only the fields the function under test needs.
function makePage(
  path: string,
  contextOverrides: Record<string, unknown> = {},
): Page<Record<string, unknown>> {
  return {
    path,
    component: "/src/pages/index.tsx",
    context: contextOverrides,
  };
}

describe("createLocalePages", () => {
  let createPage: jest.MockedFunction<Actions["createPage"]>;
  let deletePage: jest.MockedFunction<Actions["deletePage"]>;
  let actions: Pick<Actions, "createPage" | "deletePage">;

  beforeEach(() => {
    createPage = jest.fn();
    deletePage = jest.fn();
    actions = { createPage, deletePage } as unknown as Pick<
      Actions,
      "createPage" | "deletePage"
    >;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Guard: already-localized pages must not be re-processed.
  // ---------------------------------------------------------------------------
  describe("when page.context.locale is already set", () => {
    it("does not call deletePage", () => {
      const page = makePage("/", { locale: "zh-Hans" });
      createLocalePages({ page, actions: actions as never });
      expect(deletePage).not.toHaveBeenCalled();
    });

    it("does not call createPage", () => {
      const page = makePage("/", { locale: "zh-Hans" });
      createLocalePages({ page, actions: actions as never });
      expect(createPage).not.toHaveBeenCalled();
    });

    it("is a no-op for any locale value already present", () => {
      const page = makePage("/contact-form/", { locale: "en-US" });
      createLocalePages({ page, actions: actions as never });
      expect(deletePage).not.toHaveBeenCalled();
      expect(createPage).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // 404 page: localized fan-out.
  // ---------------------------------------------------------------------------
  describe("when path contains '404'", () => {
    const page404 = makePage("/404/");

    it("calls deletePage once with the original page", () => {
      createLocalePages({ page: page404, actions: actions as never });
      expect(deletePage).toHaveBeenCalledTimes(1);
      expect(deletePage).toHaveBeenCalledWith(page404);
    });

    it("calls createPage exactly 4 times (one per locale, no en-GB alias)", () => {
      createLocalePages({ page: page404, actions: actions as never });
      expect(createPage).toHaveBeenCalledTimes(4);
    });

    it("creates the default 404 page at '/404/' with locale en-GB", () => {
      createLocalePages({ page: page404, actions: actions as never });
      expect(createPage).toHaveBeenCalledWith(
        expect.objectContaining({
          path: "/404/",
          context: expect.objectContaining({ locale: "en-GB" }),
        }),
      );
    });

    it("creates localized 404 pages for non-default locales", () => {
      createLocalePages({ page: page404, actions: actions as never });
      expect(createPage).toHaveBeenCalledWith(
        expect.objectContaining({
          path: "/zh-Hans/404/",
          context: expect.objectContaining({ locale: "zh-Hans" }),
        }),
      );
      expect(createPage).toHaveBeenCalledWith(
        expect.objectContaining({
          path: "/zh-Hant/404/",
          context: expect.objectContaining({ locale: "zh-Hant" }),
        }),
      );
      expect(createPage).toHaveBeenCalledWith(
        expect.objectContaining({
          path: "/en-US/404/",
          context: expect.objectContaining({ locale: "en-US" }),
        }),
      );
    });

    it("does not create the explicit en-GB 404 alias", () => {
      createLocalePages({ page: page404, actions: actions as never });
      expect(createPage).not.toHaveBeenCalledWith(
        expect.objectContaining({ path: "/en-GB/404/" }),
      );
    });

    it("preserves the original component on the created 404 page", () => {
      createLocalePages({ page: page404, actions: actions as never });
      for (const call of createPage.mock.calls) {
        expect(call[0]).toMatchObject({ component: page404.component });
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Normal page: root "/".
  // ---------------------------------------------------------------------------
  describe("when path is '/' (normal page, no existing locale)", () => {
    const rootPage = makePage("/");

    it("calls deletePage once with the original page", () => {
      createLocalePages({ page: rootPage, actions: actions as never });
      expect(deletePage).toHaveBeenCalledTimes(1);
      expect(deletePage).toHaveBeenCalledWith(rootPage);
    });

    it("calls createPage exactly 5 times (one per locale + en-GB alias)", () => {
      createLocalePages({ page: rootPage, actions: actions as never });
      expect(createPage).toHaveBeenCalledTimes(5);
    });

    it("creates the default (en-GB) page at path '/'", () => {
      createLocalePages({ page: rootPage, actions: actions as never });
      expect(createPage).toHaveBeenCalledWith(
        expect.objectContaining({
          path: "/",
          context: expect.objectContaining({ locale: "en-GB" }),
        }),
      );
    });

    it("creates the explicit en-GB alias page at path '/en-GB/'", () => {
      createLocalePages({ page: rootPage, actions: actions as never });
      expect(createPage).toHaveBeenCalledWith(
        expect.objectContaining({
          path: "/en-GB/",
          context: expect.objectContaining({ locale: "en-GB" }),
        }),
      );
    });

    it("creates the en-US page at path '/en-US/'", () => {
      createLocalePages({ page: rootPage, actions: actions as never });
      expect(createPage).toHaveBeenCalledWith(
        expect.objectContaining({
          path: "/en-US/",
          context: expect.objectContaining({ locale: "en-US" }),
        }),
      );
    });

    it("creates the zh-Hans page at path '/zh-Hans/'", () => {
      createLocalePages({ page: rootPage, actions: actions as never });
      expect(createPage).toHaveBeenCalledWith(
        expect.objectContaining({
          path: "/zh-Hans/",
          context: expect.objectContaining({ locale: "zh-Hans" }),
        }),
      );
    });

    it("creates the zh-Hant page at path '/zh-Hant/'", () => {
      createLocalePages({ page: rootPage, actions: actions as never });
      expect(createPage).toHaveBeenCalledWith(
        expect.objectContaining({
          path: "/zh-Hant/",
          context: expect.objectContaining({ locale: "zh-Hant" }),
        }),
      );
    });

    it("preserves the original component on every created page", () => {
      createLocalePages({ page: rootPage, actions: actions as never });
      for (const call of createPage.mock.calls) {
        expect(call[0]).toMatchObject({ component: rootPage.component });
      }
    });

    it("merges locale into existing context (does not discard extra context keys)", () => {
      const pageWithExtra = makePage("/", { someFlag: true });
      createLocalePages({ page: pageWithExtra, actions: actions as never });
      for (const call of createPage.mock.calls) {
        expect(call[0]).toMatchObject({
          context: expect.objectContaining({ someFlag: true }),
        });
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Normal page: "/contact-form/".
  // ---------------------------------------------------------------------------
  describe("when path is '/contact-form/'", () => {
    const contactPage = makePage("/contact-form/");

    it("calls deletePage once with the original page", () => {
      createLocalePages({ page: contactPage, actions: actions as never });
      expect(deletePage).toHaveBeenCalledTimes(1);
      expect(deletePage).toHaveBeenCalledWith(contactPage);
    });

    it("calls createPage exactly 5 times", () => {
      createLocalePages({ page: contactPage, actions: actions as never });
      expect(createPage).toHaveBeenCalledTimes(5);
    });

    it("creates the default (en-GB) page at '/contact-form/'", () => {
      createLocalePages({ page: contactPage, actions: actions as never });
      expect(createPage).toHaveBeenCalledWith(
        expect.objectContaining({
          path: "/contact-form/",
          context: expect.objectContaining({ locale: "en-GB" }),
        }),
      );
    });

    it("creates the en-GB alias page at '/en-GB/contact-form/'", () => {
      createLocalePages({ page: contactPage, actions: actions as never });
      expect(createPage).toHaveBeenCalledWith(
        expect.objectContaining({
          path: "/en-GB/contact-form/",
          context: expect.objectContaining({ locale: "en-GB" }),
        }),
      );
    });

    it("creates the en-US page at '/en-US/contact-form/'", () => {
      createLocalePages({ page: contactPage, actions: actions as never });
      expect(createPage).toHaveBeenCalledWith(
        expect.objectContaining({
          path: "/en-US/contact-form/",
          context: expect.objectContaining({ locale: "en-US" }),
        }),
      );
    });

    it("creates the zh-Hans page at '/zh-Hans/contact-form/'", () => {
      createLocalePages({ page: contactPage, actions: actions as never });
      expect(createPage).toHaveBeenCalledWith(
        expect.objectContaining({
          path: "/zh-Hans/contact-form/",
          context: expect.objectContaining({ locale: "zh-Hans" }),
        }),
      );
    });

    it("creates the zh-Hant page at '/zh-Hant/contact-form/'", () => {
      createLocalePages({ page: contactPage, actions: actions as never });
      expect(createPage).toHaveBeenCalledWith(
        expect.objectContaining({
          path: "/zh-Hant/contact-form/",
          context: expect.objectContaining({ locale: "zh-Hant" }),
        }),
      );
    });
  });
});
