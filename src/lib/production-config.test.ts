import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { validateProductionEnvironment } from "./production-config";

const read = (path: string) => readFileSync(path, "utf8");

describe("production deployment configuration", () => {
  it("rejects missing secrets and public object storage", () => {
    expect(() => validateProductionEnvironment({ NODE_ENV: "production" })).toThrow(/DATABASE_URL/);
    expect(() => validateProductionEnvironment({ NODE_ENV: "production", DATABASE_URL: "postgresql://db", IDENTIFIER_HASH_SECRET: "x".repeat(32), OIDC_ISSUER: "https://id.example", OIDC_CLIENT_ID: "client", OIDC_CLIENT_SECRET: "x".repeat(32), OBJECT_STORAGE_ENDPOINT: "https://s3.example", OBJECT_STORAGE_BUCKET: "evidence", OBJECT_STORAGE_ACCESS_KEY: "key", OBJECT_STORAGE_SECRET_KEY: "x".repeat(32), OBJECT_STORAGE_PUBLIC: "true" })).toThrow(/private/);
  });

  it("defines separate web, worker, database, object storage, migration and TLS services", () => {
    const compose = read("docker-compose.production.yml");
    for (const service of ["web:", "worker:", "postgres:", "minio:", "migrate:", "backup:", "caddy:"]) expect(compose).toContain(service);
    expect(read("Dockerfile")).toContain("npm run build");
    expect(read("deploy/Caddyfile")).toContain("reverse_proxy web:3000");
  });

  it("documents and scripts encrypted backups and restore verification", () => {
    expect(read("deploy/backup-postgres.sh")).toMatch(/pg_dump/);
    expect(read("deploy/backup-postgres.sh")).toMatch(/age/);
    expect(read("deploy/backup.Dockerfile")).toMatch(/apk add --no-cache age/);
    expect(read("drizzle/0001_chilly_caretaker.sql")).toMatch(/CREATE TABLE "consumer_reports"/);
    expect(read("drizzle/0001_chilly_caretaker.sql")).toMatch(/"version" integer DEFAULT 1 NOT NULL/);
    expect(read("docs/hostinger-deployment.md")).toMatch(/atkūrimo bandym/i);
  });
});
