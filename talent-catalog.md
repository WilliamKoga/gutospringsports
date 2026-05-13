# Basketball Talent Catalog — Project Plan

## Goal

Build a bilingual (EN/JP) B2B web catalog to showcase Brazilian basketball talent (players, coaches, technical staff) to Japanese clubs. Public-facing catalog with search/filter + hidden admin panel for talent management.

---

## Project Type

**WEB** — Next.js 15 (App Router) full-stack application.

---

## Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Data Schema | Unified `talent` table with `role` enum | Simpler admin, one search index, shared card layout |
| Admin Model | Secret URL (`/admin/{secret}`) + password | Single admin (you), no public auth UI needed |
| Deployment | Docker → GitHub → EasyPanel | Your existing infrastructure preference |
| Image Storage | Supabase Storage (direct upload from admin) | Already have Supabase project configured |
| i18n | `next-intl` with EN/JP | Lightweight, App Router compatible |
| Contact | Inquiry form → email via Resend | Already have Resend API key configured |
| PDF Export | `@react-pdf/renderer` server-side | Clean FIBA-style profile sheets |
| Video | YouTube embed URLs per talent | No self-hosting video, just links |

---

## Success Criteria

- [ ] Public catalog loads with talent cards, searchable by name/position/role/nationality
- [ ] Language toggle switches all UI between English and Japanese seamlessly
- [ ] Admin panel at secret URL allows full CRUD (Create, Read, Update, Delete) for talent profiles
- [ ] Photo upload works and images display correctly on cards
- [ ] Contact inquiry sends email notification to admin
- [ ] PDF export generates a clean, printable talent profile
- [ ] YouTube highlights embed on talent detail pages
- [ ] Docker build succeeds and runs on EasyPanel
- [ ] Site renders professionally on mobile and desktop

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **Next.js 15** (App Router) | SSR + API routes, great DX |
| Database | **Supabase** (PostgreSQL) | Already configured, free tier, real-time |
| Storage | **Supabase Storage** | Photo uploads, CDN delivery |
| Styling | **Vanilla CSS** (CSS Modules) | Full control, no framework dependency |
| i18n | **next-intl** | Lightweight, App Router native |
| Email | **Resend** | Already configured with API key |
| PDF | **@react-pdf/renderer** | Server-side PDF generation |
| Auth (admin) | **Simple middleware** | Secret route + env password, no Supabase Auth needed |
| Deploy | **Docker** + **GitHub** → **EasyPanel** | Container-based deployment |

---

## Unified Talent Schema

```sql
CREATE TABLE talents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity
  full_name TEXT NOT NULL,
  full_name_jp TEXT,                    -- Japanese translation
  slug TEXT UNIQUE NOT NULL,            -- URL-friendly: "carlos-silva"
  
  -- Role
  role TEXT NOT NULL CHECK (role IN (
    'player', 'head_coach', 'assistant_coach',
    'athletic_trainer', 'physiotherapist', 'team_manager',
    'scout', 'analyst', 'other_staff'
  )),
  
  -- Player-specific (nullable for non-players)
  position TEXT,                        -- PG, SG, SF, PF, C
  height_cm INTEGER,
  weight_kg INTEGER,
  
  -- Professional
  current_team TEXT,
  nationality TEXT NOT NULL DEFAULT 'Brazilian',
  past_teams TEXT[],                    -- Array of past teams
  bio TEXT,                             -- EN biography
  bio_jp TEXT,                          -- JP biography
  
  -- Media
  photo_url TEXT,                       -- Supabase Storage URL
  highlight_urls TEXT[],                -- YouTube video URLs
  
  -- Contact
  available_for_contact BOOLEAN DEFAULT true,
  
  -- Meta
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Performance index
CREATE INDEX idx_talents_role ON talents(role);
CREATE INDEX idx_talents_slug ON talents(slug);
```

---

## File Structure

