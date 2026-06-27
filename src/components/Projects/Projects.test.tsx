import React from "react";
import { screen } from "@testing-library/react";
import Projects from "./Projects";
import { siteConfig } from "../../config";
import { enGB } from "../../i18n/translations/en-GB";
import { zhHans } from "../../i18n/translations/zh-Hans";
import { renderWithLocale } from "../../test/renderWithLocale";

type MutableProjectsConfig = { projects: typeof siteConfig.projects };

// Mock the module so we can override siteConfig.projects in some tests
jest.mock("../../config", () => ({
  siteConfig: {
    ...jest.requireActual("../../config").siteConfig,
  },
}));

describe("Projects (en-GB, default locale)", () => {
  it("renders the localized heading from enGB dict", () => {
    renderWithLocale(<Projects />);
    expect(
      screen.getByRole("heading", { name: enGB.projects.heading }),
    ).toBeInTheDocument();
  });

  it("renders the localized AI Dev Roundup project name", () => {
    renderWithLocale(<Projects />);
    expect(
      screen.getByText(enGB.projects.aiDevRoundupName),
    ).toBeInTheDocument();
  });

  it("renders the localized AI Dev Roundup project description", () => {
    renderWithLocale(<Projects />);
    expect(
      screen.getByText(enGB.projects.aiDevRoundupDescription),
    ).toBeInTheDocument();
  });

  it("renders the localized Chrome Extension Mastery project name", () => {
    renderWithLocale(<Projects />);
    expect(
      screen.getByText(enGB.projects.chromeExtensionMasteryName),
    ).toBeInTheDocument();
  });

  it("renders the localized Chrome Extension Mastery description", () => {
    renderWithLocale(<Projects />);
    expect(
      screen.getByText(enGB.projects.chromeExtensionMasteryDescription),
    ).toBeInTheDocument();
  });

  it("renders the localized ExtensionKit project name", () => {
    renderWithLocale(<Projects />);
    expect(
      screen.getByText(enGB.projects.extensionKitName),
    ).toBeInTheDocument();
  });

  it("renders the localized ExtensionKit description", () => {
    renderWithLocale(<Projects />);
    expect(
      screen.getByText(enGB.projects.extensionKitDescription),
    ).toBeInTheDocument();
  });

  it("renders numbered index for each project (01, 02, etc.)", () => {
    renderWithLocale(<Projects />);
    siteConfig.projects.forEach((_project, index) => {
      const padded = String(index + 1).padStart(2, "0");
      expect(screen.getByText(padded)).toBeInTheDocument();
    });
  });

  it("renders project skill tags (locale-invariant) for each project", () => {
    renderWithLocale(<Projects />);
    for (const project of siteConfig.projects) {
      for (const skill of project.skills) {
        const matches = screen.getAllByText(skill);
        expect(matches.length).toBeGreaterThan(0);
      }
    }
  });

  it("returns null when projects array is empty", () => {
    const originalProjects = siteConfig.projects;
    (siteConfig as MutableProjectsConfig).projects = [];

    const { container } = renderWithLocale(<Projects />);
    expect(container.firstChild).toBeNull();

    (siteConfig as MutableProjectsConfig).projects = originalProjects;
  });
});

describe("Projects (zh-Hans locale)", () => {
  it("renders the localized heading in Chinese", () => {
    renderWithLocale(<Projects />, "zh-Hans");
    expect(
      screen.getByRole("heading", { name: zhHans.projects.heading }),
    ).toBeInTheDocument();
  });

  it("does NOT render the English heading when locale is zh-Hans", () => {
    renderWithLocale(<Projects />, "zh-Hans");
    expect(
      screen.queryByRole("heading", { name: enGB.projects.heading }),
    ).not.toBeInTheDocument();
  });

  it("renders the localized AI Dev Roundup description in Chinese", () => {
    renderWithLocale(<Projects />, "zh-Hans");
    expect(
      screen.getByText(zhHans.projects.aiDevRoundupDescription),
    ).toBeInTheDocument();
  });

  it("renders the localized ExtensionKit description in Chinese", () => {
    renderWithLocale(<Projects />, "zh-Hans");
    expect(
      screen.getByText(zhHans.projects.extensionKitDescription),
    ).toBeInTheDocument();
  });

  it("project skills remain locale-invariant (English) in zh-Hans", () => {
    renderWithLocale(<Projects />, "zh-Hans");
    for (const project of siteConfig.projects) {
      for (const skill of project.skills) {
        const matches = screen.getAllByText(skill);
        expect(matches.length).toBeGreaterThan(0);
      }
    }
  });
});
