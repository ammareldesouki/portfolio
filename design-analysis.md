# Portfolio CMS — Design Analysis & Implementation Plan

> Based on the "Kinetic Obsidian" Stitch design export in `/design/stitch_nexus_flutter_portfolio_cms/`

---

## 1. Pages Identified (8)

| # | Page | Route | Type |
|---|------|-------|------|
| 1 | **Home** | `/` | Public |
| 2 | **About & Resume** | `/about` | Public |
| 3 | **Projects** | `/projects` | Public |
| 4 | **Project Details** | `/projects/[slug]` | Public |
| 5 | **Admin Dashboard** | `/admin` | Admin |
| 6 | **Admin Manage Projects** | `/admin/projects` | Admin |
| 7 | **Admin Edit/Create Project** | `/admin/projects/new` & `/admin/projects/[id]/edit` | Admin |
| 8 | **Admin Settings & Media** | `/admin/settings` | Admin |

---

## 2. Reusable Components

### Layout (shared across all pages)
- **`TopNavBar`** — glassmorphic fixed header with logo, nav links, active indicator, "Hire Me" CTA, mobile hamburger menu
- **`Footer`** — copyright line + social links (GitHub, LinkedIn, Twitter)
- **`SideNavBar`** — admin fixed sidebar with icon-nav links, profile card, "Add New Project" CTA
- **`TopAppBar`** — admin sticky top bar with breadcrumb title, notification/launcher icons

### UI Primitives
- **`Button`** — 3 variants: `primary` (Electric Blue + inner-glow), `ghost` (transparent + border), `secondary` (ghost variant)
- **`Chip` / `TechTag`** — small monospaced label (`bg-[#16181D]`, `text-[#666666]`), rounded or pill
- **`Input`** — dark-filled `bg-[#050505]`, `rounded-xl`, focus ring Electric Blue
- **`Select`** — same style as Input with custom chevron icon
- **`Textarea`** — same style as Input, with markdown hint and character count
- **`Toggle`** — dark mode toggle switch
- **`Breadcrumbs`** — simple path with chevron separator
- **`Pagination`** — page number buttons with prev/next
- **`Tabs`** — icon + label tab bar (used in edit form)

### Composite Components
- **`ProjectCard`** (public) — image + tech chips + title + description + links, hover lift with blue border + shadow
- **`ProjectListItem`** (admin) — horizontal card with thumbnail, meta, status badge, edit/preview/delete actions
- **`StatCard`** (admin) — analytics metric with icon, value, trend indicator, colored background glow
- **`ActivityTimelineItem`** — timeline dot + timestamp + event description
- **`Gallery`** — horizontal snap-scroll with arrow buttons
- **`FilterBar` / `FilterPill`** — pill buttons for category/tag filtering
- **`ProfileAvatar`** — circular image with hover edit overlay
- **`Dropzone`** — dashed border upload area
- **`ContactForm`** — name, email, message fields with "Transmit" submit button

---

## 3. Design System

### Colors

```
Background (#050505)                     — Level 0
Surface (#131314)                        — Base surface
Surface Container Low (#1b1c1c)          — Sidebar
Surface Container (#1f2020)              — Cards
Surface Container High (#292a2a)          — Elevated surfaces
Surface Container Highest (#343535)       — Highest elevation
Surface Container Lowest (#0d0e0e)       — Footer

Primary (Electric Blue)  (#aec6ff)       — Text links, accents, active states
Primary Container (#0070f3)              — Buttons, active nav item, key actions
On Primary Container (#ffffff)           — Button text
On Primary (#002e6b)                     — Dark text on primary backgrounds

Tertiary (#48ddbc)                       — Success badges, glow accents
Tertiary Container (#00866f)             — Deeper tertiary

Error (#ffb4ab)                          — Destructive actions
Error Container (#93000a)                — Error backgrounds

On Surface (#e4e2e2)                     — Primary body text
On Surface Variant (#c1c6d7)             — Secondary/muted text
Outline (#8b90a0)                        — Subtle borders
Outline Variant (#414754)                — Stronger borders

Gradients:
  - Surface: linear-gradient(180deg, #0A0C10 0%, #050505 100%)
  - Accent:  linear-gradient(90deg, #0070F3 0%, #50E3C2 100%)
```

### Typography

