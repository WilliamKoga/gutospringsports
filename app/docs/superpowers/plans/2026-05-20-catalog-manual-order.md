# Catalog Manual Order Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build admin drag-and-drop ordering for the default public catalog page.

**Architecture:** Store catalog ordering in a new `talents.catalog_order` column, separate from homepage curation. Keep query-order decision logic in a small pure helper so it can be tested without mocking Supabase or Next internals. Use a protected admin route for batch order updates and a client component for table drag-and-drop.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase, Node test runner.

---

### Task 1: Order Helper And Test

**Files:**
- Create: `src/lib/catalog-order.ts`
- Create: `src/lib/catalog-order.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `src/lib/catalog-order.test.mjs` with tests for default query detection, filtered query detection, ordered update payloads, and duplicate ID rejection.

- [ ] **Step 2: Run test to verify it fails**

Run: `node src/lib/catalog-order.test.mjs`
Expected: FAIL because `catalog-order.js` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/catalog-order.ts` with `hasCatalogFilters`, `getCatalogOrderMode`, and `buildCatalogOrderUpdates`.

- [ ] **Step 4: Run test through a small JS mirror**

Because the project does not have a TS test runner, create a matching temporary JS implementation only if needed for red-green verification, then remove it before final build. Keep the TypeScript source as the production implementation.

### Task 2: Database And API Ordering

**Files:**
- Create: `supabase/migrations/20260520000000_add_catalog_order.sql`
- Modify: `src/lib/types.ts`
- Modify: `src/app/api/talents/route.ts`

- [ ] **Step 1: Add migration**

Add `catalog_order INTEGER` and an index on `(catalog_order, created_at DESC)`.

- [ ] **Step 2: Apply helper in public API**

Use `getCatalogOrderMode(searchParams)` so unfiltered requests order by `catalog_order ASC NULLS LAST`, then `created_at DESC`; filtered requests order by `created_at DESC`.

### Task 3: Protected Reorder Endpoint

**Files:**
- Create: `src/app/api/admin/talents/order/route.ts`

- [ ] **Step 1: Add route**

Create a `PUT` route that checks `isAdminAuthenticated(req)`, parses `{ ids: string[] }`, validates via `buildCatalogOrderUpdates`, and updates each talent by ID with one-based `catalog_order` values.

### Task 4: Admin Drag-And-Drop UI

**Files:**
- Create: `src/app/admin/[secret]/AdminTalentOrderTable.tsx`
- Modify: `src/app/admin/[secret]/page.tsx`

- [ ] **Step 1: Split admin table into client component**

Move the existing table rendering into `AdminTalentOrderTable` and preserve the current columns/actions.

- [ ] **Step 2: Add drag-and-drop behavior**

Use native HTML drag events. A handle column starts dragging, row drop reorders local state, then saves the complete ID order to `/api/admin/talents/order` with `x-admin-secret`.

- [ ] **Step 3: Update admin query**

Select `catalog_order` and order by `catalog_order ASC NULLS LAST`, then `created_at DESC`.

### Task 5: Verification

**Files:**
- Verify all changed files.

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: exit code 0.

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: exit code 0.
