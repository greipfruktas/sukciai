import { describe, expect, it } from "vitest";
import { ingestSource } from "./ingest-source";

describe("ingestSource", () => {
  it("stores a sanitized snapshot for a registered source", async () => {
    const saved: unknown[] = [];
    const result = await ingestSource(
      {
        id: "source-1",
        url: "https://stt.lt/pranesimas",
        registry: [{ hostname: "stt.lt", level: "A", publisher: "STT" }],
      },
      {
        fetcher: async () =>
          new Response("<main>Sprendimas</main><script>bad()</script>", {
            headers: { "content-type": "text/html" },
          }),
        saveSnapshot: async (snapshot) => {
          saved.push(snapshot);
          return "snapshot-9";
        },
      },
    );

    expect(result).toEqual({ snapshotId: "snapshot-9", duplicate: false });
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({
      sourceId: "source-1",
      content: "<main>Sprendimas</main>",
    });
  });

  it("does not store a duplicate checksum", async () => {
    const result = await ingestSource(
      {
        id: "source-1",
        url: "https://stt.lt/pranesimas",
        registry: [{ hostname: "stt.lt", level: "A", publisher: "STT" }],
      },
      {
        fetcher: async () =>
          new Response("Sprendimas", { headers: { "content-type": "text/plain" } }),
        findSnapshotByChecksum: async () => "existing-snapshot",
        saveSnapshot: async () => {
          throw new Error("duplicate must not be saved");
        },
      },
    );

    expect(result).toEqual({ snapshotId: "existing-snapshot", duplicate: true });
  });
});
