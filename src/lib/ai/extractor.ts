import { z } from "zod";
import type { LanguageModelProvider } from "./provider";
import { extractionSystemPrompt, summarySystemPrompt } from "./prompts";

const statusSchema = z.enum([
  "institution_notice", "investigation_started", "suspected", "charged",
  "in_court", "non_final_decision", "final_decision",
  "investigation_closed", "acquitted", "decision_changed",
]);

const claimSchema = z.object({
  text: z.string().min(1),
  sourceSnapshotId: z.string().min(1),
  supportingQuote: z.string().min(1),
  eventDate: z.iso.date(),
  people: z.array(z.string()),
  institutions: z.array(z.string()),
  statusCandidate: statusSchema,
}).strict();

const extractionSchema = z.object({ claims: z.array(claimSchema) }).strict();
const summarySchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  claimIndexes: z.array(z.int().nonnegative()).min(1),
}).strict();

export type ExtractedClaim = z.infer<typeof claimSchema>;
export type DraftSummary = z.infer<typeof summarySchema>;

export class GroundingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GroundingError";
  }
}

function parseModelOutput<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success) throw new Error(`Invalid model output: ${result.error.message}`);
  return result.data;
}

export async function extractClaims(
  snapshot: { id: string; content: string },
  provider: LanguageModelProvider,
): Promise<{ claims: ExtractedClaim[] }> {
  const output = await provider.generateJson({
    system: extractionSystemPrompt,
    input: JSON.stringify(snapshot),
  });
  const parsed = parseModelOutput(extractionSchema, output);

  for (const claim of parsed.claims) {
    if (claim.sourceSnapshotId !== snapshot.id) {
      throw new GroundingError("Claim references a different source snapshot");
    }
    if (!snapshot.content.includes(claim.supportingQuote)) {
      throw new GroundingError("Supporting quote is absent from the source snapshot");
    }
  }

  return parsed;
}

const accusatoryTerms = /\b(sukčius|sukčiai|pavogė|nusikaltėlis|nusikaltėlė)\b/iu;

export async function buildSummary(
  claims: readonly ExtractedClaim[],
  provider: LanguageModelProvider,
): Promise<DraftSummary> {
  const output = await provider.generateJson({
    system: summarySystemPrompt,
    input: JSON.stringify(claims),
  });
  const summary = parseModelOutput(summarySchema, output);

  if (summary.claimIndexes.some((index) => !claims[index])) {
    throw new GroundingError("Summary references an unknown claim");
  }
  if (accusatoryTerms.test(`${summary.title} ${summary.body}`)) {
    throw new GroundingError("Summary contains prohibited accusatory wording");
  }
  return summary;
}
