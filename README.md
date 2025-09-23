# Fin Agent Monorepo – Dev Apps & Ports

This repo contains multiple UI apps (Vite + Next.js) and a shared backend. Below is the definitive port map for local development and how to run each app cleanly without collisions.

## Apps and Ports

- Backend (Motia): http://localhost:3000
- Next.js app (apps/web): http://localhost:3001
- Vite apps (apps/web-[a–j]):
  - web-a: http://localhost:5174
  - web-b: http://localhost:5175
  - web-c: http://localhost:5176
  - web-d: http://localhost:5177
  - web-e: http://localhost:5178
  - web-f: http://localhost:5179
  - web-g: http://localhost:5180
  - web-h: http://localhost:5181
  - web-i: http://localhost:5182
  - web-j: http://localhost:5183
- Astro landing apps (if running):
  - fin-welcome: http://localhost:3010
  - finagent-landing: http://localhost:4321

## Starting Apps

- Run Next.js (apps/web) + backend:
  - `UI_APP=web ./scripts/start-dev.sh`
  - Or: `pnpm turbo run dev --filter=web --filter=backend`
  - Next.js dashboard: http://localhost:3001/dashboard

- Run a specific Vite UI + backend (example: web-a):
  - `pnpm turbo run dev --filter=web-a --filter=backend`
  - Then open the corresponding port from the list above.

- Run all UIs (not recommended unless needed):
  - `pnpm run dev:all`

## Chat History (apps/web)

- The history-enabled Chat UI is in the Next.js app (apps/web):
  - Dashboard: `/dashboard` (uses ChatInterface with history sidebar)
  - Chat routes: `/chat` and `/chat/[sessionId]`
- API proxy routes are provided under `/app/api/chat/*` and forward to the backend (localhost:3000).
- In development, a mock chat history service is enabled when no production host is detected; it prepopulates sessions for user `user-123`.

## Tips

- If you see the wrong UI on a port, confirm which app actually owns that port using the map above.
- To avoid confusion, prefer running only the UI you’re testing together with the backend.
- `BACKEND_URL` (for API proxies) defaults to `http://localhost:3000` in dev.

