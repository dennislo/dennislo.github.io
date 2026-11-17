import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function hasValidIconSignature(contents: Buffer): boolean {
  const hasIcoSignature =
    contents.length >= 4 &&
    contents[0] === 0 &&
    contents[1] === 0 &&
    contents[2] === 1 &&
    contents[3] === 0;
  const hasPngSignature =
    contents.length >= PNG_SIGNATURE.length &&
    contents.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE);

  return hasIcoSignature || hasPngSignature;
}

describe("static assets", () => {
  it("provides a valid root favicon for browser fallback requests", () => {
    const faviconPath = resolve(process.cwd(), "static/favicon.ico");

    expect(existsSync(faviconPath)).toBe(true);

    const contents = readFileSync(faviconPath);

    expect(contents.length).toBeGreaterThan(0);
    expect(hasValidIconSignature(contents)).toBe(true);
  });
});
