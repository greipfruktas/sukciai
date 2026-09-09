import { describe, expect, it } from "vitest";
import { approveDraft, AuthorizationError, rejectDraft } from "./actions";

function repository() {
  const decisions: unknown[] = [];
  const states = new Map<string, string>();
  return {
    decisions,
    states,
    applyDecision: async (decision: { caseId: string; nextState: string }) => {
      decisions.push(decision);
      states.set(decision.caseId, decision.nextState);
    },
  };
}

describe("administrator publication actions", () => {
  it("denies approval to a viewer", async () => {
    await expect(
      approveDraft("case-1", { id: "user-1", role: "viewer" }, repository()),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("publishes an approved draft and records the actor", async () => {
    const repo = repository();

    await approveDraft("case-1", { id: "publisher-1", role: "publisher" }, repo);

    expect(repo.states.get("case-1")).toBe("published");
    expect(repo.decisions).toEqual([
      expect.objectContaining({
        caseId: "case-1",
        action: "approve",
        actorId: "publisher-1",
      }),
    ]);
  });

  it("keeps a rejected draft private and requires a reason", async () => {
    const repo = repository();

    await rejectDraft(
      "case-2",
      { id: "publisher-1", role: "publisher" },
      "Šaltiniai prieštarauja",
      repo,
    );

    expect(repo.states.get("case-2")).toBe("rejected");
    expect(repo.decisions).toEqual([
      expect.objectContaining({ reasonCodes: ["Šaltiniai prieštarauja"] }),
    ]);
  });
});
