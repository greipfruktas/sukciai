export type UserRole = "viewer" | "publisher";

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
}

export function canPublish(user: AuthenticatedUser): boolean {
  return user.role === "publisher";
}
