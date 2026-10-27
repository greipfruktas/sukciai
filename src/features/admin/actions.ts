import { canPublish, type AuthenticatedUser } from "@/lib/auth/roles";
import { evaluateConsumerPublication, type ConsumerPublicationLevel } from "@/features/reports/moderation-policy";

export class AuthorizationError extends Error {
  constructor() {
    super("Publisher role is required");
    this.name = "AuthorizationError";
  }
}

interface Decision {
  caseId: string;
  action: "approve" | "reject";
  nextState: "published" | "rejected";
  reasonCodes: string[];
  policyVersion: "1.0.0";
  actorId: string;
  createdAt: Date;
}

export interface DecisionRepository {
  applyDecision(decision: Decision): Promise<void>;
}

export class DecisionConflictError extends Error {
  constructor() {
    super("Report decision version conflict");
    this.name = "DecisionConflictError";
  }
}

export type ConsumerDecisionAction = "reject" | "request_information" | "monitor" | "start_response" | "publish";

export interface ConsumerDecisionInput {
  reportId: string;
  action: ConsumerDecisionAction;
  reason: string;
  expectedVersion: number;
  publicationLevel?: ConsumerPublicationLevel;
}

export interface PublicationContext {
  verifiedReportCount: number;
  independentReporterCount: number;
  hasOfficialSource: boolean;
  hasUnresolvedConflict: boolean;
  responseDeadline: Date | null;
  urgentRisk: boolean;
}

export interface ConsumerDecisionRepository {
  loadPublicationContext(reportId: string): Promise<PublicationContext>;
  applyConsumerDecision(decision: ConsumerDecisionInput & { actorId: string; policyVersion: "consumer-1.0.0"; createdAt: Date }): Promise<void>;
}

export async function applyConsumerDecision(
  input: ConsumerDecisionInput,
  user: AuthenticatedUser,
  repository: ConsumerDecisionRepository,
  now = new Date(),
): Promise<void> {
  requirePublisher(user);
  const reason = input.reason.trim();
  if (!reason) throw new Error("Decision reason is required");
  if (input.action === "publish") {
    if (!input.publicationLevel) throw new Error("Publication level is required");
    const context = await repository.loadPublicationContext(input.reportId);
    const policy = evaluateConsumerPublication(context);
    if (policy.outcome === "block") throw new Error(`Publication blocked by policy: ${policy.reasons.join(", ")}`);
    const allowed = new Set<ConsumerPublicationLevel>([policy.maximumLevel]);
    if (context.verifiedReportCount >= 1 && context.independentReporterCount >= 1) allowed.add("verified_dispute");
    if (!allowed.has(input.publicationLevel)) throw new Error("Publication level exceeds trusted policy evidence");
    if (!context.urgentRisk && (!context.responseDeadline || now < context.responseDeadline)) throw new Error("Seller response deadline has not passed");
  }
  await repository.applyConsumerDecision({ ...input, reason, actorId: user.id, policyVersion: "consumer-1.0.0", createdAt: now });
}

function requirePublisher(user: AuthenticatedUser): void {
  if (!canPublish(user)) throw new AuthorizationError();
}

export async function approveDraft(
  caseId: string,
  user: AuthenticatedUser,
  repository: DecisionRepository,
): Promise<void> {
  requirePublisher(user);
  await repository.applyDecision({
    caseId,
    action: "approve",
    nextState: "published",
    reasonCodes: ["PUBLISHER_APPROVED"],
    policyVersion: "1.0.0",
    actorId: user.id,
    createdAt: new Date(),
  });
}

export async function rejectDraft(
  caseId: string,
  user: AuthenticatedUser,
  reason: string,
  repository: DecisionRepository,
): Promise<void> {
  requirePublisher(user);
  const normalizedReason = reason.trim();
  if (!normalizedReason) throw new Error("Rejection reason is required");
  await repository.applyDecision({
    caseId,
    action: "reject",
    nextState: "rejected",
    reasonCodes: [normalizedReason],
    policyVersion: "1.0.0",
    actorId: user.id,
    createdAt: new Date(),
  });
}
