import { createHash } from "node:crypto";

export interface EvidenceInput {
  name: string;
  mimeType: string;
  bytes: Uint8Array;
}

export interface PreparedEvidence {
  name: string;
  mimeType: "image/jpeg" | "image/png" | "application/pdf";
  sanitizedBytes: Uint8Array;
  checksum: string;
}

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "application/pdf"]);

function hasExpectedSignature(mimeType: string, bytes: Uint8Array): boolean {
  if (mimeType === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes.at(-2) === 0xff && bytes.at(-1) === 0xd9;
  if (mimeType === "image/png") return [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte);
  if (mimeType === "application/pdf") return new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-";
  return false;
}

function stripJpegMetadata(bytes: Uint8Array): Uint8Array {
  const output = [0xff, 0xd8];
  let offset = 2;
  while (offset < bytes.length - 2) {
    if (bytes[offset] !== 0xff) { output.push(bytes[offset]); offset += 1; continue; }
    const marker = bytes[offset + 1];
    if (marker === 0xd9) break;
    if (marker === 0xda) { output.push(...bytes.slice(offset, -2)); break; }
    const length = (bytes[offset + 2] << 8) + bytes[offset + 3];
    if (length < 2 || offset + 2 + length > bytes.length) throw new Error("Sugadintas JPEG failas");
    if (marker !== 0xe1 && marker !== 0xed && marker !== 0xfe) output.push(...bytes.slice(offset, offset + 2 + length));
    offset += 2 + length;
  }
  output.push(0xff, 0xd9);
  return new Uint8Array(output);
}

export function validateEvidence(file: EvidenceInput): PreparedEvidence {
  if (!allowedTypes.has(file.mimeType)) throw new Error("Nepalaikomas failo tipas");
  if (file.bytes.length === 0 || file.bytes.length > MAX_FILE_BYTES) throw new Error("Netinkamas failo dydis");
  if (!hasExpectedSignature(file.mimeType, file.bytes)) throw new Error("Failo turinys neatitinka jo tipo");
  const sanitizedBytes = file.mimeType === "image/jpeg" ? stripJpegMetadata(file.bytes) : file.bytes;
  return {
    name: file.name,
    mimeType: file.mimeType as PreparedEvidence["mimeType"],
    sanitizedBytes,
    checksum: createHash("sha256").update(sanitizedBytes).digest("hex"),
  };
}

export function validateEvidenceBatch(files: EvidenceInput[]): PreparedEvidence[] {
  if (files.length > 10) throw new Error("Vienam pranešimui leidžiama iki 10 failų");
  const unique = new Map<string, PreparedEvidence>();
  for (const file of files) {
    const prepared = validateEvidence(file);
    if (!unique.has(prepared.checksum)) unique.set(prepared.checksum, prepared);
  }
  return [...unique.values()];
}
