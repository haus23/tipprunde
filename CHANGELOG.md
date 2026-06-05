# Changelog

## v0.7.3

[compare changes](https://github.com/haus23/tipprunde/compare/v0.7.2...v0.7.3)

### 🩹 Fixes

- **manager:** Hide outside-month calendar cells, skip Abbrechen in tab order ([5e22953](https://github.com/haus23/tipprunde/commit/5e22953))
- **manager:** Use useHref for color scheme action to respect basename ([8bb0f07](https://github.com/haus23/tipprunde/commit/8bb0f07))

## v0.7.2

[compare changes](https://github.com/haus23/tipprunde/compare/v0.7.1...v0.7.2)

### 🚀 Enhancements

- **manager:** Add round creation dialog and round navigator ([29b7c2c](https://github.com/haus23/tipprunde/commit/29b7c2c))
- **manager:** Implement Spiele route with match create/edit form ([db192bb](https://github.com/haus23/tipprunde/commit/db192bb))
- **manager:** Inline create team/league from match form ([812a6cd](https://github.com/haus23/tipprunde/commit/812a6cd))
- **manager:** Render german dates with short form in current year ([b033ef8](https://github.com/haus23/tipprunde/commit/b033ef8))
- **manager:** Replace native date input with RAC DatePicker ([9a3240a](https://github.com/haus23/tipprunde/commit/9a3240a))

### 🩹 Fixes

- **manager:** Default date from last match across championship ([fa690ed](https://github.com/haus23/tipprunde/commit/fa690ed))

### 💅 Refactors

- **manager:** Simplify round creation and navigator ([d55c2c6](https://github.com/haus23/tipprunde/commit/d55c2c6))
- **manager:** Replace Select with ComboBox and use full entity types ([943ff95](https://github.com/haus23/tipprunde/commit/943ff95))
- **manager:** Simplify ComboBox — native filtering and leaner types ([2792e9f](https://github.com/haus23/tipprunde/commit/2792e9f))
- **manager:** Use RAC native filtering with shortName support ([98d414b](https://github.com/haus23/tipprunde/commit/98d414b))

## v0.7.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.7.0...v0.7.1)

### 🚀 Enhancements

- **manager:** Add championship flags card to Turnier Übersicht ([4a1f8e1](https://github.com/haus23/tipprunde/commit/4a1f8e1))
- **manager:** Add RundenManagement card to Turnier Übersicht ([f702d28](https://github.com/haus23/tipprunde/commit/f702d28))

### 💅 Refactors

- **manager:** Improve championship flag switches UX ([84764de](https://github.com/haus23/tipprunde/commit/84764de))
- **manager:** Refine round row UX in RundenManagement ([7c5bb3e](https://github.com/haus23/tipprunde/commit/7c5bb3e))

### 📖 Documentation

- **manager:** Add domain model reference ([bd1a4ff](https://github.com/haus23/tipprunde/commit/bd1a4ff))

### 🏡 Chore

- **manager:** Label and description changes. ([a7781df](https://github.com/haus23/tipprunde/commit/a7781df))

## v0.7.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.6.5...v0.7.0)

### 🚀 Enhancements

- **manager:** Add filter input to all stammdaten tables ([7ead778](https://github.com/haus23/tipprunde/commit/7ead778))
- **manager:** Add championship switcher to header ([e770e02](https://github.com/haus23/tipprunde/commit/e770e02))

### 💅 Refactors

- **manager:** Replace filter input with RAC SearchField for a11y ([b1469f1](https://github.com/haus23/tipprunde/commit/b1469f1))
- **manager:** Stream championship list via React 19 use() + Suspense ([1dcb204](https://github.com/haus23/tipprunde/commit/1dcb204))

### 📖 Documentation

- **manager:** Add deployment guide with bootstrap instructions ([6c5b0de](https://github.com/haus23/tipprunde/commit/6c5b0de))

### 🏡 Chore

- **manager:** Enable all React Router v8 future flags ([fc5a73d](https://github.com/haus23/tipprunde/commit/fc5a73d))

## v0.6.5

[compare changes](https://github.com/haus23/tipprunde/compare/v0.6.4...v0.6.5)

### 🚀 Enhancements

- **manager:** Implement teams stammdaten route with CRUD ([c71c869](https://github.com/haus23/tipprunde/commit/c71c869))
- **manager:** Implement ligen CRUD + fix server error persistence in dialogs ([1a5c133](https://github.com/haus23/tipprunde/commit/1a5c133))
- **manager:** Implement spieler CRUD + fix email validation ([02444ad](https://github.com/haus23/tipprunde/commit/02444ad))

## v0.6.4

[compare changes](https://github.com/haus23/tipprunde/compare/v0.6.3...v0.6.4)

### 🚀 Enhancements

- **manager:** Set html title for each route. ([ea44917](https://github.com/haus23/tipprunde/commit/ea44917))
- **manager:** Set page title per route in the header. ([335e12f](https://github.com/haus23/tipprunde/commit/335e12f))
- **manager:** Add page titles — html title tags + header via handle ([c38b740](https://github.com/haus23/tipprunde/commit/c38b740))
- **manager:** Add color scheme toggle with cookie persistence ([12a16da](https://github.com/haus23/tipprunde/commit/12a16da))

### 💅 Refactors

- **manager:** Move h1 to root layout header, normalize toolbar rows ([4dc6ff7](https://github.com/haus23/tipprunde/commit/4dc6ff7))

## v0.6.3

[compare changes](https://github.com/haus23/tipprunde/compare/v0.6.2...v0.6.3)

### 🚀 Enhancements

- **manager:** Navigate to new championship after creation ([5db8a3f](https://github.com/haus23/tipprunde/commit/5db8a3f))
- **manager:** Show slug in table and as read-only field in edit dialog ([2767629](https://github.com/haus23/tipprunde/commit/2767629))
- **manager:** Add root error boundary with frown icon and error color token ([78a2e1f](https://github.com/haus23/tipprunde/commit/78a2e1f))
- **manager:** Add empty state loaders for championship sub-routes ([1d1bb27](https://github.com/haus23/tipprunde/commit/1d1bb27))

### 🩹 Fixes

- **manager:** Check nr and slug uniqueness before championship insert ([ac25611](https://github.com/haus23/tipprunde/commit/ac25611))
- **manager:** Coerce id from string for championship update ([e596bab](https://github.com/haus23/tipprunde/commit/e596bab))

### 💅 Refactors

- **manager:** Enforce design system colors, replace text-red-500 ([c32801f](https://github.com/haus23/tipprunde/commit/c32801f))

## v0.6.2

[compare changes](https://github.com/haus23/tipprunde/compare/v0.6.1...v0.6.2)

### 🚀 Enhancements

- **manager:** Add Turniere route with create/edit dialog ([5051819](https://github.com/haus23/tipprunde/commit/5051819))

### 🩹 Fixes

- **manager:** Derive championship slug from naming convention ([a0a5f9d](https://github.com/haus23/tipprunde/commit/a0a5f9d))

### 💅 Refactors

- **manager:** Use valibot v1.2 toNumber() coercion for nr field ([a50ccb5](https://github.com/haus23/tipprunde/commit/a50ccb5))

## v0.6.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.6.0...v0.6.1)

### 🚀 Enhancements

- **manager:** Add server-side validation to Regelwerk action ([2f1455e](https://github.com/haus23/tipprunde/commit/2f1455e))

### 💅 Refactors

- **manager:** Make RulesetForm self-contained with own fetcher ([dcd7fd7](https://github.com/haus23/tipprunde/commit/dcd7fd7))
- Inline the handler to get rid of type deprecation. ([01fb0cf](https://github.com/haus23/tipprunde/commit/01fb0cf))
- **manager:** Extract RegelwerkDialog into reusable component ([7698bad](https://github.com/haus23/tipprunde/commit/7698bad))
- **manager:** Replace manual validation with valibot in Regelwerk action ([c6665c3](https://github.com/haus23/tipprunde/commit/c6665c3))
- Make create/update logic cleaner. ([f75eb3a](https://github.com/haus23/tipprunde/commit/f75eb3a))

### 🏡 Chore

- Update pnpm. ([dc4631c](https://github.com/haus23/tipprunde/commit/dc4631c))
- **manager:** Add valibot. ([8040b17](https://github.com/haus23/tipprunde/commit/8040b17))
- **dx:** Update settings to let only oxfmt handle formatting tsx. ([467692c](https://github.com/haus23/tipprunde/commit/467692c))
- **manager:** Update react and types. ([ae89f2f](https://github.com/haus23/tipprunde/commit/ae89f2f))
- **manager:** Update react-router. ([47fd942](https://github.com/haus23/tipprunde/commit/47fd942))
- **web:** Update svelte. ([07b7537](https://github.com/haus23/tipprunde/commit/07b7537))
- Update lucide icons and move into catalog. ([9bae2d8](https://github.com/haus23/tipprunde/commit/9bae2d8))
- Update vite toolchain. ([e6dc9cc](https://github.com/haus23/tipprunde/commit/e6dc9cc))

## v0.6.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.5.1...v0.6.0)

### 🚀 Enhancements

- **manager:** Add onboarding wizard and layout polish ([67d810f](https://github.com/haus23/tipprunde/commit/67d810f))
- **manager:** Implement Regelwerke page with RAC table and modal forms ([95e13c1](https://github.com/haus23/tipprunde/commit/95e13c1))
- Extract shared domain rules into @tipprunde/domain package ([9ddda7f](https://github.com/haus23/tipprunde/commit/9ddda7f))
- **manager:** Auto-slug id field from name in Regelwerk create form ([0c93b35](https://github.com/haus23/tipprunde/commit/0c93b35))
- **manager:** Add consistent focus-visible ring styles across interactive elements ([16ef71e](https://github.com/haus23/tipprunde/commit/16ef71e))

### 🩹 Fixes

- **web:** Make link outbound and configurable. ([f84b9eb](https://github.com/haus23/tipprunde/commit/f84b9eb))
- **manager:** Use explicit path for favicon. ([726c4df](https://github.com/haus23/tipprunde/commit/726c4df))
- **manager:** Let vite handle the favicon path. ([192bc8d](https://github.com/haus23/tipprunde/commit/192bc8d))
- **manager:** Close Regelwerk dialog on outside click ([06014f4](https://github.com/haus23/tipprunde/commit/06014f4))

### 💅 Refactors

- **manager:** Scope active nav accent to icon only, add CSS token comments ([a2a96f1](https://github.com/haus23/tipprunde/commit/a2a96f1))
- **manager:** Apply Tailwind v4 shorthands ([aa93b37](https://github.com/haus23/tipprunde/commit/aa93b37))
- **manager:** Replace RAC Table with plain table in Regelwerke ([1316679](https://github.com/haus23/tipprunde/commit/1316679))
- **manager:** Migrate Radio to RadioField + RadioButton (RAC new API) ([865c678](https://github.com/haus23/tipprunde/commit/865c678))

### 🏡 Chore

- Add skills and docs for React Aria Components. ([dbb2835](https://github.com/haus23/tipprunde/commit/dbb2835))

## v0.5.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.5.0...v0.5.1)

### 🚀 Enhancements

- **manager:** Add sidebar layout with logo, nav, and design tokens ([955fd01](https://github.com/haus23/tipprunde/commit/955fd01))
- **manager:** Route frontend links via WEB_APP_URL env var ([1d71649](https://github.com/haus23/tipprunde/commit/1d71649))
- **manager:** Add missing route stubs and sidebar icons ([ed51644](https://github.com/haus23/tipprunde/commit/ed51644))
- **manager:** Fix logout form, add cn utility and tailwind-merge ([4d23892](https://github.com/haus23/tipprunde/commit/4d23892))

### 💅 Refactors

- **manager:** Split root middleware into separate auth and championship concerns ([0d70b6f](https://github.com/haus23/tipprunde/commit/0d70b6f))
- **manager:** Polish sidebar nav — icons, spacing, aria-current styling ([477799a](https://github.com/haus23/tipprunde/commit/477799a))

### 🏡 Chore

- **db:** Add current migrations. ([895d81b](https://github.com/haus23/tipprunde/commit/895d81b))
- Add typescript to project root deps. ([f2cc1a2](https://github.com/haus23/tipprunde/commit/f2cc1a2))

## v0.5.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.4.1...v0.5.0)

### 🚀 Enhancements

- **manager:** Add session-based auth via RR7 middleware ([bc43e10](https://github.com/haus23/tipprunde/commit/bc43e10))
- **manager:** Add design system foundations and Card component ([4278a89](https://github.com/haus23/tipprunde/commit/4278a89))
- **manager:** Add championship-based routing with cookie persistence ([5e8c987](https://github.com/haus23/tipprunde/commit/5e8c987))

### 🏡 Chore

- Opt out from vite-plus for dev server and build tool. ([ef67d80](https://github.com/haus23/tipprunde/commit/ef67d80))
- Align vite configuration. ([4a32797](https://github.com/haus23/tipprunde/commit/4a32797))
- Extract shared DB schema and relations into @tipprunde/db package ([db5a805](https://github.com/haus23/tipprunde/commit/db5a805))
- Re-organize workspace catalogs. ([4ec26dc](https://github.com/haus23/tipprunde/commit/4ec26dc))
- Ignore manager build and chrome devtools setup. ([4c6c37a](https://github.com/haus23/tipprunde/commit/4c6c37a))
- Add favicon to manager app ([368b18c](https://github.com/haus23/tipprunde/commit/368b18c))
- **db:** Add drizzle-kit with per-environment scripts ([42052cf](https://github.com/haus23/tipprunde/commit/42052cf))
- **web:** Update svelte-kit. ([8ca13a9](https://github.com/haus23/tipprunde/commit/8ca13a9))

## v0.4.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.4.0...v0.4.1)

### 🚀 Enhancements

- **manager:** Add minimal React Router 7 + Tailwind starter ([5a88e08](https://github.com/haus23/tipprunde/commit/5a88e08))
- **web:** Add Vercel rewrite to proxy /manager to manager app ([bf6db64](https://github.com/haus23/tipprunde/commit/bf6db64))

### 🩹 Fixes

- **manager:** Set Vite base to /manager/ so assets are proxied correctly ([7076089](https://github.com/haus23/tipprunde/commit/7076089))
- **manager:** Align basename trailing slash with Vite base config ([9bd78a7](https://github.com/haus23/tipprunde/commit/9bd78a7))
- **manager:** Use assetsDir instead of base to serve assets at /manager/assets/ ([4a9f57f](https://github.com/haus23/tipprunde/commit/4a9f57f))
- **manager:** Fix routing for both trailing-slash and non-trailing-slash cases ([4450aaa](https://github.com/haus23/tipprunde/commit/4450aaa))

## v0.4.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.3.1...v0.4.0)

### 🚀 Enhancements

- **nav:** Add active indicator to header nav links ([c149378](https://github.com/haus23/tipprunde/commit/c149378))
- **spieler:** Default to current user's profile when logged in ([532068e](https://github.com/haus23/tipprunde/commit/532068e))
- **perf:** Move user session client-side, enable CDN caching ([4e794a4](https://github.com/haus23/tipprunde/commit/4e794a4))

### 🩹 Fixes

- Simplify class name. ([c83d81e](https://github.com/haus23/tipprunde/commit/c83d81e))
- **home:** Smooth transitions for color scheme icon and user ranking row ([0cf52f6](https://github.com/haus23/tipprunde/commit/0cf52f6))
- **layout:** Reserve nav border space with transparent border to prevent link shifting ([7759e8f](https://github.com/haus23/tipprunde/commit/7759e8f))

### 💅 Refactors

- Rename dal files to use german names. ([c0e9319](https://github.com/haus23/tipprunde/commit/c0e9319))
- Use cn-function where appropriate. ([e2d7be0](https://github.com/haus23/tipprunde/commit/e2d7be0))
- Move user personalization client-side, redirect /spieler to explicit slug ([a899a3b](https://github.com/haus23/tipprunde/commit/a899a3b))

## v0.3.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.3.0...v0.3.1)

### 🚀 Enhancements

- **header:** Refactor color scheme switcher to two-action model ([c377769](https://github.com/haus23/tipprunde/commit/c377769))
- **errors:** Add error pages and improve 404 messages ([a4245b7](https://github.com/haus23/tipprunde/commit/a4245b7))
- **seo:** Add page titles to all routes ([df8073d](https://github.com/haus23/tipprunde/commit/df8073d))

### 🩹 Fixes

- **layout:** Add xs:mx-4 to content cards on spiele and spieler views ([6b5bb81](https://github.com/haus23/tipprunde/commit/6b5bb81))
- **home:** Align bottom links in dashboard cards ([f14d563](https://github.com/haus23/tipprunde/commit/f14d563))

## v0.3.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.2.2...v0.3.0)

### 🚀 Enhancements

- **spiele:** Add prev/next navigation and back link to match view ([efb94b5](https://github.com/haus23/tipprunde/commit/efb94b5))

### 🩹 Fixes

- **spiele:** Fix tip sort to use goal diff and home goals as tie-break ([4f31752](https://github.com/haus23/tipprunde/commit/4f31752))

## v0.2.2

[compare changes](https://github.com/haus23/tipprunde/compare/v0.2.1...v0.2.2)

### 🚀 Enhancements

- **spiele:** Add match overview page with accordion by round ([6b39f7f](https://github.com/haus23/tipprunde/commit/6b39f7f))
- **spiele:** Add single match view with sortable tips table ([de3f12e](https://github.com/haus23/tipprunde/commit/de3f12e))

### 🩹 Fixes

- Update ring offset color. ([23f4556](https://github.com/haus23/tipprunde/commit/23f4556))

## v0.2.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.2.0...v0.2.1)

### 🚀 Enhancements

- **spieler:** Add accordion open/close animations and margin transition ([87f1954](https://github.com/haus23/tipprunde/commit/87f1954))

### 🩹 Fixes

- **tipp-flag:** Fix arrow color and add hover support ([5d00a5d](https://github.com/haus23/tipprunde/commit/5d00a5d))

### 💅 Refactors

- **spieler:** Use cn() for grouped class names ([6d443af](https://github.com/haus23/tipprunde/commit/6d443af))

### 🏡 Chore

- Update deps. ([27a41a4](https://github.com/haus23/tipprunde/commit/27a41a4))

## v0.2.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.1.1...v0.2.0)

### 🚀 Enhancements

- **web:** Add /verlauf route with LayerChart points progression chart ([cda4198](https://github.com/haus23/tipprunde/commit/cda4198))
- **verlauf:** Add rank to tooltip with distinct display ([8dc3e43](https://github.com/haus23/tipprunde/commit/8dc3e43))
- **verlauf:** Improve tooltip positioning, selection UX, and rank accuracy ([4d78178](https://github.com/haus23/tipprunde/commit/4d78178))
- **web:** Add /spieler route with player detail view ([b71b78f](https://github.com/haus23/tipprunde/commit/b71b78f))

### 🩹 Fixes

- **web:** Fix /verlauf responsiveness, legend, and header z-index ([29e60b5](https://github.com/haus23/tipprunde/commit/29e60b5))

## v0.1.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.1.0...v0.1.1)

### 🚀 Enhancements

- **web:** Add spiele-select component with navigation and styling ([f3a242a](https://github.com/haus23/tipprunde/commit/f3a242a))

### 🏡 Chore

- **web:** Preparing first ideas for the matches view. ([ac89b36](https://github.com/haus23/tipprunde/commit/ac89b36))
- **web:** Setup svelte mcp server. ([43d0a8b](https://github.com/haus23/tipprunde/commit/43d0a8b))
- **web:** Install svelte-check. ([5bf99f3](https://github.com/haus23/tipprunde/commit/5bf99f3))
- **web:** Update tsconfig for sv check usage. ([4f89f62](https://github.com/haus23/tipprunde/commit/4f89f62))
- Add claude instructions. ([7a4a065](https://github.com/haus23/tipprunde/commit/7a4a065))
- Move mcp config to monorepo root. ([cf21bc9](https://github.com/haus23/tipprunde/commit/cf21bc9))

## v0.1.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.0.5...v0.1.0)

### 🚀 Enhancements

- **web:** Highlight current user in ranking. ([a9a748d](https://github.com/haus23/tipprunde/commit/a9a748d))
- **web:** Send login code per email. ([87b5893](https://github.com/haus23/tipprunde/commit/87b5893))
- **web:** Add remaining routes with slightly changed concept. No params any more. ([b298e43](https://github.com/haus23/tipprunde/commit/b298e43))

### 🩹 Fixes

- Break out of pending auth. ([e064325](https://github.com/haus23/tipprunde/commit/e064325))

### 💅 Refactors

- **web:** Improve UI and UX for code input. ([f41192b](https://github.com/haus23/tipprunde/commit/f41192b))

## v0.0.5

[compare changes](https://github.com/haus23/tipprunde/compare/v0.0.4...v0.0.5)

### 🚀 Enhancements

- **web:** Implement basic login auth flow. ([8fb1bbc](https://github.com/haus23/tipprunde/commit/8fb1bbc))
- **web:** Load authenticated user into locals and page data. ([b3fc23f](https://github.com/haus23/tipprunde/commit/b3fc23f))
- **web:** Use authenticated user. ([afaf5f7](https://github.com/haus23/tipprunde/commit/afaf5f7))
- **web:** Implement logout flow. ([5c79b31](https://github.com/haus23/tipprunde/commit/5c79b31))

### 🩹 Fixes

- **web:** Wrong folder for domain rules. ([30d102c](https://github.com/haus23/tipprunde/commit/30d102c))

## v0.0.4

[compare changes](https://github.com/haus23/tipprunde/compare/v0.0.3...v0.0.4)

### 🚀 Enhancements

- **web:** Display current top-3 ranking on index route. ([a4efd01](https://github.com/haus23/tipprunde/commit/a4efd01))
- **web:** Display current/last matches on index route. ([356be7e](https://github.com/haus23/tipprunde/commit/356be7e))
- **web:** Display ruleset on index route. ([a70c8d7](https://github.com/haus23/tipprunde/commit/a70c8d7))

## v0.0.3

[compare changes](https://github.com/haus23/tipprunde/compare/v0.0.2...v0.0.3)

### 🚀 Enhancements

- **web:** Add color-scheme switch. ([60782ab](https://github.com/haus23/tipprunde/commit/60782ab))

### 🏡 Chore

- **web:** Add bits-ui und lucide icons. ([1def15e](https://github.com/haus23/tipprunde/commit/1def15e))

## v0.0.2

[compare changes](https://github.com/haus23/tipprunde/compare/v0.0.1...v0.0.2)

### 🚀 Enhancements

- **web:** Add header to layout. ([126f0e6](https://github.com/haus23/tipprunde/commit/126f0e6))
- **web:** Render tabelle route. ([cf84aec](https://github.com/haus23/tipprunde/commit/cf84aec))

### 💅 Refactors

- **web:** Move championship loading up to layout. ([d3ff36f](https://github.com/haus23/tipprunde/commit/d3ff36f))

### 🏡 Chore

- **web:** Add and configure drizzle-orm. ([2738323](https://github.com/haus23/tipprunde/commit/2738323))
- **web:** Load and render current championship (POC). ([c18172e](https://github.com/haus23/tipprunde/commit/c18172e))
- **web:** Add alias for ui lib folder. ([d031a64](https://github.com/haus23/tipprunde/commit/d031a64))

## v0.0.1

### 🏡 Chore

- Setup monorepo with vp tooling. ([39bfc7c](https://github.com/haus23/tipprunde/commit/39bfc7c))
- **web:** Create svelte kit web app. ([e965f6f](https://github.com/haus23/tipprunde/commit/e965f6f))
- **web:** Prepare vercel build. ([21b3cd7](https://github.com/haus23/tipprunde/commit/21b3cd7))
