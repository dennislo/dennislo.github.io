import React from "react";
import { render, screen } from "@testing-library/react";
import ContactFormPage, { Head } from "./contact-form";
import { enGB } from "../i18n/translations/en-GB";
import { renderWithLocale } from "../test/renderWithLocale";
import { getDictionary } from "../i18n/dictionaries";
import { siteConfig } from "../config";

jest.mock("../components/Layout/Layout", () => ({
  __esModule: true,
  default: function MockLayout({ children }: { children: React.ReactNode }) {
    return <div aria-label="Layout">{children}</div>;
  },
}));

jest.mock("../components/ContactForm/ContactForm", () => ({
  __esModule: true,
  default: function MockContactForm() {
    return <div aria-label="Contact Form">Contact Form</div>;
  },
}));

describe("ContactFormPage", () => {
  it("renders the layout", () => {
    render(<ContactFormPage />);
    expect(screen.getByLabelText("Layout")).toBeInTheDocument();
  });

  it("renders the contact form component", () => {
    render(<ContactFormPage />);
    expect(screen.getByLabelText("Contact Form")).toBeInTheDocument();
  });

  it("renders correctly when wrapped with LocaleProvider (en-GB)", () => {
    renderWithLocale(<ContactFormPage />);
    expect(screen.getByLabelText("Layout")).toBeInTheDocument();
    expect(screen.getByLabelText("Contact Form")).toBeInTheDocument();
  });

  it("renders correctly when wrapped with LocaleProvider (zh-Hans)", () => {
    renderWithLocale(<ContactFormPage />, "zh-Hans");
    expect(screen.getByLabelText("Layout")).toBeInTheDocument();
    expect(screen.getByLabelText("Contact Form")).toBeInTheDocument();
  });
});

describe("ContactFormPage Head", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("renders the localized title and description meta from enGB dict", () => {
    render(<Head />);
    expect(document.title).toBe(enGB.seo.contactPageTitle);
    const meta = document.head.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;
    expect(meta).toBeInTheDocument();
    expect(meta?.content).toBe(enGB.seo.contactPageDescription);
  });

  it("renders alternate Markdown link in head", () => {
    render(<Head />);
    const link = document.head.querySelector(
      'link[rel="alternate"][type="text/markdown"]',
    ) as HTMLLinkElement | null;
    expect(link).toBeInTheDocument();
    expect(link?.getAttribute("href")).toBe("/contact-form.md");
  });

  it("renders Open Graph meta tags via SharedHead", () => {
    render(<Head />);
    const ogTitle = document.head.querySelector('meta[property="og:title"]');
    expect(ogTitle?.getAttribute("content")).toBe(enGB.seo.contactPageTitle);
    const ogDescription = document.head.querySelector(
      'meta[property="og:description"]',
    );
    expect(ogDescription?.getAttribute("content")).toBe(
      enGB.seo.contactPageDescription,
    );
  });

  it("renders Twitter card meta tags via SharedHead", () => {
    render(<Head />);
    const twitterCard = document.head.querySelector(
      'meta[name="twitter:card"]',
    );
    expect(twitterCard?.getAttribute("content")).toBe("summary");
    const twitterTitle = document.head.querySelector(
      'meta[name="twitter:title"]',
    );
    expect(twitterTitle?.getAttribute("content")).toBe(
      enGB.seo.contactPageTitle,
    );
  });

  it("renders a WebPage JSON-LD script tag", () => {
    render(<Head />);
    const scripts = document.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts).toHaveLength(1);
    const parsed = JSON.parse(scripts[0]?.textContent ?? "{}");
    expect(parsed["@type"]).toBe("WebPage");
  });
});

describe("ContactFormPage Head — localized SEO", () => {
  // Cast to any so TypeScript accepts the not-yet-implemented pageContext/location props.
  // Runtime assertions will fail (RED) until the engineer implements them.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LocalizedHead = Head as React.ComponentType<any>;

  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("renders localized contact page title from zh-Hans dictionary when pageContext.locale=zh-Hans", () => {
    // New contract: Head accepts pageContext and location props for localized rendering
    render(
      <LocalizedHead
        pageContext={{ locale: "zh-Hans" }}
        location={{ pathname: "/zh-Hans/contact-form/" }}
      />,
    );
    const zhHansDict = getDictionary("zh-Hans");
    expect(document.querySelector("title")?.textContent).toBe(
      zhHansDict.seo.contactPageTitle,
    );
  });

  it("emits canonical href https://dlo.wtf/zh-Hans/contact-form/ when locale=zh-Hans", () => {
    render(
      <LocalizedHead
        pageContext={{ locale: "zh-Hans" }}
        location={{ pathname: "/zh-Hans/contact-form/" }}
      />,
    );
    const canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;
    expect(canonical).not.toBeNull();
    expect(canonical?.getAttribute("href")).toBe(
      `${siteConfig.siteUrl}/zh-Hans/contact-form/`,
    );
  });
});
