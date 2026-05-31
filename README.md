# FitConnect Ads

A full-stack gym advertising and management platform. Gym owners register, customize their public page (CMS), and manage classes, membership plans, and trainers. Visitors browse gyms, view offerings, and sign up for updates.

## Architecture

```
┌──────────────┐     HTTPS      ┌──────────────┐     REST/JWT   ┌──────────────┐
│   Browser    │ ─────────────► │   Frontend   │ ────────────► │   Backend    │
│              │                │  Next.js 16  │               │  Django 6    │
└──────────────┘                └──────────────┘               └──────┬───────┘
                                                                      │
                                                                      ▼
                                                               ┌──────────────┐
                                                               │  Supabase    │
                                                               │  PostgreSQL  │
                                                               └──────────────┘
```

| Layer | Technology | Default local URL |
|-------|------------|-------------------|
| Frontend | Next.js 16, React 19, Ant Design, TypeScript | http://localhost:3000 |
| Backend | Django 6, Django REST Framework, SimpleJWT | http://127.0.0.1:8000/api/ |
| Database | PostgreSQL (Supabase session pooler) | via `DIRECT_URL` |
| Admin | Django Admin | http://127.0.0.1:8000/admin/ |

## Repository layout

```
web2026/
├── backend/          # Django API + admin
├── frontend/         # Next.js web app
├── scripts/          # Helper scripts (e.g. local production run)
├── docker-compose.yml
├── .env.example      # Local development env template
├── .env.production.example
├── DEPLOYMENT.md     # Detailed hosting guide (Render + Vercel + Supabase)
└── README.md
```

## Features

- **Public site** — Gym listings, detail pages (classes, plans, trainers), JWT login/register
- **Owner dashboard** — CRUD for classes, plans, trainers; CMS for hero copy and newsletter text
- **REST API** — `/api/gyms/`, `/api/classes/`, `/api/plans/`, `/api/trainers/`, `/api/cms/`, `/api/auth/*`
- **Auth** — Email + password with JWT access/refresh tokens; gym owners scoped to their gym data

---

## Prerequisites

