import type { CaseStatus } from "./types";

const statusLabels: Record<CaseStatus, string> = {
  institution_notice: "Institucijos informacija",
  investigation_started: "Pradėtas tyrimas",
  suspected: "Pareikšti įtarimai",
  charged: "Pareikšti kaltinimai",
  in_court: "Nagrinėjama teisme",
  non_final_decision: "Neįsiteisėjęs sprendimas",
  final_decision: "Įsiteisėjęs sprendimas",
  investigation_closed: "Tyrimas nutrauktas",
  acquitted: "Išteisintas",
  decision_changed: "Sprendimas pakeistas",
};

export function StatusLabel({ status, date }: { status: CaseStatus; date?: string }) {
  return (
    <p className={`status-label status-label--${status}`}>
      <span>{statusLabels[status]}</span>
      {date ? <time dateTime={date}>{date}</time> : null}
    </p>
  );
}
