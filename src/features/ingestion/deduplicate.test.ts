import { describe, expect, it } from "vitest";
import { canonicalizeSourceUrl, fingerprintSource } from "./deduplicate";

describe("source deduplication", () => {
  it("removes tracking parameters and fragments from canonical URLs", () => {
    expect(
      canonicalizeSourceUrl(
        "https://STT.lt/naujienos/tyrimas/?utm_source=facebook&fbclid=abc#daugiau",
      ),
    ).toBe("https://stt.lt/naujienos/tyrimas");
  });

  it("returns the same fingerprint for tracking variants", () => {
    const first = fingerprintSource({
      url: "https://stt.lt/naujienos/tyrimas?utm_campaign=ruduo",
      content: "Paskelbtas galutinis sprendimas.",
    });
    const second = fingerprintSource({
      url: "https://stt.lt/naujienos/tyrimas#tekstas",
      content: "Paskelbtas galutinis sprendimas.",
    });

    expect(first).toBe(second);
  });

  it("changes the fingerprint when the source text changes", () => {
    expect(
      fingerprintSource({ url: "https://stt.lt/a", content: "Pirmas tekstas" }),
    ).not.toBe(
      fingerprintSource({ url: "https://stt.lt/a", content: "Atnaujintas tekstas" }),
    );
  });
});
