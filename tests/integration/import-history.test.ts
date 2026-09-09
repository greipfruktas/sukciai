import { expect, it } from "vitest";
import { importHistory } from "@/features/ingestion/import-history";

it("is idempotent when historical records are imported twice", async () => {
  const keys = new Set<string>();
  const store = { has: async (key: string) => keys.has(key), save: async (key: string) => { keys.add(key); } };
  const records = [{ sourceId: "stt", externalId: "notice-1", publishedAt: "2022-03-01", url: "https://stt.lt/notice-1" }];
  expect(await importHistory({ from: "2021-09-09", records }, store)).toEqual({ imported: 1, duplicates: 0, skippedBeforeRange: 0 });
  expect(await importHistory({ from: "2021-09-09", records }, store)).toEqual({ imported: 0, duplicates: 1, skippedBeforeRange: 0 });
});
