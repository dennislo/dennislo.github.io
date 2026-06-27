import React from "react";
import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SiteHeader from "./SiteHeader";
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
});
