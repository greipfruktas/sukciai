import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  const database = process.env.DATABASE_URL ? "configured" : "not_configured";
  return NextResponse.json({ status: "ok", checks: { application: "ready", database }, timestamp: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } });
}
