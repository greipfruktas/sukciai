import { describe, expect, it } from "vitest";
import { applyConsumerDecision, DecisionConflictError } from "./actions";

function repository() {
  let version = 1;
  const decisions: unknown[] = [];
  return {
    decisions,
    loadPublicationContext: async () => ({ verifiedReportCount: 1, independentReporterCount: 1, hasOfficialSource: false, hasUnresolvedConflict: false, responseDeadline: new Date("2026-10-26T00:00:00Z"), urgentRisk: false }),
    applyConsumerDecision: async (decision: { expectedVersion: number }) => {
      if (decision.expectedVersion !== version) throw new DecisionConflictError();
      decisions.push(decision);
      version += 1;
    },
  };
}

describe("consumer report decisions", () => {
  it("requires a publisher and records a rejection reason", async () => {
    const repo = repository();
    await expect(applyConsumerDecision({ reportId: "report-1", action: "reject", reason: "Dokumentai nepatvirtina mokėjimo", expectedVersion: 1 }, { id: "viewer", role: "viewer" }, repo)).rejects.toThrow(/Publisher/);
    await applyConsumerDecision({ reportId: "report-1", action: "reject", reason: "Dokumentai nepatvirtina mokėjimo", expectedVersion: 1 }, { id: "publisher", role: "publisher" }, repo);
    expect(repo.decisions).toEqual([expect.objectContaining({ action: "reject", actorId: "publisher", reason: "Dokumentai nepatvirtina mokėjimo" })]);
  });

  it("rejects a concurrent second decision using the same version", async () => {
    const repo = repository();
    const user = { id: "publisher", role: "publisher" as const };
    await applyConsumerDecision({ reportId: "report-1", action: "monitor", reason: "Laukiama antro pranešimo", expectedVersion: 1 }, user, repo);
    await expect(applyConsumerDecision({ reportId: "report-1", action: "publish", reason: "Patvirtinta", expectedVersion: 1, publicationLevel: "verified_dispute" }, user, repo)).rejects.toBeInstanceOf(DecisionConflictError);
  });

  it("rejects publication above the trusted policy result", async () => {
    const repo = repository();
    await expect(applyConsumerDecision({ reportId: "report-1", action: "publish", reason: "Nepakanka pagrindo", expectedVersion: 1, publicationLevel: "repeated_pattern" }, { id: "publisher", role: "publisher" }, repo, new Date("2026-10-27T00:00:00Z"))).rejects.toThrow(/policy/i);
  });

  it("rejects publication before the seller response deadline", async () => {
    const repo = repository();
    repo.loadPublicationContext = async () => ({ verifiedReportCount: 1, independentReporterCount: 1, hasOfficialSource: false, hasUnresolvedConflict: false, responseDeadline: new Date("2026-11-03T00:00:00Z"), urgentRisk: false });
    await expect(applyConsumerDecision({ reportId: "report-1", action: "publish", reason: "Per anksti", expectedVersion: 1, publicationLevel: "verified_dispute" }, { id: "publisher", role: "publisher" }, repo, new Date("2026-10-27T00:00:00Z"))).rejects.toThrow(/deadline/i);
  });
});
