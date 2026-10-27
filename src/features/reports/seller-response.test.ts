import { describe, expect, it } from "vitest";
import { startSellerResponsePeriod } from "./seller-response";

describe("seller response period", () => {
  it("sets a seven-calendar-day deadline", () => {
    expect(startSellerResponsePeriod({ contact: "info@example.lt", startedAt: new Date("2026-10-27T10:00:00Z"), urgentRisk: false })).toEqual({ deadline: new Date("2026-11-03T10:00:00.000Z"), mayPublishBeforeDeadline: false });
  });

  it("allows an administrator-recorded urgent-risk exception", () => {
    expect(startSellerResponsePeriod({ contact: "info@example.lt", startedAt: new Date("2026-10-27T10:00:00Z"), urgentRisk: true }).mayPublishBeforeDeadline).toBe(true);
  });

  it("requires a seller contact", () => {
    expect(() => startSellerResponsePeriod({ contact: " ", startedAt: new Date(), urgentRisk: false })).toThrow(/kontakt/i);
  });
});
