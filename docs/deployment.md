# Deployment

## Environment variables

### Shared (both apps)

| Variable             | Description                         |
| -------------------- | ----------------------------------- |
| `TURSO_DATABASE_URL` | Turso database URL (`libsql://...`) |
| `TURSO_AUTH_TOKEN`   | Turso auth token                    |

### Manager app (`apps/manager`)

| Variable      | Description                                       |
| ------------- | ------------------------------------------------- |
| `WEB_APP_URL` | URL of the frontend app (used for login redirect) |

### Web app (`apps/web`)

| Variable | Description |
| -------- | ----------- |
| TBD      |             |

## First-deploy bootstrap

The manager has no registration flow — authentication goes through the
frontend app's TOTP login, which requires a `users` row with a valid
email address and role `manager` or `admin`.

On a fresh database, insert the initial admin user manually:

```sql
INSERT INTO users (name, slug, email, role)
VALUES ('Your Name', 'your-slug', 'your@email.com', 'admin');
```

Via Drizzle Studio (`bun run db:studio` in the db package) or any
SQLite/libSQL client. After that, log in via the frontend app — the
manager will accept the session cookie.

All further user management happens inside the manager under
**Stammdaten → Spieler**.
