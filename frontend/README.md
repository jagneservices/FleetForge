# FleetForge \u2014 Frontend (React)

## Run locally

```bash
yarn install
cp .env.example .env        # edit REACT_APP_BACKEND_URL if your API is not on :8001
yarn start
```

Then open http://localhost:3000.

## Build for production

```bash
yarn build
```

Output goes to `build/`. Serve it with any static host (nginx, Cloudflare Pages, Vercel, S3+CloudFront, ...).

## Project structure

- `src/App.js` \u2014 Routes (`/`, `/login`, `/register`, `/app/*` behind `RequireAuth`)
- `src/lib/`
  - `api.js` \u2014 axios instance with bearer token interceptor
  - `auth.jsx` \u2014 React context for auth state + persistence
  - `RequireAuth.jsx` \u2014 route guard
  - `format.js` \u2014 currency, status helpers, statuses enum
- `src/components/`
  - `ui/` \u2014 shadcn primitives
  - `site/` \u2014 marketing landing components
- `src/pages/`
  - `Home.jsx`, `Login.jsx`, `Register.jsx`
  - `app/` \u2014 authenticated app shell + module pages (Dashboard, Loads, LoadDetail, LoadNew,
    Drivers, Documents, Compliance, Financials)

## Conventions

- All API calls go through `src/lib/api.js`. The base URL is
  `${REACT_APP_BACKEND_URL}/api`. Never hard-code the URL.
- Auth token is stored under `ff_token` in localStorage; user under `ff_user`.
- Brand colors: gold `#d4a23a`, charcoal `#0a0a0a`. Use Tailwind utilities; avoid inline
  hex outside the design tokens above.
