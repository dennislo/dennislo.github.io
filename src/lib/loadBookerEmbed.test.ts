import fs from "fs";
import path from "path";
import * as loadBookerEmbedModule from "./loadBookerEmbed";

describe("loadBookerEmbed", () => {
  it("exports a loadBookerEmbed function", () => {
    expect(typeof loadBookerEmbedModule.loadBookerEmbed).toBe("function");
  });

  it("resolves to the BookerEmbed component exported by the underlying module", async () => {
    const fakeBookerEmbed = () => null;

    // The loader dynamically imports the npm-installed @calcom/atoms package
    // (rather than an unpinned CDN URL) and returns its BookerEmbed export.
    // Mock the npm specifier directly to validate that contract.
    jest.doMock("@calcom/atoms", () => ({ BookerEmbed: fakeBookerEmbed }), {
      virtual: true,
    });

    // Re-require after mocking so the dynamic import resolves the mock.
    jest.resetModules();
    const { loadBookerEmbed } = await import("./loadBookerEmbed");

    const BookerEmbed = await loadBookerEmbed();

    expect(BookerEmbed).toBe(fakeBookerEmbed);
  });

  it("does NOT dynamically import the third-party embed from an unpinned esm.sh CDN URL", () => {
    // This pins down the desired, safer contract: the loader should resolve
    // the BookerEmbed component from the npm-installed @calcom/atoms package
    // (already declared in package.json) rather than reaching out at runtime
    // to an external CDN URL that bypasses the npm-installed, audited
    // dependency. Read the current source directly since the CDN specifier
    // is a dynamic, runtime-only string that can't be intercepted via
    // jest.mock in this environment.
    const source = loadBookerEmbedSource();

    expect(source).not.toMatch(/esm\.sh/);
  });
});

function loadBookerEmbedSource(): string {
  return fs.readFileSync(path.join(__dirname, "loadBookerEmbed.ts"), "utf8");
}
