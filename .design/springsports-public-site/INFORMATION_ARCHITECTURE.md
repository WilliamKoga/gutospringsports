# Information Architecture: SpringSports Public Site

## Site Map

- Root redirect `/`
  - Redirects to default localized home, currently `/en`.
- Home `/en`, `/ja`
  - Institutional introduction to SpringSports.
  - Primary path to Catalog.
  - Secondary path to About.
  - Optional featured talent cards, shown only when manually curated in admin.
- Catalog `/en/catalog`, `/ja/catalog`
  - Searchable and filterable talent index.
  - Uses API query parameters for search, role, and position.
  - Links to individual talent profiles.
  - Talent Profile `/en/catalog/[slug]`, `/ja/catalog/[slug]`
    - Read-only detail page for a single player, coach, or staff member.
    - Contains identity, bio, team history, measurements, photo, and highlights.
- About `/en/about`, `/ja/about`
  - Institutional explanation of SpringSports, the Brazil-Japan bridge, and how clubs should use the site.
- Admin `/admin/[secret]`
  - Protected talent dashboard.
  - New Talent `/admin/[secret]/new`
  - Edit Talent `/admin/[secret]/edit/[id]`
  - Login `/admin/[secret]/login`
- API
  - Talents `/api/talents`
  - Talent by id `/api/talents/[id]`
  - Upload `/api/upload`
  - Admin session `/api/admin/session`

## Navigation Model

- **Primary navigation**: Header contains Home, Catalog, About. Maximum three public content links to preserve the narrow, curated site model.
- **Secondary navigation**: Profile pages include a contextual “Back to Catalog” link. About page includes a Catalog CTA. Home includes Catalog and About CTAs.
- **Utility navigation**: Locale toggle in the header. Admin is intentionally hidden from public nav and accessed only by secret URL.
- **Mobile navigation**: Current header hides nav links at narrow widths and keeps logo plus locale toggle. If mobile navigation is expanded later, keep the same three-link model: Home, Catalog, About.

## Content Hierarchy

### Home

1. SpringSports identity and value proposition -- The visitor first needs to understand what the company is and why the profile link is credible.
2. Catalog CTA -- The highest-value action is reviewing talent, not contacting SpringSports.
3. About CTA -- Supports visitors who need more company context before reviewing profiles.
4. Featured talent cards -- Real, manually curated proof of value. Shown only when admin marks profiles as featured.
5. Three supporting principles -- Curated profiles, Brazil-Japan bridge, and shareable profiles.

### Catalog

1. Page title and description -- Confirms the user is viewing the talent index.
2. Search and filters -- Primary working controls for finding relevant talent.
3. Talent card grid -- Main browsing surface.
4. Empty/error states -- Clarify whether there are no matches or the catalog failed to load.

### Talent Profile

1. Back to Catalog -- Supports evaluation flow without trapping the user.
2. Photo and identity -- Establishes who the profile is about.
3. Role, position, and measurable details -- Fast scanning for club staff.
4. Team history and current team -- Career context.
5. Biography -- Human/professional context in the selected locale.
6. Highlights -- Evaluation media embedded directly when YouTube links are available.

### About

1. SpringSports positioning -- Explains the company as a focused scouting bridge.
2. Mission/role -- Defines what SpringSports does and does not do.
3. Audience-specific value blocks -- Clubs, talent, and decision context.
4. How to use the site -- Drives users back to Catalog with clear expectations.

### Admin Dashboard

1. Talent count and add action -- Quick orientation and creation path.
2. Talent table -- Operational view of existing profiles.
3. Homepage featured status -- Makes curation visible without opening every profile.
4. Edit action -- Primary management path.

### Admin Talent Form

1. Identity -- Name, Japanese name, and slug.
2. Role and player-specific stats -- Role, position, height, weight.
3. Professional context -- Current team, nationality, past teams.
4. Biography -- English and Japanese bio.
5. Highlights -- YouTube links shown on profile.
6. Homepage feature controls -- Manual home visibility and numeric order.
7. Photo -- Upload and preview.
8. Save/delete actions -- Form completion.

## User Flows

### Club Staff Evaluates a Shared Profile

