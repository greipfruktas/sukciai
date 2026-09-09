import type { CaseStatus } from "@/features/cases/types";

interface CurrentCase { id: string; status: CaseStatus; statusDate: string; primarySourceUrl: string }
interface SourceCheck { available: boolean; sourceId: string; status?: CaseStatus; statusDate?: string }
interface Dependencies {
  loadCase: (caseId: string) => Promise<CurrentCase | undefined>;
  checkSource: (url: string) => Promise<SourceCheck>;
  applyUpdate: (update: { caseId: string; status: CaseStatus; statusDate: string; sourceId: string; publicationState: "published"; createTimelineEvent: true; createVersion: true }) => Promise<void>;
  markSourceUnavailable: (sourceId: string) => void | Promise<void>;
}

export async function recheckCase(caseId: string, dependencies: Dependencies) {
  const current = await dependencies.loadCase(caseId);
  if (!current) return { outcome: "not_found" as const };
  const checked = await dependencies.checkSource(current.primarySourceUrl);
  if (!checked.available) { await dependencies.markSourceUnavailable(checked.sourceId); return { outcome: "source_unavailable" as const }; }
  if (!checked.status || !checked.statusDate || (checked.status === current.status && checked.statusDate === current.statusDate)) return { outcome: "unchanged" as const };
  await dependencies.applyUpdate({ caseId, status: checked.status, statusDate: checked.statusDate, sourceId: checked.sourceId, publicationState: "published", createTimelineEvent: true, createVersion: true });
  return { outcome: "updated" as const, status: checked.status };
}
