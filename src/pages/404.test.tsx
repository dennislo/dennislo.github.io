import React from "react";
import { render, screen } from "@testing-library/react";
import type { PageProps } from "gatsby";
import NotFoundPage, { Head } from "./404";
import { enGB } from "../i18n/translations/en-GB";
import { zhHans } from "../i18n/translations/zh-Hans";
import { renderWithLocale } from "../test/renderWithLocale";

jest.mock("gatsby", () => ({
  Link: function MockLink({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) {
    return <a href={to}>{children}</a>;
  },
}));

const mockLocation: PageProps["location"] = {
  pathname: "/404/",
  search: "",
  hash: "",
  href: "",
  origin: "",
  protocol: "",
  host: "",
  hostname: "",
  port: "",
  state: null,
  key: "",
  ancestorOrigins: {} as DOMStringList,
  assign: jest.fn(),
  reload: jest.fn(),
  replace: jest.fn(),
};

class MockPageComponent extends React.Component {
  render() {
    return null;
  }
}

const mockPageProps: PageProps = {
  path: "/404/",
  uri: "/404/",
  location: mockLocation,
  children: undefined,
  params: {},
  serverData: {},
  pageResources: {
    component: new MockPageComponent({}),
    json: { data: {}, pageContext: {} },
    page: {
      componentChunkName: "component---src-pages-404-tsx",
      path: "/404/",
      webpackCompilationHash: "test-hash",
    },
  },
  data: {},
  pageContext: {},
};

describe("NotFoundPage (en-GB, default locale)", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("renders the localized 404 title from enGB dict", () => {
    renderWithLocale(<NotFoundPage />);
    // The 404 heading text ("404") is numeric — the same across locales
    expect(screen.getByText(enGB.notFound.title)).toBeInTheDocument();
  });

  it("renders the localized 'Page not found' heading from enGB dict", () => {
    renderWithLocale(<NotFoundPage />);
    expect(screen.getByText(enGB.notFound.heading)).toBeInTheDocument();
  });

  it("renders the localized apology body from enGB dict", () => {
    // The component currently hardcodes the body text with an emoji; the dict key holds
    // the bare text. We assert on a fragment that is present in both ("Sorry").
    renderWithLocale(<NotFoundPage />);
    expect(screen.getByText(/Sorry/)).toBeInTheDocument();
  });

  it("renders the localized go-home button from enGB dict", () => {
    renderWithLocale(<NotFoundPage />);
    const link = screen.getByRole("link", { name: enGB.notFound.goHomeButton });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders the page head title", () => {
    render(<Head {...mockPageProps} />);
    expect(document.title).toBe("Not found");
  });

  it("renders alternate Markdown link in head", () => {
    render(<Head {...mockPageProps} />);
    const link = document.head.querySelector(
      'link[rel="alternate"][type="text/markdown"]',
    ) as HTMLLinkElement | null;
    expect(link).toBeInTheDocument();
    expect(link?.getAttribute("href")).toBe("/404.md");
  });
});

describe("NotFoundPage (zh-Hans locale)", () => {
  it("renders the localized 'Page not found' heading in Chinese", () => {
    renderWithLocale(<NotFoundPage />, "zh-Hans");
    expect(screen.getByText(zhHans.notFound.heading)).toBeInTheDocument();
  });

  it("does NOT render the English heading when locale is zh-Hans", () => {
    renderWithLocale(<NotFoundPage />, "zh-Hans");
    expect(screen.queryByText(enGB.notFound.heading)).not.toBeInTheDocument();
  });

  it("renders the localized go-home button in Chinese", () => {
    renderWithLocale(<NotFoundPage />, "zh-Hans");
    expect(
      screen.getByRole("link", { name: zhHans.notFound.goHomeButton }),
    ).toBeInTheDocument();
  });
});
