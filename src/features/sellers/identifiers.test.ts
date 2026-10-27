import { describe, expect, it } from "vitest";
import {
  createLookupHash,
  maskSellerIdentifier,
  normalizeSellerIdentifier,
} from "./identifiers";

describe("normalizeSellerIdentifier", () => {
  it.each([
    ["phone", " 8 612-34-567 ", "+37061234567"],
    ["phone", "+370 (612) 34 567", "+37061234567"],
    ["iban", "lt12 1000 0111 0100 1000", "LT121000011101001000"],
    ["company_code", " 123 456 789 ", "123456789"],
    ["name", "  ŽŪB   Šilas  ", "žūb šilas"],
    ["website", "Example.LT/paslaugos/?utm_source=fb#kaina", "https://example.lt/paslaugos"],
    ["facebook", "https://m.facebook.com/MediniaiSandeliai/?ref=share", "https://facebook.com/MediniaiSandeliai"],
  ] as const)("normalizes %s without losing identity", (type, input, expected) => {
    expect(normalizeSellerIdentifier(type, input)).toBe(expected);
  });

  it.each([
    ["phone", "123"],
    ["iban", "LT001"],
    ["company_code", "abc"],
    ["website", "javascript:alert(1)"],
    ["facebook", "https://example.com/not-facebook"],
  ] as const)("rejects invalid %s input", (type, input) => {
    expect(() => normalizeSellerIdentifier(type, input)).toThrow();
  });
});

describe("privacy-safe lookup", () => {
  it("produces a stable keyed hash for exact matching", () => {
    expect(createLookupHash("+37061234567", "test-secret")).toBe(
      "c20690507ccab8854d4f7e2ba5a7086457f08b1d01390075315bb27020f2681d",
    );
    expect(createLookupHash("+37061234568", "test-secret")).not.toBe(
      createLookupHash("+37061234567", "test-secret"),
    );
  });

  it.each([
    ["phone", "+37061234567", "+370 6•• ••567"],
    ["iban", "LT121000011101001000", "LT•• •••• •••• •••• 1000"],
  ] as const)("masks public %s values", (type, value, expected) => {
    expect(maskSellerIdentifier(type, value)).toBe(expected);
  });
});
