import { fetchSource } from "@/features/sources/fetch-source";
import type { SourceRegistryEntry } from "@/features/sources/registry";
import { createSnapshotInput, type SnapshotInput } from "@/features/sources/snapshot";

interface IngestionSource {
  id: string;
  url: string;
  registry: readonly SourceRegistryEntry[];
}

interface IngestionDependencies {
  fetcher: (input: string, init?: RequestInit) => Promise<Response>;
  saveSnapshot: (snapshot: SnapshotInput) => Promise<string>;
  findSnapshotByChecksum?: (checksum: string) => Promise<string | undefined>;
}

export interface IngestionResult {
  snapshotId: string;
  duplicate: boolean;
}

export async function ingestSource(
  source: IngestionSource,
  dependencies: IngestionDependencies,
): Promise<IngestionResult> {
  const fetched = await fetchSource(source.url, source.registry, dependencies.fetcher);
  const existingSnapshotId = await dependencies.findSnapshotByChecksum?.(
    fetched.checksum,
  );

  if (existingSnapshotId) {
    return { snapshotId: existingSnapshotId, duplicate: true };
  }

  const snapshotId = await dependencies.saveSnapshot(
    createSnapshotInput(source.id, fetched),
  );
  return { snapshotId, duplicate: false };
}
