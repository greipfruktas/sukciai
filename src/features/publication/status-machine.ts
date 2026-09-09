import type { CaseStatus } from "@/features/cases/types";

const allowedTransitions: Record<CaseStatus, ReadonlySet<CaseStatus>> = {
  institution_notice: new Set(["investigation_started", "investigation_closed"]),
  investigation_started: new Set([
    "suspected",
    "charged",
    "investigation_closed",
    "acquitted",
  ]),
  suspected: new Set(["charged", "investigation_closed", "acquitted"]),
  charged: new Set(["in_court", "investigation_closed", "acquitted"]),
  in_court: new Set(["non_final_decision", "final_decision", "acquitted"]),
  non_final_decision: new Set(["final_decision", "acquitted", "decision_changed"]),
  final_decision: new Set(["decision_changed", "acquitted"]),
  investigation_closed: new Set(["decision_changed"]),
  acquitted: new Set(["decision_changed"]),
  decision_changed: new Set([]),
};

export function canTransition(from: CaseStatus, to: CaseStatus): boolean {
  return allowedTransitions[from].has(to);
}
