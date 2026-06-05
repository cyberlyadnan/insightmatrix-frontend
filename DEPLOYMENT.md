# Deploying InsightMatrix (frontend + backend)

When you move from `localhost` to a live domain, set these variables so the site, API proxy, auth cookies, and **supplier callback redirect URLs** all use the correct hosts.

## Quick production setup

1. Copy env templates on the server:
   - Frontend: use committed `.env.production` (or copy to `.env` before build)
   - Backend: copy `.env.production` → fill `REPLACE_*` secrets → save as `.env` **or** keep as `.env.production` with `NODE_ENV=production`
2. Build and start (never use `next dev` in production):

```bash
# Backend
cd survey-platform-backend
npm ci
npm run build
NODE_ENV=production npm start   # or pm2 — port 5000

# Frontend
cd survey-platform-frontend
npm ci
npm run build                  # uses .env.production + webpack
npm run start                  # port 3000
```

3. Configure nginx using `nginx.conf.example` — **required** for same-server deploys.

---

## Troubleshooting: ChunkLoadError / 500 on `/_next/static/chunks/*.js`

**Symptoms in browser console:**

```
Failed to load resource: 500 (Internal Server Error)  …/_next/static/chunks/….js
Uncaught ChunkLoadError: Failed to load chunk …
```

**Root cause (confirmed on insightmatrix.online):** Static Next.js assets under `/_next/static/` return HTTP 500 while `/` may still load. This is almost always a **deployment / reverse-proxy** issue, not an API env mismatch.

| Check | Fix |
|-------|-----|
| `/_next/static/*` proxied to Express (port 5000) | Route `/_next/` and `/` to Next.js (port 3000) — see `nginx.conf.example` |
| `next dev` running in production | Use `npm run build && npm run start` |
| Stale `.next` after git pull | Delete `.next`, rebuild, restart `next start` |
| `NEXT_PUBLIC_*` changed without rebuild | Re-run `npm run build` (values are baked in at build time) |
| Turbopack build instability | Build uses `next build --webpack` (see `package.json`) |

**Verify on server:**

```bash
curl -I https://insightmatrix.online/_next/static/chunks/webpack.js
# Should be 200 (or 404 on old builds), NOT 500
curl -I https://insightmatrix.online/login
# Should be 200
curl -I https://insightmatrix.online/api/v1/
# Should be 200 JSON from Express
```

## Frontend (`survey-platform-frontend`)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | **Public website URL** (no trailing slash), e.g. `https://app.yourdomain.com`. Used for callback links in Admin → Settings and anywhere we build absolute URLs. |
| `BACKEND_URL` | **Server-only.** Origin of the Express API for Next.js rewrites (`next.config.ts`). |
| `NEXT_PUBLIC_API_URL` | Browser API base. Usually `/api/v1` when the API is proxied on the same domain. |
| `NEXT_PUBLIC_ENABLE_ROUTE_GUARD` | Set `true` in production to protect `/dashboard` and `/admin`. |

### Callback redirect URLs (automatic)

With `NEXT_PUBLIC_APP_URL` set, partners receive URLs like:

- `https://app.yourdomain.com/survey/callback/complete?pid=…`
- `https://app.yourdomain.com/survey/callback/quota-full?pid=…`
- `https://app.yourdomain.com/survey/callback/terminate?pid=…`
- `https://app.yourdomain.com/survey/callback/quality?pid=…`

Copy them from **Admin → Settings → Survey routing callbacks**. Locally, if `NEXT_PUBLIC_APP_URL` is empty, the app uses the current browser origin (`http://localhost:3000`).

### Same-server setup (recommended)

Next and API on one VPS; Next proxies `/api/v1` to Express:

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
BACKEND_URL=http://127.0.0.1:5000
NEXT_PUBLIC_API_URL=/api/v1
NEXT_PUBLIC_ENABLE_ROUTE_GUARD=true
```

### Separate API host

```env
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_API_URL=/api/v1
```

Rebuild/redeploy the frontend after changing `NEXT_PUBLIC_*` variables (they are embedded at build time).

---

## Backend (`survey-platform-backend`)

| Variable | Purpose |
|----------|---------|
| `CLIENT_URL` | **Must match** `NEXT_PUBLIC_APP_URL` — CORS, password-reset links, post-verify redirect. |
| `API_PUBLIC_URL` | Public API origin for **email verification** links (hits the API directly). |
| `COOKIE_DOMAIN` | Parent domain in production, e.g. `.yourdomain.com` or `yourdomain.com`. |
| `COOKIE_SECURE` | `true` when using HTTPS. |

```env
CLIENT_URL=https://yourdomain.com
API_PUBLIC_URL=https://api.yourdomain.com
COOKIE_DOMAIN=yourdomain.com
COOKIE_SECURE=true
```

If the API is only reached via the Next proxy (`/api/v1` on the same host), `API_PUBLIC_URL` can still be `https://yourdomain.com` so verification emails use the proxied path, or the direct API URL if emails should hit Express directly.

---

## Checklist

1. Set `NEXT_PUBLIC_APP_URL` and `CLIENT_URL` to the same public site URL.
2. Set `BACKEND_URL` to where Express actually listens (internal or public).
3. Enable route guard and secure cookies in production.
4. Redeploy frontend after env changes.
5. In Admin → Settings, confirm callback URLs show your live domain before sending them to suppliers.
