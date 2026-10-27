import { createLookupHash, normalizeSellerIdentifier, type SellerIdentifierType } from "./identifiers";

export const NO_RESULT_DISCLAIMER = "Rezultato nebuvimas nereiškia, kad pardavėjas patikimas. Prieš mokėdami patikrinkite sutartį, rekvizitus ir nepriklausomus šaltinius.";

export interface PublicSellerRecord {
  slug: string;
  displayName: string;
  status: "verified_dispute" | "repeated_pattern" | "official_process";
  summary: string;
  publishedAt: Date | null;
  identifiers: { type: SellerIdentifierType; maskedValue: string }[];
}

interface SearchDependencies {
  lookupKey: string;
  findByLookup: (type: SellerIdentifierType, lookupHash: string) => Promise<PublicSellerRecord[]>;
}

export interface SellerSearchResponse {
  status: "match" | "none";
  results: Omit<PublicSellerRecord, "publishedAt">[];
  disclaimer: string;
}

export async function searchPublishedSellers(
  query: { type: SellerIdentifierType; value: string },
  dependencies: SearchDependencies,
): Promise<SellerSearchResponse> {
  const normalized = normalizeSellerIdentifier(query.type, query.value);
  const lookupHash = createLookupHash(normalized, dependencies.lookupKey);
  const records = await dependencies.findByLookup(query.type, lookupHash);
  const results = records.filter((record) => record.publishedAt !== null).map((record) => ({
    slug: record.slug,
    displayName: record.displayName,
    status: record.status,
    summary: record.summary,
    identifiers: record.identifiers,
  }));
  return { status: results.length > 0 ? "match" : "none", results, disclaimer: NO_RESULT_DISCLAIMER };
}
