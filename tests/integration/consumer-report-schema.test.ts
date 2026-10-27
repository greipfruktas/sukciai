import { getTableColumns, getTableName } from "drizzle-orm";
import { expect, it } from "vitest";
import { consumerReports, evidenceFiles, reporterVerifications } from "../../src/lib/db/schema";

it("keeps reports, reporter verification and evidence in separate private tables", () => {
  expect(getTableName(consumerReports)).toBe("consumer_reports");
  expect(getTableName(evidenceFiles)).toBe("evidence_files");
  expect(getTableName(reporterVerifications)).toBe("reporter_verifications");
  expect(Object.keys(getTableColumns(evidenceFiles))).toEqual(expect.arrayContaining(["storageKey", "checksum", "scanStatus", "sanitized"]));
});
