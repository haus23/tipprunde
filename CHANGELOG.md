# Changelog

## v0.3.0-pre.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.2.0...v0.3.0-pre.0)

### 🚀 Enhancements

- Create RAC textarea wrapper. ([9ffb59e](https://github.com/haus23/tipprunde/commit/9ffb59e))
- Create ruleset actions, table and form. ([15f831e](https://github.com/haus23/tipprunde/commit/15f831e))

### 🏡 Chore

- Create rulesets table. ([cbd84b2](https://github.com/haus23/tipprunde/commit/cbd84b2))
- Improve db:push command execution with better env handling. ([214c3fa](https://github.com/haus23/tipprunde/commit/214c3fa))
- Create migration for rulesets table. ([255e848](https://github.com/haus23/tipprunde/commit/255e848))

## v0.2.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.2.0-pre.2...v0.2.0)

### 🚀 Enhancements

- Add close button to dialog header ([d773d49](https://github.com/haus23/tipprunde/commit/d773d49))
- Replace native select with RAC Select component ([6957ac1](https://github.com/haus23/tipprunde/commit/6957ac1))

### 💅 Refactors

- Replace onSuccess callback with OverlayTriggerStateContext ([35f097b](https://github.com/haus23/tipprunde/commit/35f097b))

## v0.2.0-pre.2

[compare changes](https://github.com/haus23/tipprunde/compare/v0.2.0-pre.1...v0.2.0-pre.2)

### 💅 Refactors

- Start thinking about mobile layout. ([21413f6](https://github.com/haus23/tipprunde/commit/21413f6))
- Move heading and button into the spieler-table to top. ([d9b21f4](https://github.com/haus23/tipprunde/commit/d9b21f4))
- Adjust table layout and rendering on mobile devices. ([dc6db7d](https://github.com/haus23/tipprunde/commit/dc6db7d))
- Adjust mobile styling for the dialog component. ([52df4ae](https://github.com/haus23/tipprunde/commit/52df4ae))

## v0.2.0-pre.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.2.0-pre.0...v0.2.0-pre.1)

### 🚀 Enhancements

- Add size variant for icon-only buttons. ([04d5cf5](https://github.com/haus23/tipprunde/commit/04d5cf5))
- Auto-sluggify user names to slug value. ([7e98589](https://github.com/haus23/tipprunde/commit/7e98589))

### 🩹 Fixes

- Remove root (id=0) from players list query. ([7a7cd52](https://github.com/haus23/tipprunde/commit/7a7cd52))

### 💅 Refactors

- Display player ID. Provide empty data fallback. ([4290646](https://github.com/haus23/tipprunde/commit/4290646))
- Use icons where appropriate. ([773d260](https://github.com/haus23/tipprunde/commit/773d260))
- Omit unused anon role. Use labels for roles. ([18a0228](https://github.com/haus23/tipprunde/commit/18a0228))
- Adjust spacing in manager layout. ([de0e585](https://github.com/haus23/tipprunde/commit/de0e585))

### 🏡 Chore

- Add lucide-react dependency. ([e2fa082](https://github.com/haus23/tipprunde/commit/e2fa082))

## v0.2.0-pre.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.1.0...v0.2.0-pre.0)

### 🚀 Enhancements

- Bring auth tables to production db branch. ([5145382](https://github.com/haus23/tipprunde/commit/5145382))
- Add Spieler management with CRUD dialog ([3d6e27c](https://github.com/haus23/tipprunde/commit/3d6e27c))

### 🏡 Chore

- Prepare for production. ([1e4c802](https://github.com/haus23/tipprunde/commit/1e4c802))

## v0.1.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.1.0-pre.1...v0.1.0)

### 🚀 Enhancements

- Add secondary button variant and update login form. ([f967955](https://github.com/haus23/tipprunde/commit/f967955))
- Use RAC validation. Added new error colors. ([4650973](https://github.com/haus23/tipprunde/commit/4650973))

### 💅 Refactors

- Restart auth flow with fatal totp error on max_attempts or expired code. ([9d351ef](https://github.com/haus23/tipprunde/commit/9d351ef))
- Turn login-form into a two-step process for better user experience and controlling. ([f493061](https://github.com/haus23/tipprunde/commit/f493061))
- Improve UX by handling email validation and error better. ([400f88c](https://github.com/haus23/tipprunde/commit/400f88c))

### 🏡 Chore

- Reorder tsconfig compiler options. ([768a4cf](https://github.com/haus23/tipprunde/commit/768a4cf))
- Ignore agents files when formatting. ([cf598c2](https://github.com/haus23/tipprunde/commit/cf598c2))

## v0.1.0-pre.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.1.0-pre.0...v0.1.0-pre.1)

### 🚀 Enhancements

- Add manager dashboard and login route. Link to manager dashboard from home. ([e253656](https://github.com/haus23/tipprunde/commit/e253656))
- Add styles for all pages and layouts. ([3a2add8](https://github.com/haus23/tipprunde/commit/3a2add8))
- Add optimistic checking for manager routes. ([d8d3195](https://github.com/haus23/tipprunde/commit/d8d3195))
- Add checkbox component. ([53990d9](https://github.com/haus23/tipprunde/commit/53990d9))
- Initiate login flow by entering manager area. ([b641e76](https://github.com/haus23/tipprunde/commit/b641e76))

### 🩹 Fixes

- Add relations for auth tables. ([d94ad6b](https://github.com/haus23/tipprunde/commit/d94ad6b))

### 💅 Refactors

- Upgrade drizzle to v1 beta. ([fa8ab6b](https://github.com/haus23/tipprunde/commit/fa8ab6b))
- Update cookie handling. ([22167d8](https://github.com/haus23/tipprunde/commit/22167d8))
- Update login form with code validation for valid emails. ([446757f](https://github.com/haus23/tipprunde/commit/446757f))
- Change db column types. User id to integer and date columns to text. ([e120cf9](https://github.com/haus23/tipprunde/commit/e120cf9))

### 🏡 Chore

- Upgrade next to 16.2.0-canary. ([c1b6475](https://github.com/haus23/tipprunde/commit/c1b6475))
- Add agent instructions. ([ffa45b2](https://github.com/haus23/tipprunde/commit/ffa45b2))
- Add drizzle orm and libqsl libraries. ([9a2a068](https://github.com/haus23/tipprunde/commit/9a2a068))
- Create auth related tables. ([06f56eb](https://github.com/haus23/tipprunde/commit/06f56eb))
- Add session cookie handling. ([0f7e542](https://github.com/haus23/tipprunde/commit/0f7e542))
- Add session handling. ([4bc9399](https://github.com/haus23/tipprunde/commit/4bc9399))
- Add TOTP handling. ([8ea0eaf](https://github.com/haus23/tipprunde/commit/8ea0eaf))
- Add auth flow utilities. ([ec8c9ba](https://github.com/haus23/tipprunde/commit/ec8c9ba))

## v0.1.0-pre.0

### 🚀 Enhancements

- Initial landing page. ([4bad9b7](https://github.com/haus23/tipprunde/commit/4bad9b7))
- Introduce color scheme. ([5af364a](https://github.com/haus23/tipprunde/commit/5af364a))

### 🏡 Chore

- Create bare nextjs app. Initial commit. ([f7400a2](https://github.com/haus23/tipprunde/commit/f7400a2))
- Add and configure tailwindcss. ([61471a3](https://github.com/haus23/tipprunde/commit/61471a3))
- Add paths alias. ([34a6fac](https://github.com/haus23/tipprunde/commit/34a6fac))
- Provide build and start scripts. ([1610682](https://github.com/haus23/tipprunde/commit/1610682))
- Ignore local dev env. ([6bfcaca](https://github.com/haus23/tipprunde/commit/6bfcaca))
- Update package.json with product name and version. ([c65249a](https://github.com/haus23/tipprunde/commit/c65249a))
