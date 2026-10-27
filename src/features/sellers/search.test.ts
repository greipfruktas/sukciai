import { describe, expect, it } from "vitest";
import { searchPublishedSellers } from "./search";

const published = {
  slug: "mediniai-statiniai",
  displayName: "Medinių statinių veikla",
  status: "verified_dispute" as const,
  summary: "Redakcijos patikrintas vartotojo ginčas.",
  publishedAt: new Date("2026-10-20T00:00:00Z"),
  identifiers: [
    { type: "phone" as const, maskedValue: "+370 6•• ••999" },
    { type: "iban" as const, maskedValue: "LT•• •••• •••• •••• 1000" },
  ],
};

describe("searchPublishedSellers", () => {
  it.each([
    ["phone", "+37069999999"],
    ["iban", "LT121000011101001000"],
    ["company_code", "123456789"],
    ["name", "Mediniai statiniai"],
    ["website", "https://example.lt"],
    ["facebook", "https://facebook.com/MediniaiSandeliai"],
  ] as const)("finds a published exact %s match", async (type, value) => {
    const response = await searchPublishedSellers({ type, value }, { lookupKey: "key", findByLookup: async () => [published] });
    expect(response.status).toBe("match");
    expect(response.results[0]).toMatchObject({ slug: published.slug, identifiers: published.identifiers });
    expect(JSON.stringify(response)).not.toContain("+37069999999");
    expect(JSON.stringify(response)).not.toContain("LT121000011101001000");
  });

  it("does not reveal an unpublished-only match", async () => {
    const response = await searchPublishedSellers({ type: "phone", value: "+37069999999" }, { lookupKey: "key", findByLookup: async () => [{ ...published, publishedAt: null }] });
    expect(response).toEqual({ status: "none", results: [], disclaimer: expect.stringMatching(/nereiškia.*patikimas/i) });
  });

  it("returns the same response keys for matches and misses", async () => {
    const deps = { lookupKey: "key", findByLookup: async () => [] };
    const miss = await searchPublishedSellers({ type: "phone", value: "+37069999999" }, deps);
    const match = await searchPublishedSellers({ type: "phone", value: "+37069999999" }, { ...deps, findByLookup: async () => [published] });
    expect(Object.keys(miss)).toEqual(Object.keys(match));
  });
});
