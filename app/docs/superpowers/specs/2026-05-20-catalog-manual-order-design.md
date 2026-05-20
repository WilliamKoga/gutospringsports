# Catalog Manual Order Design

## Goal

Let admins manually control the default order of profiles on the public catalog page by dragging rows in the existing admin list.

## Scope

The manual order applies only to the default catalog view, when no search, role, or position filter is active. Filtered and searched catalog requests keep the existing newest-first ordering.

## Approach

Add a `catalog_order` integer column to `talents`, separate from the existing `homepage_order`. The admin dashboard reads talents by `catalog_order ASC NULLS LAST`, then `created_at DESC`, and renders a client-side sortable table. When an admin drops a row, the browser sends the ordered IDs to a protected API route that updates each profile's `catalog_order`.

The public `/api/talents` route orders by `catalog_order` only when no `search`, `role`, or `position` query parameter is present. With any of those parameters present, it keeps ordering by `created_at DESC`.

## Components

- `supabase/migrations/20260520000000_add_catalog_order.sql`: adds `catalog_order` and an index for default catalog reads.
- `src/lib/catalog-order.ts`: small pure helpers for detecting the default catalog query and creating order updates.
- `src/app/api/talents/route.ts`: applies manual order only for the unfiltered default catalog.
- `src/app/api/admin/talents/order/route.ts`: protected reorder endpoint.
- `src/app/admin/[secret]/AdminTalentOrderTable.tsx`: client component that handles drag-and-drop and save state.
- `src/app/admin/[secret]/page.tsx`: fetches the new field and delegates table rendering to the client component.
- `src/lib/types.ts`: exposes `catalog_order` on `Talent`.

## Error Handling

The reorder endpoint rejects unauthenticated requests, invalid payloads, empty ID lists, and duplicate IDs. Supabase update failures return a `500` with a generic error message and log the server-side detail.

The admin table keeps its previous order if saving fails and shows a short inline error. While saving, rows remain visible and actions are disabled only where needed.

## Testing

Add a focused Node test for the pure ordering helper: unfiltered queries use manual order, filtered/searched queries use newest-first, and duplicate IDs are rejected. Then run lint and build to verify the Next app compiles.
