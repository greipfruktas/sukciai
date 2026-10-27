import { NextResponse } from "next/server";
import { NO_RESULT_DISCLAIMER } from "@/features/sellers/search";
import { demoSeller } from "@/features/sellers/demo-data";
import { createSearchHandler } from "./handler";

const windows = new Map<string, { count: number; resetAt: number }>();
async function checkRateLimit(key: string) {
  const now = Date.now();
  const current = windows.get(key);
  if (!current || current.resetAt <= now) { windows.set(key, { count: 1, resetAt: now + 60_000 }); return true; }
  if (current.count >= 20) return false;
  current.count += 1;
  return true;
}

export const POST = createSearchHandler({
  checkRateLimit,
  search: async ({ type, value }) => {
    if (process.env.NODE_ENV !== "production" && type === "company_code" && value.replace(/\D/g, "") === "123456789") {
      const { publishedAt: _publishedAt, timeline: _timeline, sellerResponse: _sellerResponse, sources: _sources, ...result } = demoSeller;
      void _publishedAt; void _timeline; void _sellerResponse; void _sources;
      return { status: "match", results: [result], disclaimer: NO_RESULT_DISCLAIMER };
    }
    return { status: "none", results: [], disclaimer: NO_RESULT_DISCLAIMER };
  },
});

export function GET() {
  return NextResponse.json({ error: "Naudokite POST, kad jautrūs identifikatoriai nepatektų į URL žurnalus." }, { status: 405, headers: { Allow: "POST", "Cache-Control": "no-store" } });
}
