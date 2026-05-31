# FitConnect Ads — Deployment Plan

Deploy the **Next.js frontend** and **Django REST API** separately. The database stays on **Supabase PostgreSQL** (already configured via `DIRECT_URL`).

## Architecture (production)

```
┌─────────────┐   HTTPS    ┌─────────────────┐   HTTPS    ┌─────────────────┐
│   Browser   │ ─────────► │    Frontend     │ ─────────► │     Backend     │
│             │            │  Vercel (Next)  │   REST     │ Render / Fly.io │
└─────────────┘            └─────────────────┘            └────────┬────────┘
                                                                     │
                     ┌───────────────────────────────────────────────┤
                     ▼                                               ▼
              ┌─────────────┐                               ┌─────────────┐
              │  Supabase   │                               │ Media disk  │
              │ Postgres    │                               │ (uploads)   │
              │ session     │                               │ on API host │
              │ pooler :5432│                               └─────────────┘
              └─────────────┘
```

| Layer | Stack | Hosted on |
|-------|--------|-----------|
| Frontend | Next.js 16 | **Vercel** (recommended) |
| Backend | Django 6 + DRF + Gunicorn | **Render** or **Fly.io** |
| Database | Supabase PostgreSQL | **Supabase** (no change) |
| Auth | JWT (SimpleJWT) | Issued by backend |
| Uploads | Django `ImageField` → `MEDIA_ROOT` | API server disk or external storage later |

---

## Recommended path (free tier)

| Step | What | Platform |
|------|------|----------|
| 1 | Database (done) | Supabase |
| 2 | API | Render Web Service (Docker) |
| 3 | Web app | Vercel (GitHub deploy) |

**Why split:** Vercel is built for Next.js; Django needs a long-running process and Gunicorn. Supabase holds data so the API host does not need its own Postgres container.

---

## Part 1 — Supabase (database)

Already set up locally in `.env`:

```env
DIRECT_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-1-REGION.pooler.supabase.com:5432/postgres
```

### Rules

| Rule | Detail |
|------|--------|
| Use **Session mode** (port **5432**) | Copy from Supabase → **Connect** → **Session pooler**. Django migrations and ORM need this. |
| Do **not** use port **6543** for Django | Transaction pooler is for serverless/Prisma-style clients, not Django migrations. |
| URL-encode the password | `%` → `%25`, `@` → `%40`, etc. |
| Do **not** set `DATABASE_URL` for Django | The app uses `DIRECT_URL` only (see `backend/backend/settings.py`). |

Migrations (local or CI):

```bash
cd backend
py -3 manage.py migrate
```

---

## Part 2 — Backend deployment

### Option A — Render (recommended)

