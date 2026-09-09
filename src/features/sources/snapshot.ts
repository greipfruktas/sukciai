import type { FetchedSource } from "./fetch-source";

export interface SnapshotInput {
  sourceId: string;
  content: string;
  metadata: {
    canonicalUrl: string;
    checksum: string;
    contentType: string;
  };
}

export function createSnapshotInput(
  sourceId: string,
  fetched: FetchedSource,
): SnapshotInput {
  return {
    sourceId,
    content: fetched.content,
    metadata: {
      canonicalUrl: fetched.canonicalUrl,
      checksum: fetched.checksum,
      contentType: fetched.contentType,
    },
  };
}
