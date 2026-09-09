import { describe, expect, it, vi } from "vitest";
import { submitCorrection } from "./corrections";

describe("submitCorrection", () => {
  it("normalizes and records a complete correction request", async () => {
    const save = vi.fn().mockResolvedValue("correction-1");
    const result = await submitCorrection({ caseId: "case-1", claimantName: "  Ona  ", claimantEmail: "ONA@example.lt", disputedClaim: "Netiksli data", evidence: "https://teismai.lt/dokumentas" }, { save });
    expect(result).toEqual({ id: "correction-1", status: "received" });
    expect(save).toHaveBeenCalledWith(expect.objectContaining({ claimantName: "Ona", claimantEmail: "ona@example.lt" }));
  });

  it("rejects incomplete submissions", async () => {
    await expect(submitCorrection({ caseId: "", claimantName: "", claimantEmail: "blogai", disputedClaim: "", evidence: "" }, { save: vi.fn() })).rejects.toThrow();
  });
});