```
Font Stack:
  Headings → Geist (geometric, engineered)
  Body     → Inter (readability)
  Mono     → JetBrains Mono (technical metadata, code)

Scale:
  display-lg:       64px / 700 weight / -0.04em letter / 1.1 line-height
  display-lg-mobile: 40px / 700 weight / -0.02em letter / 1.2 line-height
  headline-md:      32px / 600 weight / -0.02em letter / 1.3 line-height
  body-base:        16px / 400 weight /  0em    letter / 1.6 line-height
  code-sm:          13px / 400 weight /  0em    letter / 1.5 line-height
  label-caps:       11px / 600 weight /  0.1em  letter / 1   line-height (uppercase)
```

### Spacing

```
Unit:               4px (all spacing must be multiples of 4)
Gutter:             24px
Margin Mobile:      20px
Margin Desktop:     64px
Max Content Width:  1200px
Sidebar Width:      280px
Section Vertical:   48px–64px
```

### Border Radius

```
sm:     0.25rem (4px)
DEFAULT: 0.5rem  (8px)
md:     0.75rem (12px) — cards, inputs, large buttons
lg:     1rem    (16px)
xl:     1.5rem  (24px) — featured hero cards, image containers
full:   9999px         — pill chips, active indicators
```

### Elevation & Glassmorphism

```
Level 0: #050505 background
Level 1: #0A0C10 + 1px rgba(255,255,255,0.1) border
Level 2: #0A0C10 + shadow 0 20px 40px rgba(0,0,0,0.4) + brighter border
Glass:   rgba(10,12,16,0.7) + backdrop-filter: blur(20px)
Inner glow: box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.1)
```

---

## 4. Navigation Flow

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                    PUBLIC SITE                          │
                    │                                                         │
                    │  ┌──────────┐    ┌──────────────┐   ┌───────────────┐  │
                    │  │  HOME    │───▶│  PROJECTS    │──▶│PROJECT DETAILS│  │
                    │  │   /      │    │  /projects   │   │/projects/[id] │  │
                    │  └────┬─────┘    └──────┬───────┘   └───────┬───────┘  │
                    │       │                 │                    │          │
                    │       ▼                 ▼                    │          │
                    │  ┌──────────┐    ┌──────────────┐            │          │
                    │  │ ABOUT /  │    │  FOOTER      │            │          │
                    │  │  RESUME  │    │  (GH, LI,    │            │          │
                    │  │  /about  │    │   Twitter)   │            │          │
                    │  └──────────┘    └──────────────┘            │          │
                    │                                            │          │
                    └─────────────────────────────────────────────────────────┘
                                       │
                              ┌────────┴────────┐
                              │  Auth (JWT)     │
                              │  POST /api/auth │
                              │  /login         │
                              └────────┬────────┘
                                       │
                    ┌─────────────────────────────────────────────────────────┐
                    │                   ADMIN CMS                             │
                    │                                                         │
                    │  ┌─────────┐    ┌────────────┐   ┌──────────────────┐  │
                    │  │DASHBOARD│───▶│  MANAGE    │──▶│  EDIT / CREATE   │  │
                    │  │ /admin  │    │  PROJECTS  │   │  /admin/projects │  │
                    │  └────┬────┘    │/admin/proj │   │  /:id/edit       │  │
                    │       │         └────────────┘   └──────────────────┘  │
                    │       ▼                                                  │
                    │  ┌──────────┐                                            │
                    │  │ SETTINGS │                                            │
                    │  │ & MEDIA  │                                            │
                    │  │/admin/set│                                            │
                    │  └──────────┘                                            │
                    └─────────────────────────────────────────────────────────┘

