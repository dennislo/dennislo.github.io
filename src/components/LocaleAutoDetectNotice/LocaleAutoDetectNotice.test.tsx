import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocaleProvider } from "../../i18n";
import { localeMeta } from "../../i18n/config";
import { zhHans } from "../../i18n/translations/zh-Hans";
import LocaleAutoDetectNotice from "./LocaleAutoDetectNotice";

// ---------------------------------------------------------------------------
// Gatsby mock: Link as a plain anchor, following LanguageSwitcher.test.tsx's
// pattern.
// ---------------------------------------------------------------------------
jest.mock("gatsby", () => ({
  ...jest.requireActual("gatsby"),
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

const mockUseLocation = jest.fn();

jest.mock("@gatsbyjs/reach-router", () => ({
  ...jest.requireActual("@gatsbyjs/reach-router"),
  useLocation: () => mockUseLocation(),
}));

// ---------------------------------------------------------------------------
// Persistence mock — precise control over detection/dismissal state, and a
// spy on dismissAutoDetectedNotice.
// ---------------------------------------------------------------------------
const mockGetAutoDetectedNotice = jest.fn();
const mockIsAutoDetectedNoticeDismissed = jest.fn();
const mockDismissAutoDetectedNotice = jest.fn();

jest.mock("../../i18n/persistence", () => ({
  ...jest.requireActual("../../i18n/persistence"),
  getAutoDetectedNotice: () => mockGetAutoDetectedNotice(),
  isAutoDetectedNoticeDismissed: () => mockIsAutoDetectedNoticeDismissed(),
  dismissAutoDetectedNotice: () => mockDismissAutoDetectedNotice(),
}));

function renderNotice(
  locale: "en-GB" | "en-US" | "zh-Hans" | "es-ES",
  pathname: string,
) {
  mockUseLocation.mockReturnValue({ pathname, search: "", hash: "" });
  return render(
    <LocaleProvider locale={locale}>
      <LocaleAutoDetectNotice />
    </LocaleProvider>,
  );
}

describe("LocaleAutoDetectNotice", () => {
  beforeEach(() => {
    mockGetAutoDetectedNotice.mockReset();
    mockIsAutoDetectedNoticeDismissed.mockReset();
    mockDismissAutoDetectedNotice.mockReset();
    mockUseLocation.mockReset();
    mockIsAutoDetectedNoticeDismissed.mockReturnValue(false);
  });

  it("renders nothing when there is no auto-detected locale", () => {
    mockGetAutoDetectedNotice.mockReturnValue(null);

    const { container } = renderNotice("en-GB", "/");

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when a locale was detected but the notice has already been dismissed", () => {
    mockGetAutoDetectedNotice.mockReturnValue("zh-Hans");
    mockIsAutoDetectedNoticeDismissed.mockReturnValue(true);

    const { container } = renderNotice("zh-Hans", "/zh-Hans/");

    expect(container).toBeEmptyDOMElement();
  });

  describe("banner content and link target", () => {
    it("renders the interpolated message and a correct 'view in English' link at a nested zh-Hans path", () => {
      mockGetAutoDetectedNotice.mockReturnValue("zh-Hans");

      renderNotice("zh-Hans", "/zh-Hans/contact-form/");

      const expectedMessage = zhHans.localeNotice.message.replace(
        "{language}",
        localeMeta["zh-Hans"].label,
      );
      expect(screen.getByText(expectedMessage)).toBeInTheDocument();

      const link = screen.getByRole("link", {
        name: zhHans.localeNotice.viewInEnglish,
      });
      expect(link).toHaveAttribute("href", "/contact-form/");
    });

    it("targets the bare root '/' when the current path is the zh-Hans root", () => {
      mockGetAutoDetectedNotice.mockReturnValue("zh-Hans");

      renderNotice("zh-Hans", "/zh-Hans/");

      const link = screen.getByRole("link", {
        name: zhHans.localeNotice.viewInEnglish,
      });
      expect(link).toHaveAttribute("href", "/");
    });

    it("renders a dismiss control with the localized accessible name", () => {
      mockGetAutoDetectedNotice.mockReturnValue("zh-Hans");

      renderNotice("zh-Hans", "/zh-Hans/");

      expect(
        screen.getByRole("button", { name: zhHans.localeNotice.dismiss }),
      ).toBeInTheDocument();
    });
  });

  describe("dismiss behaviour", () => {
    it("calls dismissAutoDetectedNotice and hides the banner immediately when the dismiss control is clicked", async () => {
      const user = userEvent.setup();
      mockGetAutoDetectedNotice.mockReturnValue("zh-Hans");

      const { container } = renderNotice("zh-Hans", "/zh-Hans/");

      const dismissButton = screen.getByRole("button", {
        name: zhHans.localeNotice.dismiss,
      });
      await user.click(dismissButton);

      expect(mockDismissAutoDetectedNotice).toHaveBeenCalledTimes(1);
      expect(container).toBeEmptyDOMElement();
    });
  });
});
