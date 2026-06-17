# Changelog

## v0.16.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.16.0...v0.16.1)

### 🚀 Enhancements

- **domain:** Add three new rules for upcoming championship ([6df30da](https://github.com/haus23/tipprunde/commit/6df30da))

### 💅 Refactors

- **domain:** Drop -joker-verdoppelt suffix from tip rule IDs ([2c27d21](https://github.com/haus23/tipprunde/commit/2c27d21))

### 📖 Documentation

- **domain:** Update rule ID tables for new rules and rename ([26dd24f](https://github.com/haus23/tipprunde/commit/26dd24f))

## v0.16.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.15.2...v0.16.0)

### 🩹 Fixes

- **web:** Display only tip points, not the total points. ([32417dc](https://github.com/haus23/tipprunde/commit/32417dc))

### 💅 Refactors

- **web:** Rename spieler route to tipps, freeing /spieler for a future player profile page ([2ed0794](https://github.com/haus23/tipprunde/commit/2ed0794))

## v0.15.2

[compare changes](https://github.com/haus23/tipprunde/compare/v0.15.1...v0.15.2)

### 🚀 Enhancements

- **web:** Add /archiv/$slug final ranking view ([c4930ec](https://github.com/haus23/tipprunde/commit/c4930ec))
- **web:** Build out /archiv index with championship list and Ewige Tabelle ([bdc1b84](https://github.com/haus23/tipprunde/commit/bdc1b84))

### 🩹 Fixes

- **web:** Disable player links in archiv ranking view ([8227f8b](https://github.com/haus23/tipprunde/commit/8227f8b))
- **web:** Fix Spieler nav link to point to player list instead of profile ([0733aa8](https://github.com/haus23/tipprunde/commit/0733aa8))
- **web:** Fix Ewige Tabelle column padding and alignment ([117153a](https://github.com/haus23/tipprunde/commit/117153a))
- **web:** Add uppercase tracking to archiv table headers for consistency ([961f8c1](https://github.com/haus23/tipprunde/commit/961f8c1))
- **web:** Use CellLink for championship links in archiv tables ([79a9b64](https://github.com/haus23/tipprunde/commit/79a9b64))

## v0.15.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.15.0...v0.15.1)

### 🚀 Enhancements

- **web:** Add Archiv preview section to dashboard index ([d279455](https://github.com/haus23/tipprunde/commit/d279455))

### 💅 Refactors

- **web:** Add paddings to focusable links/buttons to create a pseudo ring-offset ([f9b52cf](https://github.com/haus23/tipprunde/commit/f9b52cf))

## v0.15.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.14.2...v0.15.0)

### 🚀 Enhancements

- **web:** Add per-player matchday tip popover to Tabelle ([b971e2a](https://github.com/haus23/tipprunde/commit/b971e2a))
- **web:** Add pairing links + outside-click close to matchday popover ([19c1a8a](https://github.com/haus23/tipprunde/commit/19c1a8a))
- **web:** Refine matchday popover — skeletons, isFlagged, joker star ([05e2344](https://github.com/haus23/tipprunde/commit/05e2344))
- **web:** Add OverlayArrow + floating name badge to matchday popover ([7bfaa9b](https://github.com/haus23/tipprunde/commit/7bfaa9b))
- **web:** Wrap matchday popover content in Dialog for focus management ([c14cca8](https://github.com/haus23/tipprunde/commit/c14cca8))

### 🩹 Fixes

- **manager:** Initialize ranking columns when enrolling a player ([c43defd](https://github.com/haus23/tipprunde/commit/c43defd))

### 💅 Refactors

- **web:** Read ranking from materialized players table ([04f792c](https://github.com/haus23/tipprunde/commit/04f792c))
- **web:** Simplify matchday popover with DialogTrigger ([b821b8c](https://github.com/haus23/tipprunde/commit/b821b8c))

## v0.14.2

[compare changes](https://github.com/haus23/tipprunde/compare/v0.14.1...v0.14.2)

### 🚀 Enhancements

- **manager:** Materialize ranking after every relevant write ([ade7bb2](https://github.com/haus23/tipprunde/commit/ade7bb2))

### 💅 Refactors

- **db:** Extend players with ranking columns; clean up rounds + championship schema ([5d04160](https://github.com/haus23/tipprunde/commit/5d04160))

### 📖 Documentation

- Record ranking persistence decision ([d35ace3](https://github.com/haus23/tipprunde/commit/d35ace3))

### 🏡 Chore

- **db:** Add migration for the ranking feature. ([9489c52](https://github.com/haus23/tipprunde/commit/9489c52))

## v0.14.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.14.0...v0.14.1)

### 🚀 Enhancements

- **web:** Add TanStack Query devtools in dev mode ([224c14b](https://github.com/haus23/tipprunde/commit/224c14b))

### 🩹 Fixes

- **domain:** Score only real misses with discrete zero points. ([4481a06](https://github.com/haus23/tipprunde/commit/4481a06))

### 💅 Refactors

- **manager:** Rename Zusatzpunkte route to Zusatzfragen. ([439a2c4](https://github.com/haus23/tipprunde/commit/439a2c4))
- **web:** Drop mobile nav overflow menu ([02e0a25](https://github.com/haus23/tipprunde/commit/02e0a25))

### 📖 Documentation

- **archiv:** Document Archiv ideas; drop Archiv from main nav ([37267f5](https://github.com/haus23/tipprunde/commit/37267f5))

## v0.14.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.13.2...v0.14.0)

### 🚀 Enhancements

- **web:** Label extra-question answer as "Aktueller Stand" until published ([320f527](https://github.com/haus23/tipprunde/commit/320f527))
- **web:** Collapse each Zusatzfrage's answer table behind a details ([879558e](https://github.com/haus23/tipprunde/commit/879558e))

### 💅 Refactors

- Rename extraQuestionsPublished field to extraQuestionPointsPublished ([146fca7](https://github.com/haus23/tipprunde/commit/146fca7))
- **web:** Narrow content width from max-w-5xl to max-w-4xl ([33cb22b](https://github.com/haus23/tipprunde/commit/33cb22b))
- **web:** Add horizontal padding to dashboard sections above xs ([ffa529d](https://github.com/haus23/tipprunde/commit/ffa529d))

## v0.13.2

[compare changes](https://github.com/haus23/tipprunde/compare/v0.13.1...v0.13.2)

### 🚀 Enhancements

- **web:** Add Zusatzfragen route and dashboard link ([1c1df46](https://github.com/haus23/tipprunde/commit/1c1df46))

### 💅 Refactors

- **domain:** Split hasExtraQuestions from includesExtraQuestions ([b916fac](https://github.com/haus23/tipprunde/commit/b916fac))

## v0.13.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.13.0...v0.13.1)

### 🚀 Enhancements

- **web:** Link Tabelle player names to their Spieler view ([4dc5776](https://github.com/haus23/tipprunde/commit/4dc5776))
- **web:** Build the index dashboard (standings, current matches, ruleset) ([d0ea27b](https://github.com/haus23/tipprunde/commit/d0ea27b))

### 🩹 Fixes

- **web:** Constrain switch menus to the popover height (no overflow spill) ([3c2a0db](https://github.com/haus23/tipprunde/commit/3c2a0db))
- **web:** Always center overview link. ([74ce6cb](https://github.com/haus23/tipprunde/commit/74ce6cb))

### 💅 Refactors

- **web:** Replace Match/PlayerLink with a single typed CellLink ([59b96f4](https://github.com/haus23/tipprunde/commit/59b96f4))

## v0.13.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.12.2...v0.13.0)

### 🩹 Fixes

- **web:** Let clicks reach the match switch behind the prev/next overlay ([5cd70cd](https://github.com/haus23/tipprunde/commit/5cd70cd))
- **web:** Drop scroll-container top padding so sticky round headers pin flush ([d6dc5f1](https://github.com/haus23/tipprunde/commit/d6dc5f1))

### 💅 Refactors

- **web:** Widen match switch, indent items with a left-gutter check ([ca323f9](https://github.com/haus23/tipprunde/commit/ca323f9))

### 🏡 Chore

- **dx:** Add launch.json for the preview dev server ([091fa45](https://github.com/haus23/tipprunde/commit/091fa45))
- **root:** Update tailwind catalog deps. ([5eea28d](https://github.com/haus23/tipprunde/commit/5eea28d))
- **root:** Update types catalog deps. ([3c80077](https://github.com/haus23/tipprunde/commit/3c80077))

## v0.12.2

[compare changes](https://github.com/haus23/tipprunde/compare/v0.12.1...v0.12.2)

### 🚀 Enhancements

- **web:** Add single-match route /spiele/$nr (header only) ([8e09ea7](https://github.com/haus23/tipprunde/commit/8e09ea7))
- **web:** Link matches to the single-match view ([91f76ef](https://github.com/haus23/tipprunde/commit/91f76ef))
- **web:** Add Spielübersicht up-link to the single-match view ([7133e46](https://github.com/haus23/tipprunde/commit/7133e46))
- **web:** Add prev/next navigation to the single-match view ([4a2d640](https://github.com/haus23/tipprunde/commit/4a2d640))
- **web:** Add tips table to the single-match view ([bd04f76](https://github.com/haus23/tipprunde/commit/bd04f76))
- **web:** Sortable columns on the match tips table ([5387b28](https://github.com/haus23/tipprunde/commit/5387b28))
- **web:** Add match switch to the single-match view ([d382ad0](https://github.com/haus23/tipprunde/commit/d382ad0))

### 💅 Refactors

- **web:** Polish match tips table ([fe6be1c](https://github.com/haus23/tipprunde/commit/fe6be1c))
- **web:** Reposition single-match nav links ([912ebf0](https://github.com/haus23/tipprunde/commit/912ebf0))

## v0.12.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.12.0...v0.12.1)

### 🚀 Enhancements

- **web:** Add Spiele overview, extract shared RoundAccordion ([a95f6a1](https://github.com/haus23/tipprunde/commit/a95f6a1))

### 📖 Documentation

- Document root-level pnpm filter commands ([8b224d2](https://github.com/haus23/tipprunde/commit/8b224d2))

## v0.12.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.11.2...v0.12.0)

### 🚀 Enhancements

- **theme:** Add inverted surface tokens ([3b0399b](https://github.com/haus23/tipprunde/commit/3b0399b))
- **web:** Use inverted colors for the tip-flag tooltip ([d08ac36](https://github.com/haus23/tipprunde/commit/d08ac36))

### 💅 Refactors

- **web:** Serve default player at /spieler instead of redirecting ([e7731a2](https://github.com/haus23/tipprunde/commit/e7731a2))

## v0.11.2

[compare changes](https://github.com/haus23/tipprunde/compare/v0.11.1...v0.11.2)

### 🚀 Enhancements

- **web:** Add Spieler view with player switch and round accordion ([2bc2c8b](https://github.com/haus23/tipprunde/commit/2bc2c8b))

### 💅 Refactors

- **web:** Center Spieler header, flatten rounds into a card-less list ([2062239](https://github.com/haus23/tipprunde/commit/2062239))
- **web:** Make text-base explicit on content, set it as a tunable token ([00a563c](https://github.com/haus23/tipprunde/commit/00a563c))

### 🏡 Chore

- **dx:** Ignore generated code when formatting. ([e9ae44b](https://github.com/haus23/tipprunde/commit/e9ae44b))
- Update package manager. ([d3a79da](https://github.com/haus23/tipprunde/commit/d3a79da))

## v0.11.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.11.0...v0.11.1)

### 🚀 Enhancements

- **web:** Integrate TanStack Query for cross-route ranking cache ([143b062](https://github.com/haus23/tipprunde/commit/143b062))
- **web:** Set 10-min default staleTime on QueryClient ([2786edb](https://github.com/haus23/tipprunde/commit/2786edb))

### 💅 Refactors

- **web:** Use text-base for body content, keep text-sm for nav/captions ([b94964f](https://github.com/haus23/tipprunde/commit/b94964f))
- **web:** Extract getRanking into shared lib/ranking.ts server fn ([44d1404](https://github.com/haus23/tipprunde/commit/44d1404))

## v0.11.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.10.5...v0.11.0)

### 🚀 Enhancements

- **web:** Build primary nav with pathless championship layout ([a57edc3](https://github.com/haus23/tipprunde/commit/a57edc3))
- **web:** Email + one-time-code login flow ([9e2b52e](https://github.com/haus23/tipprunde/commit/9e2b52e))
- **ui:** Add TextField and form-field primitives ([7c064e1](https://github.com/haus23/tipprunde/commit/7c064e1))
- **ui:** Add SearchField primitive, migrate manager FilterInput ([3e2c004](https://github.com/haus23/tipprunde/commit/3e2c004))
- **domain:** Add calcRanking with extra-question gating and tests ([0c34b80](https://github.com/haus23/tipprunde/commit/0c34b80))
- **web:** Add Tabelle view with ranking, layout padding ([13e16ca](https://github.com/haus23/tipprunde/commit/13e16ca))

### 🩹 Fixes

- **db:** Mark championships.ruleset relation as non-optional ([3bf39c9](https://github.com/haus23/tipprunde/commit/3bf39c9))
- **db:** Mark all notNull FK relations as optional: false ([e382c9f](https://github.com/haus23/tipprunde/commit/e382c9f))

### 💅 Refactors

- **db:** Rename totpCodes table to loginCodes ([ec2167c](https://github.com/haus23/tipprunde/commit/ec2167c))
- **ui:** Extract shared Checkbox component ([07ae358](https://github.com/haus23/tipprunde/commit/07ae358))
- Adopt shared TextField across manager dialogs and web login ([ec5427f](https://github.com/haus23/tipprunde/commit/ec5427f))
- **ui:** Align RAC alias to AriaButton ([6faa415](https://github.com/haus23/tipprunde/commit/6faa415))
- **manager:** Remove redundant null guards on player.user and extra-answer.user ([7bd659a](https://github.com/haus23/tipprunde/commit/7bd659a))

### 🏡 Chore

- Use tanstack intent to inform agents about packaged skills. ([1b43547](https://github.com/haus23/tipprunde/commit/1b43547))

## v0.10.5

[compare changes](https://github.com/haus23/tipprunde/compare/v0.10.4...v0.10.5)

### 🚀 Enhancements

- **web:** Add react-aria-components + I18nProvider ([5de9637](https://github.com/haus23/tipprunde/commit/5de9637))
- **theme:** Add shadow tokens (popover + overlay) ([49b60c5](https://github.com/haus23/tipprunde/commit/49b60c5))
- **web:** Add color-scheme menu (light/dark/system) ([9dfe7ad](https://github.com/haus23/tipprunde/commit/9dfe7ad))
- **web:** Strip unused RAC locales via optimize-locales-plugin ([fd24c7c](https://github.com/haus23/tipprunde/commit/fd24c7c))

### 💅 Refactors

- **ui:** Improve Button interaction states ([d001479](https://github.com/haus23/tipprunde/commit/d001479))

### 🏡 Chore

- Add Design Skills by Emil Kowalski. And apply. ([face21a](https://github.com/haus23/tipprunde/commit/face21a))
- **dx:** Tweak some lsp settings. No need for eslint, ... ([e596699](https://github.com/haus23/tipprunde/commit/e596699))
- **ui:** Wipe out type import. ([ed69693](https://github.com/haus23/tipprunde/commit/ed69693))

## v0.10.4

[compare changes](https://github.com/haus23/tipprunde/compare/v0.10.3...v0.10.4)

### 🚀 Enhancements

- **theme:** Add xs breakpoint, document all breakpoints ([d1f63ed](https://github.com/haus23/tipprunde/commit/d1f63ed))
- **web:** Add root layout with sticky header and logo link ([cacba0a](https://github.com/haus23/tipprunde/commit/cacba0a))
- **ui:** Add Button component with intent/size variants ([59b2b3c](https://github.com/haus23/tipprunde/commit/59b2b3c))
- **web:** Add color-scheme menu (light/dark/system) ([bce45e2](https://github.com/haus23/tipprunde/commit/bce45e2))

### 💅 Refactors

- **theme:** Alias text-muted to text-subtle ([04c8874](https://github.com/haus23/tipprunde/commit/04c8874))
- **manager:** Swap buttons to shared ui Button ([cacadfc](https://github.com/haus23/tipprunde/commit/cacadfc))

### 📖 Documentation

- Add web app shell & header layout spec ([7ace595](https://github.com/haus23/tipprunde/commit/7ace595))

### 🏡 Chore

- Drop legacy prepare script. Not needed any more. ([5b8685d](https://github.com/haus23/tipprunde/commit/5b8685d))
- **web:** Add ui package. ([0ec2ed2](https://github.com/haus23/tipprunde/commit/0ec2ed2))
- **manager:** Update ports to match new web app defaults ([ad19984](https://github.com/haus23/tipprunde/commit/ad19984))
- Catalog react-aria-components, add as ui peer dependency ([c2e4846](https://github.com/haus23/tipprunde/commit/c2e4846))

## v0.10.3

[compare changes](https://github.com/haus23/tipprunde/compare/v0.10.2...v0.10.3)

### 🏡 Chore

- **web:** Rename to \*.server.ts to achieve import protection. ([d27e984](https://github.com/haus23/tipprunde/commit/d27e984))
- **ui:** Create new ui package. ([c8c27b7](https://github.com/haus23/tipprunde/commit/c8c27b7))
- **manager:** Add ui package and usage proof-of-concept. ([ec5d171](https://github.com/haus23/tipprunde/commit/ec5d171))
- **web:** Add vercel config for the manager rewrites. ([a0f02af](https://github.com/haus23/tipprunde/commit/a0f02af))

## v0.10.2

[compare changes](https://github.com/haus23/tipprunde/compare/v0.10.1...v0.10.2)

### 🚀 Enhancements

- **web:** Read session cookies in root beforeLoad ([f303565](https://github.com/haus23/tipprunde/commit/f303565))

### 🏡 Chore

- Fix package manager version. ([0ae1643](https://github.com/haus23/tipprunde/commit/0ae1643))
- **web:** Read current championship as proof-of-concept. ([dce149e](https://github.com/haus23/tipprunde/commit/dce149e))
- **manager:** Remove unneeded dependency @libsql/client ([83ae030](https://github.com/haus23/tipprunde/commit/83ae030))

## v0.10.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.10.0...v0.10.1)

### 🏡 Chore

- Rename web app to web-legacy ([4d96409](https://github.com/haus23/tipprunde/commit/4d96409))
- Move docs to root, update agent instructions ([5703176](https://github.com/haus23/tipprunde/commit/5703176))
- **web:** Create minimal tanstack start web app. ([8742ccb](https://github.com/haus23/tipprunde/commit/8742ccb))
- **manager:** Align package deps with workspace catalogs. ([c273e7c](https://github.com/haus23/tipprunde/commit/c273e7c))
- **web:** Add favicon. ([3f55ab8](https://github.com/haus23/tipprunde/commit/3f55ab8))
- **web:** Prepare vercel deployment. ([53703f8](https://github.com/haus23/tipprunde/commit/53703f8))

## v0.10.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.9.1...v0.10.0)

### 🚀 Enhancements

- **db:** Rename extraPoints to extraAnswers, add answer column ([dd270ab](https://github.com/haus23/tipprunde/commit/dd270ab))
- **manager:** Rewrite Zusatzpunkte route for extraAnswers schema ([5890f9a](https://github.com/haus23/tipprunde/commit/5890f9a))

## v0.9.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.9.0...v0.9.1)

### 🚀 Enhancements

- **db:** Add extra_questions and extra_points tables ([e34c2f9](https://github.com/haus23/tipprunde/commit/e34c2f9))

### 🩹 Fixes

- **manager:** Preserve enrollment order in Mitspieler list ([be36489](https://github.com/haus23/tipprunde/commit/be36489))
- **manager:** Add void to floating promise calls ([b281f99](https://github.com/haus23/tipprunde/commit/b281f99))
- **db:** Remove URL guard from drizzle config ([a87856d](https://github.com/haus23/tipprunde/commit/a87856d))

### 💅 Refactors

- **manager:** Use the theme package. ([8c6291f](https://github.com/haus23/tipprunde/commit/8c6291f))

### 🏡 Chore

- **theme:** Create a new theme package with exported tipprunde theme. ([ea167fb](https://github.com/haus23/tipprunde/commit/ea167fb))
- **db:** Migration for extra_questions and extra_points tables ([db8fa5b](https://github.com/haus23/tipprunde/commit/db8fa5b))

## v0.9.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.8.2...v0.9.0)

### 🚀 Enhancements

- **manager:** Add paste support for bulk tip entry ([399f0e1](https://github.com/haus23/tipprunde/commit/399f0e1))
- **manager:** Implement result editing route ([42c5e80](https://github.com/haus23/tipprunde/commit/42c5e80))
- **domain:** Add scoring module with calcBase and calcTipPoints ([b979340](https://github.com/haus23/tipprunde/commit/b979340))
- **manager:** Auto-calculate tip points on result/tip save ([d16c0e1](https://github.com/haus23/tipprunde/commit/d16c0e1))

### 💅 Refactors

- **domain:** Merge calcBase into calcTipPoints ([357cfea](https://github.com/haus23/tipprunde/commit/357cfea))

## v0.8.2

[compare changes](https://github.com/haus23/tipprunde/compare/v0.8.1...v0.8.2)

### 🚀 Enhancements

- **manager:** Implement tipps editing with round navigation and player select ([0e3af86](https://github.com/haus23/tipprunde/commit/0e3af86))
- **manager:** Tip validation and normalization ([8513b07](https://github.com/haus23/tipprunde/commit/8513b07))

### 🩹 Fixes

- **manager:** Small CSS fix and cleanup. ([b4700f9](https://github.com/haus23/tipprunde/commit/b4700f9))

### 💅 Refactors

- **manager:** Rename btn color tokens to accent ([2bb4362](https://github.com/haus23/tipprunde/commit/2bb4362))
- **manager:** Improve tipps route after code review ([7cbca24](https://github.com/haus23/tipprunde/commit/7cbca24))
- **manager:** Rearchitect tipps route for per-player loading ([85dc667](https://github.com/haus23/tipprunde/commit/85dc667))
- **manager:** Use player slug in tipps route URL ([f911009](https://github.com/haus23/tipprunde/commit/f911009))
- **manager:** Improve invalid tip visual feedback ([b49e25e](https://github.com/haus23/tipprunde/commit/b49e25e))

### 🏡 Chore

- **manager:** Update CLAUDE.md ([0dd34eb](https://github.com/haus23/tipprunde/commit/0dd34eb))
- Add RR7 skills. ([b650605](https://github.com/haus23/tipprunde/commit/b650605))

## v0.8.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.8.0...v0.8.1)

### 🚀 Enhancements

- **manager:** Add Mitspieler card with drag-and-drop player management ([9c8c34d](https://github.com/haus23/tipprunde/commit/9c8c34d))
- **manager:** Limit player lists to 10 visible entries with scroll ([c4ecf66](https://github.com/haus23/tipprunde/commit/c4ecf66))
- **manager:** Add filter input below Alle Spieler list ([3b064c8](https://github.com/haus23/tipprunde/commit/3b064c8))
- **manager:** Add inline player creation to Mitspieler card ([d89c0e1](https://github.com/haus23/tipprunde/commit/d89c0e1))

### 🩹 Fixes

- **manager:** Order Mitspieler list by user id instead of name ([98564f5](https://github.com/haus23/tipprunde/commit/98564f5))
- **manager:** Restore gap between filter input and button on Stammdaten routes ([99f52af](https://github.com/haus23/tipprunde/commit/99f52af))
- **manager:** Remove native search cancel button. ([79a2d78](https://github.com/haus23/tipprunde/commit/79a2d78))
- **manager:** Clear filter after adding a player to the championship ([42e404e](https://github.com/haus23/tipprunde/commit/42e404e))

## v0.8.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.7.5...v0.8.0)

### 🚀 Enhancements

- **manager:** Set filter to newly created entity after creation ([386290d](https://github.com/haus23/tipprunde/commit/386290d))

### 🏡 Chore

- **manager:** Update RR ([6dded6f](https://github.com/haus23/tipprunde/commit/6dded6f))
- **web:** Update Svelte ([9f5724d](https://github.com/haus23/tipprunde/commit/9f5724d))

### ✅ Tests

- **manager:** Temporary error in Zusatzpunkte loader for error boundary testing ([017fe87](https://github.com/haus23/tipprunde/commit/017fe87))
- **manager:** Remove temporary error boundary test ([764ea0a](https://github.com/haus23/tipprunde/commit/764ea0a))

## v0.7.5

[compare changes](https://github.com/haus23/tipprunde/compare/v0.7.4...v0.7.5)

### 🩹 Fixes

- **manager:** Fix basename double-prefix and error boundary link ([2d5bcbe](https://github.com/haus23/tipprunde/commit/2d5bcbe))

## v0.7.4

[compare changes](https://github.com/haus23/tipprunde/compare/v0.7.3...v0.7.4)

### 🩹 Fixes

- **manager:** Move color scheme toggle to dedicated route ([39b8f72](https://github.com/haus23/tipprunde/commit/39b8f72))

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
