# Deployment

The app runs as a **single Node service on Railway** (`tipprunde`), serving the
custom server in `apps/web/server/app.ts`. The Cloudflare Workers deployment it
used to have is gone — `@cloudflare/vite-plugin` and `wrangler.jsonc` were
removed with the Node build target, so `main` can no longer produce a Worker at
all. Background and the steps that got here: [railway-plan.md](./railway-plan.md).

## Railway service

| Setting        | Value                     | Why                                                |
| -------------- | ------------------------- | -------------------------------------------------- |
| Root Directory | repo root                 | pnpm workspace resolution needs it, not `apps/web` |
| Build Command  | `pnpm --filter web build` |                                                    |
| Start Command  | `pnpm --filter web start` |                                                    |

Railway injects its own `PORT`; `server/app.ts` uses whatever it is given, so a
manually set `PORT` variable in the dashboard is dead weight rather than a bug
if you find the container listening elsewhere than you expected.

### Environments

- **production** — deploys from `main`.
- **pr-base** — the template PR Environments are cloned from. Its variables
  point at the dev database, so a preview never touches the real one.
- **tipprunde-pr-N** — created per pull request, deleted when it closes.

PR Environments copy the base environment's variables at creation. If a base
variable changes while a PR is open, that PR keeps the old value until it is
synced — worth remembering when rotating a token.

## Environment variables

One app, one set of variables. Locally they live in `apps/web/.env`; on Railway
they are set per environment in the dashboard. Railway makes no secret/var
distinction, but the split still matters for where a value may be written down:

### Secrets — never in the repo

| Variable             | Description                                    |
| -------------------- | ---------------------------------------------- |
| `TURSO_DATABASE_URL` | Turso database URL (`libsql://...`)            |
| `TURSO_AUTH_TOKEN`   | Turso auth token                               |
| `SESSION_SECRET`     | Signing key for the `__auth` session cookie    |
| `APP_SECRET`         | HMAC key for TOTP login codes                  |
| `RESEND_API_KEY`     | Resend API key for sending the login code mail |

### Plain values

| Variable                    | Default            | Description                        |
| --------------------------- | ------------------ | ---------------------------------- |
| `TOTP_EXPIRES_IN`           | `600`              | Login code lifetime, seconds       |
| `TOTP_MAX_ATTEMPTS`         | `3`                | Attempts before a code is burned   |
| `SESSION_DURATION_DEFAULT`  | `86400`            | Session lifetime, seconds          |
| `SESSION_DURATION_REMEMBER` | `2592000`          | Lifetime with "angemeldet bleiben" |
| `FROM_EMAIL`                | `hallo@runde.tips` | Sender of the login code mail      |

The login flow needs all of them, not just the database pair: without
`RESEND_API_KEY` or `APP_SECRET` nobody can get a code, and the failure looks
like a mail problem rather than a missing variable.

## First-deploy bootstrap

There is no registration flow — authentication goes through the in-app TOTP
login at `/login`, which requires a `users` row with a valid email address.
Reaching `/manager` additionally requires role `manager` or `admin`.

On a fresh database, insert the initial admin user manually:

```sql
INSERT INTO users (name, slug, email, role)
VALUES ('Your Name', 'your-slug', 'your@email.com', 'admin');
```

Via Drizzle Studio or any SQLite/libSQL client. After that, log in at `/login`.

All further user management happens inside the manager under
**Stammdaten → Spieler**.
