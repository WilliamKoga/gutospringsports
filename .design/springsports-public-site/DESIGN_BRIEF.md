# Design Brief: SpringSports Public Site

## Problem

Japanese club staff may receive a SpringSports profile link without already knowing who is behind it. Before they evaluate a player, coach, or staff member, they need quick confidence that the site is curated, relevant to Japan, and built for serious basketball review rather than generic self-promotion.

## Solution

The public site introduces SpringSports as a focused scouting bridge between Brazilian basketball talent and Japanese clubs. The home page gives a short institutional explanation, a clear path into the catalog, and up to three manually curated real talent profiles. The about page gives more context on the company’s role, while individual profiles remain clean, read-only pages that can be shared directly with decision makers.

## Experience Principles

1. Confidence over conversion -- The site should help clubs trust the profiles, not push them into contact forms or sales funnels.
2. Real talent over generic marketing -- Use actual profile cards and basketball context as the proof of value.
3. Curated simplicity over marketplace noise -- Keep public navigation and content narrow: Home, Catalog, About, Profile.

## Aesthetic Direction

- **Philosophy**: Boutique professional scouting platform with restrained sports energy.
- **Tone**: Calm, credible, focused, bilingual, and warm without becoming casual.
- **Reference points**: Professional sports scouting portals, private agency profile decks, restrained SaaS dashboards, and club-facing internal tools.
- **Anti-references**: Loud startup landing pages, player fan sites, oversized marketing claims, contact-heavy lead-generation pages, decorative gradient-orb designs, and generic “agency” templates.

## Existing Patterns

Components, tokens, and conventions already in the codebase should remain the starting vocabulary.

- Typography: Geist Sans and Geist Mono loaded in `src/app/layout.tsx`, with tight, bold headings and compact body copy.
- Colors: Dark-first CSS variables in `src/styles/globals.css`; brand orange `#f97316`; zinc/shadcn background, card, border, muted, foreground tokens.
- Spacing: CSS spacing scale from `--space-1` to `--space-24`, plus Tailwind utility spacing already used across pages.
- Components: `Button`, `Badge`, `Card`, `CardContent`, `Input`, `Header`, `Footer`, `TalentGrid`, `TalentCard`, and `TalentForm`.
- Routing: Localized Next.js routes under `[locale]`, currently English and Japanese.
- Content: Messages live in `messages/en.json` and `messages/ja.json`; public copy must be bilingual.

## Component Inventory

| Component | Status | Notes |
| --- | --- | --- |
| Header navigation | Modify | Public nav should expose Home, Catalog, About, and the locale toggle. No inquiry/contact link. |
| Home hero | Modify | Should introduce SpringSports and prioritize Catalog. Secondary CTA can point to About. |
| Featured talent cards | Modify | Home should show up to three manually featured real talents. Hide the card area if none are featured. |
| About page | New | Institutional page explaining SpringSports’ role, mission, and how clubs should use the site. |
| Admin homepage controls | Modify | Talent form should allow “featured on home” and “homepage order”. Dashboard should make featured status visible. |
| Supabase migration | New | Add `featured_on_home` and `homepage_order` fields, with an index for ordered home queries. |
| Catalog | Exists | Remains the primary public evaluation surface. No public featured badge. |
| Talent profile | Exists | Remains read-only and shareable, with biography, history, photo, and highlights. |

## Key Interactions

- A visitor opens `/en` or `/ja` and sees a concise explanation of SpringSports, then can go to the catalog or read About.
- A visitor clicks a featured talent card and lands on that talent’s profile.
- A visitor opens About and learns why SpringSports exists, who it serves, and how to use the catalog/profile links.
- An admin edits a talent, marks it as featured, sets a numeric order, and saves.
- The home page queries only featured talents, orders by homepage order, shows up to three, and hides the card area when no featured talents exist.
- The catalog does not expose whether a talent is featured; homepage curation is private editorial logic.

## Responsive Behavior

- Desktop home layout should place institutional copy beside featured talent cards when featured talents exist.
- Tablet/mobile home layout should stack copy and cards with stable, readable spacing.
- If there are no featured talents, the hero should remain balanced without an empty visual placeholder.
- Header navigation may collapse or simplify at small widths according to the current header pattern.
- Cards must use stable dimensions for photos and avoid text overflow through truncation.

## Accessibility Requirements

- Maintain sufficient contrast between text, card surfaces, borders, and orange accents.
- Links and buttons must have visible focus states using the existing global focus style.
- Talent card images need meaningful alt text using the talent’s name.
- Navigation labels must remain text, not icon-only.
- The Japanese and English pages must expose equivalent structure and meaning.
- Empty featured state must not create hidden-but-focusable controls.

## Out of Scope

- Public contact or inquiry flow.
- Public “featured” badges in the catalog.
- Payment, account login, club dashboards, or saved shortlists.
- Automated ranking, recommendation, or scouting score.
- Manual drag-and-drop ordering in admin; numeric order is enough.
- Replacing the current design system, Tailwind setup, or shadcn component base.
