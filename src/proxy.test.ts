import { describe, expect, it } from "vitest";
import { shouldRedirectToHoldingPage } from "./proxy";

describe("pre-launch route gate", () => {
  it("redirects public, demo and admin routes while holding mode is active", () => {
    for (const path of ["/pranesti", "/pardavejai/demo", "/admin/review", "/api/sellers/search"]) {
      expect(shouldRedirectToHoldingPage(path, undefined)).toBe(true);
    }
  });

  it("keeps the landing page public and allows all routes in explicit demo mode", () => {
    expect(shouldRedirectToHoldingPage("/", undefined)).toBe(false);
    expect(shouldRedirectToHoldingPage("/admin/review", "demo")).toBe(false);
  });
});
