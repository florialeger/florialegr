# Copilot / AI agent instructions — florialegr portfolio

This file contains concise, project-specific guidance to help an AI coding agent be productive immediately.

Overview

- This repo is a small full-stack portfolio app:
  - Frontend: React + Vite (ESM) under `src/` (components, pages, hooks, contexts, services).
  - Backend: Express (CommonJS) under `backend/` with MongoDB (mongoose + GridFS) and API routes.
  - Dev runner: `npm run start` runs backend + frontend concurrently; `npm run dev` runs only the frontend (Vite).

Key files / directories (read these first)

- `src/contexts/PortfolioContext.jsx` — central data loader, normalizes backend data and exposes `usePortfolio()`.
- `src/services/api.jsx` — axios instance and low-level API wrappers (baseURL `/api` — proxied by Vite).
- `src/components/sections/` and `src/components/ui/` — principal UI surface; CSS Modules (`*.module.css`) used widely.
- `src/hooks/` — small reusable hooks (magnet, media, theme). Keep hook exports stable to avoid HMR issues.
- `backend/` — Express server entry `serveur.jsx`, routes in `backend/routes/`, controllers in `backend/controllers/`, Mongo config in `backend/config/`.

Important conventions and patterns

- Path aliases: imports use `@` and other aliases (see `vite.config.js`). Prefer those aliases over relative paths.
- Styling: combination of global tokens (`src/assets/styles/global.css`) + component CSS Modules. Avoid changing global tokens without testing across pages.
- Data normalization: `PortfolioContext` normalizes incoming objects (slug, images, links) — update normalization when backend shape changes.
- API wiring: frontend calls `/api/*` via `src/services/api.jsx`; Vite proxies `/api` to backend (port 5000). When adding endpoints, update both server routes and any frontend wrapper.
- Hook stability: exports should remain the same shape (default ref setter or named exports) to avoid Fast Refresh warnings like "default export is incompatible".

Developer workflows & useful commands

- Start frontend only (fast):
  - `npm run dev` (Vite at http://localhost:5173 or next free port)
- Start full stack (backend + frontend):
  - `npm run start` (runs `npm run backend` + `npm run frontend`). Backend listens on port 5000 by default.
- Seed backend with demo data: `npm run seed` (runs `backend/importData.jsx`).
- Lint: `npm run lint` (ESLint + project config).
- Build: `npm run build` (Vite production build for frontend).

Runtime notes & debugging tips

- Ports: frontend uses Vite (5173/5174); backend uses PORT from `backend/.env` or 5000. Vite proxies `/api` to backend — ensure backend is running when testing API calls.
- HMR caveat: changing module export shape (e.g., replacing a hook implementation with a different kind of export) can trigger "Could not Fast Refresh ('default' export is incompatible)". Prefer editing implementation without changing exported identifiers/signature.
- Debugging API: backend routes are in `backend/routes/*.jsx`. Use Postman or curl against `http://localhost:5000/api/...` or the frontend proxy at `/api/...`.
- DB: `backend/config/db.jsx` configures mongoose/connection. If seeding failing, check `backend/.env` credentials.

Integration points & external deps

- MongoDB + mongoose + GridFS (see `backend/config/gridfs.jsx` and file upload middleware). File endpoints live in `backend/routes/fileRoutes.jsx`.
- Framer Motion, GSAP, MUI are used for UI; prefer CSS-driven effects for lightweight interactions unless animation control requires a library.
- Axios is used (`src/services/api.jsx`). Keep baseURL as `/api` to use Vite proxy.

When making changes

- Update `src/contexts/PortfolioContext.jsx` when API payloads change — frontend relies on its normalization logic.
- If you add backend routes, also update `backend/config/swagger.jsx` to document them and ensure the frontend wrapper in `src/services/api.jsx` mirrors the contract.
- Keep CSS Module class names local. For a global token change, update `src/assets/styles/designTokens.js` and `global.css`.

Examples (common edits)

- Add a new API wrapper:
  - Add an Express route in `backend/routes/`, a controller in `backend/controllers/`, then add wrapper in `src/services/api.jsx` and consume via `src/contexts/PortfolioContext.jsx` or pages.
- Add a component-level style:
  - Create `MyComponent.jsx` and `MyComponent.module.css`; import classes via `import styles from './MyComponent.module.css'`.

If anything is unclear or you want a different level of detail (more files, a diagram, or onboarding checklist), say so and I will iterate.
