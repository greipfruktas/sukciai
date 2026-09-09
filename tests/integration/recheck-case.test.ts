import { expect, it, vi } from "vitest";
import { recheckCase } from "@/features/ingestion/jobs/recheck-case";

it("publishes an acquittal as a visible status and timeline update", async () => {
  const applyUpdate = vi.fn().mockResolvedValue(undefined);
  const result = await recheckCase("case-1", { loadCase: async () => ({ id: "case-1", status: "in_court", statusDate: "2025-01-01", primarySourceUrl: "https://teismai.lt/byla/1" }), checkSource: async () => ({ available: true, status: "acquitted", statusDate: "2026-09-09", sourceId: "source-2" }), applyUpdate, markSourceUnavailable: vi.fn() });
  expect(result).toEqual({ outcome: "updated", status: "acquitted" });
  expect(applyUpdate).toHaveBeenCalledWith(expect.objectContaining({ createTimelineEvent: true, createVersion: true, publicationState: "published" }));
});

it("marks a broken primary source unavailable without deleting the case", async () => {
  const markSourceUnavailable = vi.fn();
  const applyUpdate = vi.fn();
  const result = await recheckCase("case-1", { loadCase: async () => ({ id: "case-1", status: "final_decision", statusDate: "2025-01-01", primarySourceUrl: "https://teismai.lt/byla/1" }), checkSource: async () => ({ available: false, sourceId: "source-1" }), applyUpdate, markSourceUnavailable });
  expect(result).toEqual({ outcome: "source_unavailable" });
  expect(markSourceUnavailable).toHaveBeenCalledWith("source-1");
  expect(applyUpdate).not.toHaveBeenCalled();
});
