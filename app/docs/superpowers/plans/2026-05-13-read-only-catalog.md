# Read-Only Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the public catalog and profile pages suitable for sharing directly with teams as read-only pages.

**Architecture:** Keep the existing `/api/talents` endpoint and client-side catalog fetching. Add filter state in `TalentGrid`, pass query parameters already supported by the API, and remove profile-page contact/download actions.

**Tech Stack:** Next.js App Router, React client components, next-intl, Supabase-backed API.

---

### Task 1: Catalog Filters

**Files:**
- Modify: `src/components/catalog/TalentGrid.tsx`

- [ ] Add role and position select controls.
- [ ] Include `role` and `position` query parameters when selected.
- [ ] Show a translated inline error state if fetching fails.

### Task 2: Read-Only Profile

**Files:**
- Modify: `src/app/[locale]/catalog/[slug]/page.tsx`

- [ ] Remove the `Send Inquiry` and `Download PDF` buttons.
- [ ] Remove the unused `Button` import.
- [ ] Keep profile details, biography, teams, highlights, and image intact.

### Task 3: Verification

**Commands:**
- `npm run lint`
- `npm run build`
- `Invoke-WebRequest http://127.0.0.1:3000/en`
- `Invoke-WebRequest http://127.0.0.1:3000/en/catalog`
