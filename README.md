# FleetForge

**FleetForge** is a workflow-driven trucking management application for owner operators and small
fleets. It pairs a marketing landing page with a full back-office app: dispatch loads, track
status, capture documents, monitor compliance, and see profit per load \u2014 all from one platform.

- Marketing site at `/`
- Authenticated app at `/app` (Dashboard / Loads / Drivers / Documents / Compliance / Financials)
- Stack: **React 19 + Tailwind + shadcn/ui** \u00b7 **FastAPI + MongoDB (Motor)** \u00b7 **JWT auth**

---

## Repository layout

```
fleetforge/
├── backend/                 FastAPI service (Python 3.11+)
│   ├── server.py             App entrypoint (mounts /api routers)
│   ├── db.py                 MongoDB (Motor) client + db handle
│   ├── auth.py               JWT auth, password hashing, get_current_user
│   ├── models.py             Pydantic models (User, Driver, Load, Document, ...)
│   ├── routers/              Per-domain routers
│   │   ├── loads.py
│   │   ├── drivers.py
│   │   ├── documents.py
│   │   ├── expenses.py
│   │   ├── compliance.py
│   │   └── dashboard.py      Stats + demo data seed
│   ├── requirements.txt
│   └── .env.example
├── frontend/                React app (CRA + craco)
│   ├── src/
│   │   ├── App.js            Router (marketing + /app + auth)
│   │   ├── lib/              api client, auth context, formatters
│   │   ├── components/       Reusable UI (shadcn + site components)
│   │   ├── pages/
│   │   │   ├── Home.jsx      Marketing landing
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── app/          Authenticated app shell + module pages
│   │   └── mock.js           Static landing-page content
│   ├── package.json
│   └── .env.example
├── docker-compose.yml       Local Mongo + backend + frontend (optional)
├── .gitignore
└── README.md
```

---

## Quick start (local development)

### Prerequisites

- **Python 3.11+**
- **Node.js 20+** with **Yarn** (`npm i -g yarn`)
- **MongoDB 6+** running locally (or via Docker: `docker run -p 27017:27017 mongo:7`)

### 1. Clone & configure environment

```bash
git clone <your-repo-url> fleetforge
cd fleetforge

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` and set a real `JWT_SECRET` (generate one with
`python -c "import secrets; print(secrets.token_urlsafe(48))"`).

### 2. Start the backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

The API will be live at `http://localhost:8001`. Health check: `GET /api/health`.

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
yarn install
yarn start
```

Open `http://localhost:3000`. Click **Start Free** to register a new account \u2014
it will auto-seed realistic demo data (3 drivers, 5 loads, expenses, compliance items).

---

## Running with Docker Compose (optional)

The included `docker-compose.yml` starts MongoDB + backend + frontend together:

```bash
docker compose up --build
```

Then open `http://localhost:3000`.

---

## Environment variables

### Backend (`backend/.env`)

| Variable        | Purpose                                                |
|-----------------|--------------------------------------------------------|
| `MONGO_URL`     | MongoDB connection string                              |
| `DB_NAME`       | Database name                                          |
| `CORS_ORIGINS`  | Comma-separated allowed origins, or `*`                |
| `JWT_SECRET`    | Secret used to sign JWTs                               |

### Frontend (`frontend/.env`)

| Variable                | Purpose                                          |
|-------------------------|--------------------------------------------------|
| `REACT_APP_BACKEND_URL` | Base URL of the FastAPI service (no trailing /) |

> All backend API routes are prefixed with `/api`. The frontend automatically appends `/api`
> to `REACT_APP_BACKEND_URL`, so set the variable to the bare host (e.g. `http://localhost:8001`).

---

## API overview

| Group        | Endpoint                                  | Notes                                    |
|--------------|-------------------------------------------|------------------------------------------|
| Auth         | `POST /api/auth/register`                 | `{email, password, company_name?}`       |
|              | `POST /api/auth/login`                    | Returns `{access_token, user}`           |
|              | `GET  /api/auth/me`                       | Bearer token                             |
| Loads        | `GET/POST /api/loads`                     | Filter `?status=` `?driver_id=`          |
|              | `PATCH /api/loads/{id}`                   | Partial update                           |
|              | `PATCH /api/loads/{id}/status`            | Pending / Dispatched / In Transit / ...  |
|              | `POST  /api/loads/{id}/assign`            | `{driver_id}` (auto-bumps status)        |
| Drivers      | `GET/POST/PATCH/DELETE /api/drivers`      |                                          |
| Documents    | `POST /api/documents/parse`               | Multipart, mocked auto-fill              |
|              | `POST /api/documents/upload`              | Multipart, optional `load_id`/`doc_type` |
|              | `GET/DELETE /api/documents`               |                                          |
| Expenses     | `GET/POST/DELETE /api/expenses`           | Filter `?load_id=`                       |
| Compliance   | `GET/POST/PATCH/DELETE /api/compliance`   | Auto-status from `expires_on`            |
| Dashboard    | `GET  /api/dashboard/stats`               | KPIs                                     |
|              | `POST /api/dashboard/seed`                | Idempotent demo data load                |

All authenticated requests require `Authorization: Bearer <token>`.

---

## Notes on the MVP

- **Document parsing is MOCKED.** `documents/parse` and `documents/upload` classify by filename
  (e.g. `ratecon_3500.pdf` → Rate Confirmation with rate=3500) and return realistic random
  values for pickup/dropoff/customer. Swap `_mock_extract_rate_con` in
  `backend/routers/documents.py` for a real OCR/LLM call to upgrade.
- **Files are stored as base64 inside MongoDB** for simplicity (8MB cap). For production, swap to
  S3/Cloud Storage and store only the URL.
- **Auth** is JWT-only (no email verification or password reset flows). Add via your provider of
  choice when promoting to production.

---

## License

MIT — see `LICENSE` (add your own).
