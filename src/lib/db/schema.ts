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
