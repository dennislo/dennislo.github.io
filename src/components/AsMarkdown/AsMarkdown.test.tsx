import React from "react";
import { render, screen } from "@testing-library/react";
import AsMarkdown from "./AsMarkdown";

describe("AsMarkdown", () => {
  it("renders an accessible link to the explicit Markdown route", () => {
    render(<AsMarkdown href="/contact-form.md" label="As Markdown" />);

    expect(screen.getByRole("link", { name: "As Markdown" })).toHaveAttribute(
      "href",
      "/contact-form.md",
    );
  });

  it("uses the localized label supplied by the page", () => {
    render(<AsMarkdown href="/index.md" label="以 Markdown 格式查看" />);

    expect(
      screen.getByRole("link", { name: "以 Markdown 格式查看" }),
    ).toBeVisible();
  });

  it("includes a decorative Markdown icon that inherits the link colour", () => {
    render(<AsMarkdown href="/index.md" label="As Markdown" />);

    const link = screen.getByRole("link", { name: "As Markdown" });
    const icon = link.querySelector("svg");
    const currentColorElement = icon?.querySelector(
      '[fill="currentColor"], [stroke="currentColor"]',
    );

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveAttribute("focusable", "false");
    expect(icon?.querySelector("path")).toBeInTheDocument();
    expect(
      icon?.matches('[fill="currentColor"], [stroke="currentColor"]') ||
        currentColorElement !== null,
    ).toBe(true);
  });

  it("keeps the localized accessible name when its visual label is responsive", () => {
    render(<AsMarkdown href="/index.md" label="Ver como Markdown" />);

    const link = screen.getByRole("link", { name: "Ver como Markdown" });

    expect(link).toHaveAccessibleName("Ver como Markdown");
    expect(screen.getByText("Ver como Markdown")).toBeInTheDocument();
  });
});