TopNav:  Home | Projects | About | Resume | Contact
Sidebar: Dashboard | Projects | Skills | Experience | Media | Settings
```

---

## 5. Proposed Project Architecture

```
portfolio-cms/
├── frontend/                          # Next.js 14 (App Router) — SPA consuming REST APIs
│   ├── app/
│   │   ├── (public)/                  # Layout: TopNav + Footer
│   │   │   ├── page.tsx               # Home
│   │   │   ├── about/page.tsx         # About & Resume
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx           # Projects listing
│   │   │   │   └── [slug]/page.tsx    # Project detail
│   │   │   └── layout.tsx
│   │   ├── (admin)/                   # Layout: SideNav + TopAppBar
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx           # Dashboard overview
│   │   │   │   ├── projects/
│   │   │   │   │   ├── page.tsx       # Manage projects
│   │   │   │   │   ├── new/page.tsx   # Create project
│   │   │   │   │   └── [id]/edit/page.tsx
│   │   │   │   └── settings/page.tsx  # Settings + Media
│   │   │   └── layout.tsx
│   │   ├── login/page.tsx             # Admin login page
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                        # Primitives
│   │   ├── layout/                    # TopNavBar, Footer, SideNavBar, TopAppBar
│   │   ├── public/                    # Public page sections
│   │   └── admin/                     # Admin page sections
│   ├── lib/
│   │   ├── api-client.ts              # Axios/fetch wrapper with JWT interceptor
│   │   ├── auth-context.tsx           # Auth context (JWT storage)
│   │   └── utils.ts
│   └── ...
│
├── backend/                           # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts            # MongoDB/Mongoose connection
│   │   │   ├── env.ts                 # Environment variables loader
│   │   │   ├── cloudinary.ts          # Cloudinary SDK config
│   │   │   └── jwt.ts                 # JWT sign/verify helpers
│   │   ├── models/                    # Mongoose schemas
│   │   │   ├── Project.ts
│   │   │   ├── User.ts
│   │   │   ├── Contact.ts
│   │   │   └── Settings.ts
│   │   ├── repositories/              # Data access layer
│   │   │   ├── BaseRepository.ts
│   │   │   ├── ProjectRepository.ts
│   │   │   ├── UserRepository.ts
│   │   │   ├── ContactRepository.ts
│   │   │   └── SettingsRepository.ts
│   │   ├── services/                  # Business logic
│   │   │   ├── AuthService.ts
│   │   │   ├── ProjectService.ts
│   │   │   ├── ContactService.ts
│   │   │   ├── SettingsService.ts
│   │   │   └── MediaService.ts
│   │   ├── controllers/               # Express request handlers
│   │   │   ├── AuthController.ts
│   │   │   ├── ProjectController.ts
│   │   │   ├── ContactController.ts
│   │   │   ├── SettingsController.ts
│   │   │   └── MediaController.ts
│   │   ├── validators/                # Zod request schemas
│   │   │   ├── auth.ts
│   │   │   ├── project.ts
│   │   │   ├── contact.ts
│   │   │   └── settings.ts
│   │   ├── routes/                    # Express routers
│   │   │   ├── index.ts               # Route aggregator
│   │   │   ├── auth.routes.ts
│   │   │   ├── project.routes.ts
│   │   │   ├── contact.routes.ts
│   │   │   ├── settings.routes.ts
│   │   │   └── media.routes.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts      # JWT verification
│   │   │   ├── error.middleware.ts     # Global error handler
│   │   │   ├── validate.middleware.ts  # Zod validation
│   │   │   └── upload.middleware.ts    # Cloudinary upload
│   │   ├── types/
│   │   │   └── index.ts               # Shared TypeScript types
│   │   ├── utils/
│   │   │   └── api-response.ts        # Standardized response format
│   │   └── app.ts                     # Express app setup + middleware
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── design/                            # Stitch design exports (existing)
├── docs/                              # Documentation
└── README.md
```

### Key Technical Decisions

| Concern | Choice |
|---------|--------|
| Monorepo structure | `frontend/` + `backend/` + `design/` + `docs/` |
| Frontend | Next.js 14 (App Router) — pure SPA, no API routes |
| Backend | Node.js + Express + TypeScript |
| Styling | Tailwind CSS with design tokens in `tailwind.config.ts` |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| Database | MongoDB + Mongoose |
| Forms | React Hook Form + Zod |
| Image Storage | Cloudinary |
| Rendering | Server Components by default, Client Components for interactivity |
| SEO | Metadata API + `next/sitemap` |
| HTTP Client | Axios with JWT interceptor |

### Clean Architecture Pattern (Backend)

```
Request → Route → Validator → Controller → Service → Repository → Model → MongoDB
                        ↑           ↑            ↑
                    Zod schema   req/res     Business logic
                                 handling