```
basketball-scout/
├── .env.local                       # Supabase keys (exists)
├── next.config.ts                   # Next.js + next-intl config
├── Dockerfile                       # Multi-stage production build
├── docker-compose.yml               # Local dev + production
├── .dockerignore
├── middleware.ts                     # i18n routing + admin auth guard
├── messages/
│   ├── en.json                      # English translations
│   └── ja.json                      # Japanese translations
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx           # Root layout with lang toggle
│   │   │   ├── page.tsx             # Homepage / hero
│   │   │   ├── catalog/
│   │   │   │   ├── page.tsx         # Catalog grid with search/filter
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx     # Talent detail profile
│   │   │   └── inquiry/
│   │   │       └── page.tsx         # Contact/inquiry form
│   │   ├── admin/
│   │   │   └── [secret]/
│   │   │       ├── layout.tsx       # Admin layout with auth guard
│   │   │       ├── page.tsx         # Dashboard / talent list
│   │   │       ├── new/
│   │   │           └── page.tsx     # Add new talent
│   │   │       └── edit/
│   │   │           └── [id]/
│   │   │               └── page.tsx # Edit talent
│   │   └── api/
│   │       ├── talents/
│   │       │   ├── route.ts         # GET (list) + POST (create)
│   │       │   └── [id]/
│   │       │       └── route.ts     # GET + PUT + DELETE
│   │       ├── upload/
│   │       │   └── route.ts         # Photo upload to Supabase Storage
│   │       ├── inquiry/
│   │       │   └── route.ts         # Send inquiry email via Resend
│   │       └── pdf/
│   │           └── [id]/
│   │               └── route.ts     # Generate PDF profile
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Nav + language toggle
│   │   │   ├── Footer.tsx           # Footer with branding
│   │   │   └── LanguageToggle.tsx   # EN/JP switcher
│   │   ├── catalog/
│   │   │   ├── TalentCard.tsx       # Grid card component
│   │   │   ├── TalentGrid.tsx       # Grid container with filters
│   │   │   ├── SearchBar.tsx        # Search input
│   │   │   ├── FilterPanel.tsx      # Role/position/nationality filters
│   │   │   └── TalentProfile.tsx    # Full profile detail view
│   │   ├── admin/
│   │   │   ├── TalentForm.tsx       # Create/Edit form
│   │   │   ├── TalentTable.tsx      # Admin list table
│   │   │   ├── PhotoUploader.tsx    # Image upload component
│   │   │   └── AdminLogin.tsx       # Password gate
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Badge.tsx
│   │       └── Modal.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts            # Browser Supabase client
│   │   │   └── server.ts            # Server Supabase client (service role)
│   │   ├── resend.ts                # Resend email client
│   │   └── pdf.ts                   # PDF generation logic
│   ├── i18n/
│   │   ├── request.ts               # next-intl request config
│   │   └── routing.ts               # Locale routing config
│   └── styles/
│       ├── globals.css              # Design tokens, reset, typography
│       ├── catalog.module.css       # Catalog page styles
│       ├── profile.module.css       # Profile detail styles
│       └── admin.module.css         # Admin panel styles
└── public/
    ├── favicon.ico
    └── og-image.png                 # Social sharing image
```

---

## Tasks

### Phase 1: Foundation (Database + Auth)

- [x] **T1: Initialize Next.js project**
  - `npx -y create-next-app@latest ./` with TypeScript, App Router, CSS Modules
  - Install deps: `next-intl`, `@supabase/supabase-js`, `@supabase/ssr`
  - Agent: `frontend-specialist` | Skill: `app-builder`
  - **Verify:** `npm run dev` starts without errors

- [x] **T2: Create Supabase schema + seed**
  - Create `talents` table with schema above via Supabase dashboard or migration SQL
  - Create `talent-photos` storage bucket (public)
  - Insert 2-3 seed records for testing
  - Agent: `database-architect` | Skill: `database-design`
  - **Verify:** `SELECT * FROM talents` returns seed data

