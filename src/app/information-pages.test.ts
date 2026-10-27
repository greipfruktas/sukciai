import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pages = ["metodika", "kontaktai", "privatumas"] as const;

describe("public information pages", () => {
  it.each(pages)("provides the /%s route", (slug) => {
    expect(existsSync(`src/app/${slug}/page.tsx`)).toBe(true);
  });

  it("states the editorial verification and source policy", () => {
    const page = readFileSync("src/app/metodika/page.tsx", "utf8");
    expect(page).toMatch(/neviešinamas automatiškai/i);
    expect(page).toMatch(/oficial/i);
    expect(page).toMatch(/šaltin/i);
    expect(page).toMatch(/atsakymo teis/i);
  });

  it("explains the current demo privacy boundary", () => {
    const page = readFileSync("src/app/privatumas/page.tsx", "utf8");
    expect(page).toMatch(/šiame įrenginyje/i);
    expect(page).toMatch(/į serverį nesiunčiami/i);
  });
});