- **Python** 3.12+ (3.14 supported locally)
- **Node.js** 20+ and npm
- **PostgreSQL** — [Supabase](https://supabase.com) project (recommended) or local Postgres
- **Docker Desktop** (optional, for containerized runs)
- **Git**

---

## Development setup

### 1. Clone and configure environment

```bash
git clone <your-repo-url>
cd web2026
cp .env.example .env
cp frontend/.env.example frontend/.env.local
```

Edit **`.env`** at the repo root:

| Variable | Purpose |
|----------|---------|
| `DIRECT_URL` | Supabase **session** pooler URI (port `5432`) |
| `DJANGO_SECRET_KEY` | Django secret key |
| `DJANGO_DEBUG` | `True` for local dev |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000` |
| `CSRF_TRUSTED_ORIGINS` | Same as CORS for local admin |

Edit **`frontend/.env.local`**:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
API_URL=http://127.0.0.1:8000/api
API_ORIGIN=http://127.0.0.1:8000
```

> Use the Django host for API calls. Do **not** point the browser at Next.js `/api` (conflicts with reserved routes).

URL-encode special characters in the database password (`%` → `%25`).

### 2. Backend

```bash
cd backend
py -3 -m pip install -r requirements.txt
py -3 manage.py migrate
py -3 manage.py createsuperuser   # optional, for /admin/
py -3 manage.py runserver 127.0.0.1:8000
```

API base: http://127.0.0.1:8000/api/

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:3000

### 4. Local production-like run (optional)

Uses `.env.production` (Supabase + `DJANGO_DEBUG=False`):

```bash
cp .env.production.example .env.production
# Fill secrets, then:
.\scripts\run-local-production.ps1
```

Or manually:

```bash
cd backend
py -3 manage.py collectstatic --noinput
py -3 manage.py runserver 127.0.0.1:8000 --insecure
```

`--insecure` serves admin static files when `DEBUG=False` on HTTP localhost.

---

## Production setup

Production uses a **split deployment**:

| Component | Platform |
|-----------|----------|
| Database | Supabase PostgreSQL |
| Backend | [Render](https://render.com) (Docker) |
| Frontend | [Vercel](https://vercel.com) |

### Summary

1. **Supabase** — Session pooler connection string → `DIRECT_URL` on Render.
2. **Render** — Root directory `backend`, Docker, port `8000`, env vars from `.env.production.example`.
3. **Vercel** — Root directory `frontend`, set `NEXT_PUBLIC_API_URL=https://<your-api>.onrender.com/api`.
4. **CORS** — Add your Vercel URL to `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` on Render.

Full step-by-step instructions, checklists, and troubleshooting: **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

### Production environment variables

**Render (backend)**

| Variable | Example |
|----------|---------|
| `DIRECT_URL` | Supabase session URI |
| `DJANGO_SECRET_KEY` | Long random string |
| `DJANGO_DEBUG` | `False` |
| `DJANGO_ALLOWED_HOSTS` | `your-service.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app` |
| `CSRF_TRUSTED_ORIGINS` | `https://your-app.vercel.app` |
| `MEDIA_ROOT` | `/app/media` |

**Vercel (frontend)**

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | `https://your-service.onrender.com/api` |
| `API_URL` | Same as above |
| `API_ORIGIN` | `https://your-service.onrender.com` |

---

## Docker instructions

Run **frontend and backend together** with one command from the repo root.

### Requirements

- Docker Engine 24+ and Compose v2
- `.env` file with `DIRECT_URL` (Supabase) and other variables (see `.env.example`)

### Quick start

```bash
cp .env.example .env
# Edit .env — set DIRECT_URL, DJANGO_SECRET_KEY, etc.

docker compose up --build
```

Wait until both services are healthy, then open:

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:8000/api/ |
| Admin | http://localhost:8000/admin/ |

Stop with `Ctrl+C` or `docker compose down`.

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:8000/api/ |
| Admin | http://localhost:8000/admin/ |

### What happens on startup

- **backend** — `docker-entrypoint.sh` runs `migrate`, `collectstatic`, then Gunicorn on port 8000
- **frontend** — Next.js standalone production server; `NEXT_PUBLIC_API_URL` is set at **build** time
- **media** — Uploaded files stored in Docker volume `media_data`

### Useful commands

```bash
# Run in background
docker compose up -d --build

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Create admin user
docker compose exec backend python manage.py createsuperuser

# Stop
docker compose down

# Remove volumes (media only; DB is external Supabase)
docker compose down -v
```

### Build images separately

```bash
cd backend
docker build -t fitconnect-api .

cd frontend
docker build -t fitconnect-web --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000/api .
```

---

## Testing instructions

### Backend (Django)

From `backend/`:

```bash
py -3 manage.py test
```

Run a single app:

```bash
py -3 manage.py test gym
```

With verbosity:

```bash
py -3 manage.py test --verbosity=2
```

**Note:** Test modules exist (`gym/tests.py`) as placeholders. Add `TestCase` classes for models, API permissions, and owner scoping before relying on CI.

#### Suggested manual API checks

```bash
# List gyms (public)
curl http://127.0.0.1:8000/api/gyms/

# Login
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"owner@fitness.com\",\"password\":\"password123\"}"
```

### Frontend

```bash
cd frontend
npm run lint
npm run build    # verifies production build
```

Automated E2E (Playwright) is listed as an optional dependency but not configured in this repo.

### Pre-deploy checklist

- [ ] `py -3 manage.py test` passes (once tests are written)
- [ ] `npm run build` succeeds in `frontend/`
- [ ] `py -3 manage.py migrate` succeeds against production `DIRECT_URL`
- [ ] CORS and `NEXT_PUBLIC_API_URL` match deployed hostnames

---

## API overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/gyms/` | Public | List gyms |
| GET | `/api/gyms/{id}/` | Public | Gym detail |
| GET/POST/PATCH/DELETE | `/api/classes/` | Owner for writes | Classes |
| GET/POST/PATCH/DELETE | `/api/plans/` | Owner for writes | Plans |
| GET/POST/PATCH/DELETE | `/api/trainers/` | Owner for writes | Trainers (multipart for images) |
| GET/PATCH | `/api/cms/` | Owner for writes | CMS items |
| POST | `/api/auth/register/` | Public | Register owner + gym |
| POST | `/api/auth/login/` | Public | JWT login |
| POST | `/api/auth/refresh/` | Public | Refresh token |
| GET | `/api/auth/me/` | Bearer | Current user |

Append `?gym_id=<id>` to filter list endpoints on public gym pages.

---

## Caching and logging notes

### Caching (current behavior)

| Layer | Status | Details |
|-------|--------|---------|
| **Django** | No app-level cache | No Redis/Memcached; `CACHES` not configured. Each request hits the database. |
| **Database** | Connection pooling | Supabase session pooler (`DIRECT_URL`, port 5432). `conn_max_age=0` in settings for compatibility. |
| **DRF** | No response caching | API responses are not cached server-side. |
| **Next.js** | Framework defaults | App Router may cache static segments; public gym pages use `dynamic = 'force-dynamic'` for fresh data. |
| **Static assets** | WhiteNoise (production) | Admin/DRF static files served from `STATIC_ROOT` after `collectstatic`. |
| **Browser** | Standard HTTP | JWT stored in `localStorage`; no service worker cache. |

**Possible future improvements:** Redis for Django cache framework, CDN for `MEDIA_ROOT` uploads (Cloudinary/S3), HTTP cache headers on read-only gym list endpoints.

### Logging (current behavior)

| Layer | Status | Details |
|-------|--------|---------|
| **Django (dev)** | Default | Console output via `runserver`; no custom `LOGGING` dict in `settings.py`. |
| **Gunicorn (Docker/Render)** | Access + error logs | `--access-logfile -` and `--error-logfile -` in `docker-entrypoint.sh` (stdout). |
| **Next.js** | Dev / build logs | `npm run dev` → `.next/dev/logs/`; production logs on Vercel/Node stdout. |
| **Render / Vercel** | Platform logs | View in each provider’s dashboard (runtime and build logs). |

**Recommended production additions** (not yet implemented):

```python
# Example: structured logging in settings.py (future)
LOGGING = {
    'version': 1,
    'handlers': {'console': {'class': 'logging.StreamHandler'}},
    'root': {'handlers': ['console'], 'level': 'INFO'},
}
```

For debugging API issues locally, use Django debug mode (`DJANGO_DEBUG=True`) and browser DevTools → Network (watch CORS and JWT headers).

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Failed to fetch` on frontend | Set `NEXT_PUBLIC_API_URL` to Django (`http://127.0.0.1:8000/api`), not Next `/api` |
| CORS error from Vercel | Add Vercel URL to `CORS_ALLOWED_ORIGINS` on Render; redeploy backend |
| `DisallowedHost` | Add hostname to `DJANGO_ALLOWED_HOSTS` |
| Unstyled Django admin locally | Run `collectstatic` and `runserver --insecure` when `DEBUG=False` |
| `invalid percent-encoded token` in DB URL | URL-encode password in `DIRECT_URL` |
| Port 3000 in use | Stop other Next process or use the port shown in the terminal |

See also **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

---

## License

University project — see course requirements for usage terms.
