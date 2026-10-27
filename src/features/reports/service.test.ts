import { describe, expect, it } from "vitest";
import { submitConsumerReport } from "./service";

const input = {
  reporter: { name: "Ona Onaitytė", email: "ona@example.lt", phone: "+37061234567" },
  sellerIdentifiers: [{ type: "phone" as const, value: "+37069999999" }],
  description: "Pardavėjas gavo avansą, tačiau sutarto statinio nepristatė.",
  amountCents: 125000,
  paymentDate: "2026-10-01",
  promisedDate: "2026-10-15",
  workStatus: "not_done" as const,
  officialReference: "ROIK 0123456789",
  authenticityConfirmed: true as const,
};

function dependencies(overrides: Record<string, unknown> = {}) {
  return {
    lookupKey: "test-key",
    encrypt: (value: string) => `encrypted:${value}`,
    getReporterVerification: async () => ({ emailVerified: true, phoneVerified: true }),
    saveIdempotently: async () => ({ id: "report-1", duplicate: false }),
    ...overrides,
  };
}

describe("submitConsumerReport", () => {
  it("requires verified reporter email and phone", async () => {
    await expect(submitConsumerReport(input, dependencies({ getReporterVerification: async () => ({ emailVerified: true, phoneVerified: false }) }))).rejects.toThrow(/telefon/i);
  });

  it("returns the existing report for an idempotent duplicate", async () => {
    await expect(submitConsumerReport(input, dependencies({ saveIdempotently: async () => ({ id: "report-existing", duplicate: true }) }))).resolves.toEqual({ id: "report-existing", duplicate: true });
  });

  it("stores normalized identifier hashes without returning private values", async () => {
    let saved: unknown;
    const result = await submitConsumerReport(input, dependencies({ saveIdempotently: async (record: unknown) => { saved = record; return { id: "report-1", duplicate: false }; } }));
    expect(saved).toMatchObject({ identifiers: [{ type: "phone", maskedValue: "+370 6•• ••999" }] });
    expect(saved).not.toHaveProperty("identifiers.0.value");
    expect(result).toEqual({ id: "report-1", duplicate: false });
  });
});
