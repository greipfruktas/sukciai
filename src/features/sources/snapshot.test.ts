import { describe, expect, it } from "vitest";
import { createSnapshotInput } from "./snapshot";

describe("createSnapshotInput", () => {
  it("preserves provenance metadata with fetched content", () => {
    expect(
      createSnapshotInput("source-1", {
        canonicalUrl: "https://stt.lt/pranesimas",
        content: "<main>Sprendimas</main>",
        checksum: "abc123",
        contentType: "text/html",
      }),
    ).toEqual({
      sourceId: "source-1",
      content: "<main>Sprendimas</main>",
      metadata: {
        canonicalUrl: "https://stt.lt/pranesimas",
        checksum: "abc123",
        contentType: "text/html",
      },
    });
  });
});
