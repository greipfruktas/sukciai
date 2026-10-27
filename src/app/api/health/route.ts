import { NextResponse } from "next/server";
import { Pool } from "pg";
import { validateProductionEnvironment } from "@/lib/production-config";

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV === "production") validateProductionEnvironment(process.env);
  let database = "not_configured";
  if (process.env.DATABASE_URL) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1, connectionTimeoutMillis: 2_000 });
    try { await pool.query("select 1"); database = "ready"; } catch { database = "unavailable"; } finally { await pool.end(); }
  }
  const objectStorage = process.env.OBJECT_STORAGE_ENDPOINT && process.env.OBJECT_STORAGE_PUBLIC === "false" ? "private_configured" : "not_configured";
  const status = database === "unavailable" ? "degraded" : "ok";
  return NextResponse.json({ status, checks: { application: "ready", database, objectStorage }, timestamp: new Date().toISOString() }, { status: status === "ok" ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
