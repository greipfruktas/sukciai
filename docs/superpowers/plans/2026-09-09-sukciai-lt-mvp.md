# sukciai.lt MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable Lithuanian public-interest news portal that publishes only source-backed cases, routes sensitive cases through administrator approval, and exposes every claim's provenance.

**Architecture:** A TypeScript monolith serves the public site, administrator interface, ingestion jobs, and JSON endpoints. PostgreSQL stores cases, claims, source snapshots, decisions, and a durable job queue. Deterministic policy code decides publication eligibility; the language model may extract and summarize claims but cannot override policy.

**Tech Stack:** Node.js LTS, Next.js App Router, TypeScript, PostgreSQL, Drizzle ORM, pg-boss, Zod, Vitest, Testing Library, Playwright, axe-core, Docker Compose.

**Spec:** `docs/superpowers/specs/2026-09-09-sukciai-lt-design.md`

## Global Constraints

- Initial content covers A-level source records published from 2021-09-09 and the separate „Skaidrinam“ collection.
- Every public factual claim must reference at least one stored source.
- C-level sources may create leads but cannot support publication.
- Conflicting sources, incomplete proceedings, allegations, charges, and non-final decisions require administrator approval.
- Final official decisions, official dismissals, and acquittals may publish automatically.
- The product must give dismissals, acquittals, and overturned decisions the same visibility as earlier allegations.
- Public copy must not call a person a fraudster, thief, or criminal unless a final official source establishes that wording.
- The public interface must meet WCAG 2.2 AA and preserve source/status context on mobile.
- The first release does not include comments, mobile apps, personalized feeds, person scores, or automatic translation.

## File Structure

```text
src/
  app/                         Next.js routes and layouts
  features/cases/              case queries, DTOs, public components
  features/sources/            source registry, fetchers, snapshots
  features/publication/        policy, decisions, audit trail
  features/ingestion/          queue jobs, deduplication, entity matching
  features/admin/              approval workflow and protected routes
  lib/db/                      Drizzle client and schema
  lib/auth/                    OIDC session and role checks
  lib/ai/                      provider-neutral extraction interface
  styles/                      editorial design tokens and global CSS
tests/
  fixtures/                    fixed official/media source documents
  integration/                 database-backed workflows
  e2e/                         public and administrator browser tests
drizzle/                       generated SQL migrations
scripts/                       seed, import, and operational checks
```

---

### Task 1: Project Foundation and Quality Gates

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `playwright.config.ts`
- Create: `docker-compose.yml`, `.env.example`, `.github/workflows/ci.yml`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/styles/globals.css`
- Test: `src/app/page.test.tsx`

**Interfaces:**
- Produces: runnable `dev`, `build`, `lint`, `typecheck`, `test`, `test:e2e`, `db:migrate` scripts.

- [ ] **Step 1: Write the failing smoke test**

```tsx
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

it("identifies the service as a source aggregator", () => {
  render(<HomePage />);
  expect(screen.getByText(/portalas neatlieka pirminio tyrimo/i)).toBeVisible();
});
```

- [ ] **Step 2: Run the test and verify the missing project fails**

Run: `npm test -- src/app/page.test.tsx`  
Expected: FAIL because the package and page do not exist.

- [ ] **Step 3: Scaffold the application and add the disclosure**

Create the scripts listed above, strict TypeScript settings, a minimal root layout, and a homepage containing:

```tsx
<p>Portalas neatlieka pirminio tyrimo. Informacija apibendrinta iš viešų šaltinių.</p>
```

- [ ] **Step 4: Run all foundation checks**

Run: `npm run lint && npm run typecheck && npm test && npm run build`  
Expected: all commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json next.config.ts vitest.config.ts playwright.config.ts docker-compose.yml .env.example .github src
git commit -m "chore: scaffold sukciai.lt application"
```

### Task 2: Provenance-First Database Model

**Files:**
- Create: `src/lib/db/schema.ts`, `src/lib/db/client.ts`, `drizzle.config.ts`
- Create: `src/features/cases/types.ts`, `src/features/publication/status-machine.ts`
- Test: `src/features/publication/status-machine.test.ts`, `tests/integration/schema.test.ts`

**Interfaces:**
- Produces: `CaseStatus`, `canTransition(from, to): boolean`, and tables `sources`, `source_snapshots`, `people`, `institutions`, `municipalities`, `cases`, `claims`, `claim_sources`, `timeline_events`, `publication_decisions`, `corrections`.

- [ ] **Step 1: Write failing status and provenance tests**

```ts
expect(canTransition("investigation_started", "acquitted")).toBe(true);
expect(canTransition("acquitted", "investigation_started")).toBe(false);
```

