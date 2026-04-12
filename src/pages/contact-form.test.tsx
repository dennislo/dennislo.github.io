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
  it("renders title and description meta", () => {
    render(<Head />);
    expect(screen.getByText("Contact — DLO")).toBeInTheDocument();
    const meta = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;
    expect(meta).toBeInTheDocument();
    expect(meta?.content).toBe("Send a message to Dennis Lo");
  });
});
