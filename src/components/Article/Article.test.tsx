import React from "react";
import { render, screen } from "@testing-library/react";
import Article from "./Article";

jest.mock("./Clients", () => {
  function MockClients() {
    return <div data-testid="clients">Clients</div>;
  }
  return MockClients;
});

jest.mock("./More", () => {
  function MockMore() {
    return <div data-testid="more">More</div>;
  }
  return MockMore;
});

jest.mock("./Contact", () => {
  function MockContact() {
    return <div data-testid="contact">Contact</div>;
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
    expect(screen.getByTestId("clients")).toBeInTheDocument();
    expect(screen.getByTestId("more")).toBeInTheDocument();
    expect(screen.getByTestId("contact")).toBeInTheDocument();
  });

  it("renders design credit", () => {
    render(<Article />);
    expect(
      screen.getByText("Page design credit: Peter W @techieshark"),
    ).toBeInTheDocument();
  });
});
