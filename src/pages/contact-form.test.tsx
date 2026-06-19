import React from "react";
import { render, screen } from "@testing-library/react";
import ContactFormPage, { Head } from "./contact-form";

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
});

describe("ContactFormPage Head", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("renders title and description meta", () => {
    render(<Head />);
    expect(document.title).toBe("Contact — DLO");
    const meta = document.head.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;
    expect(meta).toBeInTheDocument();
    expect(meta?.content).toBe("Send a message to Dennis Lo");
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
    expect(ogTitle?.getAttribute("content")).toBe("Contact — DLO");
    const ogDescription = document.head.querySelector(
      'meta[property="og:description"]',
    );
    expect(ogDescription?.getAttribute("content")).toBe(
      "Send a message to Dennis Lo",
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
    expect(twitterTitle?.getAttribute("content")).toBe("Contact — DLO");
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
