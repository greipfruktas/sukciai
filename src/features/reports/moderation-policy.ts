export type ConsumerPublicationLevel = "verified_dispute" | "repeated_pattern" | "official_process";

interface ConsumerPublicationInput {
  verifiedReportCount: number;
  independentReporterCount: number;
  hasOfficialSource: boolean;
  hasUnresolvedConflict: boolean;
}

type ConsumerPublicationDecision =
  | { outcome: "block"; maximumLevel: null; reasons: string[] }
  | { outcome: "review"; maximumLevel: ConsumerPublicationLevel; reasons: string[] };

export function evaluateConsumerPublication(input: ConsumerPublicationInput): ConsumerPublicationDecision {
  if (input.hasUnresolvedConflict) return { outcome: "block", maximumLevel: null, reasons: ["UNRESOLVED_SOURCE_CONFLICT"] };
  if (input.hasOfficialSource) return { outcome: "review", maximumLevel: "official_process", reasons: ["OFFICIAL_SOURCE"] };
  if (input.verifiedReportCount >= 2 && input.independentReporterCount >= 2) {
    return { outcome: "review", maximumLevel: "repeated_pattern", reasons: ["TWO_INDEPENDENT_REPORTS"] };
  }
  if (input.verifiedReportCount >= 1 && input.independentReporterCount >= 1) {
    return { outcome: "review", maximumLevel: "verified_dispute", reasons: ["ONE_VERIFIED_REPORT"] };
  }
  return { outcome: "block", maximumLevel: null, reasons: ["NO_VERIFIED_BASIS"] };
}
