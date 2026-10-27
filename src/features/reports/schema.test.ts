import { describe, expect, it } from "vitest";
import { consumerReportSchema } from "./schema";

const validReport = {
  reporter: { name: "Ona Onaitytė", email: "ona@example.lt", phone: "+37061234567" },
  sellerIdentifiers: [{ type: "phone" as const, value: "+37069999999" }],
  description: "Pardavėjas gavo avansą, tačiau sutarto statinio nepristatė.",
  amountCents: 125000,
  paymentDate: "2026-10-01",
  promisedDate: "2026-10-15",
  workStatus: "not_done" as const,
  officialReference: "ROIK 0123456789",
  authenticityConfirmed: true,
};

describe("consumerReportSchema", () => {
  it("accepts a complete evidence-backed report", () => {
    expect(consumerReportSchema.parse(validReport)).toMatchObject({ amountCents: 125000, workStatus: "not_done" });
  });

  it.each(["not_done", "partially_done", "late", "defective"] as const)("accepts the %s work state", (workStatus) => {
    expect(consumerReportSchema.parse({ ...validReport, workStatus }).workStatus).toBe(workStatus);
  });

  it("requires at least one seller identifier and authenticity confirmation", () => {
    expect(() => consumerReportSchema.parse({ ...validReport, sellerIdentifiers: [], authenticityConfirmed: false })).toThrow();
  });

  it.each([0, -1, 1_000_000_001])("rejects an out-of-range amount of %d cents", (amountCents) => {
    expect(() => consumerReportSchema.parse({ ...validReport, amountCents })).toThrow();
  });

  it("rejects a payment date in the future", () => {
    expect(() => consumerReportSchema.parse({ ...validReport, paymentDate: "2999-01-01" })).toThrow();
  });
});
