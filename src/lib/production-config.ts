import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.literal("production"),
  DATABASE_URL: z.string().url(),
  IDENTIFIER_HASH_SECRET: z.string().min(32),
  OIDC_ISSUER: z.string().url(),
  OIDC_CLIENT_ID: z.string().min(1),
  OIDC_CLIENT_SECRET: z.string().min(32),
  OBJECT_STORAGE_ENDPOINT: z.string().url(),
  OBJECT_STORAGE_BUCKET: z.string().min(1),
  OBJECT_STORAGE_ACCESS_KEY: z.string().min(1),
  OBJECT_STORAGE_SECRET_KEY: z.string().min(32),
  OBJECT_STORAGE_PUBLIC: z.enum(["false"]),
});

export function validateProductionEnvironment(environment: Record<string, string | undefined>) {
  const parsed = schema.safeParse(environment);
  if (!parsed.success) throw new Error(`Invalid production environment: ${parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")}. Object storage must remain private.`);
  return parsed.data;
}
