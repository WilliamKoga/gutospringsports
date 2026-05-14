# Build Tasks: SpringSports Public Site

Generated from: `.design/springsports-public-site/DESIGN_BRIEF.md`  
Date: 2026-05-14

## Foundation

- [ ] **Commit installed skills separately**: Stage `.agents/skills` and `skills-lock.json` in their own commit so design tooling changes are isolated from product code. _Creates/commits: `.agents/skills/*`, `skills-lock.json`._

- [ ] **Apply Supabase homepage curation migration**: Run `app/supabase/migrations/20260514000000_add_homepage_featured_fields.sql` in Supabase SQL Editor, then verify `featured_on_home` and `homepage_order` can be selected from `talents`. _Creates DB fields; reuses existing `talents` table._

- [ ] **Normalize public route map**: Ensure `src/i18n/routing.ts` exposes only `/`, `/catalog`, `/catalog/[slug]`, and `/about`; confirm no public `/inquiry` route or nav remains. _Modifies: routing; reuses next-intl routing._

- [ ] **Document token adoption boundary**: Keep `.design/springsports-public-site/DESIGN_TOKENS.md` as the canonical token spec for this iteration; do not refactor `globals.css` until after public pages are reviewed. _Reuses: existing Tailwind/shadcn tokens._

## Core UI

- [ ] **Home page institutional hero**: Build `/[locale]/page.tsx` with SpringSports positioning, primary Catalog CTA, secondary About CTA, and the “boutique professional scouting platform” tone from the brief. _Modifies: localized home page; reuses `Link`, Supabase server client, Tailwind tokens._

- [ ] **Manual featured talent cards on home**: Query up to three talents where `featured_on_home = true`, ordered by `homepage_order`, and hide the card area entirely when no featured talents exist. _Modifies: home page; reuses profile slugs, `Image`, existing talent data model._

- [ ] **About page**: Create `/[locale]/about` with company positioning, mission, value blocks for clubs/talent/decisions, and a Catalog CTA. _Creates: `src/app/[locale]/about/page.tsx`; reuses localized messages and public layout._

- [ ] **Public navigation**: Update `Header` so public nav contains Home, Catalog, About, plus the existing EN/JP toggle; keep admin out of public navigation. _Modifies: `Header.tsx`; reuses `Header.module.css`._

- [ ] **Remove obsolete home styling**: Delete the old generic landing-page CSS once the new home no longer imports it. _Deletes: `src/styles/home.module.css`; reuses Tailwind classes instead._

- [ ] **Bilingual copy**: Add English and Japanese message keys for Home, About, and nav; remove unused inquiry/contact/PDF messages. _Modifies: `messages/en.json`, `messages/ja.json`; reuses next-intl._

## Admin & Data

- [ ] **Talent type updates**: Add `featured_on_home` and `homepage_order` to `Talent`; remove stale public inquiry/contact types if no code uses them. _Modifies: `src/lib/types.ts`; reuses existing talent interface._

- [ ] **Homepage curation controls in admin form**: Add “Feature this talent on the homepage” checkbox and numeric “Homepage Order” field to `TalentForm`, saving both values through existing API payloads. _Modifies: `TalentForm.tsx`; reuses existing form state and admin API._

- [ ] **Admin dashboard visibility**: Add a Home column to the admin table showing `Featured #order` for curated profiles so the homepage lineup is visible at a glance. _Modifies: `src/app/admin/[secret]/page.tsx`; reuses `Badge` and existing dashboard table._

- [ ] **Migration file**: Keep the SQL migration in source control with `ADD COLUMN IF NOT EXISTS` and an index for featured-home queries. _Creates: `app/supabase/migrations/20260514000000_add_homepage_featured_fields.sql`._

## Interactions & States

- [ ] **Empty featured state**: Verify home renders cleanly with no featured talents and does not show an empty card grid, placeholder copy, or hidden focusable links. _Covers: empty state, accessibility._

- [ ] **Featured-card navigation**: Verify each featured talent card links to the localized profile route using typed next-intl route objects. _Covers: click path, route safety._

- [ ] **Locale switching**: Verify EN/JP toggle preserves equivalent route intent on Home, About, Catalog, and Profile pages. _Reuses: existing `Header.toggleLocale` logic._

- [ ] **Catalog remains neutral**: Confirm the public catalog does not display featured badges or homepage-order metadata. _Reuses: `TalentGrid`, `TalentCard`._

- [ ] **Profile remains read-only**: Confirm profile pages contain no inquiry/contact/download CTAs and still show biography, teams, photo, and highlights. _Reuses: profile page._

## Responsive & Polish

- [ ] **Desktop layout check**: On desktop, confirm home copy and featured talent cards balance visually; About content uses readable line lengths and cards do not feel like a marketing wall. _Breakpoints: 1280px and wider._

- [ ] **Mobile layout check**: On mobile, confirm header does not overflow, home cards stack cleanly, text does not clip, and Japanese copy fits. _Breakpoints: 375px and 640px._

- [ ] **Accessibility pass**: Check keyboard focus on header links, CTAs, featured cards, form fields, and admin actions; confirm image alt text uses talent names and all nav labels are visible text. _Reuses: global focus styles._

- [ ] **Token consistency pass**: Scan new UI for one-off colors/spacing and replace with Tailwind semantic classes or values from `DESIGN_TOKENS.md` where practical. _Reuses: Tailwind/shadcn tokens._

## Verification

- [ ] **Lint**: Run `npm run lint` in `app` and require a clean result. _Command: `npm run lint`._

- [ ] **Build**: Run `npm run build` in `app` and require a clean result. _Command: `npm run build`._

- [ ] **HTTP smoke checks**: With dev server running, verify `/en`, `/ja`, `/en/about`, `/ja/about`, `/en/catalog`, and a sample profile return 200. _Reuses: Next dev server._

- [ ] **Admin smoke checks**: Verify edit page renders homepage feature controls and dashboard renders Home column after the migration is applied. _Reuses: admin secret route._

- [ ] **Supabase schema check**: Query `talents` for `id, featured_on_home, homepage_order` and confirm no `42703` missing-column error. _Depends on: migration applied._

## Review

- [ ] **Design review**: Run `/design-review` against the brief, IA, tokens, and implemented pages.

- [ ] **Commit product changes**: Commit home/about/admin/migration changes separately from installed skills. _Suggested commit: `Add SpringSports public home and about pages`._

- [ ] **Push**: Push `main` after commits and validation are complete. _Command: `git push origin main`._
