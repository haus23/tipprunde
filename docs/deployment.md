# Deployment

## Environment variables

One app (`apps/web`), one set of variables. Locally they live in
`apps/web/.env`; on Cloudflare the secrets are set on the Worker and the
plain values come from `vars` in `wrangler.jsonc`. Both lists are mirrored in
`wrangler.jsonc` (`secrets.required` + `vars`), so `wrangler deploy` fails
loudly and by name when a secret is missing.

### Secrets (never in `wrangler.jsonc`)

| Variable             | Description                                    |
| -------------------- | ---------------------------------------------- |
| `TURSO_DATABASE_URL` | Turso database URL (`libsql://...`)            |
| `TURSO_AUTH_TOKEN`   | Turso auth token                               |
| `SESSION_SECRET`     | Signing key for the `__auth` session cookie    |
| `APP_SECRET`         | HMAC key for TOTP login codes                  |
| `RESEND_API_KEY`     | Resend API key for sending the login code mail |

### Vars (in `wrangler.jsonc`)

| Variable                    | Default            | Description                        |
| --------------------------- | ------------------ | ---------------------------------- |
| `TOTP_EXPIRES_IN`           | `600`              | Login code lifetime, seconds       |
| `TOTP_MAX_ATTEMPTS`         | `3`                | Attempts before a code is burned   |
| `SESSION_DURATION_DEFAULT`  | `86400`            | Session lifetime, seconds          |
| `SESSION_DURATION_REMEMBER` | `2592000`          | Lifetime with "angemeldet bleiben" |
| `FROM_EMAIL`                | `hallo@runde.tips` | Sender of the login code mail      |

`wrangler deploy` replaces the dashboard's _vars_ with the ones from
`wrangler.jsonc`, but leaves _secrets_ alone — so secrets are set once per
Worker with `wrangler secret put` (or in the dashboard) and survive deploys.

## First-deploy bootstrap

There is no registration flow — authentication goes through the in-app TOTP
login at `/login`, which requires a `users` row with a valid email address.
Reaching `/manager` additionally requires role `manager` or `admin`.

On a fresh database, insert the initial admin user manually:

```sql
INSERT INTO users (name, slug, email, role)
VALUES ('Your Name', 'your-slug', 'your@email.com', 'admin');
```

Via Drizzle Studio (`bun run db:studio` in the db package) or any
SQLite/libSQL client. After that, log in at `/login`.

All further user management happens inside the manager under
**Stammdaten → Spieler**.
