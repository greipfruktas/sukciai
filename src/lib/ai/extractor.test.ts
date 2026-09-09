import { describe, expect, it } from "vitest";
import { buildSummary, extractClaims, GroundingError } from "./extractor";
import type { LanguageModelProvider } from "./provider";

function providerReturning(value: unknown): LanguageModelProvider {
  return { generateJson: async () => value };
}

describe("extractClaims", () => {
  it("accepts a claim tied to the supplied snapshot and quote", async () => {
    const result = await extractClaims(
      {
        id: "snapshot-1",
        content: "Teismas 2026 m. rugsėjo 8 d. paskelbė galutinį sprendimą.",
      },
      providerReturning({
        claims: [{
          text: "Teismas paskelbė galutinį sprendimą.",
          sourceSnapshotId: "snapshot-1",
          supportingQuote: "paskelbė galutinį sprendimą",
          eventDate: "2026-09-08",
          people: [],
          institutions: ["Teismas"],
          statusCandidate: "final_decision",
        }],
      }),
    );

    expect(result.claims[0]).toMatchObject({
      sourceSnapshotId: "snapshot-1",
      eventDate: "2026-09-08",
      statusCandidate: "final_decision",
    });
  });

  it("rejects a quote absent from the source snapshot", async () => {
    await expect(
      extractClaims(
        { id: "snapshot-1", content: "Pradėtas tyrimas." },
        providerReturning({
          claims: [{
            text: "Asmuo pripažintas kaltu.",
            sourceSnapshotId: "snapshot-1",
            supportingQuote: "pripažintas kaltu",
            eventDate: "2026-09-08",
            people: [],
            institutions: [],
            statusCandidate: "final_decision",
          }],
        }),
      ),
    ).rejects.toBeInstanceOf(GroundingError);
  });

  it("rejects malformed model output", async () => {
    await expect(
      extractClaims(
        { id: "snapshot-1", content: "Pradėtas tyrimas." },
        providerReturning({ claims: [{ text: "Pradėtas tyrimas." }] }),
      ),
    ).rejects.toThrow(/invalid model output/i);
  });
});

describe("buildSummary", () => {
  const claims = [{
    text: "Teismas paskelbė sprendimą.",
    sourceSnapshotId: "snapshot-1",
    supportingQuote: "paskelbė sprendimą",
    eventDate: "2026-09-08",
    people: [],
    institutions: ["Teismas"],
    statusCandidate: "final_decision" as const,
  }];

  it("accepts a summary composed from approved claim identifiers", async () => {
    const summary = await buildSummary(
      claims,
      providerReturning({
        title: "Teismas paskelbė sprendimą",
        body: "Teismas paskelbė sprendimą.",
        claimIndexes: [0],
      }),
    );

    expect(summary.claimIndexes).toEqual([0]);
  });

  it("rejects a summary that cites a nonexistent claim", async () => {
    await expect(
      buildSummary(
        claims,
        providerReturning({ title: "Antraštė", body: "Tekstas", claimIndexes: [1] }),
      ),
    ).rejects.toBeInstanceOf(GroundingError);
  });

  it("rejects accusatory wording that the source does not establish", async () => {
    await expect(
      buildSummary(
        claims,
        providerReturning({
          title: "Sukčius pagaliau nuteistas",
          body: "Teismas paskelbė sprendimą.",
          claimIndexes: [0],
        }),
      ),
    ).rejects.toBeInstanceOf(GroundingError);
  });
});
