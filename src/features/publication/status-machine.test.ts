import { describe, expect, it } from "vitest";
import { canTransition } from "./status-machine";

describe("case status transitions", () => {
  it("allows a case to record an acquittal after an investigation", () => {
    expect(canTransition("investigation_started", "acquitted")).toBe(true);
  });

  it("blocks reopening an acquitted case as the same proceeding", () => {
    expect(canTransition("acquitted", "investigation_started")).toBe(false);
  });

  it("allows a proceeding to progress to a final decision", () => {
    expect(canTransition("charged", "in_court")).toBe(true);
    expect(canTransition("in_court", "non_final_decision")).toBe(true);
    expect(canTransition("non_final_decision", "final_decision")).toBe(true);
  });

  it("allows an official decision to be changed", () => {
    expect(canTransition("final_decision", "decision_changed")).toBe(true);
  });

  it("does not treat an unchanged status as a transition", () => {
    expect(canTransition("in_court", "in_court")).toBe(false);
  });
});
