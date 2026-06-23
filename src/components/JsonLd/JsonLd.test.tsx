import React from "react";
import { render } from "@testing-library/react";
import { JsonLd } from "./JsonLd";

describe("JsonLd", () => {
  it("renders a script tag with type application/ld+json", () => {
    const { container } = render(
      <JsonLd
        schema={{ "@context": "https://schema.org", "@type": "Person" }}
      />,
    );
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script).toBeInTheDocument();
  });

  it("serializes the schema as JSON in the script content", () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Dennis Lo",
    };
    const { container } = render(<JsonLd schema={schema} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script?.textContent).toBe(JSON.stringify(schema));
  });

  it("handles nested schema objects", () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      mainEntity: { "@type": "Person", name: "Dennis Lo" },
    };
    const { container } = render(<JsonLd schema={schema} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script?.textContent).toContain('"mainEntity"');
    expect(script?.textContent).toContain('"Dennis Lo"');
  });

  it("handles arrays in schema values", () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      sameAs: ["https://github.com/dennislo", "https://linkedin.com/in/dennis"],
    };
    const { container } = render(<JsonLd schema={schema} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script?.textContent).toContain('"sameAs"');
    expect(script?.textContent).toContain("https://github.com/dennislo");
  });

  it("renders without crashing for an empty schema object", () => {
    const { container } = render(<JsonLd schema={{}} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script).toBeInTheDocument();
    expect(script?.textContent).toBe("{}");
  });

  it("escapes </script> sequences to prevent early tag termination", () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Test </script><script>alert(1)</script>",
    };
    const { container } = render(<JsonLd schema={schema} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script?.innerHTML).not.toContain("</script>");
    expect(script?.innerHTML).toContain("<\\/script>");
  });
});
