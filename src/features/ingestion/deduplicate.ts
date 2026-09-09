import { createHash } from "node:crypto";

const trackingParameters = new Set([
  "fbclid",
  "gclid",
  "mc_cid",
  "mc_eid",
]);

export function canonicalizeSourceUrl(input: string): string {
  const url = new URL(input);
  url.hostname = url.hostname.toLowerCase();
  url.hash = "";

  for (const key of [...url.searchParams.keys()]) {
    if (key.startsWith("utm_") || trackingParameters.has(key)) {
      url.searchParams.delete(key);
    }
  }

  url.searchParams.sort();
  if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/+$/, "");
  return url.toString().replace(/\?$/, "").replace(/\/$/, "");
}

export function fingerprintSource(input: { url: string; content: string }): string {
  const canonicalUrl = canonicalizeSourceUrl(input.url);
  const normalizedContent = input.content.replace(/\s+/g, " ").trim();
  return createHash("sha256")
    .update(`${canonicalUrl}\n${normalizedContent}`)
    .digest("hex");
}
