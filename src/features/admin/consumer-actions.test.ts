import { describe, expect, it } from "vitest";
import { applyConsumerDecision, DecisionConflictError } from "./actions";

function repository() {
  let version = 1;
  const decisions: unknown[] = [];
  return {
    decisions,
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
});
