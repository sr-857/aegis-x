# Aegis Reconnaissance Intelligence Suite

> **Advanced attack surface reconnaissance and vulnerability intelligence platform** — A production-grade SaaS frontend featuring a premium gold/black cinematic aesthetic built with Next.js 14, Tailwind CSS, and shadcn/ui.

![Aegis Gold Platform](https://img.shields.io/badge/Platform-Aegis%20Gold-f2ca50?style=for-the-badge&labelColor=0a0a0a)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## Overview

Aegis is a cybersecurity SaaS intelligence platform that provides real-time reconnaissance, vulnerability triage, asset discovery, and live operations monitoring. The frontend delivers a premium cinematic experience with gold-on-black aesthetics, smooth animations, and a responsive design that works across desktop and mobile.

### Screenshots

> *(Screenshots available at `/public/screenshots/` in future releases)*

| Executive Dashboard | Vulnerability Triage | Live Operations |
|:---:|:---:|:---:|
| KPI grid, attack surface charts, threat feed | Queue-based analysis with bulk actions | Real-time worker telemetry and terminal |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.4 |
| Styling | Tailwind CSS 3.4 + CSS Variables |
| Components | shadcn/ui + Radix UI primitives |
| Animation | Framer Motion 11 |
| Charts | Recharts 2 |
| State | Zustand (stores) + React Query |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Project Structure

```
recon-intelligence/
├── apps/
│   └── web/                    # Next.js 14 production app
│       └── src/
│           ├── app/           # App Router pages (route groups)
│           │   ├── (auth)/     # Authentication routes
│           │   ├── (dashboard)/# Protected dashboard routes
│           │   └── ...
│           ├── components/    # UI components
│           │   ├── ui/         # shadcn/ui primitives (15 components)
│           │   ├── shared/     # Shared business components
│           │   ├── navigation/ # AppShell, Sidebar, TopNav
│           │   └── charts/     # DonutChart, TimelineNode
│           ├── lib/            # Business logic
│           │   ├── api/        # Mock service + API abstraction
│           │   ├── hooks/      # React Query hooks (7 hooks)
│           │   ├── stores/     # Zustand stores (5 stores)
│           │   └── utils.ts    # Shared utilities
│           ├── types/          # TypeScript interfaces
│           └── styles/         # Global CSS + design tokens
├── local-dev/                  # Vite + React standalone (alternative dev)
│   └── src/
│       ├── App.tsx            # React Router routing
│       └── ...
├── packages/                   # Shared packages (future)
├── .github/workflows/         # CI/CD pipelines
├── turbo.json                 # Turborepo config
└── package.json               # Workspace root
```

---

## Features

### Pages (8 total)

| Page | Route | Description |
|---|---|---|
| **Login** | `/login` | Operator authentication with field validation |
| **Executive Dashboard** | `/executive` | KPI grid, attack surface charts, live feed, top threats |
| **Intelligence Explorer** | `/explorer` | Asset search, filters, sort, risk scores |
| **Vulnerability Triage** | `/vulnerabilities` | Queue-based analysis, bulk resolve, analyst notes |
| **Live Operations** | `/operations` | Real-time worker telemetry, terminal log stream |
| **Asset Intelligence** | `/assets` | Asset analysis workspace with radar charts |
| **Settings** | `/settings` | Display, notification, scan engine, security prefs |
| **Notifications** | `/notifications` | Alert feed with filter persistence |

### Core Capabilities

- **Auth Guard** — Middleware-protected routes with session persistence
- **Mock Data Fallback** — `NEXT_PUBLIC_USE_MOCK=true` enables realistic demo data
- **Global Search** — `/` keyboard shortcut opens cross-asset/vulnerability search
- **Command Palette** — `⌘K` for quick navigation and actions
- **Keyboard Shortcuts** — `G+D/E/V/O/A/S/N`, `H`, `B`, `N`, `R`, `?`
- **New Scan Dialog** — Simulated scan event injection with progress
- **Export** — JSON export on Explorer, Assets, and Vulnerabilities pages
- **Pagination** — Load-more on vulnerability list (10 items at a time)
- **Filter Persistence** — Notification and operations log filters persist in localStorage
- **Copy to Clipboard** — CopyButton on IPs, hostnames, DNS values, CVE titles
- **Shared Component** — `AssetDetailView` reused across Explorer and Assets pages
- **Loading States** — Skeleton screens on all pages
- **Error Boundary** — Graceful error handling with retry
- **Demo Badge** — Indicates mock/demo mode on dashboard pages
- **Connection Status** — Simulated/Live/Disconnected indicator
- **Back to Top** — Floating button after 400px scroll
- **Page Title** — Hydration-safe title management

---

## Installation

### Prerequisites

- Node.js 18+
- npm 10+

### Setup

```bash
# Clone the repository
git clone https://github.com/sr-857/aegis-x.git
cd aegis-x

# Install all dependencies (monorepo)
npm install

# Start the Next.js dev server
npm run dev:web
```

For the Vite alternative (no Next.js):

```bash
cd local-dev
npm install
npm run dev
# → http://localhost:5173
```

---

## Environment Variables

Copy `.env.example` to `.env.local` in `apps/web/`:

```bash
cp apps/web/.env.example apps/web/.env.local
```

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_USE_MOCK` | `true` | Use mock data (set `false` for real API) |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API base URL |
| `NEXT_PUBLIC_WS_URL` | `http://localhost:8000` | WebSocket URL |
| `NEXT_PUBLIC_DEV_MODE` | `true` | Enable debug logging |

---

## Development

```bash
# Next.js development (port 3000)
npm run dev:web

# Vite development (port 5173)
npm run dev:local

# Type check
npm run typecheck

# Lint
npm run lint

# Production build
npm run build:web

# Preview production build
cd apps/web && npm run start
```

---

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd apps/web
vercel --prod
```

Or connect via GitHub integration in the Vercel dashboard.

### Environment Variables (Vercel)

Configure these in Vercel project settings:

- `NEXT_PUBLIC_USE_MOCK` → `false` (production)
- `NEXT_PUBLIC_API_URL` → Your production API URL
- `NEXT_PUBLIC_WS_URL` → Your production WebSocket URL
- `VERCEL_TOKEN` → For GitHub Actions deployment
- `VERCEL_ORG_ID` → For GitHub Actions deployment
- `VERCEL_PROJECT_ID` → For GitHub Actions deployment

---

## Architecture

### State Management

- **Zustand Stores** — Auth, sidebar, scan, notification, dashboard, toast
- **React Query** — Server state with 30s stale time, no window focus refetch
- **LocalStorage** — Notification filter, auth session, sidebar state

### API Layer

```
Mock Service (always available)          Real API (when USE_MOCK=false)
         ↓                                          ↓
  mock-service.ts                            service.ts
         ↓                                          ↓
      api/index.ts ─── fetch wrapper ──────────────→ api/index.ts
         ↓
  React Query hooks (useAssets, useVulnerabilities, etc.)
```

### Design Tokens

All colors, spacing, typography, and animations are defined via:
- **CSS Variables** in `globals.css`
- **Tailwind theme** in `tailwind.config.js`

Gold palette: `#f2ca50`, `#ffc551`, `#ffb4ab` (critical)
Dark palette: `#0a0a0a`, `#121212`, `#1a1a1a`, `#2a2a2a`

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE)

---

## Authors

Built with precision by the Aegis Intelligence Team.  
Repository: [github.com/sr-857/aegis-x](https://github.com/sr-857/aegis-x)