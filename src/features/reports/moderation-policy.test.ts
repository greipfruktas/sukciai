import { describe, expect, it } from "vitest";
import { evaluateConsumerPublication } from "./moderation-policy";

describe("consumer publication policy", () => {
  it("limits one verified report to a neutral dispute", () => {
    expect(evaluateConsumerPublication({ verifiedReportCount: 1, independentReporterCount: 1, hasOfficialSource: false, hasUnresolvedConflict: false })).toEqual({ outcome: "review", maximumLevel: "verified_dispute", reasons: ["ONE_VERIFIED_REPORT"] });
  });

  it("allows a repeated-pattern warning only for two independent verified reports", () => {
    expect(evaluateConsumerPublication({ verifiedReportCount: 2, independentReporterCount: 2, hasOfficialSource: false, hasUnresolvedConflict: false })).toEqual({ outcome: "review", maximumLevel: "repeated_pattern", reasons: ["TWO_INDEPENDENT_REPORTS"] });
    expect(evaluateConsumerPublication({ verifiedReportCount: 2, independentReporterCount: 1, hasOfficialSource: false, hasUnresolvedConflict: false }).maximumLevel).toBe("verified_dispute");
  });

  it("allows the exact official-process level when an official source exists", () => {
    expect(evaluateConsumerPublication({ verifiedReportCount: 0, independentReporterCount: 0, hasOfficialSource: true, hasUnresolvedConflict: false }).maximumLevel).toBe("official_process");
  });

  it("blocks publication when there is no verified basis or sources conflict", () => {
    expect(evaluateConsumerPublication({ verifiedReportCount: 0, independentReporterCount: 0, hasOfficialSource: false, hasUnresolvedConflict: false }).outcome).toBe("block");
    expect(evaluateConsumerPublication({ verifiedReportCount: 3, independentReporterCount: 3, hasOfficialSource: false, hasUnresolvedConflict: true }).outcome).toBe("block");
  });
});