The integration test must attempt to insert a claim without a `claim_sources` row and assert that the publication query excludes it.

- [ ] **Step 2: Run the focused tests**

Run: `npm test -- src/features/publication/status-machine.test.ts tests/integration/schema.test.ts`  
Expected: FAIL with missing schema and status machine imports.

- [ ] **Step 3: Implement schema, migration, and status transitions**

Define this shared union:

```ts
export type CaseStatus =
  | "institution_notice" | "investigation_started" | "suspected"
  | "charged" | "in_court" | "non_final_decision" | "final_decision"
  | "investigation_closed" | "acquitted" | "decision_changed";
```

Use a join table for claim provenance and retain immutable decision records.

- [ ] **Step 4: Apply the migration and rerun tests**

Run: `npm run db:migrate && npm test -- src/features/publication/status-machine.test.ts tests/integration/schema.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/db src/features/cases src/features/publication drizzle drizzle.config.ts tests/integration
git commit -m "feat: add provenance-first case model"
```

### Task 3: Deterministic Publication Policy

**Files:**
- Create: `src/features/publication/policy.ts`, `src/features/publication/repository.ts`
- Test: `src/features/publication/policy.test.ts`

**Interfaces:**
- Consumes: `CaseStatus`, source levels, claim-source relationships.
- Produces: `evaluatePublication(input: PublicationInput): PublicationResult` where the result action is `publish`, `review`, or `block` and includes machine-readable reasons.

- [ ] **Step 1: Write the policy matrix as parameterized failing tests**

```ts
it.each([
  ["final_decision", ["A"], false, "publish"],
  ["acquitted", ["A"], false, "publish"],
  ["investigation_started", ["A"], false, "review"],
  ["final_decision", ["C"], false, "block"],
  ["final_decision", ["B"], false, "block"],
  ["final_decision", ["B", "B"], false, "review"],
  ["final_decision", ["A"], true, "review"],
])("evaluates %s with %j", (status, levels, conflict, expected) => {
  expect(evaluatePublication(makeInput(status, levels, conflict)).action).toBe(expected);
});
```

- [ ] **Step 2: Verify tests fail**

Run: `npm test -- src/features/publication/policy.test.ts`  
Expected: FAIL because `evaluatePublication` is undefined.

- [ ] **Step 3: Implement policy without model calls**

Return explicit reason codes including `MISSING_PROVENANCE`, `C_LEVEL_ONLY`, `SOURCE_CONFLICT`, `SENSITIVE_STATUS`, and `ELIGIBLE_FINAL_OFFICIAL`.

- [ ] **Step 4: Run policy and type checks**

Run: `npm test -- src/features/publication/policy.test.ts && npm run typecheck`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/publication
git commit -m "feat: enforce deterministic publication policy"
```

### Task 4: Source Registry, Fetching, and Durable Ingestion

**Files:**
- Create: `src/features/sources/registry.ts`, `fetch-source.ts`, `snapshot.ts`
- Create: `src/features/ingestion/queue.ts`, `jobs/ingest-source.ts`, `deduplicate.ts`
- Create: `scripts/seed-sources.ts`
- Test: `src/features/sources/fetch-source.test.ts`, `src/features/ingestion/deduplicate.test.ts`
- Test fixture: `tests/fixtures/institution-notice.html`

**Interfaces:**
- Produces: `fetchSource(url): Promise<FetchedSource>`, `fingerprintSource(input): string`, `enqueueIngestion(sourceId): Promise<string>`.

- [ ] **Step 1: Write failing allowlist and duplicate tests**

Assert that the fetcher rejects an unknown hostname, strips scripts, records the canonical URL, and returns the same fingerprint for tracking-parameter variants.

- [ ] **Step 2: Run focused tests**

Run: `npm test -- src/features/sources src/features/ingestion/deduplicate.test.ts`  
Expected: FAIL with missing functions.

- [ ] **Step 3: Implement allowlisted fetching and pg-boss job registration**

Validate redirects against the allowlist, cap response size and time, remove executable markup, calculate SHA-256, and persist fetch failures without creating public cases.

- [ ] **Step 4: Test retry and failure behavior**

Run: `npm test -- src/features/sources src/features/ingestion`  
Expected: PASS, including a test that repeated network failure leaves existing public content unchanged.

- [ ] **Step 5: Commit**

```bash
git add src/features/sources src/features/ingestion scripts/seed-sources.ts tests/fixtures
git commit -m "feat: ingest allowlisted public sources"
```

### Task 5: Claim Extraction and Source-Bound Summaries

**Files:**
- Create: `src/lib/ai/extractor.ts`, `src/lib/ai/provider.ts`, `src/lib/ai/prompts.ts`
- Create: `src/features/ingestion/jobs/extract-claims.ts`, `link-case.ts`
- Test: `src/lib/ai/extractor.test.ts`, `src/features/ingestion/link-case.test.ts`

**Interfaces:**
- Produces: `extractClaims(snapshot): Promise<ExtractedClaim[]>`, `buildSummary(claims): Promise<DraftSummary>`, `linkCase(input): Promise<CaseMatch>`.
- Every `ExtractedClaim` contains `text`, `sourceSnapshotId`, `supportingQuote`, `eventDate`, `people`, `institutions`, and `statusCandidate`.

- [ ] **Step 1: Write failing contract tests with a fake provider**

```ts
expect(result.claims[0]).toMatchObject({
  sourceSnapshotId: snapshot.id,
  eventDate: "2026-09-08",
  statusCandidate: "final_decision",
});
expect(result.claims[0].supportingQuote.length).toBeGreaterThan(0);
```

- [ ] **Step 2: Verify contract tests fail**

Run: `npm test -- src/lib/ai src/features/ingestion/link-case.test.ts`  
Expected: FAIL with missing provider contract.

- [ ] **Step 3: Implement strict JSON extraction and grounded summaries**

Validate model output with Zod. Reject unknown claim fields, missing quotations, dates that cannot be normalized, forbidden accusation wording, and summaries containing claims absent from the approved input set.

- [ ] **Step 4: Run AI boundary tests**

Run: `npm test -- src/lib/ai src/features/ingestion/link-case.test.ts`  
Expected: PASS, including malformed JSON and hallucinated-claim fixtures.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ai src/features/ingestion tests/fixtures
git commit -m "feat: extract source-bound claims"
```

