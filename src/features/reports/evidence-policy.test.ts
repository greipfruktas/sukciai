import { describe, expect, it } from "vitest";
import { validateEvidence, validateEvidenceBatch } from "./evidence-policy";

const jpegWithExif = new Uint8Array([
  0xff, 0xd8,
  0xff, 0xe1, 0x00, 0x08, 0x45, 0x78, 0x69, 0x66, 0x00, 0x00,
  0xff, 0xd9,
]);

describe("validateEvidence", () => {
  it("removes EXIF metadata before accepting a JPEG", () => {
    const result = validateEvidence({ name: "foto.jpg", mimeType: "image/jpeg", bytes: jpegWithExif });
    expect([...result.sanitizedBytes]).toEqual([0xff, 0xd8, 0xff, 0xd9]);
    expect(result.checksum).toMatch(/^[a-f0-9]{64}$/);
  });

  it("rejects an unsupported or oversized file", () => {
    expect(() => validateEvidence({ name: "script.svg", mimeType: "image/svg+xml", bytes: new Uint8Array([1]) })).toThrow();
    expect(() => validateEvidence({ name: "huge.pdf", mimeType: "application/pdf", bytes: new Uint8Array(10 * 1024 * 1024 + 1) })).toThrow();
  });

  it("rejects a MIME type that does not match the file signature", () => {
    expect(() => validateEvidence({ name: "fake.jpg", mimeType: "image/jpeg", bytes: new TextEncoder().encode("not an image") })).toThrow();
  });

  it("limits a report to ten files and reuses duplicate checksums", () => {
    const tinyJpeg = { name: "foto.jpg", mimeType: "image/jpeg" as const, bytes: new Uint8Array([0xff, 0xd8, 0xff, 0xd9]) };
    expect(() => validateEvidenceBatch(Array.from({ length: 11 }, () => tinyJpeg))).toThrow();
    const accepted = validateEvidenceBatch([tinyJpeg, { ...tinyJpeg, name: "kopija.jpg" }]);
    expect(accepted).toHaveLength(1);
  });
});
