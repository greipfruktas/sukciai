import { describe, expect, it } from "vitest";
import { evaluatePublication, type PublicationInput } from "./policy";

function makeInput(
  status: PublicationInput["status"],
  sourceLevels: PublicationInput["sourceLevels"],
  hasConflict = false,
): PublicationInput {
  return {
    status,
    sourceLevels,
    hasConflict,
    everyClaimHasProvenance: true,
    bSourcesIndependent: true,
  };
}

describe("publication policy", () => {
  it.each([
    ["final_decision", ["A"], false, "publish", "ELIGIBLE_FINAL_OFFICIAL"],
    ["acquitted", ["A"], false, "publish", "ELIGIBLE_FINAL_OFFICIAL"],
    ["investigation_started", ["A"], false, "review", "SENSITIVE_STATUS"],
    ["final_decision", ["C"], false, "block", "C_LEVEL_ONLY"],
    ["final_decision", ["B"], false, "block", "INSUFFICIENT_B_SOURCES"],
    ["final_decision", ["B", "B"], false, "review", "MEDIA_ONLY"],
    ["final_decision", ["A"], true, "review", "SOURCE_CONFLICT"],
  ] as const)(
    "evaluates %s from %j as %s",
    (status, levels, conflict, expectedAction, expectedReason) => {
      const result = evaluatePublication(makeInput(status, [...levels], conflict));

      expect(result.action).toBe(expectedAction);
      expect(result.reasonCodes).toContain(expectedReason);
    },
  );

  it("blocks a draft when any claim lacks provenance", () => {
    const input = makeInput("final_decision", ["A"]);

    expect(
      evaluatePublication({ ...input, everyClaimHasProvenance: false }),
    ).toEqual({
      action: "block",
      reasonCodes: ["MISSING_PROVENANCE"],
      policyVersion: "1.0.0",
    });
  });

  it("does not count two dependent media reports as confirmation", () => {
    const input = makeInput("final_decision", ["B", "B"]);

    expect(
      evaluatePublication({ ...input, bSourcesIndependent: false }).action,
    ).toBe("block");
  });
});