### Task 6: Administrator Review and Audit Trail

**Files:**
- Create: `src/lib/auth/session.ts`, `src/lib/auth/roles.ts`
- Create: `src/app/admin/layout.tsx`, `src/app/admin/review/page.tsx`, `src/app/admin/review/[id]/page.tsx`
- Create: `src/features/admin/actions.ts`, `review-panel.tsx`
- Test: `src/features/admin/actions.test.ts`, `tests/e2e/admin-review.spec.ts`

**Interfaces:**
- Produces: `approveDraft(caseId, actorId)`, `rejectDraft(caseId, actorId, reason)`, `requireRole("publisher")`.

- [ ] **Step 1: Write failing authorization and decision tests**

Assert that an anonymous or viewer role cannot approve, a publisher can approve a policy `review` result, and every action writes an immutable `publication_decisions` row.

- [ ] **Step 2: Run the tests**

Run: `npm test -- src/features/admin/actions.test.ts`  
Expected: FAIL with missing actions.

- [ ] **Step 3: Implement OIDC session enforcement and review UI**

The configured OIDC provider must enforce MFA. The review screen renders draft sentences beside supporting excerpts, source URLs, status, conflicts, and policy reason codes. It offers approve and reject actions; it does not offer free-text article editing.

- [ ] **Step 4: Verify unit and browser flows**

