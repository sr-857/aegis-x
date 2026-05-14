# Aegis Local Dev

Vite + React development setup for the Aegis Reconnaissance Intelligence Suite.

## Quick Start

```bash
cd local-dev
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

## Backend Integration (optional)

```bash
uvicorn main:app --reload
```

API: http://localhost:8000
WebSocket: ws://localhost:8000/ws

Vite proxies `/api` → `localhost:8000` and `/ws` → `ws://localhost:8000`.

## Environment Variables

```bash
cp .env.example .env.local
```

| Variable | Default | Description |
|---|---|---|
| `VITE_USE_MOCK` | `true` | Use mock data instead of real API |
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend API URL |
| `VITE_WS_URL` | `ws://localhost:8000` | WebSocket URL |
| `VITE_DEV_MODE` | `true` | Enable debug logging |
| `VITE_LOG_LEVEL` | `debug` | Log verbosity |

## Features

- **Mock data fallback** — `VITE_USE_MOCK=true` uses realistic mock data
- **API proxying** — Vite proxies requests to backend in dev
- **Hot reload** — HMR enabled with error overlay
- **Lazy loading** — Pages load on demand for fast iteration
- **Gold/black theme** — Matches the production aesthetic

## Scripts

```bash
npm run dev      # Dev server with HMR
npm run build     # Production build
npm run preview   # Preview production build
npm run typecheck # TypeScript check
```

## Demo Login

Any Operator ID with a 4+ character Clearance Key works.

## Routes

| Path | Page |
|---|---|
| `/login` | Authentication |
| `/executive` | Executive Dashboard |
| `/explorer` | Intelligence Explorer |
| `/vulnerabilities` | Vulnerability Triage |
| `/operations` | Live Operations |
| `/assets` | Asset Intelligence |
| `/settings` | Settings |
| `/notifications` | Notifications |