# Changelog

## v0.7.0-pre.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.6.0...v0.7.0-pre.0)

### 🚀 Enhancements

- Add env validation via valibot. ([72a7f78](https://github.com/haus23/tipprunde/commit/72a7f78))

### 💅 Refactors

- Move auth code from src/lib/auth to src/app/(auth) ([568e08d](https://github.com/haus23/tipprunde/commit/568e08d))
- Rename and clean up session helpers in app/(auth) ([a08318f](https://github.com/haus23/tipprunde/commit/a08318f))
- Simplify auth guards and consolidate session handling ([3df0133](https://github.com/haus23/tipprunde/commit/3df0133))

## v0.6.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.6.0-pre.6...v0.6.0)

## v0.6.0-pre.6

[compare changes](https://github.com/haus23/tipprunde/compare/v0.6.0-pre.5...v0.6.0-pre.6)

### 🩹 Fixes

- Move items to ListBox. Solves type error. ([035c14c](https://github.com/haus23/tipprunde/commit/035c14c))

### 💅 Refactors

- Move rulesets server functions to src/app/manager ([e21693d](https://github.com/haus23/tipprunde/commit/e21693d))
- Move teams server functions to src/app/manager ([12ddbb7](https://github.com/haus23/tipprunde/commit/12ddbb7))
- Move leagues server functions to src/app/manager ([b282062](https://github.com/haus23/tipprunde/commit/b282062))
- Move players/users server functions to src/app/manager ([f4af5e3](https://github.com/haus23/tipprunde/commit/f4af5e3))
- Move rounds server functions to src/app/manager ([4cd6a4c](https://github.com/haus23/tipprunde/commit/4cd6a4c))
- Move matches server functions to src/app/manager ([6600b4c](https://github.com/haus23/tipprunde/commit/6600b4c))
- Move participants server functions to src/app/manager/players ([92e0643](https://github.com/haus23/tipprunde/commit/92e0643))
- Move championships server functions to src/app/manager ([d5027b1](https://github.com/haus23/tipprunde/commit/d5027b1))

## v0.6.0-pre.5

[compare changes](https://github.com/haus23/tipprunde/compare/v0.6.0-pre.4...v0.6.0-pre.5)

### 💅 Refactors

- Move getUserByEmail to db/dal/users ([2e0a90c](https://github.com/haus23/tipprunde/commit/2e0a90c))
- Extract TOTP DB operations to db/dal/totps ([4e33bcf](https://github.com/haus23/tipprunde/commit/4e33bcf))
- Extract session DB operations to db/dal/sessions ([95b0516](https://github.com/haus23/tipprunde/commit/95b0516))
- Centralize domain types in DAL files ([d74dc3e](https://github.com/haus23/tipprunde/commit/d74dc3e))
- Sort imports when formatting. ([f37a141](https://github.com/haus23/tipprunde/commit/f37a141))

### 🏡 Chore

- Update deps. ([8e0f467](https://github.com/haus23/tipprunde/commit/8e0f467))
- Updating formatting config. ([12b8c10](https://github.com/haus23/tipprunde/commit/12b8c10))
- Update drizzle to 1.0.0-beta.22 ([8566516](https://github.com/haus23/tipprunde/commit/8566516))
- Update drizzle-kit config and scripts. ([3ddd901](https://github.com/haus23/tipprunde/commit/3ddd901))

## v0.6.0-pre.4

[compare changes](https://github.com/haus23/tipprunde/compare/v0.6.0-pre.3...v0.6.0-pre.4)

### 💅 Refactors

- Move migrations to db folder as well. ([469d3a8](https://github.com/haus23/tipprunde/commit/469d3a8))
- Move leagues DAL to db/dal folder ([0bc0bde](https://github.com/haus23/tipprunde/commit/0bc0bde))
- Move teams and rulesets DAL to db/dal folder ([b8218a9](https://github.com/haus23/tipprunde/commit/b8218a9))
- Move rounds DAL to db/dal folder ([e70cf76](https://github.com/haus23/tipprunde/commit/e70cf76))
- Align update signatures across DAL functions ([991bd1b](https://github.com/haus23/tipprunde/commit/991bd1b))
- Simplify maxNr retrieval ([f29df13](https://github.com/haus23/tipprunde/commit/f29df13))
- Move matches DAL to db/dal folder ([48c56f6](https://github.com/haus23/tipprunde/commit/48c56f6))
- Simplify maxNr extraction. ([4a5042d](https://github.com/haus23/tipprunde/commit/4a5042d))
- Move participants DAL to db/dal folder ([14b78d4](https://github.com/haus23/tipprunde/commit/14b78d4))
- Move championships DAL to db/dal folder ([188d942](https://github.com/haus23/tipprunde/commit/188d942))

## v0.6.0-pre.3

[compare changes](https://github.com/haus23/tipprunde/compare/v0.6.0-pre.2...v0.6.0-pre.3)

### 💅 Refactors

- Start using package.json subpath imports. ([c580599](https://github.com/haus23/tipprunde/commit/c580599))
- Start extracting DAL server-only code and db instantiation to separate db folder. ([4d133da](https://github.com/haus23/tipprunde/commit/4d133da))

### 🏡 Chore

- Update dependencies ([af87de1](https://github.com/haus23/tipprunde/commit/af87de1))
- Update TypeScript to 6.0 ([f4ee032](https://github.com/haus23/tipprunde/commit/f4ee032))
- Update React Aria skills ([dcb8856](https://github.com/haus23/tipprunde/commit/dcb8856))
- Update drizzle to latest beta. ([a185860](https://github.com/haus23/tipprunde/commit/a185860))

## v0.6.0-pre.2

[compare changes](https://github.com/haus23/tipprunde/compare/v0.6.0-pre.1...v0.6.0-pre.2)

### 🚀 Enhancements

- Add Runden and Spiele foundation ([2971dd8](https://github.com/haus23/tipprunde/commit/2971dd8))
- Add Spieltabelle with DatePicker and ComboBox components ([c479d7e](https://github.com/haus23/tipprunde/commit/c479d7e))

### 🩹 Fixes

- Correct match query, void returns and remove result field ([573502e](https://github.com/haus23/tipprunde/commit/573502e))
- Fix DatePicker positioning and set German locale for RAC ([386116c](https://github.com/haus23/tipprunde/commit/386116c))
- Display date in German format (DD.MM.YYYY) in matches table ([fc0e90c](https://github.com/haus23/tipprunde/commit/fc0e90c))

## v0.6.0-pre.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.6.0-pre.0...v0.6.0-pre.1)

### 🚀 Enhancements

- Add Teams Stammdaten page ([f90a795](https://github.com/haus23/tipprunde/commit/f90a795))
- Auto-derive Kennung from name in Stammdaten forms ([bad56d1](https://github.com/haus23/tipprunde/commit/bad56d1))

### 💅 Refactors

- Remove Kennung column from Spieler table ([4cbed7a](https://github.com/haus23/tipprunde/commit/4cbed7a))

## v0.6.0-pre.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.5.0...v0.6.0-pre.0)

### 🚀 Enhancements

- Add Ligen Stammdaten page ([b8aaf3d](https://github.com/haus23/tipprunde/commit/b8aaf3d))

### 💅 Refactors

- Replace slug/Kürzel with Kennung across Stammdaten ([6064ab4](https://github.com/haus23/tipprunde/commit/6064ab4))

## v0.5.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.5.0-pre.2...v0.5.0)

### 🚀 Enhancements

- Add TanStack Query for optimistic player management ([d340b4c](https://github.com/haus23/tipprunde/commit/d340b4c))
- Extend TanStack Query to all Stammdaten pages ([5c2dcf4](https://github.com/haus23/tipprunde/commit/5c2dcf4))

### 🩹 Fixes

- Avoid duplicate entry after creating a new Spieler ([154b334](https://github.com/haus23/tipprunde/commit/154b334))

## v0.5.0-pre.2

[compare changes](https://github.com/haus23/tipprunde/compare/v0.5.0-pre.1...v0.5.0-pre.2)

### 🚀 Enhancements

- Add new player dialog to Spieler management ([fe13353](https://github.com/haus23/tipprunde/commit/fe13353))

### 🩹 Fixes

- Use router.invalidate() as source of truth for player lists ([9fdcab5](https://github.com/haus23/tipprunde/commit/9fdcab5))

## v0.5.0-pre.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.5.0-pre.0...v0.5.0-pre.1)

### 🚀 Enhancements

- Add player management to Turnier page ([316744e](https://github.com/haus23/tipprunde/commit/316744e))

### 🩹 Fixes

- Sort tournament players by nr instead of alphabetically ([3e7612e](https://github.com/haus23/tipprunde/commit/3e7612e))

### 🏡 Chore

- Add migration for players table ([c932e34](https://github.com/haus23/tipprunde/commit/c932e34))

## v0.5.0-pre.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.4.0...v0.5.0-pre.0)

### 🚀 Enhancements

- Add tournament status switches on Turnier page ([cfe3189](https://github.com/haus23/tipprunde/commit/cfe3189))

### 🩹 Fixes

- Fall back to latest championship on invalid cookie slug ([2c46a15](https://github.com/haus23/tipprunde/commit/2c46a15))

### 🏡 Chore

- Update drizzle and turso libsql client. ([66c8d37](https://github.com/haus23/tipprunde/commit/66c8d37))
- Update tanstack and valibot. ([f66ccf6](https://github.com/haus23/tipprunde/commit/f66ccf6))
- Update dev dependencies. ([b5975da](https://github.com/haus23/tipprunde/commit/b5975da))

## v0.4.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.4.0-pre.2...v0.4.0)

### 🚀 Enhancements

- Add championship dashboard route and complete onboarding flow. ([cb72cf3](https://github.com/haus23/tipprunde/commit/cb72cf3))
- Implement championship switcher with stable context ([cc25db5](https://github.com/haus23/tipprunde/commit/cc25db5))

### 🏡 Chore

- Polish sidebar navigation hover styles and spacing. ([e13ff94](https://github.com/haus23/tipprunde/commit/e13ff94))
- Align page and meta titles across manager routes ([6b9c66f](https://github.com/haus23/tipprunde/commit/6b9c66f))
- Improve championship switcher styling ([5262d2f](https://github.com/haus23/tipprunde/commit/5262d2f))

## v0.4.0-pre.2

[compare changes](https://github.com/haus23/tipprunde/compare/v0.4.0-pre.1...v0.4.0-pre.2)

### 🚀 Enhancements

- Add manager dashboard with onboarding flow for empty state. ([d065484](https://github.com/haus23/tipprunde/commit/d065484))
- Add sidebar navigation to manager layout. ([2403286](https://github.com/haus23/tipprunde/commit/2403286))
- Add onboarding step for missing tournament to manager dashboard. ([a72caf7](https://github.com/haus23/tipprunde/commit/a72caf7))
- Add $slug route with turnier page and sidebar navigation link. ([ac72438](https://github.com/haus23/tipprunde/commit/ac72438))

### 💅 Refactors

- Migrate Regelwerke feature from Next.js to TanStack Start. ([cbbedae](https://github.com/haus23/tipprunde/commit/cbbedae))
- Migrate Turniere feature from Next.js to TanStack Start. ([e644825](https://github.com/haus23/tipprunde/commit/e644825))

## v0.4.0-pre.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.4.0-pre.0...v0.4.0-pre.1)

### 🚀 Enhancements

- Add SearchField component. ([3be8e1a](https://github.com/haus23/tipprunde/commit/3be8e1a))
- Add DataTable component with pagination and filter support ([44da68d](https://github.com/haus23/tipprunde/commit/44da68d))
- Add concept for page titles in the manager backend. ([54dd85b](https://github.com/haus23/tipprunde/commit/54dd85b))

### 💅 Refactors

- Simplify manager validation. ([881403d](https://github.com/haus23/tipprunde/commit/881403d))
- Migrate/port Spieler Stammdaten feature to the Start app. ([e24e270](https://github.com/haus23/tipprunde/commit/e24e270))
- Start changing the overall app colors. ([d5532c0](https://github.com/haus23/tipprunde/commit/d5532c0))
- Slugify name on blur. ([b70b0a7](https://github.com/haus23/tipprunde/commit/b70b0a7))
- Update table component with new Tanstack table implementation and columns configuration ([05d495b](https://github.com/haus23/tipprunde/commit/05d495b))

### 🏡 Chore

- Add authorization middleware for server functions. ([12960c7](https://github.com/haus23/tipprunde/commit/12960c7))
- Update skills and mention skills handling in README ([25190a8](https://github.com/haus23/tipprunde/commit/25190a8))
- Add @tanstack/react-table dependency ([688bbb8](https://github.com/haus23/tipprunde/commit/688bbb8))

## v0.4.0-pre.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.3.0...v0.4.0-pre.0)

### 🚀 Enhancements

- Add (empty) manager dashboard page. ([4eaf3bd](https://github.com/haus23/tipprunde/commit/4eaf3bd))
- Add initial login form. ([4c15304](https://github.com/haus23/tipprunde/commit/4c15304))
- Protect manager routes ([cb76317](https://github.com/haus23/tipprunde/commit/cb76317))
- Validate manager session against DB on protected routes ([9218b2b](https://github.com/haus23/tipprunde/commit/9218b2b))

### 💅 Refactors

- Create Tanstack Start app with landing page. ([eb0f3d2](https://github.com/haus23/tipprunde/commit/eb0f3d2))
- Move ui components to Tanstack app. ([7896968](https://github.com/haus23/tipprunde/commit/7896968))
- Move db/drizzle schema to src/lib/db/ ([ae712b6](https://github.com/haus23/tipprunde/commit/ae712b6))
- Move simplified auth config to new src. ([895bfc9](https://github.com/haus23/tipprunde/commit/895bfc9))
- Implement the auth flow with tanstack. ([f3b9535](https://github.com/haus23/tipprunde/commit/f3b9535))
- Update auth config. ([8517f06](https://github.com/haus23/tipprunde/commit/8517f06))

### 🏡 Chore

- Update @tanstack/react-start version ([d3d5145](https://github.com/haus23/tipprunde/commit/d3d5145))
- Update dev dependencies. ([cc21791](https://github.com/haus23/tipprunde/commit/cc21791))
- Upgrade to vite 8! ([647e38c](https://github.com/haus23/tipprunde/commit/647e38c))
- Ignore build output. ([04d2fe2](https://github.com/haus23/tipprunde/commit/04d2fe2))
- Add nitro plugin to use nitro server for production. ([2679c2f](https://github.com/haus23/tipprunde/commit/2679c2f))

## v0.3.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.3.0-pre.2...v0.3.0)

### 🚀 Enhancements

- Set document titles across all manager pages ([30f6a11](https://github.com/haus23/tipprunde/commit/30f6a11))
- Set document titles for landing and login pages ([8b183c8](https://github.com/haus23/tipprunde/commit/8b183c8))

### 🩹 Fixes

- Navigate to championship turnier page after creation ([9af3d94](https://github.com/haus23/tipprunde/commit/9af3d94))

### 💅 Refactors

- Render the switcher only if necessary for championship switching. ([39b8fb0](https://github.com/haus23/tipprunde/commit/39b8fb0))
- Move turnier form to stammdaten, open in modal from table ([dbb077b](https://github.com/haus23/tipprunde/commit/dbb077b))

### 🎨 Styles

- Wrap new turnier form in a card layout ([2528e8d](https://github.com/haus23/tipprunde/commit/2528e8d))

## v0.3.0-pre.2

[compare changes](https://github.com/haus23/tipprunde/compare/v0.3.0-pre.1...v0.3.0-pre.2)

### 🚀 Enhancements

- Add manager dashboard with slug-based championship context ([b9afd71](https://github.com/haus23/tipprunde/commit/b9afd71))
- Prefill tournament number with next available nr ([367ba19](https://github.com/haus23/tipprunde/commit/367ba19))
- Show current championship name in sidebar ([c9d5fc7](https://github.com/haus23/tipprunde/commit/c9d5fc7))
- Implement championship switching via button in the sidebar and command. ([d8c4a7c](https://github.com/haus23/tipprunde/commit/d8c4a7c))

### 🏡 Chore

- Add championship migration. ([d5891a4](https://github.com/haus23/tipprunde/commit/d5891a4))
- Add cmdk dependency. ([f1dd956](https://github.com/haus23/tipprunde/commit/f1dd956))

## v0.3.0-pre.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.3.0-pre.0...v0.3.0-pre.1)

### 🚀 Enhancements

- Add turniere page to shared data section. ([0e178d7](https://github.com/haus23/tipprunde/commit/0e178d7))
- Add colors for dashboard action cards. Add dashboard link to layout. ([960fca0](https://github.com/haus23/tipprunde/commit/960fca0))
- Add page to create championships. ([4a6c867](https://github.com/haus23/tipprunde/commit/4a6c867))

### 🩹 Fixes

- Remove unconditional hidden input for id when creating rulesets. ([d806eb4](https://github.com/haus23/tipprunde/commit/d806eb4))

### 🏡 Chore

- Create championships table. ([67e320f](https://github.com/haus23/tipprunde/commit/67e320f))

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
