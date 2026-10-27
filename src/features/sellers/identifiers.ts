import { createHmac } from "node:crypto";

export type SellerIdentifierType =
  | "phone"
  | "iban"
  | "company_code"
  | "name"
  | "website"
  | "facebook";

function normalizePhone(value: string): string {
  const trimmed = value.trim();
  if (!/^(?:\+|00)?[\d\s().-]+$/.test(trimmed)) throw new Error("Netinkamas telefono numeris");
  let digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("8") && digits.length === 9) digits = `370${digits.slice(1)}`;
  if (digits.startsWith("370") && digits.length === 11) return `+${digits}`;
  if ((trimmed.startsWith("+") || trimmed.startsWith("00")) && digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  throw new Error("Netinkamas telefono numeris");
}

function hasValidIbanChecksum(value: string): boolean {
  const rearranged = `${value.slice(4)}${value.slice(0, 4)}`;
  const numeric = [...rearranged].map((character) => /[A-Z]/.test(character) ? String(character.charCodeAt(0) - 55) : character).join("");
  let remainder = 0;
  for (const digit of numeric) remainder = (remainder * 10 + Number(digit)) % 97;
  return remainder === 1;
}

function normalizeIban(value: string): string {
  const normalized = value.replace(/\s/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(normalized) || !hasValidIbanChecksum(normalized)) {
    throw new Error("Netinkama IBAN sąskaita");
  }
  return normalized;
}

function normalizeUrl(value: string, facebookOnly: boolean): string {
  const withProtocol = /^[a-z][a-z\d+.-]*:/i.test(value.trim()) ? value.trim() : `https://${value.trim()}`;
  const url = new URL(withProtocol);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error("Netinkamas URL protokolas");
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "").replace(/^m\./, "");
  if (facebookOnly && hostname !== "facebook.com") throw new Error("Tai nėra Facebook nuoroda");
  url.protocol = "https:";
  url.hostname = hostname;
  url.port = "";
  const trackingParameters = new Set(["fbclid", "gclid", "ref", "ref_src", "ref_url"]);
  for (const key of [...url.searchParams.keys()]) {
    if (key.toLowerCase().startsWith("utm_") || trackingParameters.has(key.toLowerCase())) url.searchParams.delete(key);
  }
  url.searchParams.sort();
  url.hash = "";
  url.pathname = url.pathname === "/" ? "" : url.pathname.replace(/\/+$/, "");
  return url.toString().replace(/\/$/, "");
}

export function normalizeSellerIdentifier(type: SellerIdentifierType, value: string): string {
  if (!value.trim()) throw new Error("Identifikatorius privalomas");
  switch (type) {
    case "phone": return normalizePhone(value);
    case "iban": return normalizeIban(value);
    case "company_code": {
      const normalized = value.replace(/\s/g, "");
      if (!/^\d{9}$/.test(normalized)) throw new Error("Netinkamas įmonės kodas");
      return normalized;
    }
    case "name": return value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("lt-LT");
    case "website": return normalizeUrl(value, false);
    case "facebook": return normalizeUrl(value, true);
  }
}

export function createLookupHash(normalizedValue: string, key: string): string {
  if (!key) throw new Error("Paieškos HMAC raktas privalomas");
  return createHmac("sha256", key).update(normalizedValue).digest("hex");
}

export function maskSellerIdentifier(type: SellerIdentifierType, normalizedValue: string): string {
  if (type === "phone") return `${normalizedValue.slice(0, 4)} ${normalizedValue.slice(4, 5)}•• ••${normalizedValue.slice(-3)}`;
  if (type === "iban") return `${normalizedValue.slice(0, 2)}•• •••• •••• •••• ${normalizedValue.slice(-4)}`;
  return normalizedValue;
}
