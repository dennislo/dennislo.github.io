import { expect, test } from "@playwright/test";

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

test("serves a valid root favicon without an HTTP error", async ({
  request,
}) => {
  const response = await request.get("/favicon.ico");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/^image\//);

  const contents = await response.body();

  expect(contents.length).toBeGreaterThan(0);
  expect(hasValidIconSignature(contents)).toBe(true);
});
