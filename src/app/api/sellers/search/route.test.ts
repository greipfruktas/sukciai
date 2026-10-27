import { describe, expect, it } from "vitest";
import { createSearchHandler } from "./handler";

describe("seller search route", () => {
  it("rate limits before querying seller data", async () => {
    let queried = false;
    const handler = createSearchHandler({
      checkRateLimit: async () => false,
      search: async () => { queried = true; throw new Error("must not run"); },
    });
    const response = await handler(new Request("http://localhost/api/sellers/search", { method: "POST", body: JSON.stringify({ type: "phone", value: "+37069999999" }), headers: { "content-type": "application/json", "x-forwarded-for": "192.0.2.1" } }));
    expect(response.status).toBe(429);
    expect(queried).toBe(false);
  });

  it("returns a generic no-result response", async () => {
    const handler = createSearchHandler({
      checkRateLimit: async () => true,
      search: async () => ({ status: "none" as const, results: [], disclaimer: "Rezultato nebuvimas nereiškia, kad pardavėjas patikimas." }),
    });
    const response = await handler(new Request("http://localhost/api/sellers/search", { method: "POST", body: JSON.stringify({ type: "phone", value: "+37069999999" }), headers: { "content-type": "application/json" } }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "none", results: [], disclaimer: expect.any(String) });
  });

  it("rejects missing query parameters without running search", async () => {
    const handler = createSearchHandler({ checkRateLimit: async () => true, search: async () => { throw new Error("must not run"); } });
    expect((await handler(new Request("http://localhost/api/sellers/search", { method: "POST", body: "{}", headers: { "content-type": "application/json" } }))).status).toBe(400);
  });
});
