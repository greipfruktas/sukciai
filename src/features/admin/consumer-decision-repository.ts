import { and, eq, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { consumerReportDecisions, consumerReports, sellerProfiles } from "@/lib/db/schema";
import { DecisionConflictError, type ConsumerDecisionInput } from "./actions";

type AuditedDecision = ConsumerDecisionInput & {
  actorId: string;
  policyVersion: "consumer-1.0.0";
  createdAt: Date;
};

const nextStates = {
  reject: "rejected",
  request_information: "needs_information",
  monitor: "monitoring",
  start_response: "response_pending",
  publish: "published",
} as const;

export async function persistConsumerDecisionAtomically(
  decision: AuditedDecision,
  database = getDatabase(),
): Promise<void> {
  await database.transaction(async (transaction) => {
    const [updated] = await transaction.update(consumerReports).set({
      state: nextStates[decision.action],
      version: sql`${consumerReports.version} + 1`,
      updatedAt: decision.createdAt,
    }).where(and(eq(consumerReports.id, decision.reportId), eq(consumerReports.version, decision.expectedVersion))).returning({ sellerProfileId: consumerReports.sellerProfileId });

    if (!updated) throw new DecisionConflictError();

    await transaction.insert(consumerReportDecisions).values(decision);
    if (decision.action === "publish" && decision.publicationLevel && updated.sellerProfileId) {
      await transaction.update(sellerProfiles).set({ status: decision.publicationLevel, publishedAt: decision.createdAt, updatedAt: decision.createdAt }).where(eq(sellerProfiles.id, updated.sellerProfileId));
    }
  });
}
