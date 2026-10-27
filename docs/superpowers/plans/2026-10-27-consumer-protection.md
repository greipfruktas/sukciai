# Sukčiai.lt Consumer Protection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a moderated consumer seller-check and evidence-backed reporting system while preserving public-funds coverage as a separate section.

**Architecture:** Extend the existing Next.js and Drizzle application with encrypted seller identifiers, private consumer reports, evidence metadata, deterministic moderation levels, and separate public/admin views. Public search uses normalized HMAC lookup keys and never exposes unpublished report existence or full sensitive identifiers.

**Tech Stack:** Next.js 16, React, TypeScript, PostgreSQL, Drizzle ORM, Zod, pg-boss, Vitest, Testing Library, Playwright, Docker Compose.

**Spec:** `docs/superpowers/specs/2026-10-27-consumer-protection-design.md`

## Global Constraints

- Full phone numbers, IBANs, reporter identity, and evidence files remain private.
- Public phone and IBAN lookup is exact-match only and returns masked values.
- Every publication requires an explicit administrator decision.
- One verified report may only produce a neutral verified-dispute status.
- A repeated-pattern warning requires two independent verified reports or an official source.
- Seller response period is seven calendar days unless an administrator records the urgent-risk exception.
- Deployment target is a Hostinger VPS with Node.js, PostgreSQL, worker, TLS proxy, and private S3-compatible object storage.

## Review Focus

- Unicode, whitespace, country-code, IBAN, URL, and Facebook URL normalization must not create false matches.
- Search timing and response copy must not reveal whether an unpublished report exists.
- Duplicate evidence uploads and duplicate reports must stay idempotent.
- Malformed, oversized, metadata-bearing, or unsupported files must fail before storage publication.
- Concurrent moderation actions must create one decision and one public version.

---

### Task 1: Seller identifiers and privacy-safe lookup

**Files:**
- Create: `src/features/sellers/identifiers.ts`
- Create: `src/features/sellers/identifiers.test.ts`
- Modify: `src/lib/db/schema.ts`
- Test: `tests/integration/seller-schema.test.ts`

**Interfaces:**
- Produces: `normalizeSellerIdentifier(type, value)`, `createLookupHash(value, key)`, `maskSellerIdentifier(type, value)` and seller profile/identifier tables.

- [ ] Write failing tests for phone, IBAN, company code, name, website, Facebook URL, invalid input, Unicode and exact-match lookup.
- [ ] Run `npm test -- src/features/sellers/identifiers.test.ts tests/integration/seller-schema.test.ts` and confirm missing-interface failures.
- [ ] Implement focused normalization, HMAC lookup, masking, encrypted-value fields and unique lookup indexes.
- [ ] Run the focused tests and `npm run typecheck`.
- [ ] Commit with `feat: add private seller identifiers`.

### Task 2: Consumer report intake and evidence policy

**Files:**
- Create: `src/features/reports/schema.ts`
- Create: `src/features/reports/service.ts`
- Create: `src/features/reports/evidence-policy.ts`
- Create: `src/features/reports/*.test.ts`
- Modify: `src/lib/db/schema.ts`

**Interfaces:**
- Consumes: normalized seller identifiers from Task 1.
- Produces: `consumerReportSchema`, `submitConsumerReport(input, deps)`, `validateEvidence(file)` and report/evidence/verification tables.

- [ ] Write failing tests for required fields, work states, money/date bounds, reporter verification, duplicate submission, file type/size/count, metadata stripping and checksum reuse.
- [ ] Run the focused tests and confirm expected failures.
- [ ] Implement validation and dependency-injected persistence/object-storage boundaries; do not expose storage URLs.
- [ ] Run focused tests, types and lint.
- [ ] Commit with `feat: add evidence-backed consumer reports`.

### Task 3: Moderation policy and seller response workflow

**Files:**
- Create: `src/features/reports/moderation-policy.ts`
- Create: `src/features/reports/moderation-policy.test.ts`
- Create: `src/features/reports/seller-response.ts`
- Create: `src/features/reports/seller-response.test.ts`
- Modify: `src/features/admin/actions.ts`
- Modify: `src/lib/db/schema.ts`

**Interfaces:**
- Consumes: verified reports and official-source claims.
- Produces: `evaluateConsumerPublication(input)`, `startSellerResponsePeriod(input)`, and audited moderation actions.

- [ ] Write failing tests for neutral single-report status, two-report warning, official decision, seven-day deadline, urgent exception, missing seller contact, rejection and concurrent decisions.
- [ ] Run focused tests and confirm policy/action failures.
- [ ] Implement deterministic policy and transactional moderation actions with role checks.
- [ ] Run focused tests, types and integration tests.
- [ ] Commit with `feat: add moderated consumer publication`.

### Task 4: Public seller search and profile API

