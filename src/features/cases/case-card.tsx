import Link from "next/link";
import { StatusLabel } from "./status-label";
import type { CaseStatus } from "./types";

export type CaseCardItem = {
  slug: string;
  title: string;
  summary: string;
  status: CaseStatus;
  statusDate: string;
  municipality: string;
  sourceCount: number;
};

export function CaseCard({ item, featured = false }: { item: CaseCardItem; featured?: boolean }) {
  return (
    <article className={featured ? "case-card case-card--featured" : "case-card"}>
      <p className="case-card__place">{item.municipality}</p>
      <h2><Link href={`/atvejai/${item.slug}`}>{item.title}</Link></h2>
      <p className="case-card__summary">{item.summary}</p>
      <div className="case-card__meta">
        <StatusLabel status={item.status} date={item.statusDate} />
        <span>{item.sourceCount} {item.sourceCount === 1 ? "šaltinis" : "šaltiniai"}</span>
      </div>
    </article>
  );
}
