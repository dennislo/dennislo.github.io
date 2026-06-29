import React from "react";
import { screen } from "@testing-library/react";
import Experience from "./Experience";
import { siteConfig } from "../../config";
import { enGB } from "../../i18n/translations/en-GB";
import { zhHans } from "../../i18n/translations/zh-Hans";
import { renderWithLocale } from "../../test/renderWithLocale";

type MutableExperienceConfig = { experience: typeof siteConfig.experience };

jest.mock("../../config", () => ({
  siteConfig: {
    ...jest.requireActual("../../config").siteConfig,
  },
}));

describe("Experience (en-GB, default locale)", () => {
  it("renders the localized heading from enGB dict", () => {
    renderWithLocale(<Experience />);
    expect(
      screen.getByRole("heading", { name: enGB.experience.heading }),
    ).toBeInTheDocument();
  });

  it("renders the localized contractor role title from enGB dict", () => {
    renderWithLocale(<Experience />);
    const titles = screen.getAllByText(enGB.experience.roleContractor);
    expect(titles.length).toBeGreaterThan(0);
  });

  it("renders the localized senior role title from enGB dict", () => {
    renderWithLocale(<Experience />);
    expect(screen.getByText(enGB.experience.roleSenior)).toBeInTheDocument();
  });

  it("renders the localized Crosstide bullet 1 from enGB dict", () => {
    renderWithLocale(<Experience />);
    expect(
      screen.getByText(enGB.experience.crosstideBullet1),
    ).toBeInTheDocument();
  });

  it("renders the localized Crosstide bullet 2 from enGB dict", () => {
    renderWithLocale(<Experience />);
    expect(
      screen.getByText(enGB.experience.crosstideBullet2),
    ).toBeInTheDocument();
  });

  it("renders the localized Crosstide bullet 3 from enGB dict", () => {
    renderWithLocale(<Experience />);
    expect(
      screen.getByText(enGB.experience.crosstideBullet3),
    ).toBeInTheDocument();
  });

  it("renders invariant company names from siteConfig", () => {
    renderWithLocale(<Experience />);
    for (const exp of siteConfig.experience) {
      expect(screen.getByText(exp.company)).toBeInTheDocument();
    }
  });

  it("renders invariant date ranges from siteConfig", () => {
    renderWithLocale(<Experience />);
    for (const exp of siteConfig.experience) {
      expect(screen.getByText(exp.dateRange)).toBeInTheDocument();
    }
  });

  it("returns null when experience array is empty", () => {
    const originalExperience = siteConfig.experience;
    (siteConfig as MutableExperienceConfig).experience = [];

    const { container } = renderWithLocale(<Experience />);
    expect(container.firstChild).toBeNull();

    (siteConfig as MutableExperienceConfig).experience = originalExperience;
  });
});

describe("Experience (zh-Hans locale)", () => {
  it("renders the localized heading in Chinese", () => {
    renderWithLocale(<Experience />, "zh-Hans");
    expect(
      screen.getByRole("heading", { name: zhHans.experience.heading }),
    ).toBeInTheDocument();
  });

  it("does NOT render the English heading when locale is zh-Hans", () => {
    renderWithLocale(<Experience />, "zh-Hans");
    expect(
      screen.queryByRole("heading", { name: enGB.experience.heading }),
    ).not.toBeInTheDocument();
  });

  it("renders the localized Crosstide bullet 1 in Chinese", () => {
    renderWithLocale(<Experience />, "zh-Hans");
    expect(
      screen.getByText(zhHans.experience.crosstideBullet1),
    ).toBeInTheDocument();
  });

  it("renders invariant company names in zh-Hans locale", () => {
    renderWithLocale(<Experience />, "zh-Hans");
    for (const exp of siteConfig.experience) {
      expect(screen.getByText(exp.company)).toBeInTheDocument();
    }
  });
});
