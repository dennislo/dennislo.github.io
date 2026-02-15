import React from "react";
import { render } from "@testing-library/react";
import { Head } from "./Head";

describe("Head", () => {
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
      'meta[name="twitter:creator"]'
    );
    expect(twitterCard?.getAttribute("content")).toBe("summary");
    expect(twitterCreator?.getAttribute("content")).toBe("@dlo");
  });
});