1. Push the repo to GitHub.
2. [Render](https://render.com) → **New** → **Web Service** → connect the repo.
3. Settings:

| Setting | Value |
|---------|--------|
| **Root directory** | `backend` |
| **Environment** | Docker |
| **Dockerfile path** | `./Dockerfile` (relative to `backend/`) |
| **Instance type** | Free (spins down when idle; cold starts ~30–60s) |

4. **Environment variables** (Render dashboard):

| Variable | Example / notes |
|----------|-----------------|
| `DIRECT_URL` | Same Supabase **session** URI as local `.env` |
| `DJANGO_SECRET_KEY` | Long random string (50+ chars) |
| `DJANGO_DEBUG` | `False` |
| `DJANGO_ALLOWED_HOSTS` | `your-service.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app` |
| `CSRF_TRUSTED_ORIGINS` | `https://your-app.vercel.app` |
| `MEDIA_ROOT` | `/app/media` (default in Docker) |

5. **Persistent disk** (important for trainer images):

   - Render free tier: filesystem is **ephemeral** — uploads are lost on redeploy.
   - For a course demo, that may be acceptable; for production add a **Disk** (paid) mounted at `/app/media`, or use Cloudinary/S3 later.

6. Deploy. The entrypoint runs `migrate`, `collectstatic`, then Gunicorn on port **8000**.

7. Create admin user (one-time):

   ```bash
   # Render shell, or locally with production DIRECT_URL
   python manage.py createsuperuser
   ```

8. Note the public URL: `https://your-service.onrender.com`  
   API base: `https://your-service.onrender.com/api`

### Option B — Fly.io

1. Install [flyctl](https://fly.io/docs/hands-on/install-flyctl/).
2. From `backend/`:

   ```bash
   fly launch
   fly secrets set DIRECT_URL="postgresql://..." DJANGO_SECRET_KEY="..." \
     DJANGO_DEBUG=False \
     DJANGO_ALLOWED_HOSTS=your-app.fly.dev \
     CORS_ALLOWED_ORIGINS=https://your-app.vercel.app \
     CSRF_TRUSTED_ORIGINS=https://your-app.vercel.app
   fly volumes create media_data --size 1
   # Mount volume to /app/media in fly.toml
   fly deploy
   ```

Good when you need a **volume** for uploads on a low budget.

### Option C — Docker on a VPS

Use root `docker-compose.yml` on any VM (Oracle Always Free, etc.):

```bash
cp .env.example .env
# Set DIRECT_URL, DJANGO_SECRET_KEY, production hosts/CORS, NEXT_PUBLIC_API_URL

docker compose up --build -d
```

Expose ports 80/443 with Caddy or nginx in front.

### Backend build (manual)

```bash
cd backend
docker build -t fitconnect-api .
docker run -p 8000:8000 \
  -e DIRECT_URL="postgresql://..." \
  -e DJANGO_SECRET_KEY="..." \
  -e DJANGO_DEBUG=False \
  -e DJANGO_ALLOWED_HOSTS=localhost \
  -e CORS_ALLOWED_ORIGINS=http://localhost:3000 \
  -v fitconnect_media:/app/media \
  fitconnect-api
```

---

## Part 3 — Frontend deployment

### Vercel (recommended)

1. [Vercel](https://vercel.com) → **Add New Project** → import the GitHub repo.
2. Settings:

| Setting | Value |
|---------|--------|
| **Root directory** | `frontend` |
| **Framework preset** | Next.js |
| **Build command** | `npm run build` (default) |
| **Output** | Default (Vercel native build; no Docker required) |

3. **Environment variables** (Production):

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | `https://your-service.onrender.com/api` |
| `API_URL` | Same as above (SSR fetches) |
| `API_ORIGIN` | `https://your-service.onrender.com` |

4. Deploy. Vercel assigns `https://your-app.vercel.app`.

5. **Update backend CORS** with the exact Vercel URL (including `https://`), redeploy the API if needed.

### Frontend Docker (optional)

Only needed if you host Next.js yourself (not on Vercel):

```bash
cd frontend
docker build -t fitconnect-web \
  --build-arg NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api .
docker run -p 3000:3000 \
  -e API_URL=https://your-api.onrender.com/api \
  -e API_ORIGIN=https://your-api.onrender.com \
  fitconnect-web
```

`NEXT_PUBLIC_API_URL` is baked in at **build** time — rebuild after changing the API URL.

---

## Environment variables reference

### Root `.env` (local + Docker Compose)

| Variable | Used by | Purpose |
|----------|---------|---------|
| `DIRECT_URL` | Backend | Supabase session pooler (port 5432) |
| `DJANGO_SECRET_KEY` | Backend | Django secret |
| `DJANGO_DEBUG` | Backend | `True` local, `False` production |
| `DJANGO_ALLOWED_HOSTS` | Backend | API hostname(s), comma-separated |
| `CORS_ALLOWED_ORIGINS` | Backend | Frontend origin(s), comma-separated |
| `CSRF_TRUSTED_ORIGINS` | Backend | Same for HTTPS admin |
| `NEXT_PUBLIC_API_URL` | Frontend build | Public API URL for browser |
| `MEDIA_ROOT` | Backend | Upload path (Docker: `/app/media`) |

### `frontend/.env.local` (local dev)

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
API_URL=http://127.0.0.1:8000/api
API_ORIGIN=http://127.0.0.1:8000
```

Do **not** point the browser at Next.js `/api` — it conflicts with Django routes.

---

## Deployment order (checklist)

### Before deploy

- [ ] Supabase project running; `DIRECT_URL` tested (`py -3 manage.py migrate` succeeds)
- [ ] Strong `DJANGO_SECRET_KEY` generated
- [ ] `DJANGO_DEBUG=False` on production API
- [ ] Password in `DIRECT_URL` is URL-encoded

### Backend

- [ ] Deploy API (Render/Fly/Docker)
- [ ] Set `DJANGO_ALLOWED_HOSTS`, `CORS_*`, `CSRF_*` to real domains
- [ ] Confirm `https://your-api.../api/gyms/` returns JSON (200)
- [ ] Run / confirm migrations on deploy
- [ ] `createsuperuser` for `/admin/`
- [ ] Plan media persistence (disk volume or accept ephemeral on free tier)

### Frontend

- [ ] Set `NEXT_PUBLIC_API_URL` to production API
- [ ] Deploy to Vercel
- [ ] Smoke test: home page loads gyms, login/register, dashboard

### After deploy

- [ ] Register a test gym via `/register`
- [ ] Upload a trainer image (verify it survives if you added a media volume)
- [ ] Fix cold starts on Render free tier (first request may be slow)

---

## Local development

### Without Docker

```bash
# Terminal 1 — API (loads ../.env via settings)
cd backend
py -3 manage.py runserver

# Terminal 2 — Web
cd frontend
npm run dev
```

| URL | Service |
|-----|---------|
| http://localhost:3000 | Frontend |
| http://localhost:8000/api/ | API |

### With Docker Compose

```bash
cp .env.example .env
# Fill DIRECT_URL, DJANGO_SECRET_KEY, etc.

docker compose up --build
```

---

## Platform comparison

| Provider | Frontend | Backend | Supabase | Uploads on free tier |
|----------|----------|---------|----------|----------------------|
| **Vercel** | Excellent | No | N/A | N/A |
| **Render** | Possible | Good (Docker) | External | Ephemeral disk |
| **Fly.io** | Good | Good (Docker) | External | Volumes available |
| **Railway** | Good | Good | External | Credits-based |
| **Supabase** | No | No | Included | N/A |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `invalid percent-encoded token` in password | Encode `%` as `%25` in `DIRECT_URL` |
| Migration timeout / wrong host | Use **session** pooler (`:5432`), not `:6543`; remove stale shell `DATABASE_URL` |
| `DisallowedHost` | Add API domain to `DJANGO_ALLOWED_HOSTS` |
| CORS / “Failed to fetch” | Add exact Vercel URL to `CORS_ALLOWED_ORIGINS`; rebuild frontend if API URL changed |
| Frontend still calls localhost API | Set `NEXT_PUBLIC_API_URL` on Vercel and redeploy |
| Uploads disappear after redeploy | Add Render disk or Fly volume at `MEDIA_ROOT`, or external storage |
| Render free cold start | Wait 30–60s on first request after idle |
| IPv6-only direct Supabase host | Use pooler hostname (`aws-*-*.pooler.supabase.com`), not `db.*.supabase.co` |

---

## Repo layout for hosts

```
web2026/
├── .env                 # Local secrets (do not commit)
├── .env.example
├── docker-compose.yml   # Local full stack
├── DEPLOYMENT.md        # This file
├── backend/             # ← Render / Fly root directory
│   ├── Dockerfile
│   └── docker-entrypoint.sh
└── frontend/            # ← Vercel root directory
    ├── package.json
    └── Dockerfile       # Optional; Vercel uses native build
```

---

## Suggested timeline (university project)

1. **Week 1** — Supabase + local app working (done).
2. **Week 2** — Deploy backend to Render; run migrations; create superuser.
3. **Week 3** — Deploy frontend to Vercel; set `NEXT_PUBLIC_API_URL`; test auth + dashboard.
4. **Week 4** — Optional: media volume, custom domain, or Cloudinary for images.

---

## Security reminders

- Never commit `.env` (use platform secret managers).
- Rotate Supabase password if it was exposed in chat or git history.
- Keep `DJANGO_DEBUG=False` in production.
- Use HTTPS only for `CORS_ALLOWED_ORIGINS` / `CSRF_TRUSTED_ORIGINS` in production.
