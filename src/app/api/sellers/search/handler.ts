import { NextResponse } from "next/server";
import type { SellerIdentifierType } from "@/features/sellers/identifiers";
import type { SellerSearchResponse } from "@/features/sellers/search";

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
