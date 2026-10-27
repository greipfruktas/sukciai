import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const sourceLevel = pgEnum("source_level", ["A", "B", "C"]);
export const caseStatus = pgEnum("case_status", [
  "institution_notice",
  "investigation_started",
  "suspected",
  "charged",
  "in_court",
  "non_final_decision",
  "final_decision",
  "investigation_closed",
  "acquitted",
  "decision_changed",
]);
export const publicationState = pgEnum("publication_state", ["draft", "review", "published", "rejected"]);
export const decisionAction = pgEnum("decision_action", ["publish", "review", "block", "approve", "reject"]);
export const sellerIdentifierType = pgEnum("seller_identifier_type", ["phone", "iban", "company_code", "name", "website", "facebook"]);
export const sellerProfileStatus = pgEnum("seller_profile_status", ["verified_dispute", "repeated_pattern", "official_process"]);
export const consumerWorkStatus = pgEnum("consumer_work_status", ["not_done", "partially_done", "late", "defective"]);
export const consumerReportState = pgEnum("consumer_report_state", ["submitted", "needs_information", "monitoring", "response_pending", "published", "rejected"]);
export const evidenceScanStatus = pgEnum("evidence_scan_status", ["pending", "clean", "rejected"]);

export const sellerProfiles = pgTable("seller_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  displayName: text("display_name").notNull(),
  status: sellerProfileStatus("status").notNull(),
  summary: text("summary").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sellerIdentifiers = pgTable("seller_identifiers", {
  id: uuid("id").primaryKey().defaultRandom(),
  sellerProfileId: uuid("seller_profile_id").notNull().references(() => sellerProfiles.id),
  type: sellerIdentifierType("type").notNull(),
  encryptedValue: text("encrypted_value").notNull(),
  lookupHash: text("lookup_hash").notNull(),
  maskedValue: text("masked_value").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("seller_identifier_type_lookup_idx").on(table.type, table.lookupHash),
]);

export const reporterVerifications = pgTable("reporter_verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  reporterNameEncrypted: text("reporter_name_encrypted").notNull(),
  emailHash: text("email_hash").notNull(),
  phoneHash: text("phone_hash").notNull(),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  phoneVerifiedAt: timestamp("phone_verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const consumerReports = pgTable("consumer_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reporterVerificationId: uuid("reporter_verification_id").notNull().references(() => reporterVerifications.id),
  sellerProfileId: uuid("seller_profile_id").references(() => sellerProfiles.id),
  description: text("description").notNull(),
  amountCents: integer("amount_cents").notNull(),
  paymentDate: date("payment_date").notNull(),
  promisedDate: date("promised_date"),
  workStatus: consumerWorkStatus("work_status").notNull(),
  officialReferenceEncrypted: text("official_reference_encrypted"),
  authenticityConfirmed: boolean("authenticity_confirmed").notNull(),
  fingerprint: text("fingerprint").notNull().unique(),
  state: consumerReportState("state").notNull().default("submitted"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const consumerReportIdentifiers = pgTable("consumer_report_identifiers", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id").notNull().references(() => consumerReports.id),
  type: sellerIdentifierType("type").notNull(),
  encryptedValue: text("encrypted_value").notNull(),
  lookupHash: text("lookup_hash").notNull(),
  maskedValue: text("masked_value").notNull(),
}, (table) => [uniqueIndex("consumer_report_identifier_lookup_idx").on(table.type, table.lookupHash, table.reportId)]);

export const evidenceFiles = pgTable("evidence_files", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id").notNull().references(() => consumerReports.id),
  storageKey: text("storage_key").notNull().unique(),
  originalNameEncrypted: text("original_name_encrypted").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  checksum: text("checksum").notNull(),
  scanStatus: evidenceScanStatus("scan_status").notNull().default("pending"),
  sanitized: boolean("sanitized").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull().unique(),
  publisher: text("publisher").notNull(),
  author: text("author"),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
  level: sourceLevel("level").notNull(),
  documentNumber: text("document_number"),
  checksum: text("checksum").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sourceSnapshots = pgTable("source_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceId: uuid("source_id").notNull().references(() => sources.id),
  content: text("content").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
  capturedAt: timestamp("captured_at", { withTimezone: true }).notNull().defaultNow(),
});

export const people = pgTable("people", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  publicRole: text("public_role"),
  identityKey: text("identity_key").notNull().unique(),
});

export const institutions = pgTable("institutions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  type: text("type").notNull(),
});

export const municipalities = pgTable("municipalities", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const cases = pgTable("cases", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  status: caseStatus("status").notNull(),
  publicationState: publicationState("publication_state").notNull().default("draft"),
  statusDate: date("status_date").notNull(),
  municipalityId: uuid("municipality_id").references(() => municipalities.id),
  amountCents: integer("amount_cents"),
  riskFlags: jsonb("risk_flags").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const claims = pgTable("claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseId: uuid("case_id").notNull().references(() => cases.id),
  text: text("text").notNull(),
  eventDate: date("event_date"),
  verified: boolean("verified").notNull().default(false),
});

export const claimSources = pgTable(
  "claim_sources",
  {
    claimId: uuid("claim_id").notNull().references(() => claims.id),
    sourceId: uuid("source_id").notNull().references(() => sources.id),
    supportingQuote: text("supporting_quote").notNull(),
  },
  (table) => [primaryKey({ columns: [table.claimId, table.sourceId] })],
);

export const timelineEvents = pgTable("timeline_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseId: uuid("case_id").notNull().references(() => cases.id),
  eventDate: date("event_date").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  sourceId: uuid("source_id").notNull().references(() => sources.id),
});

export const publicationDecisions = pgTable("publication_decisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseId: uuid("case_id").notNull().references(() => cases.id),
  action: decisionAction("action").notNull(),
  reasonCodes: jsonb("reason_codes").$type<string[]>().notNull(),
  policyVersion: text("policy_version").notNull(),
  actorId: text("actor_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const corrections = pgTable("corrections", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseId: uuid("case_id").notNull().references(() => cases.id),
  claimantName: text("claimant_name").notNull(),
  claimantEmail: text("claimant_email").notNull(),
  disputedClaim: text("disputed_claim").notNull(),
  evidence: text("evidence").notNull(),
  resolution: text("resolution"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
