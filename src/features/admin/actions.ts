import { canPublish, type AuthenticatedUser } from "@/lib/auth/roles";

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
