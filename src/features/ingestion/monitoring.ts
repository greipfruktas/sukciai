export type MonitoringSeverity = "warning" | "critical";
export interface MonitoringIssue { code: "queue_failure" | "stale_case" | "broken_primary_link" | "publication_failure"; severity: MonitoringSeverity; id: string }

export function createMonitoringReport(issues: MonitoringIssue[]) {
  return { checkedAt: new Date().toISOString(), healthy: !issues.some((issue) => issue.severity === "critical"), counts: { total: issues.length, critical: issues.filter((issue) => issue.severity === "critical").length }, issues };
}
