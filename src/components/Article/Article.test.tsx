import React from "react";
import { render, screen } from "@testing-library/react";
import Article from "./Article";

jest.mock("./Clients", () => {
  function MockClients() {
    return <div>Clients</div>;
  }
  return MockClients;
});

jest.mock("./More", () => {
  function MockMore() {
    return <div>More</div>;
  }
  return MockMore;
});

jest.mock("./Contact", () => {
  function MockContact() {
    return <div>Contact</div>;
  }
  return MockContact;
});

describe("Article", () => {
  it("renders the article with main sections", () => {
    render(<Article />);
    expect(screen.getByText("Who is DLO?")).toBeInTheDocument();
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(
      screen.getByText(/I'm Dennis Lo, an IT consultant/),
    ).toBeInTheDocument();
  });

  it("renders Agile IT & Software Limited section", () => {
    render(<Article />);
    expect(screen.getByText("Agile IT & Software Limited")).toBeInTheDocument();
    expect(
      screen.getByText(/We deliver enterprise-grade IT consultancy/),
    ).toBeInTheDocument();
  });

  it("renders contact email link", () => {
    render(<Article />);
    const link = screen.getByRole("link", {
      name: /Please contact us for further information/,
    });
    expect(link).toHaveAttribute("href", "mailto:dennis@dlo.wtf");
  });

  it("renders child components", () => {
    render(<Article />);
    expect(screen.getByText("Clients")).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("renders design credit", () => {
    render(<Article />);
    expect(
      screen.getByText("Page design credit: Peter W @techieshark"),
    ).toBeInTheDocument();
  });
});
