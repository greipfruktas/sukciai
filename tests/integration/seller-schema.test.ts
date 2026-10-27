import { getTableColumns, getTableName } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/pg-core";
import { describe, expect, it } from "vitest";
import { sellerIdentifiers, sellerProfiles } from "../../src/lib/db/schema";

describe("seller privacy schema", () => {
  it("stores profiles separately from private identifiers", () => {
    expect(getTableName(sellerProfiles)).toBe("seller_profiles");
    expect(getTableName(sellerIdentifiers)).toBe("seller_identifiers");
    expect(Object.keys(getTableColumns(sellerIdentifiers))).toEqual(
      expect.arrayContaining([
        "sellerProfileId",
        "type",
        "encryptedValue",
        "lookupHash",
        "maskedValue",
      ]),
    );
  });

  it("uniquely indexes identifier type and exact lookup hash", () => {
    const config = getTableConfig(sellerIdentifiers);
    expect(config.indexes.some((index) => index.config.unique && index.config.columns.length === 2)).toBe(true);
  });
});