**Files:**
- Create: `src/features/sellers/search.ts`
- Create: `src/features/sellers/search.test.ts`
- Create: `src/app/api/sellers/search/route.ts`
- Create: `src/app/api/sellers/search/route.test.ts`
- Create: `src/app/pardavejai/[slug]/page.tsx`

**Interfaces:**
- Consumes: lookup hashes and published seller profiles.
- Produces: `searchPublishedSellers(query, deps)` and public search endpoint.

- [ ] Write failing tests for every identifier type, unpublished-only matches, constant response shape, masked output, rate limiting and no-result disclaimer.
- [ ] Run focused tests and confirm failures.
- [ ] Implement published-only lookup, generic no-result response and profile rendering with sources and seller response.
- [ ] Run tests, types and lint.
- [ ] Commit with `feat: add privacy-safe seller search`.

### Task 5: Consumer-first public interface

**Files:**
- Create: `src/features/sellers/search-form.tsx`
- Create: `src/features/sellers/search-form.test.tsx`
- Create: `src/app/pranesti/page.tsx`
- Create: `src/features/reports/report-form.tsx`
- Create: `src/features/reports/report-form.test.tsx`
- Create: `src/app/viesieji-pinigai/page.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/styles/globals.css`

**Interfaces:**
- Consumes: Tasks 2 and 4 public APIs.
- Produces: consumer-first homepage, five-step report form, and separate public-funds landing page.

- [ ] Write failing component tests for search semantics, no-result warning, step validation, local draft recovery, accessible upload labels and separation from public-funds content.
- [ ] Run focused tests and confirm missing UI failures.
- [ ] Implement an editorial utility aesthetic: oversized exact-match search, restrained black/cream/red palette, square controls, strong rules, clear privacy copy, responsive grids and reduced-motion support.
- [ ] Run component tests, axe checks, mobile and desktop Playwright flows.
- [ ] Commit with `feat: add consumer seller-check interface`.

### Task 6: Administrator review queue

**Files:**
- Create: `src/features/admin/consumer-review-panel.tsx`
- Create: `src/features/admin/consumer-review-panel.test.tsx`
- Create: `src/app/admin/pranesimai/page.tsx`
- Create: `src/app/admin/pranesimai/[id]/page.tsx`
- Modify: `src/app/admin/layout.tsx`

**Interfaces:**
- Consumes: report, evidence, match, response and policy data.
- Produces: administrator queue and decision screen.

- [ ] Write failing tests for evidence visibility, matching identifiers, missing-document alerts, response deadline, policy recommendation and allowed role actions.
- [ ] Run focused tests and confirm failures.
- [ ] Implement queue/detail views using existing audited admin actions.
- [ ] Run focused tests, types and accessibility checks.
- [ ] Commit with `feat: add consumer report review queue`.

### Task 7: Hostinger-ready deployment and operational controls

**Files:**
- Modify: `docker-compose.yml`
- Create: `docker-compose.production.yml`
- Create: `Dockerfile`
- Create: `deploy/Caddyfile`
- Create: `deploy/backup-postgres.sh`
- Modify: `.env.example`
- Modify: `docs/operations.md`
- Create: `docs/hostinger-deployment.md`
- Modify: `tests/e2e/release-smoke.spec.ts`

**Interfaces:**
- Consumes: web, database, worker and private object-storage configuration.
- Produces: repeatable staging/production deployment and rollback instructions.

- [ ] Write failing smoke/config tests for health, database readiness, worker, private object storage, migration and environment validation.
- [ ] Run release smoke/config tests and confirm failures.
- [ ] Implement production containers, TLS proxy, secrets/env checks, backup script and Hostinger VPS runbook.
- [ ] Run `npm run lint && npm run typecheck && npm test && npm run build && npm run db:check && npm run test:e2e`.
- [ ] Commit with `docs: add hostinger deployment operations`.

### Task 8: Final privacy, security and release verification

**Files:**
- Create: `docs/privacy-impact-checklist.md`
- Modify: `docs/editorial-policy.md`
- Modify: `docs/release-checklist.md`
- Create: `tests/e2e/consumer-release.spec.ts`

**Interfaces:**
- Consumes: all completed consumer protection flows.
- Produces: audited release gate and explicit legal/staging blockers.

- [ ] Add failing end-to-end tests covering exact search, no-result copy, report draft, submission fixture, moderation, seller response and published masked profile.
- [ ] Run the tests and confirm the fixture flow fails before final wiring.
- [ ] Complete the fixture wiring, privacy impact checklist and editorial/release documents.
- [ ] Run the full release gate and record the commit/date; real reports remain disabled until OIDC/MFA, object storage, staging restore and Lithuanian legal review are complete.
- [ ] Commit with `test: verify consumer protection release flow`.
