import { NextResponse } from "next/server";
import type { SellerIdentifierType } from "@/features/sellers/identifiers";
import { NO_RESULT_DISCLAIMER, type SellerSearchResponse } from "@/features/sellers/search";

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
    const url = new URL(request.url);
    const type = url.searchParams.get("type") as SellerIdentifierType | null;
    const value = url.searchParams.get("q")?.trim();
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

export const GET = createSearchHandler({
  checkRateLimit,
  search: async () => ({ status: "none", results: [], disclaimer: NO_RESULT_DISCLAIMER }),
});
