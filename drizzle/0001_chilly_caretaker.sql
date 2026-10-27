CREATE TYPE "public"."consumer_decision_action" AS ENUM('reject', 'request_information', 'monitor', 'start_response', 'publish');--> statement-breakpoint
CREATE TYPE "public"."consumer_report_state" AS ENUM('submitted', 'needs_information', 'monitoring', 'response_pending', 'published', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."consumer_work_status" AS ENUM('not_done', 'partially_done', 'late', 'defective');--> statement-breakpoint
CREATE TYPE "public"."evidence_scan_status" AS ENUM('pending', 'clean', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."seller_identifier_type" AS ENUM('phone', 'iban', 'company_code', 'name', 'website', 'facebook');--> statement-breakpoint
CREATE TYPE "public"."seller_profile_status" AS ENUM('verified_dispute', 'repeated_pattern', 'official_process');--> statement-breakpoint
CREATE TABLE "consumer_report_decisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"action" "consumer_decision_action" NOT NULL,
	"reason" text NOT NULL,
	"publication_level" "seller_profile_status",
	"expected_version" integer NOT NULL,
	"policy_version" text NOT NULL,
	"actor_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consumer_report_identifiers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"type" "seller_identifier_type" NOT NULL,
	"encrypted_value" text NOT NULL,
	"lookup_hash" text NOT NULL,
	"masked_value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consumer_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporter_verification_id" uuid NOT NULL,
	"seller_profile_id" uuid,
	"description" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"payment_date" date NOT NULL,
	"promised_date" date,
	"work_status" "consumer_work_status" NOT NULL,
	"official_reference_encrypted" text,
	"authenticity_confirmed" boolean NOT NULL,
	"fingerprint" text NOT NULL,
	"state" "consumer_report_state" DEFAULT 'submitted' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "consumer_reports_fingerprint_unique" UNIQUE("fingerprint")
);
--> statement-breakpoint
CREATE TABLE "evidence_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"storage_key" text NOT NULL,
	"original_name_encrypted" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"checksum" text NOT NULL,
	"scan_status" "evidence_scan_status" DEFAULT 'pending' NOT NULL,
	"sanitized" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "evidence_files_storage_key_unique" UNIQUE("storage_key")
);
--> statement-breakpoint
CREATE TABLE "reporter_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporter_name_encrypted" text NOT NULL,
	"email_hash" text NOT NULL,
	"phone_hash" text NOT NULL,
	"email_verified_at" timestamp with time zone,
	"phone_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seller_identifiers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_profile_id" uuid NOT NULL,
	"type" "seller_identifier_type" NOT NULL,
	"encrypted_value" text NOT NULL,
	"lookup_hash" text NOT NULL,
	"masked_value" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seller_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"display_name" text NOT NULL,
	"status" "seller_profile_status" NOT NULL,
	"summary" text NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "seller_profiles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "seller_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"contact_encrypted" text NOT NULL,
	"contacted_at" timestamp with time zone NOT NULL,
	"deadline_at" timestamp with time zone NOT NULL,
	"urgent_risk" boolean DEFAULT false NOT NULL,
	"response_encrypted" text,
	"public_excerpt" text,
	"responded_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "consumer_report_decisions" ADD CONSTRAINT "consumer_report_decisions_report_id_consumer_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."consumer_reports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consumer_report_identifiers" ADD CONSTRAINT "consumer_report_identifiers_report_id_consumer_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."consumer_reports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consumer_reports" ADD CONSTRAINT "consumer_reports_reporter_verification_id_reporter_verifications_id_fk" FOREIGN KEY ("reporter_verification_id") REFERENCES "public"."reporter_verifications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consumer_reports" ADD CONSTRAINT "consumer_reports_seller_profile_id_seller_profiles_id_fk" FOREIGN KEY ("seller_profile_id") REFERENCES "public"."seller_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_files" ADD CONSTRAINT "evidence_files_report_id_consumer_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."consumer_reports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_identifiers" ADD CONSTRAINT "seller_identifiers_seller_profile_id_seller_profiles_id_fk" FOREIGN KEY ("seller_profile_id") REFERENCES "public"."seller_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_responses" ADD CONSTRAINT "seller_responses_report_id_consumer_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."consumer_reports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "consumer_report_decision_version_idx" ON "consumer_report_decisions" USING btree ("report_id","expected_version");--> statement-breakpoint
CREATE UNIQUE INDEX "consumer_report_identifier_lookup_idx" ON "consumer_report_identifiers" USING btree ("type","lookup_hash","report_id");--> statement-breakpoint
CREATE UNIQUE INDEX "seller_identifier_type_lookup_idx" ON "seller_identifiers" USING btree ("type","lookup_hash");