export interface HistoricalRecord { sourceId: string; externalId: string; publishedAt: string; url: string }
interface ImportStore { has: (key: string) => Promise<boolean>; save: (key: string, record: HistoricalRecord) => Promise<void> }

export async function importHistory(input: { from: string; records: HistoricalRecord[] }, store: ImportStore) {
  let imported = 0, duplicates = 0, skippedBeforeRange = 0;
  for (const record of input.records) {
    if (record.publishedAt < input.from) { skippedBeforeRange += 1; continue; }
    const key = `${record.sourceId}:${record.externalId}`;
    if (await store.has(key)) { duplicates += 1; continue; }
    await store.save(key, record); imported += 1;
  }
  return { imported, duplicates, skippedBeforeRange };
}
