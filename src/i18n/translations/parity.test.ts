import { enGB } from "./en-GB";
import { enUS } from "./en-US";
import { zhHans } from "./zh-Hans";
import { esES } from "./es-ES";

// Recursively flatten a nested object into a sorted array of dot-path keys.
// e.g. { nav: { about: "About" } } -> ["nav.about"]
function flattenKeys(obj: object, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      return flattenKeys(value as object, fullKey);
    }
    return [fullKey];
  });
}

// Recursively collect every leaf value (strings, numbers, booleans) from a
// nested object.
function collectLeafValues(obj: object): unknown[] {
  return Object.values(obj).flatMap((value) => {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      return collectLeafValues(value as object);
    }
    return [value];
  });
}

const baseKeys = flattenKeys(enGB).sort();

const dictionaries: Array<{ name: string; dict: typeof enGB }> = [
  { name: "en-US", dict: enUS },
  { name: "zh-Hans", dict: zhHans },
  { name: "es-ES", dict: esES },
];

describe("Translation dictionary key parity", () => {
  it("en-GB dictionary itself has no empty-string leaf values", () => {
    const emptyLeaves = collectLeafValues(enGB).filter(
      (v) => typeof v === "string" && v === "",
    );
    expect(emptyLeaves).toHaveLength(0);
  });

  for (const { name, dict } of dictionaries) {
    describe(`${name}`, () => {
      it(`has exactly the same set of keys as en-GB`, () => {
        const keys = flattenKeys(dict).sort();
        expect(keys).toEqual(baseKeys);
      });

      it(`has no empty-string leaf values`, () => {
        const emptyLeaves = collectLeafValues(dict).filter(
          (v) => typeof v === "string" && v === "",
        );
        expect(emptyLeaves).toHaveLength(0);
      });
    });
  }
});
