import config from "../gatsby-config";

describe("gatsby-config Segment plugin", () => {
  it("does not configure the placeholder Segment development write key", () => {
    const segmentPlugin = config.plugins?.find(
      (plugin) =>
        typeof plugin === "object" &&
        plugin !== null &&
        "resolve" in plugin &&
        plugin.resolve === "gatsby-plugin-segment-js",
    );

    expect(segmentPlugin).toBeDefined();
    expect(
      segmentPlugin &&
        typeof segmentPlugin === "object" &&
        "options" in segmentPlugin &&
        segmentPlugin.options,
    ).not.toEqual(expect.objectContaining({ devKey: "SEGMENT_DEV_WRITE_KEY" }));
  });
});
