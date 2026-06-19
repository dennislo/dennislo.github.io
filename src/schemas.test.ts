import { siteConfig } from "./config";
import {
  buildPersonSchema,
  buildWebSiteSchema,
  buildProfilePageSchema,
  buildArticleSchema,
  buildWebPageSchema,
} from "./schemas";

describe("buildPersonSchema", () => {
  const schema = buildPersonSchema(siteConfig);

  it("sets @context to https://schema.org", () => {
    expect(schema["@context"]).toBe("https://schema.org");
  });

  it("sets @type to Person", () => {
    expect(schema["@type"]).toBe("Person");
  });

  it("maps config.name to name", () => {
    expect(schema.name).toBe(siteConfig.name);
  });

  it("maps config.siteUrl to url", () => {
    expect(schema.url).toBe(siteConfig.siteUrl);
  });

  it("maps config.social.email as a bare address (not mailto:)", () => {
    expect(schema.email).toBe(siteConfig.social.email);
    expect(schema.email).not.toMatch(/^mailto:/);
  });

  it("maps config.title to jobTitle", () => {
    expect(schema.jobTitle).toBe(siteConfig.title);
  });

  it("includes github, linkedin, and instagram in sameAs", () => {
    expect(schema.sameAs).toContain(siteConfig.social.github);
    expect(schema.sameAs).toContain(siteConfig.social.linkedin);
    expect(schema.sameAs).toContain(siteConfig.social.instagram);
  });

  it("does not include email in sameAs", () => {
    expect(schema.sameAs).not.toContain(siteConfig.social.email);
  });

  it("sets knowsAbout from config.skills", () => {
    expect(schema.knowsAbout).toEqual(siteConfig.skills);
  });

  it("sets alumniOf from the first education entry", () => {
    expect(schema.alumniOf["@type"]).toBe("EducationalOrganization");
    expect(schema.alumniOf.name).toBe(siteConfig.education[0].school);
  });
});

describe("buildWebSiteSchema", () => {
  const schema = buildWebSiteSchema(siteConfig);

  it("sets @context to https://schema.org", () => {
    expect(schema["@context"]).toBe("https://schema.org");
  });

  it("sets @type to WebSite", () => {
    expect(schema["@type"]).toBe("WebSite");
  });

  it("maps config.header to name", () => {
    expect(schema.name).toBe(siteConfig.header);
  });

  it("maps config.siteUrl to url", () => {
    expect(schema.url).toBe(siteConfig.siteUrl);
  });

  it("maps config.description to description", () => {
    expect(schema.description).toBe(siteConfig.description);
  });
});

describe("buildProfilePageSchema", () => {
  const schema = buildProfilePageSchema(siteConfig);

  it("sets @type to ProfilePage", () => {
    expect(schema["@type"]).toBe("ProfilePage");
  });

  it("mainEntity has @type Person", () => {
    expect(schema.mainEntity["@type"]).toBe("Person");
  });

  it("mainEntity does NOT have @context (nested nodes must omit it)", () => {
    expect(
      Object.prototype.hasOwnProperty.call(schema.mainEntity, "@context"),
    ).toBe(false);
  });

  it("mainEntity.name matches config.name", () => {
    expect(schema.mainEntity.name).toBe(siteConfig.name);
  });

  it("url maps to config.siteUrl", () => {
    expect(schema.url).toBe(siteConfig.siteUrl);
  });
});

describe("buildArticleSchema", () => {
  const options = {
    headline: "Test Article",
    description: "A test article description",
    url: "https://dlo.wtf/articles/test",
    datePublished: "2026-01-01",
  };

  it("sets @type to Article", () => {
    const schema = buildArticleSchema(siteConfig, options);
    expect(schema["@type"]).toBe("Article");
  });

  it("author has @type Person", () => {
    const schema = buildArticleSchema(siteConfig, options);
    expect(schema.author["@type"]).toBe("Person");
  });

  it("author.name matches config.name", () => {
    const schema = buildArticleSchema(siteConfig, options);
    expect(schema.author.name).toBe(siteConfig.name);
  });

  it("dateModified key is absent when not provided", () => {
    const schema = buildArticleSchema(siteConfig, options);
    expect(Object.prototype.hasOwnProperty.call(schema, "dateModified")).toBe(
      false,
    );
  });

  it("dateModified is included when provided", () => {
    const schema = buildArticleSchema(siteConfig, {
      ...options,
      dateModified: "2026-06-01",
    });
    expect(schema.dateModified).toBe("2026-06-01");
  });

  it("image key is absent when not provided", () => {
    const schema = buildArticleSchema(siteConfig, options);
    expect(Object.prototype.hasOwnProperty.call(schema, "image")).toBe(false);
  });

  it("image is included when provided", () => {
    const schema = buildArticleSchema(siteConfig, {
      ...options,
      image: "https://dlo.wtf/og-image.png",
    });
    expect(schema.image).toBe("https://dlo.wtf/og-image.png");
  });
});

describe("buildWebPageSchema", () => {
  it("sets @type to WebPage", () => {
    const schema = buildWebPageSchema(siteConfig, {
      url: "https://dlo.wtf/contact-form",
      name: "Contact — DLO",
    });
    expect(schema["@type"]).toBe("WebPage");
  });

  it("uses url from options", () => {
    const schema = buildWebPageSchema(siteConfig, {
      url: "https://dlo.wtf/contact-form",
      name: "Contact — DLO",
    });
    expect(schema.url).toBe("https://dlo.wtf/contact-form");
  });

  it("description key is absent when not provided", () => {
    const schema = buildWebPageSchema(siteConfig, {
      url: "https://dlo.wtf/contact-form",
      name: "Contact — DLO",
    });
    expect(Object.prototype.hasOwnProperty.call(schema, "description")).toBe(
      false,
    );
  });

  it("description is included when provided", () => {
    const schema = buildWebPageSchema(siteConfig, {
      url: "https://dlo.wtf/contact-form",
      name: "Contact — DLO",
      description: "Send a message to Dennis Lo",
    });
    expect(schema.description).toBe("Send a message to Dennis Lo");
  });
});
