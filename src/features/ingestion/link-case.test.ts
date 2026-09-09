import { describe, expect, it } from "vitest";
import { linkCase } from "./link-case";

describe("linkCase", () => {
  it("links an exact official case number", () => {
    expect(
      linkCase(
        { caseNumber: "A-42/2026", people: ["Jonas Jonaitis"], eventDate: "2026-09-08" },
        [{ id: "case-1", caseNumber: "A-42/2026", people: ["Kitas Asmuo"], lastEventDate: "2025-01-01" }],
      ),
    ).toEqual({ kind: "existing", caseId: "case-1", reason: "case_number" });
  });

  it("does not merge people with the same surname without an exact identity match", () => {
    expect(
      linkCase(
        { people: ["Jonas Jonaitis"], eventDate: "2026-09-08" },
        [{ id: "case-1", people: ["Petras Jonaitis"], lastEventDate: "2026-09-07" }],
      ),
    ).toEqual({ kind: "new", reason: "no_safe_match" });
  });
});
