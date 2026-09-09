import { describe, expect, it } from "vitest";
import { fetchSource, SourceFetchError } from "./fetch-source";

const registry = [
  { hostname: "stt.lt", level: "A" as const, publisher: "STT" },
  { hostname: "teismai.lt", level: "A" as const, publisher: "Lietuvos teismai" },
];

describe("fetchSource", () => {
  it("rejects a hostname outside the source registry before requesting it", async () => {
    let requested = false;

    await expect(
      fetchSource("https://example.com/post", registry, async () => {
        requested = true;
        return new Response("unused");
      }),
    ).rejects.toMatchObject<Partial<SourceFetchError>>({ code: "HOST_NOT_ALLOWED" });
    expect(requested).toBe(false);
  });

  it("rejects a redirect to a hostname outside the registry", async () => {
    await expect(
      fetchSource("https://stt.lt/post", registry, async () =>
        new Response(null, {
          status: 302,
          headers: { location: "https://example.com/copy" },
        }),
      ),
    ).rejects.toMatchObject<Partial<SourceFetchError>>({ code: "REDIRECT_NOT_ALLOWED" });
  });

  it("removes executable markup and records the canonical URL", async () => {
    const html = '<main><h1>Sprendimas</h1></main><script>alert("x")</script>';
    const result = await fetchSource(
      "https://STT.lt/pranesimas?utm_source=newsletter#top",
      registry,
      async () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    );

    expect(result.canonicalUrl).toBe("https://stt.lt/pranesimas");
    expect(result.content).toContain("Sprendimas");
    expect(result.content).not.toContain("script");
    expect(result.content).not.toContain("alert");
    expect(result.checksum).toMatch(/^[a-f0-9]{64}$/);
  });
});
