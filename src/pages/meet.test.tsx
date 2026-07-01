import React from "react";
import { render, screen } from "@testing-library/react";
import MeetPage, { Head } from "./meet";
import { enGB } from "../i18n/translations/en-GB";
import { getDictionary } from "../i18n/dictionaries";
import { siteConfig } from "../config";
import { renderWithLocale } from "../test/renderWithLocale";

jest.mock("../components/Layout/Layout", () => ({
  __esModule: true,
  default: function MockLayout({ children }: { children: React.ReactNode }) {
    return <div aria-label="Layout">{children}</div>;
  },
}));

jest.mock("../components/MeetingBooker/MeetingBooker", () => ({
  __esModule: true,
  default: function MockMeetingBooker() {
    return <section aria-label="Meeting booker">Meeting booker</section>;
  },
}));

describe("MeetPage", () => {
  it("renders the layout and meeting booker", () => {
    renderWithLocale(<MeetPage />);

    expect(screen.getByLabelText("Layout")).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Meeting booker" }),
    ).toBeInTheDocument();
  });

  it("renders a top-level page heading", () => {
    renderWithLocale(<MeetPage />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).not.toHaveTextContent("");
  });

  it("renders the heading localized for the active non-default locale", () => {
    renderWithLocale(<MeetPage />, "zh-Hans");

    const dict = getDictionary("zh-Hans");
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(dict.meet.pageTitle);
    expect(heading).not.toHaveTextContent(enGB.meet.pageTitle);
  });
});

describe("MeetPage Head", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("renders default localized meeting SEO", () => {
    render(<Head />);

    expect(document.title).toBe(enGB.seo.meetPageTitle);
    expect(
      document.head.querySelector('meta[name="description"]'),
    ).toHaveAttribute("content", enGB.seo.meetPageDescription);
  });

  it("emits canonical href for zh-Hans meet route", () => {
    render(
      <Head
        pageContext={{ locale: "zh-Hans" }}
        location={{ pathname: "/zh-Hans/meet/" }}
      />,
    );

    const dict = getDictionary("zh-Hans");
    const canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    expect(document.querySelector("title")?.textContent).toBe(
      dict.seo.meetPageTitle,
    );
    expect(canonical?.getAttribute("href")).toBe(
      `${siteConfig.siteUrl}/zh-Hans/meet/`,
    );
  });
});
