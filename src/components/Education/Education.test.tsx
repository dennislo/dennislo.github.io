import React from "react";
import { screen } from "@testing-library/react";
import Education from "./Education";
import { siteConfig } from "../../config";
import { enGB } from "../../i18n/translations/en-GB";
import { zhHans } from "../../i18n/translations/zh-Hans";
import { renderWithLocale } from "../../test/renderWithLocale";

jest.mock("../../config", () => ({
  siteConfig: {
    ...jest.requireActual("../../config").siteConfig,
  },
}));

describe("Education (en-GB, default locale)", () => {
  it("renders the localized heading from enGB dict", () => {
    renderWithLocale(<Education />);
    expect(
      screen.getByRole("heading", { name: enGB.education.heading }),
    ).toBeInTheDocument();
  });

  it("renders the localized degree from enGB dict", () => {
    renderWithLocale(<Education />);
    expect(screen.getByText(enGB.education.degree)).toBeInTheDocument();
  });

  it("renders the localized achievement 1 from enGB dict", () => {
    renderWithLocale(<Education />);
    expect(screen.getByText(enGB.education.achievement1)).toBeInTheDocument();
  });

  it("renders the localized achievement 2 from enGB dict", () => {
    renderWithLocale(<Education />);
    expect(screen.getByText(enGB.education.achievement2)).toBeInTheDocument();
  });

  it("renders the invariant school from siteConfig", () => {
    renderWithLocale(<Education />);
    for (const edu of siteConfig.education) {
      expect(screen.getByText(edu.school)).toBeInTheDocument();
    }
  });

  it("renders the invariant date range from siteConfig", () => {
    renderWithLocale(<Education />);
    for (const edu of siteConfig.education) {
      expect(screen.getByText(edu.dateRange)).toBeInTheDocument();
    }
  });
});

describe("Education (zh-Hans locale)", () => {
  it("renders the localized heading in Chinese", () => {
    renderWithLocale(<Education />, "zh-Hans");
    expect(
      screen.getByRole("heading", { name: zhHans.education.heading }),
    ).toBeInTheDocument();
  });

  it("does NOT render the English heading when locale is zh-Hans", () => {
    renderWithLocale(<Education />, "zh-Hans");
    expect(
      screen.queryByRole("heading", { name: enGB.education.heading }),
    ).not.toBeInTheDocument();
  });

  it("renders the localized degree in Chinese", () => {
    renderWithLocale(<Education />, "zh-Hans");
    expect(screen.getByText(zhHans.education.degree)).toBeInTheDocument();
  });

  it("renders the localized achievement 1 in Chinese", () => {
    renderWithLocale(<Education />, "zh-Hans");
    expect(screen.getByText(zhHans.education.achievement1)).toBeInTheDocument();
  });

  it("renders the invariant school in zh-Hans locale", () => {
    renderWithLocale(<Education />, "zh-Hans");
    for (const edu of siteConfig.education) {
      expect(screen.getByText(edu.school)).toBeInTheDocument();
    }
  });
});
