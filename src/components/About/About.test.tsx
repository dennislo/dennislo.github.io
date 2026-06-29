import React from "react";
import { screen } from "@testing-library/react";
import About from "./About";
import { siteConfig } from "../../config";
import { enGB } from "../../i18n/translations/en-GB";
import { zhHans } from "../../i18n/translations/zh-Hans";
import { renderWithLocale } from "../../test/renderWithLocale";

// Mock gatsby's Link as a plain anchor
jest.mock("gatsby", () => ({
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

describe("About (en-GB, default locale)", () => {
  it("renders the localized heading from enGB dict", () => {
    renderWithLocale(<About />);
    expect(
      screen.getByRole("heading", { name: enGB.about.heading }),
    ).toBeInTheDocument();
  });

  it("renders the localized aboutMe body text from enGB dict", () => {
    renderWithLocale(<About />);
    expect(screen.getByText(enGB.about.aboutMe)).toBeInTheDocument();
  });

  it("renders the localized Agile IT heading from enGB dict", () => {
    renderWithLocale(<About />);
    expect(screen.getByText(enGB.about.agileITHeading)).toBeInTheDocument();
  });

  it("renders the localized agileIT body text from enGB dict", () => {
    renderWithLocale(<About />);
    expect(
      screen.getByText(new RegExp(enGB.about.agileIT.slice(0, 40))),
    ).toBeInTheDocument();
  });

  it("renders the localized skills heading from enGB dict", () => {
    renderWithLocale(<About />);
    expect(screen.getByText(enGB.about.skillsHeading)).toBeInTheDocument();
  });

  it("renders the localized clients heading from enGB dict", () => {
    renderWithLocale(<About />);
    expect(screen.getByText(enGB.about.clientsHeading)).toBeInTheDocument();
  });

  it("renders the localized fun facts heading from enGB dict", () => {
    renderWithLocale(<About />);
    expect(screen.getByText(enGB.about.funFactsHeading)).toBeInTheDocument();
  });

  it("renders each skill from siteConfig.skills (locale-invariant)", () => {
    renderWithLocale(<About />);
    for (const skill of siteConfig.skills) {
      expect(screen.getByText(skill)).toBeInTheDocument();
    }
  });

  it("renders localized client labels from enGB dict", () => {
    renderWithLocale(<About />);
    expect(
      screen.getByText(enGB.about.clients.advertisingMedia),
    ).toBeInTheDocument();
    expect(
      screen.getByText(enGB.about.clients.hrRecruitment),
    ).toBeInTheDocument();
    expect(
      screen.getByText(enGB.about.clients.retailConsumer),
    ).toBeInTheDocument();
    expect(
      screen.getByText(enGB.about.clients.scienceEducation),
    ).toBeInTheDocument();
    expect(
      screen.getByText(enGB.about.clients.financeBanking),
    ).toBeInTheDocument();
    expect(
      screen.getByText(enGB.about.clients.itTelecommunications),
    ).toBeInTheDocument();
  });

  it("renders localized fun fact texts from enGB dict", () => {
    renderWithLocale(<About />);
    expect(screen.getByText(enGB.about.funFacts.fact1)).toBeInTheDocument();
    expect(screen.getByText(enGB.about.funFacts.fact2)).toBeInTheDocument();
    expect(screen.getByText(enGB.about.funFacts.fact3)).toBeInTheDocument();
  });

  it("renders the localized contact link text from enGB dict pointing to /contact-form", () => {
    renderWithLocale(<About />);
    const contactLink = screen.getByRole("link", {
      name: enGB.about.agileITContactLink,
    });
    expect(contactLink).toHaveAttribute("href", "/contact-form");
  });
});

describe("About (zh-Hans locale)", () => {
  it("renders the localized heading in Chinese", () => {
    renderWithLocale(<About />, "zh-Hans");
    expect(
      screen.getByRole("heading", { name: zhHans.about.heading }),
    ).toBeInTheDocument();
  });

  it("does NOT render the English heading when locale is zh-Hans", () => {
    renderWithLocale(<About />, "zh-Hans");
    expect(
      screen.queryByRole("heading", { name: enGB.about.heading }),
    ).not.toBeInTheDocument();
  });

  it("renders the localized skills heading in Chinese", () => {
    renderWithLocale(<About />, "zh-Hans");
    expect(screen.getByText(zhHans.about.skillsHeading)).toBeInTheDocument();
  });

  it("renders the localized client label in Chinese", () => {
    renderWithLocale(<About />, "zh-Hans");
    expect(
      screen.getByText(zhHans.about.clients.advertisingMedia),
    ).toBeInTheDocument();
  });

  it("renders the localized fun fact text in Chinese", () => {
    renderWithLocale(<About />, "zh-Hans");
    expect(screen.getByText(zhHans.about.funFacts.fact1)).toBeInTheDocument();
  });

  it("skills remain locale-invariant (English) in zh-Hans", () => {
    renderWithLocale(<About />, "zh-Hans");
    for (const skill of siteConfig.skills) {
      expect(screen.getByText(skill)).toBeInTheDocument();
    }
  });
});
