import { createLookupHash, maskSellerIdentifier, normalizeSellerIdentifier } from "@/features/sellers/identifiers";
import { consumerReportSchema, type ConsumerReportInput } from "./schema";

interface Verification { emailVerified: boolean; phoneVerified: boolean; id?: string }
interface Dependencies {
  lookupKey: string;
  encrypt: (value: string) => string;
  getReporterVerification: (reporter: ConsumerReportInput["reporter"]) => Promise<Verification>;
  saveIdempotently: (record: Record<string, unknown>) => Promise<{ id: string; duplicate: boolean }>;
}

export async function submitConsumerReport(input: ConsumerReportInput, dependencies: Dependencies) {
  const report = consumerReportSchema.parse(input);
  const verification = await dependencies.getReporterVerification(report.reporter);
  if (!verification.emailVerified) throw new Error("El. paštas nepatvirtintas");
  if (!verification.phoneVerified) throw new Error("Telefono numeris nepatvirtintas");

  const identifiers = report.sellerIdentifiers.map(({ type, value }) => {
    const normalized = normalizeSellerIdentifier(type, value);
    return {
      type,
      encryptedValue: dependencies.encrypt(normalized),
      lookupHash: createLookupHash(normalized, dependencies.lookupKey),
      maskedValue: maskSellerIdentifier(type, normalized),
    };
  });
  const fingerprint = createLookupHash([
    report.reporter.email,
    report.paymentDate,
    String(report.amountCents),
    ...identifiers.map((identifier) => identifier.lookupHash).sort(),
  ].join("|"), dependencies.lookupKey);
  const saved = await dependencies.saveIdempotently({
    reporterVerificationId: verification.id,
    reporterNameEncrypted: dependencies.encrypt(report.reporter.name),
    description: report.description,
    amountCents: report.amountCents,
    paymentDate: report.paymentDate,
    promisedDate: report.promisedDate,
    workStatus: report.workStatus,
    officialReferenceEncrypted: report.officialReference ? dependencies.encrypt(report.officialReference) : undefined,
    authenticityConfirmed: report.authenticityConfirmed,
    fingerprint,
    identifiers,
  });
  return { id: saved.id, duplicate: saved.duplicate };
}