```

Each feature follows this exact file structure:
```
features/
├── project.routes.ts        # Route definitions
├── project.validator.ts     # Zod input schemas
├── ProjectController.ts     # Request/response handling
├── ProjectService.ts        # Business logic
├── ProjectRepository.ts     # Database operations
└── Project.model.ts         # Mongoose schema
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Admin login → JWT |
| GET | `/api/projects` | No | List public projects |
| GET | `/api/projects/:slug` | No | Single project detail |
| POST | `/api/projects` | Yes | Create project |
| PUT | `/api/projects/:id` | Yes | Update project |
| DELETE | `/api/projects/:id` | Yes | Delete project |
| POST | `/api/contact` | No | Submit contact inquiry |
| GET | `/api/contact` | Yes | List inquiries |
| GET | `/api/settings` | No | Get public settings |
| PUT | `/api/settings` | Yes | Update settings |
| POST | `/api/media/upload` | Yes | Upload to Cloudinary |
| GET | `/api/media` | Yes | List uploaded media |

---

## 6. Implementation Plan

### Phase 1 — Foundation (estimated: 4 days)

**Backend:**
- [x] Initialize backend with Node.js + Express + TypeScript
- [ ] Set up clean architecture folder structure
- [ ] Create env config, database config, JWT config, Cloudinary config
- [ ] Create all Mongoose models: `Project`, `User`, `Contact`, `Settings`
- [ ] Create `BaseRepository` + specific repositories
- [ ] Create validators (Zod) for all entities
- [ ] Create services (Auth, Project, Contact, Settings, Media)
- [ ] Create controllers for all entities
- [ ] Create routes + wire up Express app
- [ ] Create middleware (auth JWT, error handler, validation, upload)
- [ ] Create `app.ts` entry point

**Frontend:**
- [ ] Scaffold Next.js 14 with App Router + TypeScript
- [ ] Configure Tailwind with full design token map (colors, fonts, spacing, radii, shadows)
- [ ] Create API client utility (Axios with JWT interceptor)
- [ ] Create auth context for JWT storage
- [ ] Build UI primitives: `Button` (3 variants), `Chip`, `Input`, `Select`, `Textarea`, `Toggle`, `Breadcrumbs`, `Pagination`, `Tabs`
- [ ] Build layout components: `TopNavBar`, `Footer`, `SideNavBar`, `TopAppBar`
- [ ] Build layout shells: `PublicLayout`, `AdminLayout`, `LoginPage`

### Phase 2 — Admin CMS (estimated: 4 days)

- [ ] **Dashboard** (`/admin`) — `StatCard` grid (4 metrics), recent projects list, `ActivityTimeline`, quick action buttons
- [ ] **Manage Projects** (`/admin/projects`) — `FilterBar`, project list with status badges, hover actions (edit/preview/delete), `Pagination`
- [ ] **Edit / Create Project** (`/admin/projects/[id]/edit` + `/admin/projects/new`) — `Tabs` (Details / Links / Media / Tech Stack), `ProjectForm` with React Hook Form + Zod
- [ ] **Settings & Media** (`/admin/settings`) — `Dropzone` uploader to Cloudinary, `MediaCard` grid, profile form, SEO form, social links manager

### Phase 3 — Public Site (estimated: 3 days)

- [ ] **Home** (`/`) — `HeroSection` with radial glow + CTA, `FeaturedProjects` grid (3 cards), `Footer`
- [ ] **Projects** (`/projects`) — `FilterBar`, 3-column `ProjectCard` grid, `Pagination`
- [ ] **Project Details** (`/projects/[slug]`) — Hero banner with gradient overlay, bento overview grid (challenge + meta card), `ProjectGallery`
- [ ] **About & Resume** (`/about`) — `AboutSection`, `ResumeTimeline`, `Testimonials`, `ContactForm`
- [ ] SEO: per-page metadata, Open Graph tags, `next/sitemap`

### Phase 4 — Polish & Deploy (estimated: 2 days)

- [ ] Responsive audit: mobile nav collapse, bottom nav for admin on mobile
- [ ] Loading states: skeleton screens matching card shapes
- [ ] Error boundaries + custom 404 page
- [ ] Form validation: Zod schemas with inline error messages
- [ ] Confirm dialogs for destructive actions
- [ ] Toast notifications for save/delete/upload success
- [ ] Performance: `next/image` optimization, ISR for public pages
- [ ] Deployment: frontend → Vercel, backend → Railway / Fly.io / VPS
