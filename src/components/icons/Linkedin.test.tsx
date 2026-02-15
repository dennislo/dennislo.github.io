import React from "react";
import { render } from "@testing-library/react";
import Linkedin from "./Linkedin";

describe("Linkedin", () => {
  it("renders an SVG element", () => {
    const { container } = render(<Linkedin />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("has correct SVG attributes", () => {
    const { container } = render(<Linkedin />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    expect(svg).toHaveAttribute("viewBox", "0 0 30 30");
    expect(svg).toHaveAttribute("width", "30px");
    expect(svg).toHaveAttribute("height", "30px");
  });

  it("contains path element", () => {
    const { container } = render(<Linkedin />);
    const path = container.querySelector("path");
    expect(path).toBeInTheDocument();
  });
});
