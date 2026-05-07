# FleetForge \u2014 Backend (FastAPI)

## Run locally

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env       # then edit JWT_SECRET
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

Health check: `GET http://localhost:8001/api/health`.

## Project structure

- `server.py` \u2014 FastAPI app, mounts every router under `/api`, configures CORS and Mongo indexes
- `db.py` \u2014 Async Motor client + `db` handle
- `auth.py` \u2014 JWT token helpers, bcrypt password hashing, `get_current_user` dependency
- `models.py` \u2014 Pydantic v2 models (User, Driver, Load, Document, Expense, ComplianceItem)
- `routers/` \u2014 One router per domain
  - `loads.py`, `drivers.py`, `documents.py`, `expenses.py`, `compliance.py`, `dashboard.py`

## Conventions

- All routes are prefixed with `/api`.
- Every record has a UUID `id` string and a `user_id` for tenant isolation.
- Authentication is `Authorization: Bearer <token>`; tokens last 14 days by default.
- Mocked rate-confirmation parsing lives in `routers/documents.py` (`_mock_extract_rate_con`).
  Replace that function to add real OCR.

## Useful commands

```bash
# Format
black .

# Lint
flake8

# Run tests (if/when added)
pytest
```
