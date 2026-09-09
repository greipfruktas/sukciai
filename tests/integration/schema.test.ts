import { getTableColumns, getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import {
  claimSources,
  claims,
  publicationDecisions,
  sources,
} from "../../src/lib/db/schema";

describe("provenance schema", () => {
  it("stores claim-to-source evidence as a separate relation", () => {
    expect(getTableName(claims)).toBe("claims");
    expect(getTableName(sources)).toBe("sources");
    expect(getTableName(claimSources)).toBe("claim_sources");
    expect(Object.keys(getTableColumns(claimSources))).toEqual([
      "claimId",
      "sourceId",
      "supportingQuote",
    ]);
  });

  it("stores immutable publication decision evidence", () => {
    expect(Object.keys(getTableColumns(publicationDecisions))).toEqual(
      expect.arrayContaining(["caseId", "action", "reasonCodes", "policyVersion", "createdAt"]),
    );
  });
});
