import type { CaseStatus } from "@/features/cases/types";

export type SourceLevel = "A" | "B" | "C";
export type PublicationAction = "publish" | "review" | "block";
export type PublicationReason =
  | "MISSING_PROVENANCE"
  | "C_LEVEL_ONLY"
  | "INSUFFICIENT_B_SOURCES"
  | "DEPENDENT_B_SOURCES"
  | "SOURCE_CONFLICT"
  | "SENSITIVE_STATUS"
  | "MEDIA_ONLY"
  | "ELIGIBLE_FINAL_OFFICIAL";

export interface PublicationInput {
  status: CaseStatus;
  sourceLevels: SourceLevel[];
  hasConflict: boolean;
  everyClaimHasProvenance: boolean;
  bSourcesIndependent: boolean;
}

export interface PublicationResult {
  action: PublicationAction;
  reasonCodes: PublicationReason[];
  policyVersion: "1.0.0";
}

const finalStatuses = new Set<CaseStatus>([
  "final_decision",
  "investigation_closed",
  "acquitted",
  "decision_changed",
]);

function result(
  action: PublicationAction,
  ...reasonCodes: PublicationReason[]
): PublicationResult {
  return { action, reasonCodes, policyVersion: "1.0.0" };
}

export function evaluatePublication(input: PublicationInput): PublicationResult {
  if (!input.everyClaimHasProvenance || input.sourceLevels.length === 0) {
    return result("block", "MISSING_PROVENANCE");
  }

  const hasOfficialSource = input.sourceLevels.includes("A");
  const mediaSourceCount = input.sourceLevels.filter((level) => level === "B").length;

  if (!hasOfficialSource && mediaSourceCount === 0) {
    return result("block", "C_LEVEL_ONLY");
  }

  if (!hasOfficialSource && mediaSourceCount < 2) {
    return result("block", "INSUFFICIENT_B_SOURCES");
  }

  if (!hasOfficialSource && !input.bSourcesIndependent) {
    return result("block", "DEPENDENT_B_SOURCES");
  }

  if (input.hasConflict) {
    return result("review", "SOURCE_CONFLICT");
  }

  if (!hasOfficialSource) {
    return result("review", "MEDIA_ONLY");
  }

  if (!finalStatuses.has(input.status)) {
    return result("review", "SENSITIVE_STATUS");
  }

  return result("publish", "ELIGIBLE_FINAL_OFFICIAL");
}
