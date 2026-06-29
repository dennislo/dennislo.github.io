import type { TranslationKey } from "./types";

describe("TranslationKey", () => {
  it("accepts dot-paths that resolve to string dictionary leaves", () => {
    const topLevelKey: TranslationKey = "nav.menu";
    const nestedKey: TranslationKey = "about.clients.financeBanking";

    expect(topLevelKey).toBe("nav.menu");
    expect(nestedKey).toBe("about.clients.financeBanking");
  });

  it("rejects misspelled or non-leaf dictionary paths at compile time", () => {
    // @ts-expect-error nav.Abuot is intentionally misspelled.
    const misspelledKey: TranslationKey = "nav.Abuot";

    // @ts-expect-error about.clients is an object, not a string leaf.
    const objectKey: TranslationKey = "about.clients";

    expect([misspelledKey, objectKey]).toEqual(["nav.Abuot", "about.clients"]);
  });
});