- [x] **T3: Set up admin auth middleware**
  - Env var `ADMIN_SECRET` for URL segment, `ADMIN_PASSWORD` for login
  - Middleware checks `/admin/{secret}/*` routes
  - Simple session cookie after password entry
  - Agent: `backend-specialist` | Skill: `api-patterns`
  - **Verify:** `/admin/wrong-secret` returns 404, correct secret shows login

### Phase 2: Core Backend (API + Storage)

- [x] **T4: Build Talent CRUD API routes**
  - `GET /api/talents` — list with search, filter by role/position
  - `POST /api/talents` — create (admin only)
  - `GET /api/talents/[id]` — single talent
  - `PUT /api/talents/[id]` — update (admin only)
  - `DELETE /api/talents/[id]` — delete (admin only)
  - Agent: `backend-specialist` | Skill: `api-patterns`
  - **Verify:** cURL requests return correct responses for all endpoints

- [x] **T5: Photo upload + Supabase Storage**
  - `POST /api/upload` — receives file, uploads to `talent-photos` bucket
  - Returns public URL, saved to talent's `photo_url`
  - Client-side preview before upload
  - Agent: `backend-specialist` | Skill: `api-patterns`
  - **Verify:** Upload an image, see it in Supabase Storage dashboard, URL loads

### Phase 3: Frontend (Catalog + Admin + i18n)

- [ ] **T6: Set up i18n with next-intl**
  - Configure `en.json` and `ja.json` message files
  - Middleware for locale routing (`/en/catalog`, `/ja/catalog`)
  - Language toggle component in header
  - All UI strings translated (catalog labels, buttons, filters, form fields)
  - Agent: `frontend-specialist` | Skill: `frontend-design`
  - **Verify:** Toggle language, all text switches between EN/JP

- [ ] **T7: Build public catalog pages**
  - Homepage with hero, value proposition, CTA to catalog
  - Catalog grid page with search bar + filters (role, position, nationality)
  - Talent detail page with full profile, stats, YouTube embeds, inquiry CTA
  - Mobile-responsive design with premium aesthetics
  - Agent: `frontend-specialist` | Skill: `frontend-design`
  - **Verify:** Browse catalog, search works, profile pages render correctly

- [ ] **T8: Build admin panel**
  - Admin dashboard: table view of all talents with edit/delete actions
  - Add/Edit form: all fields, photo uploader, YouTube URL list, past teams list
  - Confirmation dialogs for delete
  - Agent: `frontend-specialist` | Skill: `frontend-design`
  - **Verify:** Create, edit, delete a talent from admin UI — changes reflect in catalog

### Phase 4: Polish (PDF, Email, Docker, SEO)

- [ ] **T9: Inquiry email + PDF export + Docker + SEO**
  - **Inquiry:** Form on profile page → sends email via Resend with talent name + inquirer info
  - **PDF:** `/api/pdf/[id]` generates downloadable profile sheet
  - **Docker:** Multi-stage Dockerfile + docker-compose.yml for EasyPanel
  - **SEO:** Meta tags, OG image, structured data, proper heading hierarchy
  - Agent: `backend-specialist` + `frontend-specialist` + `devops-engineer`
  - **Verify:** 
    - Submit inquiry → email received
    - Download PDF → opens correctly
    - `docker build .` succeeds
    - Lighthouse SEO score ≥ 90

---

## Phase X: Verification

- [ ] `npm run build` — zero errors
- [ ] `npm run lint` — zero warnings
- [ ] Security scan: no exposed secrets, admin route protected
- [ ] Responsive: catalog + profile + admin work on mobile
- [ ] i18n: all pages work in both EN and JP
- [ ] Docker: `docker build -t basketball-scout .` succeeds
- [ ] Lighthouse: Performance ≥ 80, SEO ≥ 90, Accessibility ≥ 90

---

## Done When

- [ ] Public catalog displays talent cards with search/filter
- [ ] Language toggle works across all pages (EN ↔ JP)
- [ ] Admin panel allows full CRUD with photo upload
- [ ] Inquiry email sends successfully
- [ ] PDF export generates clean profile
- [ ] Docker image builds and runs
- [ ] Site looks premium and professional on all devices