Run: `npm test -- src/features/admin && npm run test:e2e -- tests/e2e/admin-review.spec.ts`  
Expected: PASS for denial, approval, rejection, and audit display.

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth src/app/admin src/features/admin tests/e2e/admin-review.spec.ts
git commit -m "feat: add audited publication review"
```

### Task 7: Public Editorial Experience

**Files:**
- Create: `src/features/cases/queries.ts`, `case-card.tsx`, `source-list.tsx`, `timeline.tsx`, `status-label.tsx`
- Create: `src/app/atvejai/[slug]/page.tsx`, `src/app/asmenys/[slug]/page.tsx`, `src/app/savivaldybes/[slug]/page.tsx`, `src/app/skaidrinam/page.tsx`, `src/app/paieska/page.tsx`
- Modify: `src/app/page.tsx`, `src/app/layout.tsx`, `src/styles/globals.css`
- Test: `src/features/cases/source-list.test.tsx`, `tests/e2e/public-site.spec.ts`

**Interfaces:**
- Consumes: published cases and provenance query DTOs.
- Produces: public homepage, case, person, municipality, „Skaidrinam“, register/search routes.

- [ ] **Step 1: Write failing source and status visibility tests**

The component test must verify source title, publisher, date, document number, and URL. The browser test must verify that a search result and case page both show `Išteisintas` after that transition.

- [ ] **Step 2: Run focused tests**

Run: `npm test -- src/features/cases/source-list.test.tsx`  
Expected: FAIL with missing components.

- [ ] **Step 3: Implement the approved editorial layout**

Use a centered masthead, horizontal news stream, asymmetric lead grid, ruled sections, serif headlines, and a restrained black/white/red palette. Avoid uniform card grids, rounded panels, decorative shadows, and LRT brand assets. Each case page includes chronology, inline source markers, full sources, subject position, corrections link, and version history.

- [ ] **Step 4: Verify responsive and accessible behavior**

Run: `npm test && npm run test:e2e -- tests/e2e/public-site.spec.ts`  
Expected: PASS at desktop and mobile Playwright viewports with no serious axe violations.

- [ ] **Step 5: Commit**

```bash
git add src/app src/features/cases src/styles tests/e2e/public-site.spec.ts
git commit -m "feat: build public editorial portal"
```

### Task 8: Corrections, Monitoring, and Historical Import

**Files:**
- Create: `src/app/pataisymai/page.tsx`, `src/features/cases/corrections.ts`
- Create: `src/features/ingestion/jobs/recheck-case.ts`, `src/features/ingestion/monitoring.ts`
- Create: `scripts/import-history.ts`, `scripts/check-sources.ts`
- Test: `src/features/cases/corrections.test.ts`, `tests/integration/recheck-case.test.ts`, `tests/integration/import-history.test.ts`

**Interfaces:**
- Produces: `submitCorrection(input)`, `recheckCase(caseId)`, and idempotent `import-history` CLI.

- [ ] **Step 1: Write failing update and import tests**

Assert that an acquittal creates a visible timeline/version entry, a broken primary URL marks the source unavailable without deleting it, and rerunning the history importer creates no duplicates.

- [ ] **Step 2: Run integration tests**

Run: `npm test -- src/features/cases/corrections.test.ts tests/integration/recheck-case.test.ts tests/integration/import-history.test.ts`  
Expected: FAIL with missing workflows.

- [ ] **Step 3: Implement correction intake, rechecks, and bounded import**

The importer accepts `--from 2021-09-09`, source IDs, and an optional „Skaidrinam“ dataset path. It imports drafts through the same policy code used for current news. Monitoring reports queue failures, stale cases, broken primary links, and failed publication transactions.

- [ ] **Step 4: Verify operational behavior**

Run: `npm test && npm run typecheck && npm run build && npm run check:sources`  
Expected: tests, types, and build pass; the source check emits a machine-readable report and exits nonzero only for configured critical failures.

- [ ] **Step 5: Commit**

```bash
git add src/app/pataisymai src/features/cases src/features/ingestion scripts tests/integration
git commit -m "feat: add corrections and source monitoring"
```

### Task 9: Release Verification and Operations Guide

**Files:**
- Create: `README.md`, `docs/operations.md`, `docs/editorial-policy.md`, `docs/release-checklist.md`
- Modify: `.github/workflows/ci.yml`, `.env.example`
- Test: `tests/e2e/release-smoke.spec.ts`

**Interfaces:**
- Consumes: all application scripts and health endpoints.
- Produces: repeatable deployment, rollback, backup-restore, legal-review, and incident procedures.

- [ ] **Step 1: Write the failing release smoke test**

Cover `/`, a case page, `/paieska`, `/pataisymai`, `/admin/review`, `/api/health`, and a database readiness check. Assert that unpublished drafts never appear in public search.

- [ ] **Step 2: Run the smoke test**

Run: `npm run test:e2e -- tests/e2e/release-smoke.spec.ts`  
Expected: FAIL until health/readiness and test deployment configuration exist.

- [ ] **Step 3: Add operations documentation and CI release gate**

Document environment variables, OIDC/MFA setup, migrations, queue workers, source allowlist changes, backup restoration, rollback, alert routing, corrections response, and required pre-launch legal review. CI runs lint, types, unit/integration tests, build, migration check, Playwright, and axe checks.

- [ ] **Step 4: Execute the full release gate**

Run: `npm run lint && npm run typecheck && npm test && npm run build && npm run test:e2e`  
Expected: every command exits 0. Record the date and commit SHA in `docs/release-checklist.md`.

- [ ] **Step 5: Commit**

```bash
git add README.md docs .github/workflows/ci.yml .env.example tests/e2e/release-smoke.spec.ts
git commit -m "docs: add release and editorial operations"
```

## Final Acceptance

- A fixture-backed A-level final decision reaches the public site without administrator action and every claim links to its source.
- A fixture-backed incomplete investigation stays private until a publisher approves it.
- A C-level-only lead remains private.
- A later acquittal updates the homepage, search, person page, case status, chronology, and version history.
- A duplicate source does not create a duplicate case.
- An unavailable source or failed model call cannot corrupt an existing publication.
- Desktop and mobile flows pass keyboard, Playwright, and axe checks.
- A Lithuanian media-law specialist reviews the editorial policy and first historical import before production launch.
