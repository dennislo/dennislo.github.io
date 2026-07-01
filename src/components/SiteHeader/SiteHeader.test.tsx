import React from "react";
import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SiteHeader from "./SiteHeader";
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

describe("SiteHeader (en-GB, default locale)", () => {
  const getDesktopNav = () => {
    const navigation = screen.getByRole("navigation", {
      name: enGB.nav.primaryAriaLabel,
    });
    const desktopNavList = within(navigation).getByRole("list");

    expect(desktopNavList).toHaveClass("hidden");
    expect(desktopNavList).toHaveClass("md:flex");

    return desktopNavList;
  };

  beforeEach(() => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 0,
    });
  });

  it("renders the site header text from siteConfig", () => {
    renderWithLocale(<SiteHeader />);
    expect(screen.getByText(siteConfig.header)).toBeInTheDocument();
  });

  it("renders the nav with localized aria-label from enGB dict", () => {
    renderWithLocale(<SiteHeader />);
    expect(
      screen.getByRole("navigation", { name: enGB.nav.primaryAriaLabel }),
    ).toBeInTheDocument();
  });

  it("renders the localized About nav link from enGB dict", () => {
    renderWithLocale(<SiteHeader />);
    const link = within(getDesktopNav()).getByRole("link", {
      name: enGB.nav.about,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#about");
  });

  it("renders the localized Projects nav link from enGB dict", () => {
    renderWithLocale(<SiteHeader />);
    const link = within(getDesktopNav()).getByRole("link", {
      name: enGB.nav.projects,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#projects");
  });

  it("renders the localized Activity nav link from enGB dict", () => {
    renderWithLocale(<SiteHeader />);
    const link = within(getDesktopNav()).getByRole("link", {
      name: enGB.nav.activity,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#github-activity");
  });

  it("renders the localized Experience nav link from enGB dict", () => {
    renderWithLocale(<SiteHeader />);
    const link = within(getDesktopNav()).getByRole("link", {
      name: enGB.nav.experience,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#experience");
  });

  it("renders the localized Education nav link from enGB dict", () => {
    renderWithLocale(<SiteHeader />);
    const link = within(getDesktopNav()).getByRole("link", {
      name: enGB.nav.education,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#education");
  });

  it("renders the localized Gists nav link as external from enGB dict", () => {
    renderWithLocale(<SiteHeader />);
    const link = within(getDesktopNav()).getByRole("link", {
      name: enGB.nav.gists,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "https://gist.github.com/dennislo/public",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the localized menu button text from enGB dict", () => {
    renderWithLocale(<SiteHeader />);
    // The menu button has text "Menu" (visible) and aria-label describes its action
    expect(
      screen.getByRole("button", { name: enGB.nav.openMenu }),
    ).toBeInTheDocument();
  });

  it("renders a Contact nav link pointing to /contact-form in both desktop and mobile", async () => {
    const user = userEvent.setup();

    renderWithLocale(<SiteHeader />);

    await user.click(screen.getByRole("button", { name: enGB.nav.openMenu }));

    const allContactLinks = screen.getAllByRole("link", {
      name: enGB.nav.contact,
    });
    expect(allContactLinks).toHaveLength(2);
    allContactLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", routes.contactForm);
    });
  });

  it("renders the Contact link in the desktop nav list", () => {
    renderWithLocale(<SiteHeader />);

    const desktopContactLink = within(getDesktopNav()).getByRole("link", {
      name: enGB.nav.contact,
    });
    expect(desktopContactLink).toBeInTheDocument();
    expect(desktopContactLink).toHaveAttribute("href", routes.contactForm);
  });

  it("renders the Meet link immediately after Contact in the desktop nav list", () => {
    renderWithLocale(<SiteHeader />);

    const links = within(getDesktopNav()).getAllByRole("link");
    const labels = links.map((link) => link.textContent?.trim());
    const contactIndex = labels.indexOf(enGB.nav.contact);
    const meetIndex = labels.indexOf(enGB.nav.meet);

    expect(meetIndex).toBe(contactIndex + 1);
    expect(links[meetIndex]).toHaveAttribute("href", routes.meet);
  });

  it("renders the Meet link in the desktop nav using Gatsby's Link, not a plain anchor", () => {
    renderWithLocale(<SiteHeader />);

    const meetLink = within(getDesktopNav()).getByRole("link", {
      name: enGB.nav.meet,
    });

    // The mocked gatsby Link tags its output with data-gatsby-link so tests
    // can assert client-side navigation is used instead of a full page load.
    expect(meetLink).toHaveAttribute("data-gatsby-link", "true");
  });

  it("renders the Contact link in the mobile menu", async () => {
    const user = userEvent.setup();

    renderWithLocale(<SiteHeader />);

    await user.click(screen.getByRole("button", { name: enGB.nav.openMenu }));

    const mobileMenu = screen.getByRole("region", {
      name: enGB.nav.mobileMenuAriaLabel,
    });
    const mobileContactLink = within(mobileMenu).getByRole("link", {
      name: enGB.nav.contact,
    });
    expect(mobileContactLink).toBeInTheDocument();
    expect(mobileContactLink).toHaveAttribute("href", routes.contactForm);
  });

  it("renders the Meet link in the mobile menu immediately after Contact", async () => {
    const user = userEvent.setup();

    renderWithLocale(<SiteHeader />);

    await user.click(screen.getByRole("button", { name: enGB.nav.openMenu }));

    const mobileMenu = screen.getByRole("region", {
      name: enGB.nav.mobileMenuAriaLabel,
    });
    const links = within(mobileMenu).getAllByRole("link");
    const labels = links.map((link) => link.textContent?.trim());
    const contactIndex = labels.indexOf(enGB.nav.contact);
    const meetIndex = labels.indexOf(enGB.nav.meet);

    expect(meetIndex).toBe(contactIndex + 1);
    expect(links[meetIndex]).toHaveAttribute("href", routes.meet);
  });

  it("renders the Meet link in the mobile menu using Gatsby's Link, not a plain anchor", async () => {
    const user = userEvent.setup();

    renderWithLocale(<SiteHeader />);

    await user.click(screen.getByRole("button", { name: enGB.nav.openMenu }));

    const mobileMenu = screen.getByRole("region", {
      name: enGB.nav.mobileMenuAriaLabel,
    });
    const meetLink = within(mobileMenu).getByRole("link", {
      name: enGB.nav.meet,
    });

    expect(meetLink).toHaveAttribute("data-gatsby-link", "true");
  });

  it("renders a nav element", () => {
    renderWithLocale(<SiteHeader />);
    expect(
      screen.getByRole("navigation", { name: enGB.nav.primaryAriaLabel }),
    ).toBeInTheDocument();
  });

  it("opens the mobile menu so nav links are reachable", async () => {
    const user = userEvent.setup();

    renderWithLocale(<SiteHeader />);

    const menuButton = screen.getByRole("button", {
      name: enGB.nav.openMenu,
    });

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("region", { name: enGB.nav.mobileMenuAriaLabel }),
    ).not.toBeInTheDocument();

    await user.click(menuButton);

    const mobileMenu = screen.getByRole("region", {
      name: enGB.nav.mobileMenuAriaLabel,
    });
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(mobileMenu).toBeVisible();
    expect(
      within(mobileMenu).getByRole("link", { name: enGB.nav.about }),
    ).toHaveAttribute("href", "#about");
  });

  it("renders the Gists link in the mobile menu as an external link", async () => {
    const user = userEvent.setup();

    renderWithLocale(<SiteHeader />);

    await user.click(screen.getByRole("button", { name: enGB.nav.openMenu }));

    const mobileMenu = screen.getByRole("region", {
      name: enGB.nav.mobileMenuAriaLabel,
    });
    const link = within(mobileMenu).getByRole("link", { name: enGB.nav.gists });
    expect(link).toHaveAttribute(
      "href",
      "https://gist.github.com/dennislo/public",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("closes the mobile menu after clicking the Gists external link", async () => {
    const user = userEvent.setup();

    renderWithLocale(<SiteHeader />);

    await user.click(screen.getByRole("button", { name: enGB.nav.openMenu }));

    const mobileMenu = screen.getByRole("region", {
      name: enGB.nav.mobileMenuAriaLabel,
    });

    await user.click(
      within(mobileMenu).getByRole("link", { name: enGB.nav.gists }),
    );

    expect(
      screen.getByRole("button", { name: enGB.nav.openMenu }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("region", { name: enGB.nav.mobileMenuAriaLabel }),
    ).not.toBeInTheDocument();
  });

  it("closes the mobile menu after clicking the mobile Contact route link", async () => {
    const user = userEvent.setup();

    renderWithLocale(<SiteHeader />);

    await user.click(screen.getByRole("button", { name: enGB.nav.openMenu }));

    const mobileMenu = screen.getByRole("region", {
      name: enGB.nav.mobileMenuAriaLabel,
    });

    await user.click(
      within(mobileMenu).getByRole("link", { name: enGB.nav.contact }),
    );

    expect(
      screen.getByRole("button", { name: enGB.nav.openMenu }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("region", { name: enGB.nav.mobileMenuAriaLabel }),
    ).not.toBeInTheDocument();
  });

  it("closes the mobile menu when escape is pressed", async () => {
    const user = userEvent.setup();

    renderWithLocale(<SiteHeader />);

    const menuButton = screen.getByRole("button", {
      name: enGB.nav.openMenu,
    });

    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("region", { name: enGB.nav.mobileMenuAriaLabel }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: enGB.nav.openMenu }),
    ).toBeInTheDocument();
  });

  it("resets the mobile menu when returning to desktop width", async () => {
    const user = userEvent.setup();

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 390,
    });

    renderWithLocale(<SiteHeader />);

    const menuButton = screen.getByRole("button", {
      name: enGB.nav.openMenu,
    });

    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1024,
    });

    fireEvent(window, new Event("resize"));

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("region", { name: enGB.nav.mobileMenuAriaLabel }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: enGB.nav.openMenu }),
    ).toBeInTheDocument();
  });

  it("closes the mobile menu after choosing a link", async () => {
    const user = userEvent.setup();

    renderWithLocale(<SiteHeader />);

    await user.click(screen.getByRole("button", { name: enGB.nav.openMenu }));

    const mobileMenu = screen.getByRole("region", {
      name: enGB.nav.mobileMenuAriaLabel,
    });

    await user.click(
      within(mobileMenu).getByRole("link", { name: enGB.nav.about }),
    );

    expect(
      screen.getByRole("button", { name: enGB.nav.openMenu }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("region", { name: enGB.nav.mobileMenuAriaLabel }),
    ).not.toBeInTheDocument();
  });

  it("updates the header style after scrolling", () => {
    renderWithLocale(<SiteHeader />);
    const header = screen.getByRole("banner");

    expect(header).toHaveClass("bg-transparent");

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 120,
    });

    fireEvent.scroll(window);

    expect(header).toHaveClass("bg-white/80");
    expect(header).toHaveClass("backdrop-blur-sm");
  });

  it("uses reduced desktop nav gaps", () => {
    renderWithLocale(<SiteHeader />);

    const desktopNav = getDesktopNav();
    expect(desktopNav).toHaveClass("md:gap-4");
    expect(desktopNav).toHaveClass("lg:gap-5");
  });
});

describe("SiteHeader (zh-Hans locale)", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 0,
    });
  });

  it("renders the nav with localized aria-label in Chinese", () => {
    renderWithLocale(<SiteHeader />, "zh-Hans");
    expect(
      screen.getByRole("navigation", { name: zhHans.nav.primaryAriaLabel }),
    ).toBeInTheDocument();
  });

  it("does NOT render the English nav aria-label when locale is zh-Hans", () => {
    renderWithLocale(<SiteHeader />, "zh-Hans");
    expect(
      screen.queryByRole("navigation", { name: enGB.nav.primaryAriaLabel }),
    ).not.toBeInTheDocument();
  });

  it("renders the localized menu button open aria-label in Chinese", () => {
    renderWithLocale(<SiteHeader />, "zh-Hans");
    expect(
      screen.getByRole("button", { name: zhHans.nav.openMenu }),
    ).toBeInTheDocument();
  });

  it("renders localized About nav link in Chinese", async () => {
    const user = userEvent.setup();
    renderWithLocale(<SiteHeader />, "zh-Hans");

    // Open mobile menu to surface links in both desktop and mobile (scoped to desktop nav for isolation)
    const nav = screen.getByRole("navigation", {
      name: zhHans.nav.primaryAriaLabel,
    });
    const desktopNavList = within(nav).getByRole("list");
    expect(
      within(desktopNavList).getByRole("link", { name: zhHans.nav.about }),
    ).toBeInTheDocument();

    // suppress unused variable warning
    void user;
  });

  it("renders the localized Meet label in Chinese", async () => {
    const user = userEvent.setup();
    renderWithLocale(<SiteHeader />, "zh-Hans");

    await user.click(screen.getByRole("button", { name: zhHans.nav.openMenu }));

    const mobileMenu = screen.getByRole("region", {
      name: zhHans.nav.mobileMenuAriaLabel,
    });

    expect(
      within(mobileMenu).getByRole("link", { name: zhHans.nav.meet }),
    ).toHaveAttribute("href", "/zh-Hans/meet");
  });
});
