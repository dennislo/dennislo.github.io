import React from "react";
import { screen } from "@testing-library/react";
import SiteFooter from "./SiteFooter";
import { routes, siteConfig } from "../../config";
import { enGB } from "../../i18n/translations/en-GB";
import { zhHans } from "../../i18n/translations/zh-Hans";
import { renderWithLocale } from "../../test/renderWithLocale";

// Mock gatsby's Link so it renders as a plain anchor in jsdom
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

describe("SiteFooter (en-GB, default locale)", () => {
  it("renders the site name from siteConfig (locale-invariant)", () => {
    renderWithLocale(<SiteFooter />);
    const matches = screen.getAllByText(siteConfig.name, { exact: true });
    expect(matches.length).toBeGreaterThan(0);
  });

  it("renders the title from siteConfig (locale-invariant)", () => {
    renderWithLocale(<SiteFooter />);
    expect(screen.getByText(siteConfig.title)).toBeInTheDocument();
  });

  it("renders the email social link with localized aria-label from enGB dict", () => {
    renderWithLocale(<SiteFooter />);
    const link = screen.getByRole("link", { name: enGB.footer.emailAria });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", routes.contactForm);
  });

  it("renders the GitHub social link with localized aria-label from enGB dict", () => {
    renderWithLocale(<SiteFooter />);
    const link = screen.getByRole("link", { name: enGB.footer.githubAria });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", siteConfig.social.github);
  });

  it("renders the LinkedIn social link with localized aria-label from enGB dict", () => {
    renderWithLocale(<SiteFooter />);
    const link = screen.getByRole("link", { name: enGB.footer.linkedinAria });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", siteConfig.social.linkedin);
  });

  it("renders the Instagram social link with localized aria-label from enGB dict", () => {
    renderWithLocale(<SiteFooter />);
    const link = screen.getByRole("link", { name: enGB.footer.instagramAria });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", siteConfig.social.instagram);
  });

  it("renders the localized About nav link label from enGB dict", () => {
    renderWithLocale(<SiteFooter />);
    expect(
      screen.getByRole("link", { name: enGB.nav.about }),
    ).toBeInTheDocument();
  });

  it("renders the localized Projects nav link label from enGB dict", () => {
    renderWithLocale(<SiteFooter />);
    expect(
      screen.getByRole("link", { name: enGB.nav.projects }),
    ).toBeInTheDocument();
  });

  it("renders the localized Experience nav link label from enGB dict", () => {
    renderWithLocale(<SiteFooter />);
    expect(
      screen.getByRole("link", { name: enGB.nav.experience }),
    ).toBeInTheDocument();
  });

  it("renders the localized Education nav link label from enGB dict", () => {
    renderWithLocale(<SiteFooter />);
    expect(
      screen.getByRole("link", { name: enGB.nav.education }),
    ).toBeInTheDocument();
  });

  it("renders the localized Contact nav link from enGB.footer.contact pointing to /contact-form", () => {
    renderWithLocale(<SiteFooter />);
    expect(
      screen.getByRole("link", { name: enGB.footer.contact }),
    ).toHaveAttribute("href", routes.contactForm);
  });

  it("renders the footer nav Meet link immediately after Contact, opening the Cal.eu link in a new tab", () => {
    renderWithLocale(<SiteFooter />);

    const contactLink = screen.getByRole("link", { name: enGB.footer.contact });
    const meetLink = screen.getByRole("link", { name: "Meet" });

    expect(contactLink.closest("li")?.nextElementSibling).toBe(
      meetLink.closest("li"),
    );
    expect(meetLink).toHaveAttribute("href", siteConfig.social.meet);
    expect(meetLink).toHaveAttribute("target", "_blank");
    expect(meetLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the footer social Meet icon with localized aria-label immediately after the contact icon", () => {
    renderWithLocale(<SiteFooter />);

    const contactIconLink = screen.getByRole("link", {
      name: enGB.footer.emailAria,
    });
    const meetIconLink = screen.getByRole("link", {
      name: "Meet with Dennis Lo",
    });

    expect(contactIconLink.nextElementSibling).toBe(meetIconLink);
    expect(meetIconLink).toHaveAttribute("href", siteConfig.social.meet);
    expect(meetIconLink).toHaveAttribute("target", "_blank");
    expect(meetIconLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the localized 'Built with' text from enGB dict", () => {
    renderWithLocale(<SiteFooter />);
    expect(
      screen.getByText(new RegExp(enGB.footer.builtWith)),
    ).toBeInTheDocument();
  });

  it("renders the localized 'using' text from enGB dict", () => {
    renderWithLocale(<SiteFooter />);
    expect(screen.getByText(new RegExp(enGB.footer.using))).toBeInTheDocument();
  });

  it("renders copyright text with the current year", () => {
    renderWithLocale(<SiteFooter />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${currentYear}`)),
    ).toBeInTheDocument();
  });

  it("renders the company name from siteConfig.companyDetails (locale-invariant)", () => {
    renderWithLocale(<SiteFooter />);
    expect(
      screen.getByText(siteConfig.companyDetails.name),
    ).toBeInTheDocument();
  });

  it("renders the company address from siteConfig.companyDetails (locale-invariant)", () => {
    renderWithLocale(<SiteFooter />);
    expect(
      screen.getByText(siteConfig.companyDetails.address),
    ).toBeInTheDocument();
  });

  it("renders the company number alongside its localized enGB label", () => {
    renderWithLocale(<SiteFooter />);
    expect(
      screen.getByText(
        new RegExp(
          `${enGB.footer.companyNumberLabel}.*${siteConfig.companyDetails.companyNumber}`,
        ),
      ),
    ).toBeInTheDocument();
  });

  it("renders the VAT number alongside its localized enGB label", () => {
    renderWithLocale(<SiteFooter />);
    expect(
      screen.getByText(
        new RegExp(`VAT Number.*${siteConfig.companyDetails.vatNumber}`),
      ),
    ).toBeInTheDocument();
  });

  it("keeps the English display name unchanged in the default locale", () => {
    renderWithLocale(<SiteFooter />);
    const matches = screen.getAllByText("Dennis Lo", { exact: true });
    expect(matches.length).toBeGreaterThan(0);
  });
});

describe("SiteFooter (zh-Hans locale)", () => {
  it("renders localized About nav label in Chinese", () => {
    renderWithLocale(<SiteFooter />, "zh-Hans");
    expect(
      screen.getByRole("link", { name: zhHans.nav.about }),
    ).toBeInTheDocument();
  });

  it("renders localized Projects nav label in Chinese", () => {
    renderWithLocale(<SiteFooter />, "zh-Hans");
    expect(
      screen.getByRole("link", { name: zhHans.nav.projects }),
    ).toBeInTheDocument();
  });

  it("renders localized Experience nav label in Chinese", () => {
    renderWithLocale(<SiteFooter />, "zh-Hans");
    expect(
      screen.getByRole("link", { name: zhHans.nav.experience }),
    ).toBeInTheDocument();
  });

  it("renders localized Education nav label in Chinese", () => {
    renderWithLocale(<SiteFooter />, "zh-Hans");
    expect(
      screen.getByRole("link", { name: zhHans.nav.education }),
    ).toBeInTheDocument();
  });

  it("does NOT render English nav labels when locale is zh-Hans", () => {
    renderWithLocale(<SiteFooter />, "zh-Hans");
    // "About" in English should not appear as a nav link
    expect(
      screen.queryByRole("link", { name: enGB.nav.about }),
    ).not.toBeInTheDocument();
  });

  it("renders localized Contact label in Chinese", () => {
    renderWithLocale(<SiteFooter />, "zh-Hans");
    expect(
      screen.getByRole("link", { name: zhHans.footer.contact }),
    ).toBeInTheDocument();
  });

  it("renders the localized display name in zh-Hans locale", () => {
    renderWithLocale(<SiteFooter />, "zh-Hans");
    const matches = screen.getAllByText("盧偉康 (Dennis Lo)", { exact: true });
    expect(matches.length).toBeGreaterThan(0);
  });

  it("does NOT render the English-only display name in zh-Hans locale", () => {
    renderWithLocale(<SiteFooter />, "zh-Hans");
    expect(
      screen.queryByText("Dennis Lo", { exact: true }),
    ).not.toBeInTheDocument();
  });

  it("renders the invariant company address in zh-Hans locale", () => {
    renderWithLocale(<SiteFooter />, "zh-Hans");
    expect(
      screen.getByText(siteConfig.companyDetails.address),
    ).toBeInTheDocument();
  });

  it("renders the invariant company number with its localized zh-Hans label", () => {
    renderWithLocale(<SiteFooter />, "zh-Hans");
    expect(
      screen.getByText(
        new RegExp(
          `${zhHans.footer.companyNumberLabel}.*${siteConfig.companyDetails.companyNumber}`,
        ),
      ),
    ).toBeInTheDocument();
  });

  it("renders the invariant VAT number with its localized zh-Hans label", () => {
    renderWithLocale(<SiteFooter />, "zh-Hans");
    expect(
      screen.getByText(
        new RegExp(
          `${zhHans.footer.vatNumberLabel}.*${siteConfig.companyDetails.vatNumber}`,
        ),
      ),
    ).toBeInTheDocument();
  });
});
