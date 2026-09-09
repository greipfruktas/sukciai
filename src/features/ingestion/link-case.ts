interface CaseCandidate {
  caseNumber?: string;
  people: string[];
  eventDate: string;
}

interface ExistingCase {
  id: string;
  caseNumber?: string;
  people: string[];
  lastEventDate: string;
}

export type CaseMatch =
  | { kind: "existing"; caseId: string; reason: "case_number" }
  | { kind: "new"; reason: "no_safe_match" };

export function linkCase(
  candidate: CaseCandidate,
  existingCases: readonly ExistingCase[],
): CaseMatch {
  if (candidate.caseNumber) {
    const exact = existingCases.find(
      (item) => item.caseNumber?.toLocaleUpperCase("lt-LT") === candidate.caseNumber?.toLocaleUpperCase("lt-LT"),
    );
    if (exact) return { kind: "existing", caseId: exact.id, reason: "case_number" };
  }

  return { kind: "new", reason: "no_safe_match" };
}
