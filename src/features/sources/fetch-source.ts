import { createHash } from "node:crypto";
import { canonicalizeSourceUrl } from "@/features/ingestion/deduplicate";
import type { SourceRegistryEntry } from "./registry";

type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;

export type SourceFetchErrorCode =
  | "HOST_NOT_ALLOWED"
  | "REDIRECT_NOT_ALLOWED"
  | "FETCH_FAILED"
  | "CONTENT_TOO_LARGE"
  | "UNSUPPORTED_CONTENT";

export class SourceFetchError extends Error {
  constructor(public readonly code: SourceFetchErrorCode, message: string) {
    super(message);
    this.name = "SourceFetchError";
  }
}

export interface FetchedSource {
  canonicalUrl: string;
  content: string;
  checksum: string;
  contentType: string;
}

const maxContentBytes = 5 * 1024 * 1024;

function findRegistryEntry(
  url: URL,
  registry: readonly SourceRegistryEntry[],
): SourceRegistryEntry | undefined {
  return registry.find((entry) => entry.hostname.toLowerCase() === url.hostname.toLowerCase());
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<(script|style|noscript|iframe)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

export async function fetchSource(
  input: string,
  registry: readonly SourceRegistryEntry[],
  fetcher: Fetcher = fetch,
): Promise<FetchedSource> {
  const requestedUrl = new URL(input);
  if (!findRegistryEntry(requestedUrl, registry)) {
    throw new SourceFetchError("HOST_NOT_ALLOWED", `Source host is not registered: ${requestedUrl.hostname}`);
  }

  let response: Response;
  try {
    response = await fetcher(requestedUrl.toString(), { redirect: "manual" });
  } catch (error) {
    throw new SourceFetchError("FETCH_FAILED", error instanceof Error ? error.message : "Source request failed");
  }

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    const redirectUrl = location ? new URL(location, requestedUrl) : undefined;
    if (!redirectUrl || !findRegistryEntry(redirectUrl, registry)) {
      throw new SourceFetchError("REDIRECT_NOT_ALLOWED", "Source redirected outside the registry");
    }
    return fetchSource(redirectUrl.toString(), registry, fetcher);
  }

  if (!response.ok) {
    throw new SourceFetchError("FETCH_FAILED", `Source returned HTTP ${response.status}`);
  }

  const contentLength = Number(response.headers.get("content-length") ?? 0);
  if (contentLength > maxContentBytes) {
    throw new SourceFetchError("CONTENT_TOO_LARGE", "Source exceeds the 5 MB limit");
  }

  const contentType = response.headers.get("content-type")?.split(";")[0] ?? "";
  if (contentType && contentType !== "text/html" && contentType !== "text/plain") {
    throw new SourceFetchError("UNSUPPORTED_CONTENT", `Unsupported content type: ${contentType}`);
  }

  const rawContent = await response.text();
  if (Buffer.byteLength(rawContent, "utf8") > maxContentBytes) {
    throw new SourceFetchError("CONTENT_TOO_LARGE", "Source exceeds the 5 MB limit");
  }

  const content = contentType === "text/html" ? sanitizeHtml(rawContent) : rawContent;
  return {
    canonicalUrl: canonicalizeSourceUrl(requestedUrl.toString()),
    content,
    checksum: createHash("sha256").update(content).digest("hex"),
    contentType: contentType || "text/plain",
  };
}
