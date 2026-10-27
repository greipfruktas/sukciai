import { getTableName } from "drizzle-orm";
import { expect, it } from "vitest";
import { consumerReportDecisions, sellerResponses } from "../../src/lib/db/schema";

it("stores seller responses and consumer decisions as audit records", () => {
  expect(getTableName(sellerResponses)).toBe("seller_responses");
  expect(getTableName(consumerReportDecisions)).toBe("consumer_report_decisions");
});