1. User opens a direct profile link, such as `/en/catalog/henrique-coelho`.
2. User sees photo, role, position, team information, biography, and highlights.
3. User watches embedded highlights or opens YouTube fallback.
4. User uses “Back to Catalog” if they want to compare other talent.

### Club Staff Starts From the Home Page

1. User opens `/en` or `/ja`.
2. User reads the SpringSports positioning.
3. User chooses:
   - If ready to review talent -> clicks Catalog.
   - If needing company context -> clicks About, then Catalog.
   - If a featured card is visible and relevant -> clicks that profile directly.

### Admin Curates Homepage Talent

1. Admin opens `/admin/[secret]`.
2. Admin scans the Home column to see current featured profiles.
3. Admin opens a talent edit page.
4. Admin checks “Feature this talent on the homepage”.
5. Admin sets Homepage Order.
6. Admin saves.
7. Home page shows the talent if the Supabase migration has been applied and the talent is among the first three ordered featured profiles.

### Admin Adds New Talent

1. Admin opens `/admin/[secret]/new`.
2. Admin enters identity, role, professional context, biography, photo, and highlights.
3. Admin optionally marks the talent as homepage featured.
4. Admin saves and returns to the dashboard.
5. Talent appears in Catalog and, if featured, on Home.

## Naming Conventions

| Concept | Label in UI | Notes |
| --- | --- | --- |
| Public index of people | Catalog | Short, neutral, and already used across the product. |
| Individual person record | Talent / Profile | “Talent” in admin/catalog context; “Profile” for public detail links. |
| Homepage curation | Feature on homepage | Admin-only label; avoid public “featured” badges in catalog. |
| Homepage order | Homepage Order | Numeric admin control for the first three home cards. |
| Company explanation | About | Familiar public navigation term. |
| Video links | Highlights | Sports-native label, used on profiles and admin. |
| Language switch | EN / JP | Compact header utility. |

## Component Reuse Map

| Component | Used on | Behavior differences |
| --- | --- | --- |
| `Header` | All localized public pages | Shows Home, Catalog, About, and language toggle. Hidden from admin layout. |
| `Footer` | All localized public pages | Static brand tagline and copyright. |
| `TalentGrid` | Catalog | Client-side search/filter controls and talent loading states. |
| `TalentCard` | Catalog | Public card in multi-column grid. Does not show homepage featured state. |
| Home featured card markup | Home | Uses compact horizontal card layout for up to three manually selected talents. |
| `TalentForm` | Admin new/edit | Full editing surface, including homepage curation controls. |
| `Badge` | Catalog/profile/admin | Role badges and admin featured indicator. |
| `Button` | Admin and CTAs | Shared button styling for actions. |
| Locale layout | `/[locale]/*` | Wraps public pages with provider, header, main, and footer. |

## Content Growth Plan

- **Talent profiles** will grow over time. Catalog already supports role, position, and search filters. If the catalog exceeds comfortable browsing size, add pagination or server-side filter persistence before adding more navigation depth.
- **Homepage featured talent** is intentionally capped at three. Growth is handled by admin curation, not by adding more public sections.
- **About content** should remain fixed and concise. If company proof grows, add one small “How we work” or “Selection process” section rather than creating multiple company pages.
- **Highlights** grow per profile as URL arrays. Keep them inside the profile rather than creating a separate video library.
- **Locales** currently support English and Japanese. Any new public page must be represented in both message files before release.

## URL Strategy

- Pattern: localized public routes live under `/{locale}`.
- Supported locales: `/en`, `/ja`.
- Home: `/{locale}`.
- About: `/{locale}/about`.
- Catalog: `/{locale}/catalog`.
- Profile: `/{locale}/catalog/{slug}`.
- Dynamic segments:
  - `{locale}`: `en` or `ja`.
  - `{slug}`: talent slug, controlled in admin.
  - `{secret}`: admin secret URL segment.
  - `{id}`: Supabase talent id for admin/API editing.
- Query parameters:
  - Catalog API supports `search`, `role`, and `position`.
  - Public catalog UI currently keeps filters in component state rather than URL state.
  - Future shareable catalog filters may mirror the API parameters in the browser URL.
- Admin URLs are not localized and should remain outside public navigation.
