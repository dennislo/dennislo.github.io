import React from "react";
import { screen } from "@testing-library/react";
import SiteFooter from "./SiteFooter";
import { routes, siteConfig } from "../../config";
import { enGB } from "../../i18n/translations/en-GB";
import { zhHans } from "../../i18n/translations/zh-Hans";
import { renderWithLocale } from "../../test/renderWithLocale";

// Mock gatsby's Link so it renders as a plain anchor in jsdom, tagged with a
// data attribute so tests can distinguish it from a raw, uninstrumented <a>.
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
    <a
      href={to}
      data-gatsby-link="true"
      {...(rest as React.ComponentProps<"a">)}
    >
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

  it("renders the localized Meet nav link from enGB.footer.meet pointing to /meet", () => {
    renderWithLocale(<SiteFooter />);
    expect(
      screen.getByRole("link", { name: enGB.footer.meet }),
    ).toHaveAttribute("href", routes.meet);
  });

  it("renders the Meet nav link using Gatsby's Link, not a plain anchor", () => {
    renderWithLocale(<SiteFooter />);
    expect(
      screen.getByRole("link", { name: enGB.footer.meet }),
    ).toHaveAttribute("data-gatsby-link", "true");
  });

  it("renders Meet immediately after Contact in the footer nav", () => {
    renderWithLocale(<SiteFooter />);

    const navLinks = screen
      .getAllByRole("link")
      .filter((link) => link.textContent !== "");
    const labels = navLinks.map((link) => link.textContent?.trim());
    const contactIndex = labels.indexOf(enGB.footer.contact);
    const meetIndex = labels.indexOf(enGB.footer.meet);

    expect(meetIndex).toBe(contactIndex + 1);
  });

  it("renders the Meet social icon immediately after the Contact form icon", () => {
    renderWithLocale(<SiteFooter />);

    const links = screen.getAllByRole("link");
    const names = links.map((link) => link.getAttribute("aria-label"));
    const contactIndex = names.indexOf(enGB.footer.emailAria);
    const meetIndex = names.indexOf(enGB.footer.meetAria);

    expect(meetIndex).toBe(contactIndex + 1);
    expect(links[meetIndex]).toHaveAttribute("href", routes.meet);
  });

  it("renders the Meet social icon link using Gatsby's Link, not a plain anchor", () => {
    renderWithLocale(<SiteFooter />);

    const link = screen.getByRole("link", { name: enGB.footer.meetAria });
    expect(link).toHaveAttribute("data-gatsby-link", "true");
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

  it("renders localized Meet label in Chinese", () => {
    renderWithLocale(<SiteFooter />, "zh-Hans");
    expect(
      screen.getByRole("link", { name: zhHans.footer.meet }),
    ).toHaveAttribute("href", "/zh-Hans/meet");
  });
});
