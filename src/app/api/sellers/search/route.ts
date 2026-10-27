import { NextResponse } from "next/server";
import type { SellerIdentifierType } from "@/features/sellers/identifiers";
import { NO_RESULT_DISCLAIMER, type SellerSearchResponse } from "@/features/sellers/search";
import { demoSeller } from "@/features/sellers/demo-data";

interface SearchHandlerDependencies {
  checkRateLimit: (key: string) => Promise<boolean>;
  search: (query: { type: SellerIdentifierType; value: string }) => Promise<SellerSearchResponse>;
}

const allowedTypes = new Set<SellerIdentifierType>(["phone", "iban", "company_code", "name", "website", "facebook"]);

export function createSearchHandler(dependencies: SearchHandlerDependencies) {
  return async function handler(request: Request) {
    const clientKey = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!(await dependencies.checkRateLimit(clientKey))) {
      return NextResponse.json({ error: "Per daug užklausų. Bandykite vėliau." }, { status: 429, headers: { "Retry-After": "60" } });
    }
    let payload: { type?: unknown; value?: unknown } = {};
    try { payload = await request.json(); } catch { return NextResponse.json({ error: "Netinkamas užklausos formatas." }, { status: 400 }); }
    const type = typeof payload.type === "string" ? payload.type as SellerIdentifierType : null;
    const value = typeof payload.value === "string" ? payload.value.trim() : "";
    if (!type || !allowedTypes.has(type) || !value) return NextResponse.json({ error: "Nurodykite paieškos tipą ir reikšmę." }, { status: 400 });
    try {
      return NextResponse.json(await dependencies.search({ type, value }), { headers: { "Cache-Control": "no-store" } });
    } catch {
      return NextResponse.json({ error: "Netinkama paieškos reikšmė." }, { status: 400 });
    }
  };
}

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
