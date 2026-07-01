import React from "react";
import { render } from "@testing-library/react";
import TablerCalendarEvent from "./TablerCalendarEvent";

describe("TablerCalendarEvent", () => {
  it("renders the SVG as decorative content", () => {
    const { container } = render(<TablerCalendarEvent className="h-8 w-8" />);

    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass("h-8", "w-8");
  });
});
