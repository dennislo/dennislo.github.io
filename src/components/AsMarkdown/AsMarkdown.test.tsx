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
});
