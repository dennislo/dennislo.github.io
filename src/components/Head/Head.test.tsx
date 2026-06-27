import React from "react";
import { render } from "@testing-library/react";
import { Head } from "./Head";
import { locales, localeMeta, localizePath } from "../../i18n/config";
import { siteConfig } from "../../config";

describe("Head", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("renders without crashing", () => {
    const { container } = render(<Head title="Test Title" />);
    expect(container).toBeTruthy();
  });

  it("sets the page title", () => {
    render(<Head title="Who is DLO?" />);
    const title = document.querySelector("title");
    expect(title?.textContent).toBe("Who is DLO?");
  });

  it("sets meta description", () => {
    render(<Head title="Who is DLO?" />);
    const meta = document.querySelector('meta[name="description"]');
    expect(meta?.getAttribute("content")).toContain("Who is DLO?");
  });

  it("sets Open Graph title", () => {
    render(<Head title="Who is DLO?" />);
    const meta = document.querySelector('meta[property="og:title"]');
    expect(meta?.getAttribute("content")).toBe("Who is DLO?");
  });

  it("sets Twitter card meta tags", () => {
    render(<Head title="Test" />);
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    const twitterCreator = document.querySelector(
      'meta[name="twitter:creator"]',
    );
    expect(twitterCard?.getAttribute("content")).toBe("summary");
    expect(twitterCreator?.getAttribute("content")).toBe("@dlo");
  });

  it("renders no JSON-LD script tags when schemas prop is omitted", () => {
    render(<Head title="Test" />);
    const scripts = document.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts).toHaveLength(0);
  });

  it("renders one JSON-LD script tag when one schema is passed", () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Test",
    };
    render(<Head schemas={[schema]} />);
    const scripts = document.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts).toHaveLength(1);
    expect(scripts[0]?.textContent).toBe(JSON.stringify(schema));
  });

  it("renders multiple JSON-LD script tags when multiple schemas are passed", () => {
    const schemas = [
      { "@context": "https://schema.org", "@type": "Person" },
      { "@context": "https://schema.org", "@type": "WebSite" },
    ];
    render(<Head schemas={schemas} />);
    const scripts = document.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts).toHaveLength(2);
  });
});

