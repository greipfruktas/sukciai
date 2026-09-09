import type { AuthenticatedUser, UserRole } from "./roles";

export function sessionFromOidcClaims(claims: Record<string, unknown>): AuthenticatedUser | null {
  const id = typeof claims.sub === "string" ? claims.sub : undefined;
  const role = claims.role === "publisher" || claims.role === "viewer"
    ? claims.role as UserRole
    : undefined;
  const mfa = claims.amr;
  const hasMfa = Array.isArray(mfa) && mfa.some((method) => method === "mfa" || method === "otp");

  return id && role && hasMfa ? { id, role } : null;
}
