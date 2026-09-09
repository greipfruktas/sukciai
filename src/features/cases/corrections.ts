import { z } from "zod";

const correctionSchema = z.object({
  caseId: z.string().trim().min(1),
  claimantName: z.string().trim().min(2).max(120),
  claimantEmail: z.email().transform((value) => value.trim().toLowerCase()),
  disputedClaim: z.string().trim().min(3).max(2_000),
  evidence: z.string().trim().min(3).max(10_000),
});

export type CorrectionInput = z.input<typeof correctionSchema>;
export type StoredCorrection = z.output<typeof correctionSchema>;

export async function submitCorrection(input: CorrectionInput, dependencies: { save: (correction: StoredCorrection) => Promise<string> }) {
  const correction = correctionSchema.parse(input);
  const id = await dependencies.save(correction);
  return { id, status: "received" as const };
}