describe("Head — localized SEO", () => {
  // Cast to any so TypeScript accepts the not-yet-implemented locale/path props.
  // The runtime assertions below will fail (RED) until the engineer implements them.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LocalizedHead = Head as React.ComponentType<any>;

  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  describe("og:locale meta tag", () => {
    it("emits og:locale content zh_CN when locale is zh-Hans", () => {
      render(
        <LocalizedHead title="x" description="y" locale="zh-Hans" path="/" />,
      );
      const meta = document.querySelector(
        'meta[property="og:locale"]',
      ) as HTMLMetaElement | null;
      expect(meta).not.toBeNull();
      expect(meta?.content).toBe("zh_CN");
    });

    it("emits og:locale content en_GB when no locale prop is supplied (default)", () => {
      render(<LocalizedHead title="x" description="y" />);
      const meta = document.querySelector(
        'meta[property="og:locale"]',
      ) as HTMLMetaElement | null;
      expect(meta).not.toBeNull();
      expect(meta?.content).toBe("en_GB");
    });

    it("emits og:locale content en_US when locale is en-US", () => {
      render(
        <LocalizedHead title="x" description="y" locale="en-US" path="/" />,
      );
      const meta = document.querySelector(
        'meta[property="og:locale"]',
      ) as HTMLMetaElement | null;
      expect(meta).not.toBeNull();
      expect(meta?.content).toBe("en_US");
    });
  });

  describe("canonical link", () => {
    it("emits canonical href https://dlo.wtf/zh-Hans/ when locale=zh-Hans path=/", () => {
      render(
        <LocalizedHead title="x" description="y" locale="zh-Hans" path="/" />,
      );
      const link = document.querySelector(
        'link[rel="canonical"]',
      ) as HTMLLinkElement | null;
      expect(link).not.toBeNull();
      expect(link?.getAttribute("href")).toBe(
        `${siteConfig.siteUrl}${localizePath("/", "zh-Hans")}`,
      );
    });

    it("emits canonical href https://dlo.wtf/en-US/contact-form/ when locale=en-US path=/contact-form/", () => {
      render(
        <LocalizedHead
          title="x"
          description="y"
          locale="en-US"
          path="/contact-form/"
        />,
      );
      const link = document.querySelector(
        'link[rel="canonical"]',
      ) as HTMLLinkElement | null;
      expect(link).not.toBeNull();
      expect(link?.getAttribute("href")).toBe(
        "https://dlo.wtf/en-US/contact-form/",
      );
    });

    it("emits canonical href https://dlo.wtf/ when no locale/path props are supplied (default)", () => {
      render(<LocalizedHead title="x" description="y" />);
      const link = document.querySelector(
        'link[rel="canonical"]',
      ) as HTMLLinkElement | null;
      expect(link).not.toBeNull();
      expect(link?.getAttribute("href")).toBe("https://dlo.wtf/");
    });
  });

  describe("hreflang alternate links", () => {
    it("emits exactly 4 hreflang alternate links (one per locale) when locale=zh-Hans path=/", () => {
      render(
        <LocalizedHead title="x" description="y" locale="zh-Hans" path="/" />,
      );
      const links = document.querySelectorAll(
        "link[rel='alternate'][hreflang]",
      );
      // 4 locale alternates + 1 x-default = 5, but x-default has hreflang too;
      // filter out x-default to count locale-specific ones
      const localeLinks = Array.from(links).filter(
        (l) => l.getAttribute("hreflang") !== "x-default",
      );
      expect(localeLinks).toHaveLength(locales.length);
    });

    it("emits an x-default alternate link", () => {
      render(
        <LocalizedHead title="x" description="y" locale="zh-Hans" path="/" />,
      );
      const xDefault = document.querySelector(
        'link[rel="alternate"][hreflang="x-default"]',
      ) as HTMLLinkElement | null;
      expect(xDefault).not.toBeNull();
    });

    it("zh-Hans alternate href is https://dlo.wtf/zh-Hans/ when path=/", () => {
      render(
        <LocalizedHead title="x" description="y" locale="zh-Hans" path="/" />,
      );
      const zhHansLink = document.querySelector(
        `link[rel="alternate"][hreflang="${localeMeta["zh-Hans"].htmlLang}"]`,
      ) as HTMLLinkElement | null;
      expect(zhHansLink).not.toBeNull();
      expect(zhHansLink?.getAttribute("href")).toBe(
        `${siteConfig.siteUrl}${localizePath("/", "zh-Hans")}`,
      );
    });

    it("en-GB alternate href is https://dlo.wtf/ (no prefix for default locale) when path=/", () => {
      render(
        <LocalizedHead title="x" description="y" locale="zh-Hans" path="/" />,
      );
      const enGBLink = document.querySelector(
        `link[rel="alternate"][hreflang="${localeMeta["en-GB"].htmlLang}"]`,
      ) as HTMLLinkElement | null;
      expect(enGBLink).not.toBeNull();
      expect(enGBLink?.getAttribute("href")).toBe(
        `${siteConfig.siteUrl}${localizePath("/", "en-GB")}`,
      );
    });

    it("x-default alternate href is https://dlo.wtf/ (bare path) when path=/", () => {
      render(
        <LocalizedHead title="x" description="y" locale="zh-Hans" path="/" />,
      );
      const xDefault = document.querySelector(
        'link[rel="alternate"][hreflang="x-default"]',
      ) as HTMLLinkElement | null;
      expect(xDefault?.getAttribute("href")).toBe("https://dlo.wtf/");
    });

    it("x-default href is https://dlo.wtf/contact-form/ when locale=en-US path=/contact-form/", () => {
      render(
        <LocalizedHead
          title="x"
          description="y"
          locale="en-US"
          path="/contact-form/"
        />,
      );
      const xDefault = document.querySelector(
        'link[rel="alternate"][hreflang="x-default"]',
      ) as HTMLLinkElement | null;
      expect(xDefault?.getAttribute("href")).toBe(
        "https://dlo.wtf/contact-form/",
      );
    });

    it("all 4 locales have hreflang alternate links with correct hrefs for path=/contact-form/", () => {
      render(
        <LocalizedHead
          title="x"
          description="y"
          locale="en-US"
          path="/contact-form/"
        />,
      );
      for (const locale of locales) {
        const link = document.querySelector(
          `link[rel="alternate"][hreflang="${localeMeta[locale].htmlLang}"]`,
        ) as HTMLLinkElement | null;
        expect(link).not.toBeNull();
        expect(link?.getAttribute("href")).toBe(
          `${siteConfig.siteUrl}${localizePath("/contact-form/", locale)}`,
        );
      }
    });
  });
});
